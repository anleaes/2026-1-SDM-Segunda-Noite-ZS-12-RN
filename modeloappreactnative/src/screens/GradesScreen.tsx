import { Ionicons } from "@expo/vector-icons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Grades">;

export type Grade = {
  id: number;
  bimester: number;
  value: number;
  type: string;
  bulletin: number;
  discipline: number;
  student: number;
};

type BulletinBasic = {
  id: number;
  school_year: number;
  semester: number;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

type StudentBasic = {
  id: number;
  name: string;
};

const GradesScreen = ({ navigation }: Props) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [bulletinNames, setBulletinNames] = useState<Record<number, string>>({});
  const [disciplineNames, setDisciplineNames] = useState<Record<number, string>>({});
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [gradesRes, bulletinsRes, disciplinesRes, studentsRes] =
        await Promise.all([
          fetch("http://localhost:8000/grades/"),
          fetch("http://localhost:8000/bulletins/"),
          fetch("http://localhost:8000/disciplina/"),
          fetch("http://localhost:8000/estudante/"),
        ]);

      const gradesData: Grade[] = await gradesRes.json();
      const bulletinsData: BulletinBasic[] = await bulletinsRes.json();
      const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();
      const studentsData: StudentBasic[] = await studentsRes.json();

      const bulletinMap: Record<number, string> = {};
      bulletinsData.forEach((b) => {
        bulletinMap[b.id] = `Boletim #${b.id} (${b.school_year}/${b.semester}º)`;
      });

      const disciplineMap: Record<number, string> = {};
      disciplinesData.forEach((d) => {
        disciplineMap[d.id] = d.name;
      });

      const studentMap: Record<number, string> = {};
      studentsData.forEach((s) => {
        studentMap[s.id] = s.name;
      });

      setGrades(gradesData);
      setBulletinNames(bulletinMap);
      setDisciplineNames(disciplineMap);
      setStudentNames(studentMap);
    } catch (error) {
      console.error("Erro ao buscar notas:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, []),
  );

  const deleteGrade = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/grades/${id}/`, {
        method: "DELETE",
      });
      setGrades((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Erro ao excluir nota:", error);
    }
  };

  const confirmDelete = (item: Grade) => {
    const studentName = studentNames[item.student] || "Aluno desconhecido";
    const message = `Tem certeza que deseja excluir a nota de ${studentName} no ${item.bimester}º bimestre?`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        deleteGrade(item.id);
      }
    } else {
      Alert.alert("Confirmar exclusão", message, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteGrade(item.id),
        },
      ]);
    }
  };

  const renderItem = ({ item }: { item: Grade }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {studentNames[item.student] || "Aluno desconhecido"}
      </Text>
      <Text style={styles.info}>
        Boletim: {bulletinNames[item.bulletin] || `#${item.bulletin}`}
      </Text>
      <Text style={styles.info}>
        Disciplina: {disciplineNames[item.discipline] || "Desconhecida"}
      </Text>
      <Text style={styles.info}>{item.bimester}º Bimestre</Text>
      <Text style={styles.info}>Tipo: {item.type}</Text>
      <Text style={styles.info}>Valor: {item.value}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditGrade", { grade: item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={grades}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateGrade")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignSelf: "flex-end",
  },
  editButton: {
    backgroundColor: "#4B7BE5",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E54848",
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0D47A1",
    borderRadius: 28,
    padding: 14,
    elevation: 4,
  },
});

export default GradesScreen;
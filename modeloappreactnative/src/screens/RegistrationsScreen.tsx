import { Ionicons } from "@expo/vector-icons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Registrations">;

export type Registration = {
  id: number;
  data_matricula: string;
  situacao: string;
  student: number;
  school_class: number;
};

type StudentBasic = {
  id: number;
  name: string;
};

type ClassBasic = {
  id: number;
  codigo: string;
};

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const RegistrationsScreen = ({ navigation }: Props) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});
  const [classNames, setClassNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [registrationsResponse, studentsResponse, classesResponse] =
        await Promise.all([
          fetch("http://localhost:8000/matricula/"),
          fetch("http://localhost:8000/estudante/"),
          fetch("http://localhost:8000/turma/"),
        ]);

      const registrationsData: Registration[] =
        await registrationsResponse.json();
      const studentsData: StudentBasic[] = await studentsResponse.json();
      const classesData: ClassBasic[] = await classesResponse.json();

      const studentMap: Record<number, string> = {};
      studentsData.forEach((s) => {
        studentMap[s.id] = s.name;
      });

      const classMap: Record<number, string> = {};
      classesData.forEach((c) => {
        classMap[c.id] = c.codigo;
      });

      setRegistrations(registrationsData);
      setStudentNames(studentMap);
      setClassNames(classMap);
    } catch (error) {
      console.error("Erro ao buscar matriculas, alunos e turmas:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, []),
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/matricula/${id}/`, {
        method: "DELETE",
      });
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Erro ao excluir matricula:", error);
    }
  };

  const renderItem = ({ item }: { item: Registration }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Matrícula #{item.id}</Text>
      <Text style={styles.info}>
        Aluno: {studentNames[item.student] || "Desconhecido"}
      </Text>
      <Text style={styles.info}>
        Turma: {classNames[item.school_class] || "Desconhecida"}
      </Text>
      <Text style={styles.info}>Data: {formatDate(item.data_matricula)}</Text>
      <Text style={styles.info}>Situação: {item.situacao}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditRegistration", { registration: item })
          }
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matrículas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={registrations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateRegistration")}
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

export default RegistrationsScreen;

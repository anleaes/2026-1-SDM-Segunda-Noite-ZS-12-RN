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

type Props = DrawerScreenProps<DrawerParamList, "Bulletins">;

export type Bulletin = {
  id: number;
  school_year: number;
  semester: number;
  final_situation: string;
  student: number;
};

type StudentBasic = {
  id: number;
  name: string;
};

const SITUATION_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  em_andamento: "Em andamento",
};

const BulletinsScreen = ({ navigation }: Props) => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [bulletinsResponse, studentsResponse] = await Promise.all([
        fetch("http://localhost:8000/bulletins/"),
        fetch("http://localhost:8000/estudante/"),
      ]);

      const bulletinsData: Bulletin[] = await bulletinsResponse.json();
      const studentsData: StudentBasic[] = await studentsResponse.json();

      const studentMap: Record<number, string> = {};
      studentsData.forEach((s) => {
        studentMap[s.id] = s.name;
      });

      setBulletins(bulletinsData);
      setStudentNames(studentMap);
    } catch (error) {
      console.error("Erro ao buscar boletins e alunos:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, []),
  );

  const deleteBulletin = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/bulletins/${id}/`, {
        method: "DELETE",
      });
      setBulletins((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Erro ao excluir boletim:", error);
    }
  };

  const confirmDelete = (item: Bulletin) => {
    const studentName = studentNames[item.student] || "Aluno desconhecido";
    const message = `Tem certeza que deseja excluir o boletim #${item.id} de ${studentName}?`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        deleteBulletin(item.id);
      }
    } else {
      Alert.alert("Confirmar exclusão", message, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteBulletin(item.id),
        },
      ]);
    }
  };

  const renderItem = ({ item }: { item: Bulletin }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Boletim #{item.id}</Text>
      <Text style={styles.info}>
        Aluno: {studentNames[item.student] || "Desconhecido"}
      </Text>
      <Text style={styles.info}>Ano letivo: {item.school_year}</Text>
      <Text style={styles.info}>Semestre: {item.semester}º</Text>
      <Text style={styles.info}>
        Situação final:{" "}
        {SITUATION_LABELS[item.final_situation] || item.final_situation}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditBulletin", { bulletin: item })
          }
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
      <Text style={styles.title}>Boletins</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={bulletins}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateBulletin")}
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

export default BulletinsScreen;

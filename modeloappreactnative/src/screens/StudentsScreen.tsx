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

type Props = DrawerScreenProps<DrawerParamList, "Students">;

export type Student = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  status: "ativo" | "inativo" | "trancado";
  matricula: string;
  data_nascimento: string;
  responsaveis: number[];
};

type ParentBasic = {
  id: number;
  name: string;
};

const STATUS_LABELS: Record<Student["status"], string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  trancado: "Trancado",
};

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const StudentsScreen = ({ navigation }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [parentNames, setParentNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchStudentsAndParents = async () => {
    setLoading(true);
    try {
      const [studentsResponse, parentsResponse] = await Promise.all([
        fetch("http://localhost:8000/estudante/"),
        fetch("http://localhost:8000/responsavel/"),
      ]);

      const studentsData: Student[] = await studentsResponse.json();
      const parentsData: ParentBasic[] = await parentsResponse.json();

      const namesMap: Record<number, string> = {};
      parentsData.forEach((p) => {
        namesMap[p.id] = p.name;
      });

      setStudents(studentsData);
      setParentNames(namesMap);
    } catch (error) {
      console.error("Erro ao buscar alunos e responsáveis:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudentsAndParents();
    }, []),
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/estudante/${id}/`, {
        method: "DELETE",
      });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
    }
  };

  const renderItem = ({ item }: { item: Student }) => {
    const responsaveisNomes = item.responsaveis
      .map((id) => parentNames[id] || "Desconhecido")
      .join(", ");

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.info}>Email: {item.email}</Text>
        <Text style={styles.info}>CPF: {item.cpf}</Text>
        <Text style={styles.info}>Matrícula: {item.matricula}</Text>
        <Text style={styles.info}>Status: {STATUS_LABELS[item.status]}</Text>
        <Text style={styles.info}>
          Nascimento: {formatDate(item.data_nascimento)}
        </Text>
        <Text style={styles.info}>
          Responsáveis: {responsaveisNomes || "Nenhum"}
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditStudent", { student: item })
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateStudent")}
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

export default StudentsScreen;

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

type Props = DrawerScreenProps<DrawerParamList, "Classes">;

export type Class = {
  id: number;
  codigo: string;
  turno: "matutino" | "vespertino" | "noturno";
  ano_letivo: number;
  professor: number;
};

type TeacherBasic = {
  id: number;
  name: string;
};

const TURNO_LABELS: Record<Class["turno"], string> = {
  matutino: "Matutino",
  vespertino: "Vespertino",
  noturno: "Noturno",
};

const ClassesScreen = ({ navigation }: Props) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teacherNames, setTeacherNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchClassesAndTeachers = async () => {
    setLoading(true);
    try {
      const [classesResponse, teachersResponse] = await Promise.all([
        fetch("http://localhost:8000/turma/"),
        fetch("http://localhost:8000/professor/"),
      ]);

      const classesData: Class[] = await classesResponse.json();
      const teachersData: TeacherBasic[] = await teachersResponse.json();

      const namesMap: Record<number, string> = {};
      teachersData.forEach((t) => {
        namesMap[t.id] = t.name;
      });

      setClasses(classesData);
      setTeacherNames(namesMap);
    } catch (error) {
      console.error("Erro ao buscar turmas e professores:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchClassesAndTeachers();
    }, []),
  );

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/turma/${id}/`, {
        method: "DELETE",
      });
      setClasses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  };

  const renderItem = ({ item }: { item: Class }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.codigo}</Text>
      <Text style={styles.info}>Turno: {TURNO_LABELS[item.turno]}</Text>
      <Text style={styles.info}>Ano letivo: {item.ano_letivo}</Text>
      <Text style={styles.info}>
        Professor: {teacherNames[item.professor] || "Desconhecido"}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditClass", { schoolClass: item })
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
      <Text style={styles.title}>Turmas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateClass")}
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

export default ClassesScreen;

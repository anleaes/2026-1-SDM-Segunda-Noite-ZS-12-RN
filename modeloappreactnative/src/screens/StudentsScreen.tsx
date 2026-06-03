import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
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
  data_nascimento: string; // formato ISO "YYYY-MM-DD"
  responsaveis: number[]; // array de IDs
};

const STATUS_LABELS: Record<Student["status"], string> = {
  ativo: "Ativo",
  inativo: "Inativo",
  trancado: "Trancado",
};

// Converte "2010-05-15" para "15/05/2010"
const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const StudentsScreen = ({ navigation }: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [parentNames, setParentNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: Student }) => {
    // Constrói a string com os nomes dos responsáveis
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
});

export default StudentsScreen;

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

type Props = DrawerScreenProps<DrawerParamList, "Classrooms">;

export type Classroom = {
  id: number;
  data: string;
  sala: string;
  conteudo: string;
  school_class: number; // ID da turma
  discipline: number; // ID da disciplina
};

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const ClassroomsScreen = ({ navigation }: Props) => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classNames, setClassNames] = useState<Record<number, string>>({});
  const [disciplineNames, setDisciplineNames] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: Classroom }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Sala: {item.sala}</Text>
      <Text style={styles.info}>Data: {formatDate(item.data)}</Text>
      <Text style={styles.info}>
        Turma: {classNames[item.school_class] || "Carregando..."}
      </Text>
      <Text style={styles.info}>
        Disciplina: {disciplineNames[item.discipline] || "Carregando..."}
      </Text>
      <Text style={styles.info}>Conteúdo: {item.conteudo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aulas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={classrooms}
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

export default ClassroomsScreen;

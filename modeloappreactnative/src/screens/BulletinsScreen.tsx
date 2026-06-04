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

type Props = DrawerScreenProps<DrawerParamList, "Bulletins">;

export type Bulletin = {
  id: number;
  school_year: number;
  semester: number;
  final_situation: string;
  student: number;
};

const SITUATION_LABELS: Record<string, string> = {
  aprovado: "Aprovado",
  reprovado: "Reprovado",
  em_andamento: "Em andamento",
};

const BulletinsScreen = ({ navigation }: Props) => {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: Bulletin }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Boletim #{item.id}</Text>
      <Text style={styles.info}>
        Aluno: {studentNames[item.student] || "Carregando..."}
      </Text>
      <Text style={styles.info}>Ano letivo: {item.school_year}</Text>
      <Text style={styles.info}>Semestre: {item.semester}º</Text>
      <Text style={styles.info}>
        Situação final:{" "}
        {SITUATION_LABELS[item.final_situation] || item.final_situation}
      </Text>
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

export default BulletinsScreen;

import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Disciplines">;

export type Discipline = {
  id: number;
  name: string;
  workload: number;
  code: string;
};

const DisciplinesScreen = ({ navigation }: Props) => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDisciplines = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/disciplina/");
      const data = await response.json();
      setDisciplines(data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchDisciplines();
    }, []),
  );

  const renderItem = ({ item }: { item: Discipline }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Código: {item.code}</Text>
      <Text style={styles.info}>Carga horária: {item.workload}h</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disciplinas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={disciplines}
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

export default DisciplinesScreen;

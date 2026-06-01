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

type Props = DrawerScreenProps<DrawerParamList, "Teachers">;

export type Teacher = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  titulacao: "graduado" | "especialista" | "mestre" | "doutor";
  registro: string;
};

const TITULACAO_LABELS: Record<Teacher["titulacao"], string> = {
  graduado: "Graduado",
  especialista: "Especialista",
  mestre: "Mestre",
  doutor: "Doutor",
};

const TeachersScreen = ({ navigation }: Props) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/professor/");
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTeachers();
    }, []),
  );

  const renderItem = ({ item }: { item: Teacher }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Email: {item.email}</Text>
      <Text style={styles.info}>CPF: {item.cpf}</Text>
      <Text style={styles.info}>
        Titulação: {TITULACAO_LABELS[item.titulacao]}
      </Text>
      <Text style={styles.info}>Registro: {item.registro}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professores</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={teachers}
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

export default TeachersScreen;

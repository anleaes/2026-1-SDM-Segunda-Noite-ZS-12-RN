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

type Props = DrawerScreenProps<DrawerParamList, "Parents">;

export type Parent = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  parentesco: "pai" | "mae" | "avo" | "tio" | "responsavel_legal";
  responsavel_financeiro: boolean;
};

const PARENTESCO_LABELS: Record<Parent["parentesco"], string> = {
  pai: "Pai",
  mae: "Mãe",
  avo: "Avô/Avó",
  tio: "Tio/Tia",
  responsavel_legal: "Responsável Legal",
};

const ParentsScreen = ({ navigation }: Props) => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/responsavel/");
      const data = await response.json();
      setParents(data);
    } catch (error) {
      console.error("Erro ao buscar responsáveis:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchParents();
    }, []),
  );

  const renderItem = ({ item }: { item: Parent }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Email: {item.email}</Text>
      <Text style={styles.info}>CPF: {item.cpf}</Text>
      <Text style={styles.info}>
        Parentesco: {PARENTESCO_LABELS[item.parentesco]}
      </Text>
      <Text style={styles.info}>
        Responsável financeiro: {item.responsavel_financeiro ? "Sim" : "Não"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responsáveis</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={parents}
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

export default ParentsScreen;

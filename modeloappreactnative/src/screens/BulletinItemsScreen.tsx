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

type Props = DrawerScreenProps<DrawerParamList, "BulletinItems">;

export type BulletinItem = {
  id: number;
  final_grade: number;
  frequency: number;
  situation: string;
  bulletin: number;
  discipline: number;
};

type BulletinBasic = {
  id: number;
  school_year: number;
  semester: number;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

const SITUATION_LABELS: Record<string, string> = {
  Aprovado: "Aprovado",
  Reprovado: "Reprovado",
  Cancelado: "Cancelado",
  "Em andamento": "Em andamento",
};

const BulletinItemsScreen = ({ navigation }: Props) => {
  const [items, setItems] = useState<BulletinItem[]>([]);
  const [bulletinNames, setBulletinNames] = useState<Record<number, string>>({});
  const [disciplineNames, setDisciplineNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, bulletinsRes, disciplinesRes] = await Promise.all([
        fetch("http://localhost:8000/bulletinitem/"),
        fetch("http://localhost:8000/bulletins/"),
        fetch("http://localhost:8000/disciplina/"),
      ]);

      const itemsData: BulletinItem[] = await itemsRes.json();
      const bulletinsData: BulletinBasic[] = await bulletinsRes.json();
      const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();

      const bulletinMap: Record<number, string> = {};
      bulletinsData.forEach((b) => {
        bulletinMap[b.id] = `Boletim #${b.id} (${b.school_year}/${b.semester}º)`;
      });

      const disciplineMap: Record<number, string> = {};
      disciplinesData.forEach((d) => {
        disciplineMap[d.id] = d.name;
      });

      setItems(itemsData);
      setBulletinNames(bulletinMap);
      setDisciplineNames(disciplineMap);
    } catch (error) {
      console.error("Erro ao buscar itens de boletim:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, []),
  );

  const deleteItem = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/bulletinitem/${id}/`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  };

  const confirmDelete = (item: BulletinItem) => {
    const disciplineName = disciplineNames[item.discipline] || "Disciplina desconhecida";
    const message = `Tem certeza que deseja excluir o item de ${disciplineName}?`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        deleteItem(item.id);
      }
    } else {
      Alert.alert("Confirmar exclusão", message, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteItem(item.id),
        },
      ]);
    }
  };

  const renderItem = ({ item }: { item: BulletinItem }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {disciplineNames[item.discipline] || "Disciplina desconhecida"}
      </Text>
      <Text style={styles.info}>
        Boletim: {bulletinNames[item.bulletin] || `#${item.bulletin}`}
      </Text>
      <Text style={styles.info}>Média final: {item.final_grade}</Text>
      <Text style={styles.info}>Frequência: {item.frequency}%</Text>
      <Text style={styles.info}>
        Situação: {SITUATION_LABELS[item.situation] || item.situation}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditBulletinItem", { item })}
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
      <Text style={styles.title}>Itens de Boletim</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateBulletinItem")}
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

export default BulletinItemsScreen;

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

type Props = DrawerScreenProps<DrawerParamList, "RegistrationCarts">;

export type RegistrationCart = {
  id: number;
  status: string;
  registration: number;
  discipline: number;
  teacher: number;
};

type GroupedCart = {
  key: string;
  ids: number[];
  status: string;
  registration: number;
  teacher: number;
  disciplines: number[];
};

type RegistrationBasic = {
  id: number;
  data_matricula: string;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

type TeacherBasic = {
  id: number;
  name: string;
};

const RegistrationCartScreen = ({ navigation }: Props) => {
  const [groupedCarts, setGroupedCarts] = useState<GroupedCart[]>([]);
  const [registrationNames, setRegistrationNames] = useState<Record<number, string>>({});
  const [disciplineNames, setDisciplineNames] = useState<Record<number, string>>({});
  const [teacherNames, setTeacherNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cartsRes, registrationsRes, disciplinesRes, teachersRes] =
        await Promise.all([
          fetch("http://localhost:8000/carrinhomatricula/"),
          fetch("http://localhost:8000/matricula/"),
          fetch("http://localhost:8000/disciplina/"),
          fetch("http://localhost:8000/professor/"),
        ]);

      const cartsData: RegistrationCart[] = await cartsRes.json();
      const registrationsData: RegistrationBasic[] = await registrationsRes.json();
      const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();
      const teachersData: TeacherBasic[] = await teachersRes.json();

      const registrationMap: Record<number, string> = {};
      registrationsData.forEach((r) => {
        registrationMap[r.id] = `Matrícula #${r.id} (${r.data_matricula})`;
      });

      const disciplineMap: Record<number, string> = {};
      disciplinesData.forEach((d) => {
        disciplineMap[d.id] = d.name;
      });

      const teacherMap: Record<number, string> = {};
      teachersData.forEach((t) => {
        teacherMap[t.id] = t.name;
      });

      // Agrupa por matrícula + professor + status
      const groupMap: Record<string, GroupedCart> = {};
      cartsData.forEach((cart) => {
        const key = `${cart.registration}-${cart.teacher}-${cart.status}`;
        if (groupMap[key]) {
          groupMap[key].ids.push(cart.id);
          groupMap[key].disciplines.push(cart.discipline);
        } else {
          groupMap[key] = {
            key,
            ids: [cart.id],
            status: cart.status,
            registration: cart.registration,
            teacher: cart.teacher,
            disciplines: [cart.discipline],
          };
        }
      });

      setGroupedCarts(Object.values(groupMap));
      setRegistrationNames(registrationMap);
      setDisciplineNames(disciplineMap);
      setTeacherNames(teacherMap);
    } catch (error) {
      console.error("Erro ao buscar carrinhos de matrícula:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAll();
    }, []),
  );

  const renderItem = ({ item }: { item: GroupedCart }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {registrationNames[item.registration] || `Matrícula #${item.registration}`}
      </Text>
      <Text style={styles.info}>
        Disciplinas:{" "}
        {item.disciplines
          .map((dId) => disciplineNames[dId] || `#${dId}`)
          .join(", ")}
      </Text>
      <Text style={styles.info}>
        Professor: {teacherNames[item.teacher] || "Desconhecido"}
      </Text>
      <Text style={styles.info}>Status: {item.status}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditRegistrationCart", {
              cart: {
                id: item.ids[0],
                status: item.status,
                registration: item.registration,
                discipline: item.disciplines[0],
                teacher: item.teacher,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrinho de Matrícula</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={groupedCarts}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateRegistrationCart")}
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

export default RegistrationCartScreen;
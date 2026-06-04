import { DrawerScreenProps } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { RegistrationCart } from "./RegistrationCartScreen";

type Props = DrawerScreenProps<DrawerParamList, "EditRegistrationCart">;

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

const EditRegistrationCartScreen = ({ navigation, route }: Props) => {
  const { cart } = route.params;

  const [status, setStatus] = useState(cart.status);
  const [registrationId, setRegistrationId] = useState<number | null>(cart.registration);
  const [disciplineId, setDisciplineId] = useState<number | null>(cart.discipline);
  const [teacherId, setTeacherId] = useState<number | null>(cart.teacher);

  const [registrations, setRegistrations] = useState<RegistrationBasic[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineBasic[]>([]);
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [registrationsRes, disciplinesRes, teachersRes] = await Promise.all([
          fetch("http://localhost:8000/matricula/"),
          fetch("http://localhost:8000/disciplina/"),
          fetch("http://localhost:8000/professor/"),
        ]);
        const registrationsData: RegistrationBasic[] = await registrationsRes.json();
        const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();
        const teachersData: TeacherBasic[] = await teachersRes.json();

        setRegistrations(registrationsData);
        setDisciplines(disciplinesData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
      setLoadingOptions(false);
    };

    fetchOptions();
  }, []);

  const handleSave = async () => {
    if (!registrationId || !disciplineId || !teacherId) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await fetch(`http://localhost:8000/carrinhomatricula/${cart.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          registration: registrationId,
          discipline: disciplineId,
          teacher: teacherId,
        }),
      });
      navigation.navigate("RegistrationCarts");
    } catch (error) {
      console.error("Erro ao editar carrinho:", error);
    }
  };

  if (loadingOptions) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4B7BE5" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Carrinho #{cart.id}</Text>

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Ex: Analisando"
      />

      <Text style={styles.label}>Matrícula *</Text>
      {registrations.map((r) => (
        <TouchableOpacity
          key={r.id}
          style={[
            styles.optionButton,
            registrationId === r.id && styles.optionSelected,
          ]}
          onPress={() => setRegistrationId(r.id)}
        >
          <Text
            style={[
              styles.optionText,
              registrationId === r.id && styles.optionTextSelected,
            ]}
          >
            Matrícula #{r.id} ({r.data_matricula})
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Disciplina *</Text>
      {disciplines.map((d) => (
        <TouchableOpacity
          key={d.id}
          style={[
            styles.optionButton,
            disciplineId === d.id && styles.optionSelected,
          ]}
          onPress={() => setDisciplineId(d.id)}
        >
          <Text
            style={[
              styles.optionText,
              disciplineId === d.id && styles.optionTextSelected,
            ]}
          >
            {d.name}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Professor *</Text>
      {teachers.map((t) => (
        <TouchableOpacity
          key={t.id}
          style={[
            styles.optionButton,
            teacherId === t.id && styles.optionSelected,
          ]}
          onPress={() => setTeacherId(t.id)}
        >
          <Text
            style={[
              styles.optionText,
              teacherId === t.id && styles.optionTextSelected,
            ]}
          >
            {t.name}
          </Text>
        </TouchableOpacity>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("RegistrationCarts")}
        >
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  optionSelected: {
    borderColor: "#4B7BE5",
    backgroundColor: "#e8eeff",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },
  optionTextSelected: {
    color: "#4B7BE5",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4B7BE5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default EditRegistrationCartScreen;
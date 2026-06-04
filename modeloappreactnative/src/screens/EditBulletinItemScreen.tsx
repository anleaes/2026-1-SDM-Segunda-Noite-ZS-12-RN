import { Picker } from "@react-native-picker/picker";
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

type Props = DrawerScreenProps<DrawerParamList, "EditBulletinItem">;

type BulletinBasic = {
  id: number;
  school_year: number;
  semester: number;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

const EditBulletinItemScreen = ({ navigation, route }: Props) => {
  const { item } = route.params;

  const [finalGrade, setFinalGrade] = useState(item.final_grade.toString());
  const [frequency, setFrequency] = useState(item.frequency.toString());
  const [situation, setSituation] = useState(item.situation);
  const [bulletinId, setBulletinId] = useState<number | null>(item.bulletin);
  const [disciplineId, setDisciplineId] = useState<number | null>(item.discipline);

  const [bulletins, setBulletins] = useState<BulletinBasic[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineBasic[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [bulletinsRes, disciplinesRes] = await Promise.all([
          fetch("http://localhost:8000/bulletins/"),
          fetch("http://localhost:8000/disciplina/"),
        ]);
        const bulletinsData: BulletinBasic[] = await bulletinsRes.json();
        const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();

        setBulletins(bulletinsData);
        setDisciplines(disciplinesData);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
      setLoadingOptions(false);
    };

    fetchOptions();
  }, []);

  const handleSave = async () => {
    if (!bulletinId || !disciplineId || !finalGrade || !frequency) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await fetch(`http://localhost:8000/bulletinitem/${item.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          final_grade: parseFloat(finalGrade),
          frequency: parseFloat(frequency),
          situation,
          bulletin: bulletinId,
          discipline: disciplineId,
        }),
      });
      navigation.navigate("BulletinItems");
    } catch (error) {
      console.error("Erro ao editar item:", error);
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
      <Text style={styles.title}>Editar Item #{item.id}</Text>

      <Text style={styles.label}>Média final (0 a 10) *</Text>
      <TextInput
        style={styles.input}
        value={finalGrade}
        onChangeText={setFinalGrade}
        placeholder="Ex: 7.5"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Frequência (%) *</Text>
      <TextInput
        style={styles.input}
        value={frequency}
        onChangeText={setFrequency}
        placeholder="Ex: 85.0"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Situação *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={situation}
          onValueChange={(val) => setSituation(val)}
        >
          <Picker.Item label="Em andamento" value="Em andamento" />
          <Picker.Item label="Aprovado" value="Aprovado" />
          <Picker.Item label="Reprovado" value="Reprovado" />
          <Picker.Item label="Cancelado" value="Cancelado" />
        </Picker>
      </View>

      <Text style={styles.label}>Boletim *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={bulletinId}
          onValueChange={(val) => setBulletinId(val)}
        >
          <Picker.Item label="Selecione..." value={null} />
          {bulletins.map((b) => (
            <Picker.Item
              key={b.id}
              label={`Boletim #${b.id} (${b.school_year}/${b.semester}º)`}
              value={b.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Disciplina *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={disciplineId}
          onValueChange={(val) => setDisciplineId(val)}
        >
          <Picker.Item label="Selecione..." value={null} />
          {disciplines.map((d) => (
            <Picker.Item key={d.id} label={d.name} value={d.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("BulletinItems")}
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 4,
    overflow: "hidden",
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

export default EditBulletinItemScreen;
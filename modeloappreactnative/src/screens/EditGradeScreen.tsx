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

type Props = DrawerScreenProps<DrawerParamList, "EditGrade">;

type BulletinBasic = {
  id: number;
  school_year: number;
  semester: number;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

type StudentBasic = {
  id: number;
  name: string;
};

const EditGradeScreen = ({ navigation, route }: Props) => {
  const { grade } = route.params;

  const [bimester, setBimester] = useState<number>(grade.bimester);
  const [value, setValue] = useState(grade.value.toString());
  const [type, setType] = useState(grade.type);
  const [bulletinId, setBulletinId] = useState<number | null>(grade.bulletin);
  const [disciplineId, setDisciplineId] = useState<number | null>(grade.discipline);
  const [studentId, setStudentId] = useState<number | null>(grade.student);

  const [bulletins, setBulletins] = useState<BulletinBasic[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineBasic[]>([]);
  const [students, setStudents] = useState<StudentBasic[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const [bulletinsRes, disciplinesRes, studentsRes] = await Promise.all([
          fetch("http://localhost:8000/bulletins/"),
          fetch("http://localhost:8000/disciplina/"),
          fetch("http://localhost:8000/estudante/"),
        ]);
        const bulletinsData: BulletinBasic[] = await bulletinsRes.json();
        const disciplinesData: DisciplineBasic[] = await disciplinesRes.json();
        const studentsData: StudentBasic[] = await studentsRes.json();

        setBulletins(bulletinsData);
        setDisciplines(disciplinesData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Erro ao buscar opções:", error);
      }
      setLoadingOptions(false);
    };

    fetchOptions();
  }, []);

  const handleSave = async () => {
    if (!bulletinId || !disciplineId || !studentId || !value) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    try {
      await fetch(`http://localhost:8000/grades/${grade.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bimester,
          value: parseFloat(value),
          type,
          bulletin: bulletinId,
          discipline: disciplineId,
          student: studentId,
        }),
      });
      navigation.navigate("Grades");
    } catch (error) {
      console.error("Erro ao editar nota:", error);
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
      <Text style={styles.title}>Editar Nota #{grade.id}</Text>

      <Text style={styles.label}>Bimestre *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={bimester}
          onValueChange={(val) => setBimester(val)}
        >
          <Picker.Item label="1º Bimestre" value={1} />
          <Picker.Item label="2º Bimestre" value={2} />
          <Picker.Item label="3º Bimestre" value={3} />
          <Picker.Item label="4º Bimestre" value={4} />
        </Picker>
      </View>

      <Text style={styles.label}>Valor (0 a 10) *</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder="Ex: 8.5"
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Tipo</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Ex: Prova, Trabalho"
      />

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

      <Text style={styles.label}>Aluno *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={studentId}
          onValueChange={(val) => setStudentId(val)}
        >
          <Picker.Item label="Selecione..." value={null} />
          {students.map((s) => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.navigate("Grades")}
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

export default EditGradeScreen;
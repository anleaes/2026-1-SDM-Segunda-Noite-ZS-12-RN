import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateBulletin">;

type StudentBasic = {
  id: number;
  name: string;
};

const CreateBulletinScreen = ({ navigation }: Props) => {
  const [schoolYear, setSchoolYear] = useState("2026");
  const [semester, setSemester] = useState<number>(1);
  const [finalSituation, setFinalSituation] = useState("em_andamento");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [students, setStudents] = useState<StudentBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await fetch("http://localhost:8000/estudante/");
      const data: StudentBasic[] = await response.json();
      setStudents(data);
      if (data.length > 0) setStudentId(data[0].id);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
    setLoadingStudents(false);
  };

  useFocusEffect(
    useCallback(() => {
      setSchoolYear("2026");
      setSemester(1);
      setFinalSituation("em_andamento");
      setStudentId(null);
      fetchStudents();
    }, []),
  );

  const handleSave = async () => {
    if (studentId === null) {
      console.error("Nenhum aluno selecionado");
      return;
    }
    setSaving(true);
    try {
      await fetch("http://localhost:8000/bulletins/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_year: parseInt(schoolYear, 10),
          semester,
          final_situation: finalSituation,
          student: studentId,
        }),
      });
      navigation.navigate("Bulletins");
    } catch (error) {
      console.error("Erro ao salvar boletim:", error);
    }
    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Novo boletim</Text>

      <Text style={styles.label}>Ano letivo</Text>
      <TextInput
        value={schoolYear}
        onChangeText={setSchoolYear}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ex: 2026"
      />

      <Text style={styles.label}>Semestre</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={semester}
          onValueChange={(value) => setSemester(value)}
        >
          <Picker.Item label="1º Semestre" value={1} />
          <Picker.Item label="2º Semestre" value={2} />
        </Picker>
      </View>

      <Text style={styles.label}>Situação final</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={finalSituation}
          onValueChange={(value) => setFinalSituation(value)}
        >
          <Picker.Item label="Em andamento" value="em_andamento" />
          <Picker.Item label="Aprovado" value="aprovado" />
          <Picker.Item label="Reprovado" value="reprovado" />
        </Picker>
      </View>

      <Text style={styles.label}>Aluno</Text>
      {loadingStudents ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={studentId}
            onValueChange={(value) => setStudentId(value)}
          >
            {students.map((s) => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Voltar"
          onPress={() => navigation.navigate("Bulletins")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default CreateBulletinScreen;

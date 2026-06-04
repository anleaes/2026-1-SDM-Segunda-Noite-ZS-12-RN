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

type Props = DrawerScreenProps<DrawerParamList, "CreateRegistration">;

type StudentBasic = {
  id: number;
  name: string;
};

type ClassBasic = {
  id: number;
  codigo: string;
};

const CreateRegistrationScreen = ({ navigation }: Props) => {
  const [dataMatricula, setDataMatricula] = useState("");
  const [situacao, setSituacao] = useState("Registrado");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [schoolClassId, setSchoolClassId] = useState<number | null>(null);
  const [students, setStudents] = useState<StudentBasic[]>([]);
  const [classes, setClasses] = useState<ClassBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const fetchDropdowns = async () => {
    setLoadingDropdowns(true);
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        fetch("http://localhost:8000/estudante/"),
        fetch("http://localhost:8000/turma/"),
      ]);

      const studentsData: StudentBasic[] = await studentsResponse.json();
      const classesData: ClassBasic[] = await classesResponse.json();

      setStudents(studentsData);
      setClasses(classesData);

      // Já seleciona o primeiro de cada por padrão
      if (studentsData.length > 0) setStudentId(studentsData[0].id);
      if (classesData.length > 0) setSchoolClassId(classesData[0].id);
    } catch (error) {
      console.error("Erro ao buscar alunos e turmas:", error);
    }
    setLoadingDropdowns(false);
  };

  useFocusEffect(
    useCallback(() => {
      // Reseta os campos ao entrar na tela
      setDataMatricula("");
      setSituacao("Registrado");
      setStudentId(null);
      setSchoolClassId(null);
      fetchDropdowns();
    }, []),
  );

  const handleSave = async () => {
    if (studentId === null || schoolClassId === null) {
      console.error("Aluno ou turma não selecionado");
      return;
    }
    setSaving(true);
    try {
      await fetch("http://localhost:8000/matricula/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_matricula: dataMatricula,
          situacao,
          student: studentId,
          school_class: schoolClassId,
        }),
      });
      navigation.navigate("Registrations");
    } catch (error) {
      console.error("Erro ao salvar matricula:", error);
    }
    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Nova matrícula</Text>

      <Text style={styles.label}>Data da matrícula (AAAA-MM-DD)</Text>
      <TextInput
        value={dataMatricula}
        onChangeText={setDataMatricula}
        style={styles.input}
        placeholder="Ex: 2026-06-15"
      />

      <Text style={styles.label}>Situação</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={situacao}
          onValueChange={(value) => setSituacao(value)}
        >
          <Picker.Item label="Registrado" value="Registrado" />
          <Picker.Item label="Ativa" value="Ativa" />
          <Picker.Item label="Trancada" value="Trancada" />
          <Picker.Item label="Cancelada" value="Cancelada" />
        </Picker>
      </View>

      <Text style={styles.label}>Aluno</Text>
      {loadingDropdowns ? (
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

      <Text style={styles.label}>Turma</Text>
      {loadingDropdowns ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={schoolClassId}
            onValueChange={(value) => setSchoolClassId(value)}
          >
            {classes.map((c) => (
              <Picker.Item key={c.id} label={c.codigo} value={c.id} />
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
          onPress={() => navigation.navigate("Registrations")}
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

export default CreateRegistrationScreen;

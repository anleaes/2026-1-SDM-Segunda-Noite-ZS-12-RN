import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditRegistration">;

type StudentBasic = {
  id: number;
  name: string;
};

type ClassBasic = {
  id: number;
  codigo: string;
};

const EditRegistrationScreen = ({ route, navigation }: Props) => {
  const { registration } = route.params;

  const [dataMatricula, setDataMatricula] = useState(
    registration.data_matricula,
  );
  const [situacao, setSituacao] = useState(registration.situacao);
  const [studentId, setStudentId] = useState<number>(registration.student);
  const [schoolClassId, setSchoolClassId] = useState<number>(
    registration.school_class,
  );
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
    } catch (error) {
      console.error("Erro ao buscar alunos e turmas:", error);
    }
    setLoadingDropdowns(false);
  };

  useEffect(() => {
    setDataMatricula(registration.data_matricula);
    setSituacao(registration.situacao);
    setStudentId(registration.student);
    setSchoolClassId(registration.school_class);
    fetchDropdowns();
  }, [registration]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/matricula/${registration.id}/`, {
        method: "PUT",
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
      console.error("Erro ao atualizar matricula:", error);
    }
    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Editar matrícula</Text>

      <Text style={styles.label}>Data da matrícula (AAAA-MM-DD)</Text>
      <TextInput
        value={dataMatricula}
        onChangeText={setDataMatricula}
        style={styles.input}
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

export default EditRegistrationScreen;

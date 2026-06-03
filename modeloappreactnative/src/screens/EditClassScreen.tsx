import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Class } from "./ClassesScreen";

type Props = DrawerScreenProps<DrawerParamList, "EditClass">;

type TeacherBasic = {
  id: number;
  name: string;
};

const EditClassScreen = ({ route, navigation }: Props) => {
  const { schoolClass } = route.params;

  const [codigo, setCodigo] = useState(schoolClass.codigo);
  const [turno, setTurno] = useState<Class["turno"]>(schoolClass.turno);
  const [anoLetivo, setAnoLetivo] = useState(schoolClass.ano_letivo.toString());
  const [professorId, setProfessorId] = useState<number>(schoolClass.professor);
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await fetch("http://localhost:8000/professor/");
      const data: TeacherBasic[] = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
    setLoadingTeachers(false);
  };

  useEffect(() => {
    setCodigo(schoolClass.codigo);
    setTurno(schoolClass.turno);
    setAnoLetivo(schoolClass.ano_letivo.toString());
    setProfessorId(schoolClass.professor);
    fetchTeachers();
  }, [schoolClass]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/turma/${schoolClass.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo,
          turno,
          ano_letivo: parseInt(anoLetivo, 10),
          professor: professorId,
        }),
      });
      navigation.navigate("Classes");
    } catch (error) {
      console.error("Erro ao atualizar turma:", error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar turma</Text>

      <Text style={styles.label}>Código</Text>
      <TextInput value={codigo} onChangeText={setCodigo} style={styles.input} />

      <Text style={styles.label}>Turno</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={turno}
          onValueChange={(value) => setTurno(value)}
        >
          <Picker.Item label="Matutino" value="matutino" />
          <Picker.Item label="Vespertino" value="vespertino" />
          <Picker.Item label="Noturno" value="noturno" />
        </Picker>
      </View>

      <Text style={styles.label}>Ano letivo</Text>
      <TextInput
        value={anoLetivo}
        onChangeText={setAnoLetivo}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Professor</Text>
      {loadingTeachers ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={professorId}
            onValueChange={(value) => setProfessorId(value)}
          >
            {teachers.map((teacher) => (
              <Picker.Item
                key={teacher.id}
                label={teacher.name}
                value={teacher.id}
              />
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
        <Button title="Voltar" onPress={() => navigation.navigate("Classes")} />
      </View>
    </View>
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

export default EditClassScreen;

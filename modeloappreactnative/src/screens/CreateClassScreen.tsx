import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "CreateClass">;

type TeacherBasic = {
  id: number;
  name: string;
};

const CreateClassScreen = ({ navigation }: Props) => {
  const [codigo, setCodigo] = useState("");
  const [turno, setTurno] = useState<Class["turno"]>("matutino");
  const [anoLetivo, setAnoLetivo] = useState("2026");
  const [professorId, setProfessorId] = useState<number | null>(null);
  const [teachers, setTeachers] = useState<TeacherBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await fetch("http://localhost:8000/professor/");
      const data: TeacherBasic[] = await response.json();
      setTeachers(data);
      // Já deixa o primeiro professor selecionado por padrão
      if (data.length > 0) {
        setProfessorId(data[0].id);
      }
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
    }
    setLoadingTeachers(false);
  };

  useFocusEffect(
    useCallback(() => {
      // Reseta os campos ao entrar na tela
      setCodigo("");
      setTurno("matutino");
      setAnoLetivo("2026");
      setProfessorId(null);
      fetchTeachers();
    }, []),
  );

  const handleSave = async () => {
    if (professorId === null) {
      console.error("Nenhum professor selecionado");
      return;
    }
    setSaving(true);
    try {
      await fetch("http://localhost:8000/turma/", {
        method: "POST",
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
      console.error("Erro ao salvar turma:", error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova turma</Text>

      <Text style={styles.label}>Código</Text>
      <TextInput
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        placeholder="Ex: MAT-2026-1-A"
      />

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
        placeholder="Ex: 2026"
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

export default CreateClassScreen;

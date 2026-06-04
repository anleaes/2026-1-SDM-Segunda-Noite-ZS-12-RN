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

type Props = DrawerScreenProps<DrawerParamList, "EditClassroom">;

type ClassBasic = {
  id: number;
  codigo: string;
};

type DisciplineBasic = {
  id: number;
  name: string;
};

const EditClassroomScreen = ({ route, navigation }: Props) => {
  const { classroom } = route.params;

  const [data, setData] = useState(classroom.data);
  const [sala, setSala] = useState(classroom.sala);
  const [conteudo, setConteudo] = useState(classroom.conteudo);
  const [schoolClassId, setSchoolClassId] = useState<number>(
    classroom.school_class,
  );
  const [disciplineId, setDisciplineId] = useState<number>(
    classroom.discipline,
  );
  const [classes, setClasses] = useState<ClassBasic[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const fetchDropdowns = async () => {
    setLoadingDropdowns(true);
    try {
      const [classesResponse, disciplinesResponse] = await Promise.all([
        fetch("http://localhost:8000/turma/"),
        fetch("http://localhost:8000/disciplina/"),
      ]);

      const classesData: ClassBasic[] = await classesResponse.json();
      const disciplinesData: DisciplineBasic[] =
        await disciplinesResponse.json();

      setClasses(classesData);
      setDisciplines(disciplinesData);
    } catch (error) {
      console.error("Erro ao buscar turmas e disciplinas:", error);
    }
    setLoadingDropdowns(false);
  };

  useEffect(() => {
    setData(classroom.data);
    setSala(classroom.sala);
    setConteudo(classroom.conteudo);
    setSchoolClassId(classroom.school_class);
    setDisciplineId(classroom.discipline);
    fetchDropdowns();
  }, [classroom]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/aula/${classroom.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data,
          sala,
          conteudo,
          school_class: schoolClassId,
          discipline: disciplineId,
        }),
      });
      navigation.navigate("Classrooms");
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
    }
    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Editar aula</Text>

      <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
      <TextInput value={data} onChangeText={setData} style={styles.input} />

      <Text style={styles.label}>Sala</Text>
      <TextInput value={sala} onChangeText={setSala} style={styles.input} />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        value={conteudo}
        onChangeText={setConteudo}
        style={styles.input}
      />

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

      <Text style={styles.label}>Disciplina</Text>
      {loadingDropdowns ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={disciplineId}
            onValueChange={(value) => setDisciplineId(value)}
          >
            {disciplines.map((d) => (
              <Picker.Item key={d.id} label={d.name} value={d.id} />
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
          onPress={() => navigation.navigate("Classrooms")}
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

export default EditClassroomScreen;

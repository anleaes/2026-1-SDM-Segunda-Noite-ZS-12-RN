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

type Props = DrawerScreenProps<DrawerParamList, "EditDiscipline">;

const EditDisciplineScreen = ({ route, navigation }: Props) => {
  const { discipline } = route.params;
  const [name, setName] = useState(discipline.name);
  const [workload, setWorkload] = useState(discipline.workload.toString());
  const [code, setCode] = useState(discipline.code);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(discipline.name);
    setWorkload(discipline.workload.toString());
    setCode(discipline.code);
  }, [discipline]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/disciplina/${discipline.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          workload: parseInt(workload, 10),
          code,
        }),
      });
      navigation.navigate("Disciplines");
    } catch (error) {
      console.error("Erro ao atualizar disciplina:", error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar disciplina</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Carga horária</Text>
      <TextInput
        value={workload}
        onChangeText={setWorkload}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Código</Text>
      <TextInput value={code} onChangeText={setCode} style={styles.input} />

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
          onPress={() => navigation.navigate("Disciplines")}
        />
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
  buttonContainer: {
    marginTop: 12,
  },
});

export default EditDisciplineScreen;

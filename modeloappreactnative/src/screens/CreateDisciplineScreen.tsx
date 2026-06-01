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

type Props = DrawerScreenProps<DrawerParamList, "CreateDiscipline">;

const CreateDisciplineScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [workload, setWorkload] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName("");
      setWorkload("");
      setCode("");
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("http://localhost:8000/disciplina/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          workload: parseInt(workload, 10),
          code,
        }),
      });
      navigation.navigate("Disciplines");
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova disciplina</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Ex: Matemática"
      />

      <Text style={styles.label}>Carga horária</Text>
      <TextInput
        value={workload}
        onChangeText={setWorkload}
        style={styles.input}
        placeholder="Ex: 60"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Código</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        style={styles.input}
        placeholder="Ex: MAT001"
      />

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

export default CreateDisciplineScreen;

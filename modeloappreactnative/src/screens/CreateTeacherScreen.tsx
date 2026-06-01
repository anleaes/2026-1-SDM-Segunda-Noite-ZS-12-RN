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
import { Teacher } from "./TeachersScreen";

type Props = DrawerScreenProps<DrawerParamList, "CreateTeacher">;

const CreateTeacherScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [titulacao, setTitulacao] = useState<Teacher["titulacao"]>("graduado");
  const [registro, setRegistro] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName("");
      setCpf("");
      setEmail("");
      setTitulacao("graduado");
      setRegistro("");
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("http://localhost:8000/professor/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cpf,
          email,
          titulacao,
          registro,
        }),
      });
      navigation.navigate("Teachers");
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo professor</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Ex: João Silva"
      />

      <Text style={styles.label}>CPF</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        placeholder="Ex: 123.456.789-00"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Ex: joao@escola.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Titulação</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={titulacao}
          onValueChange={(value) => setTitulacao(value)}
        >
          <Picker.Item label="Graduado" value="graduado" />
          <Picker.Item label="Especialista" value="especialista" />
          <Picker.Item label="Mestre" value="mestre" />
          <Picker.Item label="Doutor" value="doutor" />
        </Picker>
      </View>

      <Text style={styles.label}>Registro</Text>
      <TextInput
        value={registro}
        onChangeText={setRegistro}
        style={styles.input}
        placeholder="Ex: REG001"
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
          onPress={() => navigation.navigate("Teachers")}
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default CreateTeacherScreen;

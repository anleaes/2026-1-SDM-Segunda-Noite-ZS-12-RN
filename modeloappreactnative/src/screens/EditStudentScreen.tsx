import { Ionicons } from "@expo/vector-icons";
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
    TouchableOpacity,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Student } from "./StudentsScreen";

type Props = DrawerScreenProps<DrawerParamList, "EditStudent">;

type ParentBasic = {
  id: number;
  name: string;
};

const EditStudentScreen = ({ route, navigation }: Props) => {
  const { student } = route.params;

  const [name, setName] = useState(student.name);
  const [cpf, setCpf] = useState(student.cpf);
  const [email, setEmail] = useState(student.email);
  const [status, setStatus] = useState<Student["status"]>(student.status);
  const [matricula, setMatricula] = useState(student.matricula);
  const [dataNascimento, setDataNascimento] = useState(student.data_nascimento);
  const [selectedParents, setSelectedParents] = useState<number[]>(
    student.responsaveis,
  );
  const [parents, setParents] = useState<ParentBasic[]>([]);
  const [saving, setSaving] = useState(false);
  const [loadingParents, setLoadingParents] = useState(true);

  const fetchParents = async () => {
    setLoadingParents(true);
    try {
      const response = await fetch("http://localhost:8000/responsavel/");
      const data: ParentBasic[] = await response.json();
      setParents(data);
    } catch (error) {
      console.error("Erro ao buscar responsáveis:", error);
    }
    setLoadingParents(false);
  };

  useEffect(() => {
    setName(student.name);
    setCpf(student.cpf);
    setEmail(student.email);
    setStatus(student.status);
    setMatricula(student.matricula);
    setDataNascimento(student.data_nascimento);
    setSelectedParents(student.responsaveis);
    fetchParents();
  }, [student]);

  const toggleParent = (id: number) => {
    setSelectedParents((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`http://localhost:8000/estudante/${student.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          cpf,
          email,
          status,
          matricula,
          data_nascimento: dataNascimento,
          responsaveis: selectedParents,
        }),
      });
      navigation.navigate("Students");
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
    }
    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Editar aluno</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>CPF</Text>
      <TextInput value={cpf} onChangeText={setCpf} style={styles.input} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={status}
          onValueChange={(value) => setStatus(value)}
        >
          <Picker.Item label="Ativo" value="ativo" />
          <Picker.Item label="Inativo" value="inativo" />
          <Picker.Item label="Trancado" value="trancado" />
        </Picker>
      </View>

      <Text style={styles.label}>Matrícula</Text>
      <TextInput
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />

      <Text style={styles.label}>Data de nascimento (AAAA-MM-DD)</Text>
      <TextInput
        value={dataNascimento}
        onChangeText={setDataNascimento}
        style={styles.input}
      />

      <Text style={styles.label}>Responsáveis</Text>
      {loadingParents ? (
        <ActivityIndicator size="small" color="#4B7BE5" />
      ) : (
        <View style={styles.checkboxList}>
          {parents.map((parent) => {
            const isSelected = selectedParents.includes(parent.id);
            return (
              <TouchableOpacity
                key={parent.id}
                style={styles.checkboxRow}
                onPress={() => toggleParent(parent.id)}
              >
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={24}
                  color={isSelected ? "#4B7BE5" : "#999"}
                />
                <Text style={styles.checkboxLabel}>{parent.name}</Text>
              </TouchableOpacity>
            );
          })}
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
          onPress={() => navigation.navigate("Students")}
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
  checkboxList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 12,
  },
});

export default EditStudentScreen;

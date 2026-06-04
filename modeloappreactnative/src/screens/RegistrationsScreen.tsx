import { DrawerScreenProps } from "@react-navigation/drawer";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "Registrations">;

export type Registration = {
  id: number;
  data_matricula: string;
  situacao: string;
  student: number; // ID do aluno
  school_class: number; // ID da turma
};

const formatDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const RegistrationsScreen = ({ navigation }: Props) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentNames, setStudentNames] = useState<Record<number, string>>({});
  const [classNames, setClassNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: Registration }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Matrícula #{item.id}</Text>
      <Text style={styles.info}>
        Aluno: {studentNames[item.student] || "Carregando..."}
      </Text>
      <Text style={styles.info}>
        Turma: {classNames[item.school_class] || "Carregando..."}
      </Text>
      <Text style={styles.info}>Data: {formatDate(item.data_matricula)}</Text>
      <Text style={styles.info}>Situação: {item.situacao}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matrículas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={registrations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default RegistrationsScreen;

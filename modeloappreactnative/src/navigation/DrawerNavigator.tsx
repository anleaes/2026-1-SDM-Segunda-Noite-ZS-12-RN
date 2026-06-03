import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import ClassesScreen, { Class } from "../screens/ClassesScreen";
import CreateClassScreen from "../screens/CreateClassScreen";
import CreateDisciplineScreen from "../screens/CreateDisciplineScreen";
import CreateTeacherScreen from "../screens/CreateTeacherScreen";
import DisciplinesScreen, { Discipline } from "../screens/DisciplinesScreen";
import EditClassScreen from "../screens/EditClassScreen";
import EditDisciplineScreen from "../screens/EditDisciplineScreen";
import EditTeacherScreen from "../screens/EditTeacherScreen";
import HomeScreen from "../screens/HomeScreen";
import ParentsScreen from "../screens/ParentsScreen";
import TeachersScreen, { Teacher } from "../screens/TeachersScreen";

export type DrawerParamList = {
  Home: undefined;
  Disciplines: undefined;
  CreateDiscipline: undefined;
  EditDiscipline: { discipline: Discipline };
  Teachers: undefined;
  CreateTeacher: undefined;
  EditTeacher: { teacher: Teacher };
  Classes: undefined;
  CreateClass: undefined;
  EditClass: { schoolClass: Class };
  Parents: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#4B7BE5",
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: "#fff", width: 250 },
        headerStyle: { backgroundColor: "#4B7BE5" },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          title: "Início",
        }}
      />
      <Drawer.Screen
        name="Disciplines"
        component={DisciplinesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
          title: "Disciplinas",
        }}
      />
      <Drawer.Screen
        name="CreateDiscipline"
        component={CreateDisciplineScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova disciplina",
        }}
      />
      <Drawer.Screen
        name="EditDiscipline"
        component={EditDisciplineScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar disciplina",
        }}
      />
      <Drawer.Screen
        name="Teachers"
        component={TeachersScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
          title: "Professores",
        }}
      />
      <Drawer.Screen
        name="CreateTeacher"
        component={CreateTeacherScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo professor",
        }}
      />
      <Drawer.Screen
        name="EditTeacher"
        component={EditTeacherScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar professor",
        }}
      />
      <Drawer.Screen
        name="Classes"
        component={ClassesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
          title: "Turmas",
        }}
      />
      <Drawer.Screen
        name="CreateClass"
        component={CreateClassScreen}
        options={{ drawerItemStyle: { display: "none" }, title: "Nova turma" }}
      />
      <Drawer.Screen
        name="EditClass"
        component={EditClassScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar turma",
        }}
      />
      <Drawer.Screen
        name="Parents"
        component={ParentsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
          title: "Responsáveis",
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

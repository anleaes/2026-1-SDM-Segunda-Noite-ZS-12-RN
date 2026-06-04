import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import BulletinsScreen from "../screens/BulletinsScreen";
import RegistrationCartScreen, { RegistrationCart } from "../screens/RegistrationCartScreen";
import EditRegistrationCartScreen from "../screens/EditRegistrationCartScreen";
import CreateRegistrationCartScreen from "../screens/CreateRegistrationCartScreen";
import ClassesScreen, { Class } from "../screens/ClassesScreen";
import ClassroomsScreen, { Classroom } from "../screens/ClassroomsScreen";
import GradesScreen, { Grade } from "../screens/GradesScreen";
import BulletinItemsScreen, { BulletinItem } from "../screens/BulletinItemsScreen";
import EditBulletinItemScreen from "../screens/EditBulletinItemScreen";
import CreateGradeScreen from "../screens/CreateGradeScreen";
import CreateBulletinItemScreen from "../screens/CreateBulletinItemScreen";
import EditGradeScreen from "../screens/EditGradeScreen";
import CreateClassScreen from "../screens/CreateClassScreen";
import CreateClassroomScreen from "../screens/CreateClassroomScreen";
import CreateDisciplineScreen from "../screens/CreateDisciplineScreen";
import CreateParentScreen from "../screens/CreateParentScreen";
import CreateRegistrationScreen from "../screens/CreateRegistrationScreen";
import CreateStudentScreen from "../screens/CreateStudentScreen";
import CreateTeacherScreen from "../screens/CreateTeacherScreen";
import DisciplinesScreen, { Discipline } from "../screens/DisciplinesScreen";
import EditClassScreen from "../screens/EditClassScreen";
import EditClassroomScreen from "../screens/EditClassroomScreen";
import EditDisciplineScreen from "../screens/EditDisciplineScreen";
import EditParentScreen from "../screens/EditParentScreen";
import EditRegistrationScreen from "../screens/EditRegistrationScreen";
import EditStudentScreen from "../screens/EditStudentScreen";
import EditTeacherScreen from "../screens/EditTeacherScreen";
import HomeScreen from "../screens/HomeScreen";
import ParentsScreen, { Parent } from "../screens/ParentsScreen";
import RegistrationsScreen, {
  Registration,
} from "../screens/RegistrationsScreen";
import StudentsScreen, { Student } from "../screens/StudentsScreen";
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
  CreateParent: undefined;
  EditParent: { parent: Parent };
  Students: undefined;
  CreateStudent: undefined;
  EditStudent: { student: Student };
  Classrooms: undefined;
  CreateClassroom: undefined;
  EditClassroom: { classroom: Classroom };
  Registrations: undefined;
  CreateRegistration: undefined;
  EditRegistration: { registration: Registration };
  Bulletins: undefined;
  RegistrationCarts: undefined;
  CreateRegistrationCart: undefined;
  EditRegistrationCart: { cart: RegistrationCart };
  Grades: undefined;
  CreateGrade: undefined;
  EditGrade: { grade: Grade };
  BulletinItems: undefined;
  CreateBulletinItem: undefined;
  EditBulletinItem: { item: BulletinItem };
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
      <Drawer.Screen
        name="CreateParent"
        component={CreateParentScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo responsável",
        }}
      />
      <Drawer.Screen
        name="EditParent"
        component={EditParentScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar responsável",
        }}
      />
      <Drawer.Screen
        name="Students"
        component={StudentsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          title: "Alunos",
        }}
      />
      <Drawer.Screen
        name="CreateStudent"
        component={CreateStudentScreen}
        options={{ drawerItemStyle: { display: "none" }, title: "Novo aluno" }}
      />
      <Drawer.Screen
        name="EditStudent"
        component={EditStudentScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar aluno",
        }}
      />
      <Drawer.Screen
        name="Classrooms"
        component={ClassroomsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
          title: "Aulas",
        }}
      />
      <Drawer.Screen
        name="CreateClassroom"
        component={CreateClassroomScreen}
        options={{ drawerItemStyle: { display: "none" }, title: "Nova aula" }}
      />
      <Drawer.Screen
        name="EditClassroom"
        component={EditClassroomScreen}
        options={{ drawerItemStyle: { display: "none" }, title: "Editar aula" }}
      />
      <Drawer.Screen
        name="Registrations"
        component={RegistrationsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
          title: "Matrículas",
        }}
      />
      <Drawer.Screen
        name="CreateRegistration"
        component={CreateRegistrationScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova matrícula",
        }}
      />
      <Drawer.Screen
        name="EditRegistration"
        component={EditRegistrationScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar matrícula",
        }}
      />
      <Drawer.Screen
        name="Bulletins"
        component={BulletinsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
          title: "Boletins",
        }}
      />
      <Drawer.Screen
        name="RegistrationCarts"
        component={RegistrationCartScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          title: "Carrinho de Matrícula",
        }}
      />
      <Drawer.Screen
        name="CreateRegistrationCart"
        component={CreateRegistrationCartScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo carrinho",
        }}
      />
      <Drawer.Screen
        name="EditRegistrationCart"
        component={EditRegistrationCartScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar carrinho",
        }}
      />
      <Drawer.Screen
        name="Grades"
        component={GradesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
          title: "Notas",
        }}
      />
      <Drawer.Screen
        name="CreateGrade"
        component={CreateGradeScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova nota",
        }}
      />
      <Drawer.Screen
        name="EditGrade"
        component={EditGradeScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar nota",
        }}
      />
      <Drawer.Screen
        name="BulletinItems"
        component={BulletinItemsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          title: "Itens de Boletim",
        }}
      />
      <Drawer.Screen
        name="CreateBulletinItem"
        component={CreateBulletinItemScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo item",
        }}
      />
      <Drawer.Screen
        name="EditBulletinItem"
        component={EditBulletinItemScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar item",
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

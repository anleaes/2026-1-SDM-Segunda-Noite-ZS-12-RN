import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "../components/CustomDrawerContent";
import DisciplinesScreen from "../screens/DisciplinesScreen";
import HomeScreen from "../screens/HomeScreen";

export type DrawerParamList = {
  Home: undefined;
  Disciplines: undefined;
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
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

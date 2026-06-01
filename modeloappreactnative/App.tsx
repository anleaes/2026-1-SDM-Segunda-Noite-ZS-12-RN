import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerNavigator from "./src/navigation/DrawerNavigator";

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  </GestureHandlerRootView>
);

export default App;

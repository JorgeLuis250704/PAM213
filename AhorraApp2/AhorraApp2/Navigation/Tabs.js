import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PrincipalScreen from "../Screens/PrincipalScreen";
import PerfilScreen from "../Screens/PerfilScreen";
import GraficasScreen from "../Screens/GraficasScreen";
import RegistroScreen from "../Screens/RegScreens";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={PrincipalScreen} />
      <Tab.Screen name="Registro" component={RegistroScreen} />
      <Tab.Screen name="Gráficas" component={GraficasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./Screens/ThemeContext"; // ✅ Importa el contexto
import PerfilScreen from "./Screens/PerfilScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";
import PresupuestoScreen from "./Screens/PresupuestoScreen";
import GraficasScreen from "./Screens/GraficasScreen";
import LogInScreen from "./Screens/LogInScreen";
import SignInScreen from "./Screens/SignInScreen";
import RegistroScreen from "./Screens/RegScreens";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown:true }}>
          <Stack.Screen name="Principal" component={PrincipalScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Presupuesto" component={PresupuestoScreen} />
          <Stack.Screen name="Graficas" component={GraficasScreen} />
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Registros" component={RegistroScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

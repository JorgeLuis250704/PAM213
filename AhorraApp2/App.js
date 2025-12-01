import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./Screens/ThemeContext";

import PerfilScreen from "./Screens/PerfilScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";
import GraficasScreen from "./Screens/GraficasScreen";
import DetalleGraficasScreen from "./Screens/DetalleGraficasScreen";
import LogInScreen from "./Screens/LogInScreen";
import SignInScreen from "./Screens/SignInScreen";
import RegistroScreen from "./Screens/RegScreens";

import Tabs from "./Navigation/Tabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown: true }}>

          <Stack.Screen name="Principal" component={PrincipalScreen} />
          <Stack.Screen name="Perfil" component={PerfilScreen} />
          <Stack.Screen name="Registros" component={RegistroScreen} />
          <Stack.Screen name="Graficas" component={GraficasScreen} />

          {/* ESTA ES LA QUE FALTABA */}
          <Stack.Screen name="DetalleGraficas" component={DetalleGraficasScreen} />

          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />

          {/* Navegación por tabs, si la necesitas */}
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

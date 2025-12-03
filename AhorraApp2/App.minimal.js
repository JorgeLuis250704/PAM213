import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "./Screens/ThemeContext";
import React from "react";

// Importar solo las pantallas esenciales primero
import LogInScreen from "./Screens/LogInScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    console.log("✅ App.js cargando...");

    try {
        return (
            <ThemeProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown: true }}>
                        <Stack.Screen name="LogIn" component={LogInScreen} />
                        <Stack.Screen name="Principal" component={PrincipalScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        );
    } catch (error) {
        console.error("❌ Error en App.js:", error);
        return null;
    }
}

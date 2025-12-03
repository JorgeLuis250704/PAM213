import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './Screens/ThemeContext';

// Componente de prueba simple
function TestScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>✅ App Funcionando!</Text>
            <Text style={styles.subtitle}>La aplicación se está renderizando correctamente</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('LogIn')}
            >
                <Text style={styles.buttonText}>Ir a Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Principal')}
            >
                <Text style={styles.buttonText}>Ir a Principal</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Registros')}
            >
                <Text style={styles.buttonText}>Ir a Registros</Text>
            </TouchableOpacity>
        </View>
    );
}

const Stack = createNativeStackNavigator();

export default function App() {
    console.log('🚀 App iniciando...');

    return (
        <ThemeProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Test">
                    <Stack.Screen
                        name="Test"
                        component={TestScreen}
                        options={{ title: 'Prueba de App' }}
                    />
                    {/* Importar las pantallas reales después */}
                </Stack.Navigator>
            </NavigationContainer>
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2f8a4f',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        color: '#666',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2f8a4f',
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

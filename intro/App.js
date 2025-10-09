//import
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';

//main
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contador con Flexbox</Text>

      <View style={styles.counterBox}>
        <Text style={styles.counterText}>{count}</Text>
      </View>

      {/* Contenedor de botones con flexDirection */}
      <View style={styles.buttonsRow}>
        <View style={styles.button}>
          <Button title="Sumar" onPress={() => setCount(count + 1)} color="#4CAF50" />
        </View>

        <View style={styles.button}>
          <Button title="Quitar" onPress={() => setCount(count - 1)} color="#f44336" />
        </View>

        <View style={styles.button}>
          <Button title="Reiniciar" onPress={() => setCount(0)} color="#2196F3" />
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

//estilos
const styles = StyleSheet.create({
  container: {
    flex: 1, // ocupa toda la pantalla
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', // centra el contenido verticalmente
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  counterBox: {
    width: 150,
    height: 150,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center', // centra verticalmente el número
    alignItems: 'center', // centra horizontalmente el número
    borderRadius: 10,
    marginBottom: 40,
  },
  counterText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsRow: {
    flexDirection: 'row', // los botones estarán uno al lado del otro
    justifyContent: 'space-around', // los separa uniformemente
    width: '100%', // ocupa todo el ancho disponible
  },
  button: {
    flex: 1,
    marginHorizontal: 5, // espacio entre botones
  },
});

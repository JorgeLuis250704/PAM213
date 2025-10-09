//import
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';

//main
export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text>Contador: {count}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Sumar" onPress={() => setCount(count + 1)} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Quitar" onPress={() => setCount(count - 1)} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Reiniciar" onPress={() => setCount(0)} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

//estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 8, // separa los botones
    width: 150, // opcional, para que todos tengan el mismo ancho
  },
});

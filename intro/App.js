//zona 1 import: Zona de importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React,{useState} from 'react';

//zona 2 main: Zona de componentes
export default function App() {

  const [contador,setContador]=useState(0);

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

//Zona 3: Zona de los estilos, o zona de estetica y posicionamiento
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
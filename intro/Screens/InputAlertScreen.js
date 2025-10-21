import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';

export default function InputAlertScreen() {
  const [nombre, setNombre] = useState('');
    const [Contrasena, setContrasena] = useState('');
  const [Multexto, setMultexto] = useState('');

  const mostrarAlerta = () => {
    if (nombre.trim() === '') {
      if (Platform.OS === 'web') {
        alert('Por favor, escribe tu nombre antes de continuar.');
      } else {
        Alert.alert(
          'Atención',
          'Por favor, escribe tu nombre antes de continuar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Aceptar' }
          ]
        );
      }
    } 
    
    else {
      if (Platform.OS === 'web') {
        alert(`Bienvenido, ${nombre}!`);
      }
      
      else {
        Alert.alert(
          'Hola',
          `Bienvenido, ${nombre}!`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Aceptar' }
          ]
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TextInput y Alert</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

       <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        keyboardType='numeric'
        value={Contrasena}
        onChangeText={setContrasena}
      />

      <Button title="Mostrar alerta" onPress={mostrarAlerta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 15,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Platform,
  Switch,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';

export default function LoginScreen() {
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [terminos, setTerminos] = useState(false);
  const { width, height } = Dimensions.get('window');

  const mostrarAlerta = () => {
    if (nombre.trim() === '') {
      if (Platform.OS === 'web') {
        alert('Por favor, ingresa tu nombre completo.');
      } else {
        Alert.alert('Campo incompleto', 'Por favor, ingresa tu nombre completo.', [{ text: 'OK' }]);
      }
      return;
    }

    if (correo.trim() === '') {
      if (Platform.OS === 'web') {
        alert('Por favor, ingresa tu correo electrónico.');
      } else {
        Alert.alert('Campo incompleto', 'Por favor, ingresa tu correo electrónico.', [{ text: 'OK' }]);
      }
      return;
    }

    if (!terminos) {
      if (Platform.OS === 'web') {
        alert('Debes aceptar los términos y condiciones.');
      } else {
        Alert.alert('Términos no aceptados', 'Debes aceptar los términos y condiciones.', [{ text: 'OK' }]);
      }
      return;
    }

    if (Platform.OS === 'web') {
      alert(`Registro exitoso\nNombre: ${nombre}\nEmail: ${correo}`);
    } else {
      Alert.alert('Registro exitoso', `Nombre: ${nombre}\nEmail: ${correo}`, [{ text: 'OK' }]);
    }

    setNombre('');
    setCorreo('');
    setTerminos(false);
  };

  return (
    <ImageBackground
      source={require('../assets/OIP.jpg')}
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.titulo}>Registro de Usuario</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#ccc"
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={correo}
            onChangeText={setCorreo}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Aceptar términos y condiciones</Text>
            <Switch value={terminos} onValueChange={setTerminos} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Registrarse" onPress={mostrarAlerta} color="#007AFF" />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20,
  },
  switchText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
});

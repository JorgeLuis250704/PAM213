import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import DatabaseService from '../database/DatabaseService'; // 🔥 Importar nuevo servicio de BD

const AHORRA_APP_LOGO = require('../assets/ahorra_app_logo.jpg');

const CustomInput = ({
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  value,
  onChangeText,
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      autoCorrect={false}
    />
  </View>
);

export default function SignInScreen({ navigation }) { // Recibir navigation prop
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!fullName || !email || !phone || !password) {
      mostrarAlerta('Error de registro', 'Por favor, rellena todos los campos para continuar.');
      return;
    }

    if (!validateEmail(email)) {
      mostrarAlerta('Error de validación', 'El formato del correo electrónico es incorrecto.');
      return;
    }

    // Verificar si el usuario ya existe
    const existingUser = await DatabaseService.getUserByEmail(email);
    if (existingUser) {
      mostrarAlerta('Error', 'El correo electrónico ya está registrado.');
      return;
    }

    // Crear usuario a guardar
    const newUser = {
      nombre: fullName,
      email,
      phone,
      password,
    };

    // 🔥 Guardar en SQLite / LocalStorage
    const savedUser = await DatabaseService.add('usuarios', newUser);

    if (savedUser) {
      mostrarAlerta('Registro exitoso', `¡Bienvenido(a) ${fullName}! Ahora inicia sesión.`);
      // Redirigir a LogIn
      navigation.navigate("LogIn");
    } else {
      mostrarAlerta('Error', 'No se pudo guardar el usuario.');
    }
  };

  return (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.formContainer}>
        <View style={styles.logoTextContainer}>
          <Image
            source={AHORRA_APP_LOGO}
            style={{ width: 100, height: 100, marginBottom: 20 }}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.AhorraText}>Ahorra+</Text>
            <Text style={styles.AppText}>App</Text>
          </View>
        </View>

        <CustomInput
          placeholder="👤 Nombre completo"
          value={fullName}
          onChangeText={setFullName}
        />
        <CustomInput
          placeholder="✉️ Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <CustomInput
          placeholder="📞 Número de teléfono"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <CustomInput
          placeholder="🔐 Contraseña"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LogIn")} style={{ marginTop: 20 }}>
          <Text style={{ color: '#007BFF' }}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '85%',
    alignItems: 'center',
    marginTop: 50,
  },
  AhorraText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E6F3C',
    lineHeight: 30,
  },
  AppText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#469A49',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
});

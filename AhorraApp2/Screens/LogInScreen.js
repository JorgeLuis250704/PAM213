import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  Modal,
  Image,
} from 'react-native';

const logoAhorra = require('../assets/ahorra_app_logo.jpg');

export default function LogInScreen({ navigation }) {
  const [contrasena, setContrasena] = useState('');
  const [mail, setMail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [NewPassword, SetNewPassword] = useState('');
  const [CNewPassword, setCNewPassword] = useState('');

  const colorVerde = '#469A49';
  const colorGris = '#EAEAEA';
  const colorTextoGris = '#A9A9A9';

  const mostrarAlerta = () => {
    if (mail.trim() === '' || contrasena.trim() === '') {
      Alert.alert("Error", "Por favor, ingresa todos los campos correctamente.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(mail)) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
      );
      return;
    }

    navigation.navigate("Principal");
  };

  const botonCerrar = () => {
    setModalVisible(false);
    SetNewPassword('');
    setCNewPassword('');
  };

  const botonGuardar = () => {
    if (NewPassword.trim() === '' || CNewPassword.trim() === '') {
      Alert.alert("Error", "Completa ambos campos.");
      return;
    }

    if (NewPassword !== CNewPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    Alert.alert("Éxito", "Contraseña actualizada.");
    botonCerrar();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        
        {/* Logo */}
        <Image source={logoAhorra} style={styles.logoImage} />

        <Text style={styles.title}>Ahorra+</Text>
        <Text style={styles.subtitle}>Inicio de sesión</Text>

        {/* INPUT CORREO */}
        <View style={[styles.inputContainer, { backgroundColor: colorGris }]}>
          <Text style={styles.icon}>📧</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={colorTextoGris}
            keyboardType="email-address"
            value={mail}
            onChangeText={setMail}
          />
        </View>

        {/* INPUT PASSWORD */}
        <View style={[styles.inputContainer, { backgroundColor: colorGris }]}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colorTextoGris}
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />
        </View>

        {/* BOTÓN LOGIN */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colorVerde }]}
          onPress={mostrarAlerta}
        >
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        {/* LINKS */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL RECUPERAR CONTRASEÑA */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            <Text style={styles.modalTitle}>Renovar Contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Escribe tu nueva contraseña
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nueva contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={NewPassword}
              onChangeText={SetNewPassword}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={CNewPassword}
              onChangeText={setCNewPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                onPress={botonCerrar}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colorVerde }]}
                onPress={botonGuardar}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },

  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  logoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 42,
  },

  subtitle: {
    fontSize: 22,
    color: '#555',
    marginBottom: 30,
  },

  inputContainer: {
    width: '100%',
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },

  loginButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  linkText: {
    marginTop: 15,
    fontSize: 15,
    color: '#007BFF',
  },

  /* MODAL */
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
    color: '#666',
  },

  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },

  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },

  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal, 
} from 'react-native';

const logoAhorrapp = require('../assets/full.jpg');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const [modalVisible, setModalVisible] = useState(false);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');

  
  const colorVerdePrincipal = '#469A49';
  const colorGrisInput = '#EAEAEA';
  const colorGrisTexto = '#A9A9A9';
  const colorLink = '#007BFF';

  
  const handleEnviarRecuperacion = () => {
    if (!emailRecuperacion) {
      Alert.alert('Error', 'Por favor, ingresa un correo válido.');
      return;
    }
    
    
    console.log('Enviando instrucciones a:', emailRecuperacion);

    setModalVisible(false);
    setEmailRecuperacion('');

    
    Alert.alert(
      '¡Revisa tu correo!',
      `Se han enviado las instrucciones de recuperación a ${emailRecuperacion}.`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    
      <View style={styles.mainContainer}>
        
       
        <Image source={logoAhorrapp} style={styles.logoImage} />

       
        <View style={[styles.inputContainer, { backgroundColor: colorGrisInput }]}>
          <Text style={styles.icon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo/Num telefono"
            placeholderTextColor={colorGrisTexto}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colorGrisInput }]}>
          <Text style={styles.icon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={colorGrisTexto}
            value={password}
            onChangeText={setPassword}
            secureTextEntry 
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colorVerdePrincipal }]}
          onPress={() => console.log('Login con:', email, password)}
        >
          <Text style={styles.loginButtonText}>Ingresar</Text>
        </TouchableOpacity>

        
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
        >
          <Text style={[styles.linkText, { color: colorLink, marginTop: 25 }]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Ir a registrarse')}>
          <Text style={[styles.linkText, { color: colorLink, marginTop: 15 }]}>
            ¿No tienes una cuenta? Regístrate aquí
          </Text>
        </TouchableOpacity>

      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
       
        <View style={styles.modalContainer}>
         
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Recuperar Contraseña</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa tu correo para enviarte las instrucciones.
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="tu.correo@ejemplo.com"
              placeholderTextColor="#999"
              value={emailRecuperacion}
              onChangeText={setEmailRecuperacion}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6c757d' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colorVerdePrincipal }]}
                onPress={handleEnviarRecuperacion}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  logoImage: {
    width: '90%',
    height: 250,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderRadius: 30,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 15,
  },

  // --- Estilos para el Modal ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  modalInput: {
    width: '100%',
    height: 45,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
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
    fontSize: 16
  }
});

export default LoginScreen;
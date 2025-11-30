// screens/ProyectoScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity, 
  Image,
} from 'react-native';

const logoCerdito = require('../assets/ahorra_app_logo.jpg');


const ProyectoScreen = () => { 

  // --- Colores del diseño ---
  const colorVerdePrincipal = '#469A49';
  const colorTextoOscuro = '#333333';
  const colorTextoClaro = '#555555';

  return (
    <SafeAreaView style={styles.safeArea}>
      


      <View style={styles.mainContainer}>
        
        
        
        <Image source={logoCerdito} style={styles.logoImage} />


        <Text style={[styles.subtitle, { color: colorTextoClaro }]}>
          Cuida de tu dinero con
        </Text>

       
       
        <Text style={[styles.title, { color: colorTextoOscuro }]}>
          Ahorra+
        </Text>

       
       
        <Text style={[styles.title, { color: colorTextoOscuro }]}>
          App
        </Text>

       
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colorVerdePrincipal }]}
          onPress={() => console.log('Botón "Iniciar Sesión" presionado')}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco
  },
 
  mainContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 20,
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 20,
    color: '#555555',
    marginBottom: 5,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333333',
    lineHeight: 50,
  },
  loginButton: {
    marginTop: 40,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProyectoScreen;
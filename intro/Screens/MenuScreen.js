//Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import ContadorScreen from './ContadorScreen';
import BotonesScreen from './BotonesScreen';
import InputAlertScreen from './InputAlertScreen';
import FondoScreen from './FondoScreen';
import ScrollViewScreen from './ScrollViewScreen';
import LoginScreen from './LoginScreen';
import Indicator from './Indicator';
import FlatListScreen from './FlatListScreen';
import SectionList from './SectionList';
import ModalScreen from './ModalScreen';
import BottomSheetScreen from './BottomSheetScreen';

//Zona 2: Componente principal
export default function MenuScreen() {
  const [screen, setScreen] = useState('menu');

  // Control de pantallas
  switch (screen) {
      case 'ContadorScreen':
      return <ContadorScreen />;

      case 'BotonesScreen':
      return <BotonesScreen />;

      case 'InputAlertScreen':
      return <InputAlertScreen />;

      case 'FondoScreen':
      return <FondoScreen />;

       case 'ScrollViewScreen':
      return <ScrollViewScreen />;

      case 'LoginScreen':
      return <LoginScreen />;

       case 'Indicator':
      return <Indicator />;

      case 'FlatListScreen':
      return <FlatListScreen />;

      case 'SectionList':
      return <SectionList />;

      case 'ModalScreen':
      return <ModalScreen />;

      case 'BottomSheetScreen':
      return <BottomSheetScreen />;

    default:
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Menú de Prácticas</Text>

          <View style={styles.menuContainer}>
            {/* Botones del menú */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007bff' }]}
              onPress={() => setScreen('ContadorScreen')}
            >
              <Text style={styles.buttonText}>Contador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => setScreen('BotonesScreen')}
            >
            <Text style={styles.buttonText}>Botones</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#17a2b8' }]}
            onPress={() => setScreen('InputAlertScreen')}
            >
            <Text style={styles.buttonText}>InputAlert</Text>  
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#6f42c1' }]}
            onPress={() => setScreen('FondoScreen')}
            >
            <Text style={styles.buttonText}>Fondo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#20c997' }]}
            onPress={() => setScreen('ScrollViewScreen')}
            >
            <Text style={styles.buttonText}>ScrollView</Text>
            </TouchableOpacity>

             <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#17a2b8' }]}
            onPress={() => setScreen('LoginScreen')}
            >
            <Text style={styles.buttonText}>LoginScreen</Text>  
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#fd7e14' }]}
            onPress={() => setScreen('Indicator')}
            >
            <Text style={styles.buttonText}>ActivityIndicator</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#ffc107' }]}
            onPress={() => setScreen('FlatListScreen')}
            >
            <Text style={styles.buttonText}>FlatList</Text>
            </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { backgroundColor: '#ffc107' }]}
            onPress={() => setScreen('SectionList')}
            >
            <Text style={styles.buttonText}>SectionList</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: '#dc3545' }]}
            onPress={() => setScreen('ModalScreen')}
            >
            <Text style={styles.buttonText}>Modal</Text>
            </TouchableOpacity>

             <TouchableOpacity style={[styles.button, { backgroundColor: '#343a40' }]}
            onPress={() => setScreen('BottomSheetScreen')}
            >
            <Text style={styles.buttonText}>BottomSheet</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9f7fd',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  menuContainer: {
    width: '80%',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

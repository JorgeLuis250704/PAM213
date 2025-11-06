import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import SplashScreen from './SplashScreen';

export default function MenuScreen() {
  const [screen, setScreen] = useState('menu');

  switch (screen) {
    case 'SplashScreen':
      return <SplashScreen />;

    default:
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text style={styles.title}>Menú de Prácticas</Text>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#28a745' }]}
              onPress={() => setScreen('SplashScreen')}
            >
              <Text style={styles.buttonText}>Ir a SplashScreen</Text>
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
    width: '70%',
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
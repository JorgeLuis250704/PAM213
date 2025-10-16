//Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import MenuScreen from './Screens/MenuScreen';

//Zona 2: Componente principal
export default function App() {
  return (
    <View style={styles.container}>
      <MenuScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

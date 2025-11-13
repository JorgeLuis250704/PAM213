// Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import MenuScreen from './Screens/MenuScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Zona 2: Componente principal
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <MenuScreen></MenuScreen>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

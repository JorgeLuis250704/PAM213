//Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Switch } from 'react-native';
import React, { useState } from 'react';

//Zona 2: Componente principal
export default function ContadorScreen() {
  // Estados principales
  const [contador, setContador] = useState(0);
  const [modoOscuro, setModoOscuro] = useState(false);

  //Funciones de control
  const incrementar = () => setContador(contador + 1);
  const decrementar = () => contador > 0 && setContador(contador - 1);
  const resetear = () => setContador(0);
  const handleToggleModoOscuro = () => setModoOscuro(prev => !prev);

  //Tema actual según modo oscuro
  const currentTheme = modoOscuro ? styles.darkTheme : styles.lightTheme;
  const currentText = modoOscuro ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, currentTheme]}>
      <Text style={[styles.texto, currentText]}>Contador:</Text>
      <Text style={[styles.texto2, currentText]}>{contador}</Text>

      <View style={styles.botonesContainer}>
        <Button color="red" title="Agregar" onPress={incrementar} />
        <Button color="green" title="Quitar" onPress={decrementar} />
        <Button color="grey" title="Reiniciar" onPress={resetear} />
      </View>

      <View style={styles.switchContainer}>
        <Text style={currentText}>Modo Oscuro</Text>
        <Switch value={modoOscuro} onValueChange={handleToggleModoOscuro} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  lightTheme: {
    backgroundColor: '#6fc4f5ff',
  },
  darkTheme: {
    backgroundColor: '#1a1a1a',
  },
  texto: {
    fontSize: 30,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  texto2: {
    fontSize: 35,
    fontFamily: 'Courier',
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  botonesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 10,
  },
});

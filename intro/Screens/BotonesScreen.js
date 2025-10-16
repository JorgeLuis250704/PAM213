//Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Switch } from 'react-native';
import React, { useState } from 'react';

//Zona 2: Componente principal
export default function BotonesScreen() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificaciones, setNotificaciones] = useState(false);
  const [ubicacion, setUbicacion] = useState(false);

  //Tema actual
  const tema = modoOscuro ? styles.darkTheme : styles.lightTheme;
  const texto = modoOscuro ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, tema]}>
      <Text style={[styles.title, texto]}>Pantalla de Botones y Switches</Text>

      <View style={styles.section}>
        <Text style={[styles.subtitulo, texto]}>Botones</Text>

        <View style={styles.buttonContainer}>
          <Button title="Botón Azul" color="#007bff" onPress={() => {}} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Botón Verde" color="#28a745" onPress={() => {}} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Botón Amarillo" color="#ffc107" onPress={() => {}} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Botón Rojo" color="#dc3545" onPress={() => {}} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Botón Morado" color="#6f42c1" onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.subtitulo, texto]}>Switches</Text>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, texto]}>Modo Oscuro</Text>
          <Switch value={modoOscuro} onValueChange={() => setModoOscuro(!modoOscuro)} />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, texto]}>Notificaciones</Text>
          <Switch value={notificaciones} onValueChange={() => setNotificaciones(!notificaciones)} />
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, texto]}>Ubicación Activa</Text>
          <Switch value={ubicacion} onValueChange={() => setUbicacion(!ubicacion)} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.estadoTexto, texto]}>
          Modo Oscuro: {modoOscuro ? 'Activado' : 'Desactivado'}
        </Text>
        <Text style={[styles.estadoTexto, texto]}>
          Notificaciones: {notificaciones ? 'Activadas' : 'Desactivadas'}
        </Text>
        <Text style={[styles.estadoTexto, texto]}>
          Ubicación: {ubicacion ? 'Activa' : 'Inactiva'}
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

//Zona 3: Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lightTheme: {
    backgroundColor: '#f0f8ff',
  },
  darkTheme: {
    backgroundColor: '#1a1a1a',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  section: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 25,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginVertical: 5,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    marginTop: 10,
    alignItems: 'center',
  },
  estadoTexto: {
    fontSize: 15,
  },
});

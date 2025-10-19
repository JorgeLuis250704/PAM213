//Zona 1: Importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Switch, TouchableOpacity, Pressable } from 'react-native';
import React, { useState } from 'react';

//Zona 2: Componente principal
export default function BotonesScreen() {
  const [modoOscuro, setModoOscuro] = useState(false);

  const tema = modoOscuro ? styles.darkTheme : styles.lightTheme;
  const texto = modoOscuro ? styles.darkText : styles.lightText;

  return (
    <View style={[styles.container, tema]}>
      <Text style={[styles.title, texto]}>Pantalla de Botones y Switches</Text>

      {/* Sección de botones */}
      <View style={styles.section}>
        <Text style={[styles.subtitulo, texto]}>Tipos de Botones</Text>

        {/* 1. Botón básico */}
        <Button
          title="Botón Básico"
          color="#007bff"
          onPress={() => alert('Presionaste el botón básico')}
        />

        {/* 2. Botón TouchableOpacity */}
        <TouchableOpacity
          style={[styles.touchableButton, { backgroundColor: '#28a745' }]}
          onPress={() => alert('Presionaste el TouchableOpacity')}
        >
          <Text style={styles.touchableText}>Botón TouchableOpacity</Text>
        </TouchableOpacity>

        {/* 3. Botón Pressable */}
        <Pressable
          style={({ pressed }) => [
            styles.pressableButton,
            { backgroundColor: pressed ? '#ffc107' : '#ffca2c' },
          ]}
          onPress={() => alert('Presionaste el Pressable')}
        >
          <Text style={styles.pressableText}>Botón Pressable</Text>
        </Pressable>
      </View>

      {/* Sección de switches */}
      <View style={styles.section}>
        <Text style={[styles.subtitulo, texto]}>Switches</Text>

        <View style={styles.switchRow}>
          <Text style={[styles.switchText, texto]}>Modo Oscuro</Text>
          <Switch value={modoOscuro} onValueChange={() => setModoOscuro(!modoOscuro)} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.estadoTexto, texto]}>
          Modo Oscuro: {modoOscuro ? 'Activado' : 'Desactivado'}
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
    width: '80%',
    marginBottom: 25,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textDecorationLine: 'underline',
  },
  touchableButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  touchableText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pressableButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  pressableText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
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

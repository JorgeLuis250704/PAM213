import React, { useState } from 'react';
import { Text, StyleSheet, View, Button, ActivityIndicator } from 'react-native';

export default function Indicator() {
  const [cargando, setCargando] = useState(false); 
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [mensajePrompt, setMensajePrompt] = useState('Presiona "Acción" para comenzar');

  const manejarCarga = () => { 
    setCargando(true);
    setMostrarContenido(false);
    setMensajePrompt('Cargando... por favor espera');

    setTimeout(() => {
      setCargando(false);
      setMostrarContenido(true);
      setMensajePrompt('¡Acción completada!');
    }, 5000);
  };

  const cancelarCarga = () => {
    setCargando(false);
    setMostrarContenido(false);
    setMensajePrompt('Carga cancelada');
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Practica: Activity Indicator</Text>
      <Text style={styles.prompt}>{mensajePrompt}</Text>

      <View style={styles.botones}>
        <Button color="#fb5c97ff" title="Acción" onPress={manejarCarga} />
        <View style={{ width: 10 }} />
        <Button color="#868585ff" title="Cancelar" onPress={cancelarCarga} /> 
      </View>

      {cargando && (
        <ActivityIndicator
          size="large"
          color="#ff4805ff"
          style={styles.indicador}
        />
      )}

      {mostrarContenido && (
        <Text style={styles.contenido}> Acción realizada</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffffff',
  },
  titulo: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#000000ff',
  }, 
  prompt: {
    fontSize: 16,
    marginBottom: 20,
    color: '#3448faff',
  },
  botones: {
    flexDirection: 'row', 
    marginBottom: 20, 
  },
  indicador: {
    marginVertical: 20,
  },
  contenido: {
    fontSize: 18,
    color: 'green',
    marginTop: 10,
    fontWeight: '600',
  },
});

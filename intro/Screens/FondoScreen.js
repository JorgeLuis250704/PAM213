import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, StatusBar, Dimensions } from 'react-native';

export default function ISScreen() {
  const { width, height } = Dimensions.get('window'); // obtener dimensiones de pantalla

  return (
    <ImageBackground
      source={require('../assets/OIP.jpg')}
      style={[styles.splashBackground, { width, height }]}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.splashOverlay}>
        <Image source={require('../assets/OIP2.png')} style={styles.logo} />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  splashBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

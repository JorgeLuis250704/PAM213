import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, StatusBar } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.content}>
        <Image source={require('../assets/OIP2.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Cargando...</Text>
        <ActivityIndicator size="large" color="#00ADB5" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});

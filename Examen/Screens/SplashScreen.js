import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  StatusBar, 
  Dimensions, 
  Alert, 
  TouchableOpacity, 
  Platform,
  ScrollView
} from 'react-native';

export default function SplashScreen() {
  const { width } = Dimensions.get('window');

  const mostrarAlerta = (titulo) => {
    if (Platform.OS === 'web') {
      alert(`Detalles de ${titulo}`);
    } else {
      Alert.alert(
        titulo,
        'Esta es una descripción más detallada de la imagen seleccionada.',
        [{ text: 'Cerrar', style: 'cancel' }]
      );
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <Text style={styles.mainTitle}>Mi Galería</Text>

      {[1,2,3,4,5,6].map((n) => (
        <View key={n} style={styles.card}>
          <ImageBackground
            source={require('../assets/OIP.jpg')}
            style={[styles.image, { width: width - 30, height: 200 }]}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.desc}>Descripción de Imagen {n}</Text>
              <TouchableOpacity style={styles.button} onPress={() => mostrarAlerta(`Imagen ${n}`)}>
                <Text style={styles.buttonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      ))}

      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.logoContainer}>
        <Image source={require('../assets/OIP2.png')} style={styles.logo} />
        <Text style={styles.text}>Cargando...</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  desc: {
    color: '#fff',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00ADB5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
});

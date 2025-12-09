import react from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, StatusBar } from 'react-native';

export default function WeatherUPQ() {

return (

 <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

<View style={styles.content}>
        <Image source={require('../assets/carga.jpg')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>espera...</Text>
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
    content: {
    alignItems: 'center',
    },
  logo: {
    container:30,
    width:30,
    height: 30,
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
}

});

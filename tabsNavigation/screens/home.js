import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Librería adaptada

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.iconRow}>
        {/* Icono adaptado */}
        <Ionicons name="home-outline" size={28} color="red" />
        <Text style={styles.title}>Bienvenido a la pantalla principal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconRow: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'red',
  },
});
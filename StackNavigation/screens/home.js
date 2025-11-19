import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la pantalla principal</Text>

      <Pressable
        style={[styles.button, styles.buttonProfile]}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.buttonText}>Ir a Perfil</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonSettings]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.buttonText}>Ir a Configuración</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonProfile: {
    backgroundColor: '#007BFF',
  },
  buttonSettings: {
    backgroundColor: '#FF8800',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import MenuScreen from './Screens/MenuScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/*menú principal */}
      <MenuScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

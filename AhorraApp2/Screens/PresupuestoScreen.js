import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import PerfilScreen from './PerfilScreen';
import { useNavigation } from "@react-navigation/native";

export default function PresupuestoScreen() {
    const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Perfil")}>
        <Ionicons name="arrow-back" size={24} color="#0f1530" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Ahorra<Text style={{ color: '#2A7CF7' }}>+</Text> App</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Presupuesto</Text>
        <Text style={styles.subtitle}>Categorías</Text>

        <View style={styles.category}>
          <View style={styles.categoryHeader}>
            <MaterialIcons name="shopping-cart" size={24} color="#0f1530" />
            <Text style={styles.categoryText}>Canasta Básica</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto</Text>
            <Text style={styles.amount}>00.00</Text>
          </View>
        </View>

        <View style={styles.category}>
          <View style={styles.categoryHeader}>
            <Ionicons name="heart-outline" size={24} color="#0f1530" />
            <Text style={styles.categoryText}>Salud</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto</Text>
            <Text style={styles.amount}>00.00</Text>
          </View>
        </View>

        <View style={styles.category}>
          <View style={styles.categoryHeader}>
            <FontAwesome5 name="play-circle" size={22} color="#0f1530" />
            <Text style={styles.categoryText}>Entretenimiento</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto</Text>
            <Text style={styles.amount}>00.00</Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => cambiarPantalla("Registro")}
          >
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20 },
  logoText: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginLeft: 10, 
    color: '#0f1530' },
  scroll: { 
    paddingHorizontal: 20, 
    paddingBottom: 100 },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: '#0f1530' },
  subtitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 10, 
    marginBottom: 15, 
    color: '#0f1530' },
  category: { 
    backgroundColor: '#f7f7f7', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15 },
  categoryHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 },
  categoryText: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginLeft: 8, 
    color: '#0f1530' },
  amountBox: {
    backgroundColor: '#ededed', 
    borderRadius: 10,
    paddingVertical: 8, 
    paddingHorizontal: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },

  amountLabel: { 
    fontSize: 16, 
    color: '#0f1530' },
  amount: { 
    fontSize: 16, 
    color: '#0f1530' },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 25 },
  cancelButton: { 
    backgroundColor: '#bfbfbf', 
    borderRadius: 10, 
    paddingVertical: 12, 
    width: '45%', 
    alignItems: 'center' },

  saveButton: { 
    backgroundColor: '#0f1530', 
    borderRadius: 10, 
    paddingVertical: 12, 
    width: '45%', 
    alignItems: 'center' },

  cancelText: { 
    color: '#fff', 
    fontWeight: 'bold' },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold' },
  navBar: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    backgroundColor: '#0f1530', 
    height: 60,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderTopLeftRadius: 10, 

}});

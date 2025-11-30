// BottomMenu.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const color = {
  verde: "#2f8a4f",
  naranja: "blue", // color activo
};

export default function BottomMenu({ colorActivo = color.naranja }) {
  const navigation = useNavigation();
  const route = useRoute();

  const colorIcono = (pantalla) => (route.name === pantalla ? colorActivo : "gray");

  return (
    <View style={styles.barraInferior}>
      {/* Perfil */}
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Perfil")}>
        <Ionicons name="person-outline" size={26} color={colorIcono("Perfil")} />
      </TouchableOpacity>

      {/* Registros */}
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Registros")}>
        <Ionicons name="document-text-outline" size={26} color={colorIcono("Registros")} />
      </TouchableOpacity>

      {/* Home (central flotante) */}
      <TouchableOpacity style={styles.botonCentral} onPress={() => navigation.navigate("Principal")}>
        <Ionicons name="home-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Gráficas */}
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Graficas")}>
        <Ionicons name="stats-chart-outline" size={26} color={colorIcono("Graficas")} />
      </TouchableOpacity>

      {/* Calendario */}
      <TouchableOpacity style={styles.icono} onPress={() => navigation.navigate("Registros")}>
        <Ionicons name="calendar-outline" size={26} color={colorIcono("Registros")} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  barraInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
  },
  icono: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  botonCentral: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: color.verde,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
    elevation: 8,
  },
});

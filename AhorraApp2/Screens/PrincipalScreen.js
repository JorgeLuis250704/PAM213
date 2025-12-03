import React, { useContext } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";
import HeaderVerde from "./HeaderVerde";

export default function PrincipalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, toggleTheme } = useContext(ThemeContext);

  const handleNavegar = (destino) => {
    if (Platform.OS === "web") window.alert(`Navegando a: ${destino}`);
    else Alert.alert("Navegación", `Navegando a: ${destino}`);
    navigation.navigate(destino);
  };

  const colorBotonGrid = (pantalla) =>
    route.name === pantalla ? colors.naranja : colors.verde;


  return (
    <View style={[estilos.pantalla, { backgroundColor: colors.fondo }]}>

      {/* ---------------- ENCABEZADO ---------------- */}
      {/* ---------------- ENCABEZADO ---------------- */}
      <HeaderVerde
        titulo="Bienvenido"
        onBankIconPress={() => handleNavegar("Perfil")}
      />

      {/* ---------------- CUERPO ---------------- */}
      <View style={estilos.cuerpo}>
        <View style={[estilos.cajaBlanca, { backgroundColor: colors.tarjeta }]}>
          <View style={estilos.gridOpciones}>

            {/* PERFIL */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Perfil") },
              ]}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="wallet-outline" size={38} color="white" />
              <Text style={estilos.textoOpcion}>Perfil</Text>
            </TouchableOpacity>

            {/* REGISTROS */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Registros") },
              ]}
              onPress={() => handleNavegar("Registros")}
            >
              <FontAwesome5 name="piggy-bank" size={34} color="white" />
              <Text style={estilos.textoOpcion}>Registros</Text>
            </TouchableOpacity>

            {/* ---------------- PRESUPUESTOS (FULL WIDTH + OTRO COLOR) ---------------- */}
            <TouchableOpacity
              style={[
                estilos.botonOpcionFull,
                { backgroundColor: "#006400" }, // color presupuestos
              ]}
              onPress={() => handleNavegar("Presupuestos")}
            >
              <FontAwesome5 name="money-bill-wave" size={38} color="white" />
              <Text style={estilos.textoOpcion}>Presupuestos</Text>
            </TouchableOpacity>

            {/* GRAFICAS */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Graficas") },
              ]}
              onPress={() => handleNavegar("Graficas")}
            >
              <MaterialIcons name="bar-chart" size={40} color="white" />
              <Text style={estilos.textoOpcion}>Graficas</Text>
            </TouchableOpacity>

            {/* DETALLE GRAFICAS */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("DetalleGraficas") },
              ]}
              onPress={() => handleNavegar("DetalleGraficas")}
            >
              <MaterialIcons name="bar-chart" size={40} color="white" />
              <Text style={estilos.textoOpcion}>DetalleGraficas</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      {/* ---------------- CAMBIO DE TEMA ---------------- */}
      <TouchableOpacity
        style={[estilos.botonTema, { backgroundColor: colors.naranja }]}
        onPress={toggleTheme}
      >
        <Text style={{ color: colors.tarjeta, fontWeight: "bold" }}>Cambiar tema</Text>
      </TouchableOpacity>

      {/* ---------------- MENÚ INFERIOR ---------------- */}
      <BottomMenu colorActivo={colors.naranja} />

    </View>
  );
}

// ---------------- ESTILOS ----------------
const estilos = StyleSheet.create({
  pantalla: { flex: 1 },

  encabezado: {
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
  },

  titulo: { fontSize: 16, marginBottom: 8, fontWeight: "600" },

  saldoTarjeta: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800" },
  moneda: { fontSize: 12 },

  cuerpo: { paddingHorizontal: 16, marginTop: 14, flex: 1 },

  cajaBlanca: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  gridOpciones: {
    width: "100%",
    maxWidth: 400,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  botonOpcion: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
  },

  // 🔵 BOTÓN FULL WIDTH (Presupuestos)
  botonOpcionFull: {
    width: "100%",
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    elevation: 3,
  },

  textoOpcion: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 8,
  },

  botonTema: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});

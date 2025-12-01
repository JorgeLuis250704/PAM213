import React, { useContext } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";

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
      <View style={[estilos.encabezado, { backgroundColor: colors.verde }]}>
        <Text style={[estilos.titulo, { color: colors.tarjeta }]}>Bienvenido</Text>

        <View style={[estilos.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
          <TouchableOpacity onPress={() => handleNavegar("Perfil")}>
            <Text
              style={{
                fontSize: 24,
                color: route.name === "Perfil" ? colors.naranja : colors.texto,
              }}
            >
              🏦
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[estilos.saldo, { color: colors.texto }]}>9,638.35</Text>
            <Text style={[estilos.moneda, { color: colors.textoSuave }]}>MXN</Text>
          </View>

          <View style={estilos.iconosAccion}>
            <TouchableOpacity
              style={{ marginRight: 8 }}
              onPress={() => Alert.alert("Notificaciones", "No tienes notificaciones nuevas")}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.verde} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name="settings-outline" size={20} color={colors.naranja} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ---------------- CUERPO ---------------- */}
      <View style={estilos.cuerpo}>
        <View style={[estilos.cajaBlanca, { backgroundColor: colors.tarjeta }]}>
          <View style={estilos.gridOpciones}>

            {/* TRANSACCIONES → Perfil */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Perfil") },
              ]}
              onPress={() => handleNavegar("Perfil")}
            >
              <Ionicons name="wallet-outline" size={38} color="white" />
              <Text style={estilos.textoOpcion}>Transacciones</Text>
            </TouchableOpacity>

            {/* AHORROS → Registros */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Registros") },
              ]}
              onPress={() => handleNavegar("Registros")}
            >
              <FontAwesome5 name="piggy-bank" size={34} color="white" />
              <Text style={estilos.textoOpcion}>Ahorros</Text>
            </TouchableOpacity>

            {/* REPORTES → DetalleGraficas */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("DetalleGraficas") },
              ]}
              onPress={() => handleNavegar("DetalleGraficas")}
            >
              <MaterialIcons name="bar-chart" size={40} color="white" />
              <Text style={estilos.textoOpcion}>Reportes</Text>
            </TouchableOpacity>

            {/* CALENDARIO → Graficas (para no repetir Registros) */}
            <TouchableOpacity
              style={[
                estilos.botonOpcion,
                { backgroundColor: colorBotonGrid("Graficas") },
              ]}
              onPress={() => handleNavegar("Graficas")}
            >
              <Ionicons name="calendar-outline" size={38} color="white" />
              <Text style={estilos.textoOpcion}>Calendario</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      {/* ---------------- BOTÓN CAMBIO DE TEMA ---------------- */}
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
  encabezado: { paddingTop: 6, paddingBottom: 12, paddingHorizontal: 16 },
  titulo: { fontSize: 16, marginBottom: 8, fontWeight: "600" },
  saldoTarjeta: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
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

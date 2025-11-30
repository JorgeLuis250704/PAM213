import React from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  texto: "#101010",
  textoSuave: "#666",
};

function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  const handleNotificaciones = () => {
    if (Platform.OS === "web") {
      window.alert("No tienes notificaciones nuevas");
    } else {
      Alert.alert("Notificaciones", "No tienes notificaciones nuevas");
    }
  };

  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        <TouchableOpacity>🏦</TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        <View style={estilos.iconosAccion}>
          <TouchableOpacity style={{ marginRight: 8 }} onPress={handleNotificaciones}><Ionicons name="notifications-outline" size={20} color={color.verde} /></TouchableOpacity>
          <TouchableOpacity><Ionicons name="settings-outline" size={20} color={color.verde} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TransaccionesScreen() {
  const handleBoton = (mensaje) => {
    if (Platform.OS === "web") {
      window.alert(mensaje);
    } else {
      Alert.alert("Acción", mensaje);
    }
  };

  const handleHomePress = () => {
    if (Platform.OS === "web") {
      window.alert("¿Deseas regresar a la pantalla principal?");
    } else {
      Alert.alert("Inicio", "¿Deseas regresar a la pantalla principal?");
    }
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Transacciones" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View style={estilos.gridOpciones}>
            <TouchableOpacity style={estilos.botonOpcion} onPress={() => handleBoton("Registro de transferencias")}><Ionicons name="reload-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Registro de{"\n"}transferencias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => handleBoton("Nueva transferencia")}> <FontAwesome5 name="exchange-alt" size={32} color="white" />
              <Text style={estilos.textoOpcion}>Nueva{"\n"}transferencia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => handleBoton("Editado de las transferencias")}><MaterialIcons name="edit" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Editado de las{"\n"}transferencias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={estilos.botonOpcion} onPress={() => handleBoton("Listado de las transferencias")}><Ionicons name="list-outline" size={36} color="white" />
              <Text style={estilos.textoOpcion}>Listado de las{"\n"}transferencias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono}><Ionicons name="person-outline" size={26} color="gray" /></TouchableOpacity>

        <TouchableOpacity style={estilos.icono}><Ionicons name="document-text-outline" size={26} color="gray" /></TouchableOpacity>

        <TouchableOpacity style={estilos.botonCentral} onPress={handleHomePress}><Ionicons name="home-outline" size={30} color="white" /></TouchableOpacity>

        <TouchableOpacity style={estilos.icono}><Ionicons name="stats-chart-outline" size={26} color="gray" /></TouchableOpacity>

        <TouchableOpacity style={estilos.icono}><Ionicons name="calendar-outline" size={26} color="gray" /></TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: color.fondo },
  encabezado: {
    backgroundColor: color.verde,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  titulo: { color: "white", fontSize: 16, marginBottom: 8, fontWeight: "600" },
  saldoTarjeta: {
    backgroundColor: color.tarjeta,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 12, color: color.textoSuave },
  cuerpo: { paddingHorizontal: 16, marginTop: 14, flex: 1 },
  cajaBlanca: {
    flex: 1,
    backgroundColor: color.tarjeta,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  gridOpciones: {
    width: "100%",
    maxWidth: 400, // ✅ para centrar y mantener tamaño similar al ejemplo
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  botonOpcion: {
    backgroundColor: color.verde,
    width: "48%", // dos por fila
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
    fontWeight: "600",
    fontSize: 12,
    marginTop: 6,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
});
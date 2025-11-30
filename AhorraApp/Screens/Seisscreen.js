import React from "react";
import {Platform,View,Text,TouchableOpacity,StyleSheet,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";


const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  gris: "#dcdcdc",
  rosado: "#f7efef",
  verdeSuave: "#b8e0c2",
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
          <TouchableOpacity style={{ marginRight: 8 }}onPress={handleNotificaciones}>
            <Ionicons name="notifications-outline"size={20}color={color.verde}/>
          </TouchableOpacity>
          <TouchableOpacity><Ionicons name="settings-outline" size={20} color={color.verde} /></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function PresupuestoScreen() {
  const presupuestos = [
    { id: 1, texto: "1500MXN / Ropa para bebé" },
    { id: 2, texto: "500MXN / Gimnasio" },
  ];

  const handleEditar = () => {
    const mensaje = "¿Seguro que quieres editar este presupuesto?";
    if (Platform.OS === "web") {
      window.alert(mensaje);
    } else {
      Alert.alert("Editar presupuesto", mensaje);
    }
  };

  const handleAgregarPresupuesto = () => {
    if (Platform.OS === "web") {
      window.alert("¿Deseas agregar un nuevo presupuesto?");
    } else {
      Alert.alert("¿Deseas agregar un nuevo presupuesto?");
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
      <Encabezado titulo="Presupuesto" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <Text style={estilos.textoTitulo}>Presupuesto:</Text>

          <View style={estilos.cuadroPresupuesto}>
            {presupuestos.map((item) => (
              <View key={item.id} style={estilos.itemPresupuesto}>
                <Text style={estilos.textoPresupuesto}>{item.texto}</Text>
                <TouchableOpacity onPress={handleEditar}><Text style={estilos.textoEditar}>editar</Text></TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={estilos.botonAgregar}onPress={handleAgregarPresupuesto}>
            <Text style={estilos.textoBoton}>Agregar presupuesto</Text>
          </TouchableOpacity>
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
    padding: 16,
    justifyContent: "flex-start",
  },
  textoTitulo: {
    fontWeight: "700",
    color: color.texto,
    fontSize: 16,
    marginBottom: 8,
  },
  cuadroPresupuesto: {
    flex: 1,
    backgroundColor: color.rosado,
    borderRadius: 20,
    marginVertical: 10,
    padding: 10,
  },
  itemPresupuesto: {
    backgroundColor: color.verdeSuave,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textoPresupuesto: {
    color: color.texto,
    fontSize: 14,
    fontWeight: "600",
  },
  textoEditar: {
    color: color.verde,
    fontSize: 13,
    fontWeight: "500",
  },
  botonAgregar: {
    alignSelf: "flex-end",
    backgroundColor: color.verde,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 70,
  },
  textoBoton: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
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
import React, { useMemo, useState } from "react";
import {Alert,View,Text,FlatList,StyleSheet,TouchableOpacity,Platform,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  gris: "#dcdcdc",
  texto: "#101010",
  textoSuave: "#666",
};

function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  const mostrarNotificacion = () => {
    if (Platform.OS === "web") {
      window.alert("No tienes nuevas notificaciones.");
    } else {
      Alert.alert("Notificaciones", "No tienes nuevas notificaciones.");
    }
  };

  return (
    <View style={estilos.encabezado}>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        
        <TouchableOpacity style={estilos.iconoCasa} onPress={() => {}}>
          <Text>🏦</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

       
        <View style={estilos.iconosAccion}>
         
          <TouchableOpacity onPress={mostrarNotificacion}>
            <Ionicons name="notifications-outline"size={22} color="#777" style={{ marginRight: 10 }}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="settings-outline" size={22} color="#777" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function RegistroTransferenciasScreen() {
  const [transferencias] = useState([]);
  const columnas = useMemo(() => ["Monto", "Categoría", "Fecha", "Descripción"],[] );

  const mostrarAlertaInicio = () => {
    if (Platform.OS === "web") {
      window.alert("¿Deseas regresar a la pantalla principal?.");
    } else {
      Alert.alert("Inicio", "¿Deseas regresar a la pantalla principal?.");
    }
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Registro de transferencias" />
      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View style={estilos.filaCabecera}>
            {columnas.map((c) => (
              <Text key={c} style={estilos.celdaCabecera}>
                {c}
              </Text>
            ))}
          </View>
          <FlatList
            style={{ flex: 1 }}
            data={transferencias}
            keyExtractor={(_, i) => String(i)}
            ListEmptyComponent={
              <View style={estilos.vacio}>
                <Text style={estilos.textoSuave}>
                  Aún no hay transferencias registradas.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={estilos.fila}>
                <Text style={estilos.celda}>{item.monto}</Text>
                <Text style={estilos.celda}>{item.categoria}</Text>
                <Text style={estilos.celda}>{item.fecha}</Text>
                <Text style={estilos.celda}>{item.descripcion}</Text>
              </View>
            )}
          />
        </View>
      </View>

    
      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono} onPress={() => {}}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => {}}>
          <Ionicons name="document-text-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botonCentral} onPress={mostrarAlertaInicio}>
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => {}}>
          <Ionicons name="stats-chart-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => {}}>
          <Ionicons name="calendar-outline" size={26} color="gray" />
        </TouchableOpacity>
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
  iconoCasa: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: color.gris,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconosAccion: { flexDirection: "row", marginLeft: 12 },
  saldo: { fontSize: 28, fontWeight: "800", color: color.texto },
  moneda: { fontSize: 12, color: color.textoSuave },
  cuerpo: { paddingHorizontal: 16, marginTop: 14, flex: 1 },
  cajaBlanca: {
    flex: 1,
    backgroundColor: color.tarjeta,
    borderRadius: 16,
    padding: 12,
  },
  filaCabecera: {
    flexDirection: "row",
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  celdaCabecera: {
    flex: 1,
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  fila: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.gris,
  },
  celda: { flex: 1, color: color.texto },
  vacio: { flex: 1, paddingVertical: 36, alignItems: "center" },
  textoSuave: { color: color.textoSuave },
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
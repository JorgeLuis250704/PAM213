import React, { useState } from "react";
import {Platform,Alert,View,Text,TextInput,TouchableOpacity,StyleSheet,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  gris: "#dcdcdc",
  morado: "#d7b8d9",
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

        <TouchableOpacity style={estilos.iconoCasa}>
          <Text>🏦</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        <View style={estilos.iconosAccion}>
          <TouchableOpacity onPress={mostrarNotificacion}>
            <Ionicons name="notifications-outline"size={22}color="#555"style={{ marginRight: 10 }}/>
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function AgregarPresupuestoScreen() {
  const [montoMensual, setMontoMensual] = useState("");
  const [categoria, setCategoria] = useState("Alimentación");
  const categorias = ["Alimentación", "Ocio", "Transporte"];

  const handleConfirmar = () => {
    const montoNumerico = parseFloat(montoMensual);

    if (montoMensual.trim() === "") {
      Platform.OS === "web"
        ? window.alert("Debes llenar todos los campos.")
        : Alert.alert("Campos vacíos", "Debes llenar todos los campos.");
      return;
    }

    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      Platform.OS === "web"
        ? window.alert("El monto debe ser mayor a cero.")
        : Alert.alert("Monto inválido", "El monto debe ser mayor a cero.");
      return;
    }

    const mensaje = "¿Seguro que deseas agregar este presupuesto?";

    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) {
        window.alert("Presupuesto agregado con éxito.");
        setMontoMensual("");
      }
    } else {
      Alert.alert("Confirmar acción", mensaje, [{ text: "Cancelar", style: "cancel" },{text: "Aceptar",onPress: () => {
            Alert.alert("Éxito", "Presupuesto agregado con éxito.");
            setMontoMensual("");
          },
        },
      ]);
    }
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Agregar presupuesto" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View
            style={[estilos.tarjetaSuave, { backgroundColor: color.morado }]}
          >
            <Text style={estilos.subtitulo}>Presupuesto mensual:</Text>
            <TextInput
              value={montoMensual}
              onChangeText={setMontoMensual}
              placeholder="$ Monto"
              keyboardType="decimal-pad"
              style={estilos.inputCapsulaGrande}
              placeholderTextColor={color.textoSuave}
            />

            <Text style={[estilos.subtitulo, { marginTop: 16 }]}>
              Categoría:
            </Text>
            <View style={estilos.filaChips}>
              {categorias.map((c) => {
                const activo = c === categoria;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setCategoria(c)}
                    style={[
                      estilos.chip,
                      activo && { borderColor: color.verde, borderWidth: 2 },
                    ]}
                  >
                    <Text style={estilos.textoChip}>{c}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={estilos.botonConfirmar}
              onPress={handleConfirmar}
            >
              <Text style={estilos.textoBoton}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono} onPress={() => console.log("Perfil clicado")}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => console.log("Documentos clicado")}>
          <Ionicons name="document-text-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botonCentral} onPress={() =>
            Platform.OS === "web"
              ? window.alert("¿Deseas regresar a la pantalla principal?.")
              : Alert.alert("Inicio", "¿Deseas regresar a la pantalla principal?.")
          }
        >
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => console.log("Estadísticas clicado")}>
          <Ionicons name="stats-chart-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono} onPress={() => console.log("Calendario clicado")}>
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
  tarjetaSuave: { borderRadius: 18, padding: 16, marginTop: 6 },
  subtitulo: { fontWeight: "700", color: color.texto, marginBottom: 8 },
  inputCapsulaGrande: {
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filaChips: { flexDirection: "row", marginTop: 8, flexWrap: "wrap" },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#f4f4f4",
    marginRight: 8,
    marginBottom: 8,
  },
  textoChip: { color: color.texto },
  botonConfirmar: {
    alignSelf: "flex-end",
    marginTop: 16,
    backgroundColor: "#cfeee0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  textoBoton: { color: color.texto, fontWeight: "600" },

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
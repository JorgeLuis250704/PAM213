import React, { useState } from "react";
import {Platform,View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondo: "#f1f2f3",
  verde: "#2f8a4f",
  tarjeta: "#ffffff",
  gris: "#dcdcdc",
  rosado: "#d9b8b8",
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
        <TouchableOpacity>
          <Text>🏦</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        <View style={estilos.iconosAccion}>
          
          <TouchableOpacity style={{ marginRight: 8 }} onPress={handleNotificaciones}>
            <Ionicons name="notifications-outline" size={20} color={color.verde} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="settings-outline" size={20} color={color.verde} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function NuevaTransferenciaScreen() {
  const [titular, setTitular] = useState("");
  const [banco, setBanco] = useState("");
  const [numero, setNumero] = useState("");
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");

  const handleAgregar = () => {
    if (!titular || !banco || !numero || !monto || !motivo) {
      if (Platform.OS === "web") {
        window.alert("Debes llenar todos los campos.");
      } else {
        Alert.alert("Campos incompletos", "Debes llenar todos los campos.");
      }
      return;
    }

    const mensaje = "¿Seguro que deseas agregar?";

    if (Platform.OS === "web") {
      const confirmacion = window.confirm(mensaje);
      if (confirmacion) {
        window.alert("Transacción agregada correctamente.");
        setTitular("");
        setBanco("");
        setNumero("");
        setMonto("");
        setMotivo("");
      }
    } else {
      Alert.alert("Confirmar acción", mensaje, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: () => {
            Alert.alert("Éxito", "Transacción agregada correctamente.");
            setTitular("");
            setBanco("");
            setNumero("");
            setMonto("");
            setMotivo("");
          },
        },
      ]);
    }
  };

  const handleHomePress = () => {
    if (Platform.OS === "web") {
      window.alert("¿Deseas regresar a la pantalla principal?.");
    } else {
      Alert.alert("Inicio", "¿Deseas regresar a la pantalla principal?.");
    }
  };

  return (
    <View style={estilos.pantalla}>
      <Encabezado titulo="Nueva transferencia" />

      <View style={estilos.cuerpo}>
        <View style={estilos.cajaBlanca}>
          <View style={[estilos.tarjetaSuave, { backgroundColor: color.rosado }]}>
            <Text style={estilos.subtitulo}>Datos</Text>

            <TextInput value={titular} onChangeText={setTitular} placeholder="Titular de la tarjeta"style={estilos.inputCapsula}placeholderTextColor={color.textoSuave}/>
            <TextInput value={banco} onChangeText={setBanco} placeholder="Banco (receptor)"style={estilos.inputCapsula}placeholderTextColor={color.textoSuave}/>
            <TextInput value={numero} onChangeText={setNumero} placeholder="Número de la tarjeta" keyboardType="number-pad"style={estilos.inputCapsula} placeholderTextColor={color.textoSuave} />
            <TextInput value={monto}onChangeText={setMonto}placeholder="Monto"keyboardType="decimal-pad"style={estilos.inputCapsula}placeholderTextColor={color.textoSuave} />
            <TextInput value={motivo} onChangeText={setMotivo} placeholder="Motivo"style={estilos.inputCapsula}placeholderTextColor={color.textoSuave} />

            <TouchableOpacity style={estilos.botonAceptar} onPress={handleAgregar}>
              <Text style={estilos.textoBoton}>Aceptar transacción</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="person-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="document-text-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.botonCentral} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
          <Ionicons name="stats-chart-outline" size={26} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity style={estilos.icono}>
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
  inputCapsula: {
    backgroundColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8,
  },
  botonAceptar: {
    alignSelf: "flex-end",
    marginTop: 10,
    backgroundColor: "#cfeee0",
    paddingHorizontal: 12,
    paddingVertical: 8,
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
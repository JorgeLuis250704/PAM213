import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";

const AHORRA_APP_LOGO = require("../assets/ahorra_app_logo.jpg");

export default function PerfilScreen({ navigation }) {
  const { colors, toggleTheme } = useContext(ThemeContext);

  // -------------------------------
  // ✔ Usuario con datos por defecto
  // -------------------------------
  const [usuario, setUsuario] = useState({
    nombre: "Juan Pérez",
    email: "jorge@example.com",
    telefono: "5544332211",
    password: "123456",
  });

  // Estados del modal (se llenan desde usuario)
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [nombre, setNombre] = useState(usuario.nombre);
  const [email, setEmail] = useState(usuario.email);
  const [telefono, setTelefono] = useState(usuario.telefono);
  const [password, setPassword] = useState(usuario.password);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensaje}`);
    else Alert.alert(titulo, mensaje);
  };

  // -----------------------------------
  // ✔ Abrir modal con datos del usuario
  // -----------------------------------
  const abrirEdicion = () => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setTelefono(usuario.telefono);
    setPassword(usuario.password);
    setEditarPerfil(true);
  };

  // -------------------------------
  // ✔ Guardar datos editados
  // -------------------------------
  const guardarPerfil = () => {
    if (!nombre || !email || !telefono || !password) {
      mostrarAlerta("Error", "Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarAlerta("Error", "Correo no válido");
      return;
    }

    // Guardar en el usuario principal
    setUsuario({ nombre, email, telefono, password });

    mostrarAlerta("Éxito", "Perfil actualizado correctamente");
    setEditarPerfil(false);
  };

  const cerrarSesion = () => {
    if (navigation) navigation.navigate("LogIn");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.fondo }}>
      {/* ---------- BARRA VERDE SUPERIOR ---------- */}
      <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
        <Text style={[styles.titulo, { color: colors.tarjeta }]}>Perfil</Text>

        <View style={[styles.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: colors.naranja }}>🏦</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.saldo, { color: colors.texto }]}>9,638.35</Text>
            <Text style={[styles.moneda, { color: colors.textoSuave }]}>MXN</Text>
          </View>

          <View style={styles.iconosAccion}>
            <TouchableOpacity
              style={{ marginRight: 8 }}
              onPress={() =>
                mostrarAlerta("Notificaciones", "No tienes notificaciones nuevas")
              }
            >
              <Ionicons name="notifications-outline" size={20} color={colors.verde} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name="settings-outline" size={20} color={colors.naranja} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Image source={AHORRA_APP_LOGO} style={styles.logo} />

          {/* ✔ Datos del usuario mostrados en pantalla */}
          <Text style={[styles.userName, { color: colors.texto }]}>
            {usuario.nombre}
          </Text>

          <Text style={[styles.userEmail, { color: colors.textoSuave }]}>
            {usuario.email}
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.tarjeta }]}
            onPress={abrirEdicion}
          >
            <Ionicons name="person-outline" size={22} color={colors.verde} />
            <Text style={[styles.optionText, { color: colors.texto }]}>
              Editar perfil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.tarjeta }]}
            onPress={cerrarSesion}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.naranja} />
            <Text style={[styles.optionText, { color: colors.texto }]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- MODAL PARA EDITAR PERFIL ---------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editarPerfil}
        onRequestClose={() => setEditarPerfil(false)}
      >
        <View style={GlobalStyles.modalContenedor}>
          <View
            style={[GlobalStyles.modalVista, { backgroundColor: colors.tarjeta }]}
          >
            <Text style={[GlobalStyles.modalTitulo, { color: colors.texto }]}>
              Editar perfil
            </Text>

            <TextInput
              style={[
                GlobalStyles.modalInput,
                { backgroundColor: colors.fondo, color: colors.texto },
              ]}
              placeholder="Nombre completo"
              placeholderTextColor={colors.textoSuave}
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              style={[
                GlobalStyles.modalInput,
                { backgroundColor: colors.fondo, color: colors.texto },
              ]}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.textoSuave}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[
                GlobalStyles.modalInput,
                { backgroundColor: colors.fondo, color: colors.texto },
              ]}
              placeholder="Número de teléfono"
              placeholderTextColor={colors.textoSuave}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[
                GlobalStyles.modalInput,
                { backgroundColor: colors.fondo, color: colors.texto },
              ]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textoSuave}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={() => setEditarPerfil(false)}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={guardarPerfil}
              >
                <Text style={GlobalStyles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomMenu colorActivo={colors.naranja} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", paddingTop: 30, paddingBottom: 20 },
  logo: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { fontSize: 14 },
  options: { padding: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: { fontSize: 15, marginLeft: 10 },
  encabezado: { paddingVertical: 20 },
  titulo: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  saldoTarjeta: {
    marginTop: 10,
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  saldo: { fontSize: 20, fontWeight: "700" },
  moneda: { fontSize: 14 },
  iconosAccion: { flexDirection: "row", alignItems: "center" },
});

const GlobalStyles = StyleSheet.create({
  modalContenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalVista: {
    width: "85%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    fontSize: 15,
  },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  botonBase: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonCancelar: { backgroundColor: "#ccc" },
  botonCancelarTexto: { color: "#000", fontWeight: "bold" },
  botonGuardar: { backgroundColor: "#469A49" },
  botonGuardarTexto: { color: "#fff", fontWeight: "bold" },
});

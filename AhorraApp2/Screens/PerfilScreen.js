import React, { useState, useContext, useCallback, useEffect } from "react";
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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";
import DatabaseService from "../database/DatabaseService";
import HeaderVerde from "./HeaderVerde";

const AHORRA_APP_LOGO = require("../assets/ahorra_app_logo.jpg");

export default function PerfilScreen({ navigation }) {
  const { colors, toggleTheme } = useContext(ThemeContext);

  // Estados
  const [usuario, setUsuario] = useState({
    id: null,
    nombre: "Usuario",
    email: "usuario@example.com",
    telefono: "",
    password: "",
  });

  const [registros, setRegistros] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);

  // Estados del modal
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensaje}`);
    else Alert.alert(titulo, mensaje);
  };

  // Cargar usuario actual desde AsyncStorage y BD
  const cargarUsuario = useCallback(async () => {
    try {
      // Intentar obtener el email del usuario actual desde AsyncStorage
      const currentUserEmail = await AsyncStorage.getItem('currentUserEmail');

      if (currentUserEmail) {
        // Cargar datos del usuario desde la BD
        const usuarioDB = await DatabaseService.getUserByEmail(currentUserEmail);
        if (usuarioDB) {
          setUsuario({
            id: usuarioDB.id,
            nombre: usuarioDB.nombre,
            email: usuarioDB.email,
            telefono: usuarioDB.phone || "",
            password: usuarioDB.password || "",
          });
        }
      } else {
        // Si no hay usuario en sesión, intentar cargar el último usuario registrado
        const usuarios = await DatabaseService.getAll('usuarios');
        if (usuarios && usuarios.length > 0) {
          const ultimoUsuario = usuarios[0];
          setUsuario({
            id: ultimoUsuario.id,
            nombre: ultimoUsuario.nombre,
            email: ultimoUsuario.email,
            telefono: ultimoUsuario.phone || "",
            password: ultimoUsuario.password || "",
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  }, []);

  // Cargar datos desde la base de datos
  const cargarDatos = useCallback(async () => {
    try {
      // Primero cargar el usuario
      await cargarUsuario();

      // Cargar registros
      const regs = await DatabaseService.getAll('registros');
      setRegistros(regs);

      // Cargar presupuestos
      const preps = await DatabaseService.getAll('presupuestos');
      setPresupuestos(preps);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, [cargarUsuario]);



  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  const abrirEdicion = () => {
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setTelefono(usuario.telefono);
    setPassword(usuario.password);
    setEditarPerfil(true);
  };

  const guardarPerfil = async () => {
    if (!nombre || !email || !telefono || !password) {
      mostrarAlerta("Error", "Todos los campos son obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      mostrarAlerta("Error", "Correo no válido");
      return;
    }

    try {
      // Actualizar en la base de datos
      if (usuario.id) {
        await DatabaseService.update('usuarios', usuario.id, {
          nombre,
          email,
          phone: telefono,
          password
        });

        // Actualizar AsyncStorage si cambió el email
        if (email !== usuario.email) {
          await AsyncStorage.setItem('currentUserEmail', email);
        }
      }

      // Actualizar estado local
      setUsuario({
        ...usuario,
        nombre,
        email,
        telefono,
        password
      });

      mostrarAlerta("Éxito", "Perfil actualizado correctamente");
      setEditarPerfil(false);
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      mostrarAlerta("Error", "No se pudo actualizar el perfil");
    }
  };

  const cerrarSesion = () => {
    if (navigation) navigation.navigate("LogIn");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.fondo }}>
      {/* BARRA VERDE SUPERIOR */}
      {/* BARRA VERDE SUPERIOR */}
      <HeaderVerde titulo="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.header}>
          <Image source={AHORRA_APP_LOGO} style={styles.logo} />
          <Text style={[styles.userName, { color: colors.texto }]}>
            {usuario.nombre}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textoSuave }]}>
            {usuario.email}
          </Text>
        </View>

        {/* ESTADÍSTICAS RÁPIDAS */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.tarjeta }]}>
            <FontAwesome5 name="arrow-up" size={20} color={colors.verde} />
            <Text style={[styles.statValue, { color: colors.verde }]}>
              ${registros.filter(r => r.tipo === 'ingreso').reduce((sum, r) => sum + r.monto, 0).toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textoSuave }]}>Ingresos</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.tarjeta }]}>
            <FontAwesome5 name="arrow-down" size={20} color={colors.rojo} />
            <Text style={[styles.statValue, { color: colors.rojo }]}>
              ${registros.filter(r => r.tipo === 'gasto').reduce((sum, r) => sum + r.monto, 0).toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textoSuave }]}>Gastos</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.tarjeta }]}>
            <FontAwesome5 name="wallet" size={20} color={colors.naranja} />
            <Text style={[styles.statValue, { color: colors.naranja }]}>
              {presupuestos.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textoSuave }]}>Presupuestos</Text>
          </View>
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

      {/* MODAL NOTIFICACIONES */}


      {/* MODAL EDITAR PERFIL */}
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

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },

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

  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  notifModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 20,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  notifTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notifList: {
    maxHeight: 400,
  },
  notifItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  notifContent: {
    flex: 1,
    marginLeft: 12,
  },
  notifItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notifItemMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
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

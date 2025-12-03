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
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";
import DatabaseService from "../database/DatabaseService";

const AHORRA_APP_LOGO = require("../assets/ahorra_app_logo.jpg");

export default function PerfilScreen({ navigation }) {
  const { colors, toggleTheme } = useContext(ThemeContext);

  // Estados
  const [usuario, setUsuario] = useState({
    nombre: "Juan Pérez",
    email: "jorge@example.com",
    telefono: "5544332211",
    password: "123456",
  });

  const [saldoTotal, setSaldoTotal] = useState(0);
  const [registros, setRegistros] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  // Estados del modal
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [nombre, setNombre] = useState(usuario.nombre);
  const [email, setEmail] = useState(usuario.email);
  const [telefono, setTelefono] = useState(usuario.telefono);
  const [password, setPassword] = useState(usuario.password);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensaje}`);
    else Alert.alert(titulo, mensaje);
  };

  // Cargar datos desde la base de datos
  const cargarDatos = useCallback(async () => {
    try {
      // Cargar registros
      const regs = await DatabaseService.getAll('registros');
      setRegistros(regs);

      // Calcular saldo total
      const ingresos = regs.filter(r => r.tipo === 'ingreso').reduce((sum, r) => sum + r.monto, 0);
      const gastos = regs.filter(r => r.tipo === 'gasto').reduce((sum, r) => sum + r.monto, 0);
      const saldo = ingresos - gastos;
      setSaldoTotal(saldo);

      // Cargar presupuestos
      const preps = await DatabaseService.getAll('presupuestos');
      setPresupuestos(preps);

      // Generar notificaciones
      generarNotificaciones(regs, preps, saldo);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, []);

  // Generar notificaciones basadas en presupuestos y saldo
  const generarNotificaciones = (regs, preps, saldo) => {
    const notifs = [];
    const now = new Date();

    // Notificación de saldo negativo
    if (saldo < 0) {
      notifs.push({
        id: 'saldo-negativo',
        tipo: 'alerta',
        icono: 'alert-circle',
        color: '#FF3B30',
        titulo: '⚠️ Saldo Negativo',
        mensaje: `Tu saldo es de $${saldo.toFixed(2)}. Considera reducir gastos.`,
        fecha: new Date().toISOString()
      });
    }

    // Notificaciones de presupuestos
    preps.forEach(presupuesto => {
      const gastosMes = regs
        .filter(r =>
          r.categoria === presupuesto.categoria &&
          r.tipo === 'gasto' &&
          new Date(r.fecha_creacion).getMonth() === now.getMonth() &&
          new Date(r.fecha_creacion).getFullYear() === now.getFullYear()
        )
        .reduce((sum, r) => sum + r.monto, 0);

      const porcentaje = (gastosMes / presupuesto.monto) * 100;

      if (gastosMes > presupuesto.monto) {
        notifs.push({
          id: `presupuesto-excedido-${presupuesto.id}`,
          tipo: 'error',
          icono: 'close-circle',
          color: '#FF3B30',
          titulo: '🚨 Presupuesto Excedido',
          mensaje: `Has gastado $${gastosMes.toFixed(2)} en ${presupuesto.categoria}, superando tu límite de $${presupuesto.monto}.`,
          fecha: new Date().toISOString()
        });
      } else if (porcentaje >= 90) {
        notifs.push({
          id: `presupuesto-alerta-${presupuesto.id}`,
          tipo: 'advertencia',
          icono: 'warning',
          color: '#FF8C00',
          titulo: '⚠️ Cerca del Límite',
          mensaje: `Estás al ${porcentaje.toFixed(0)}% de tu presupuesto en ${presupuesto.categoria}. Llevas $${gastosMes.toFixed(2)} de $${presupuesto.monto}.`,
          fecha: new Date().toISOString()
        });
      } else if (porcentaje >= 75) {
        notifs.push({
          id: `presupuesto-info-${presupuesto.id}`,
          tipo: 'info',
          icono: 'information-circle',
          color: '#2F8A4F',
          titulo: 'ℹ️ Presupuesto en Progreso',
          mensaje: `Llevas ${porcentaje.toFixed(0)}% de tu presupuesto en ${presupuesto.categoria}.`,
          fecha: new Date().toISOString()
        });
      }
    });

    // Notificación de bienvenida si no hay otras
    if (notifs.length === 0) {
      notifs.push({
        id: 'bienvenida',
        tipo: 'exito',
        icono: 'checkmark-circle',
        color: '#2F8A4F',
        titulo: '✅ Todo en Orden',
        mensaje: 'No tienes notificaciones pendientes. ¡Sigue así!',
        fecha: new Date().toISOString()
      });
    }

    setNotificaciones(notifs);
  };

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

    setUsuario({ nombre, email, telefono, password });
    mostrarAlerta("Éxito", "Perfil actualizado correctamente");
    setEditarPerfil(false);
  };

  const cerrarSesion = () => {
    if (navigation) navigation.navigate("LogIn");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.fondo }}>
      {/* BARRA VERDE SUPERIOR */}
      <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
        <Text style={[styles.titulo, { color: colors.tarjeta }]}>Perfil</Text>

        <View style={[styles.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: colors.naranja }}>🏦</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.saldo, { color: saldoTotal < 0 ? colors.rojo : colors.texto }]}>
              ${saldoTotal.toFixed(2)}
            </Text>
            <Text style={[styles.moneda, { color: colors.textoSuave }]}>
              {saldoTotal < 0 ? 'Saldo Negativo' : 'MXN'}
            </Text>
          </View>

          <View style={styles.iconosAccion}>
            <TouchableOpacity
              style={{ marginRight: 8, position: 'relative' }}
              onPress={() => setMostrarNotificaciones(true)}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.verde} />
              {notificaciones.length > 0 && notificaciones[0].tipo !== 'exito' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{notificaciones.length}</Text>
                </View>
              )}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={mostrarNotificaciones}
        onRequestClose={() => setMostrarNotificaciones(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.notifModal, { backgroundColor: colors.tarjeta }]}>
            <View style={styles.notifHeader}>
              <Text style={[styles.notifTitle, { color: colors.texto }]}>
                Notificaciones
              </Text>
              <TouchableOpacity onPress={() => setMostrarNotificaciones(false)}>
                <Ionicons name="close" size={24} color={colors.texto} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notifList}>
              {notificaciones.map((notif) => (
                <View
                  key={notif.id}
                  style={[styles.notifItem, { backgroundColor: colors.fondo }]}
                >
                  <Ionicons name={notif.icono} size={24} color={notif.color} />
                  <View style={styles.notifContent}>
                    <Text style={[styles.notifItemTitle, { color: colors.texto }]}>
                      {notif.titulo}
                    </Text>
                    <Text style={[styles.notifItemMessage, { color: colors.textoSuave }]}>
                      {notif.mensaje}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

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

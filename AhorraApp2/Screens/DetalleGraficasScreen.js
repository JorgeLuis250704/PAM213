import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";
import DatabaseService from "../database/DatabaseService";
import HeaderVerde from "./HeaderVerde";

export default function DetalleGraficasScreen() {
  const { colors, toggleTheme } = useContext(ThemeContext);
  const [vista, setVista] = useState("ahorro");
  const [registros, setRegistros] = useState([]);
  const screenWidth = Dimensions.get("window").width;

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const coloresBarras = ["#98d4b3", "#a7d2e0", "#e0b0af"];

  // Cargar datos reales de la BD
  useFocusEffect(
    useCallback(() => {
      const fetchRegistros = async () => {
        const data = await DatabaseService.getAll('registros');
        setRegistros(data);
      };
      fetchRegistros();
    }, [])
  );

  // Procesar datos para gráficas
  const procesarDatosMensuales = () => {
    return meses.map((mes, index) => {
      const registrosMes = registros.filter(r => {
        const fecha = new Date(r.fecha_creacion);
        return fecha.getMonth() === index;
      });

      const ingreso = registrosMes
        .filter(r => r.tipo === 'ingreso')
        .reduce((sum, r) => sum + r.monto, 0);

      const egreso = registrosMes
        .filter(r => r.tipo === 'gasto')
        .reduce((sum, r) => sum + r.monto, 0);

      const ahorro = ingreso - egreso;

      return {
        mes,
        ingreso,
        egreso,
        ahorro: Math.max(0, ahorro), // Evitar barras negativas visualmente
        color: coloresBarras[index % coloresBarras.length],
        ingresoReal: ingreso,
        egresoReal: egreso,
        ahorroReal: ahorro
      };
    });
  };

  const datosMensuales = procesarDatosMensuales();

  // Filtrar meses sin actividad para limpiar gráficas (opcional)
  const datosVisibles = datosMensuales.filter(d => d.ingreso > 0 || d.egreso > 0);

  const ingresosMes = datosVisibles.map(d => ({ mes: d.mes, monto: d.ingreso, color: d.color }));
  const egresosMes = datosVisibles.map(d => ({ mes: d.mes, monto: d.egreso, color: d.color }));
  const ahorrosMes = datosVisibles.map(d => ({ mes: d.mes, monto: d.ahorro, color: d.color }));

  const VerticalChart = ({ titulo, datos, icono }) => {
    if (!datos || datos.length === 0) return null;

    const maxMonto = Math.max(...datos.map((x) => x.monto));

    return (
      <View style={[styles.card, { backgroundColor: colors.tarjeta }]}>
        <View style={styles.titleRow}>
          <Ionicons name={icono} size={22} color={colors.verde} />
          <Text style={[styles.cardTitle, { color: colors.texto }]}>{titulo}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: Math.max(datos.length * 60, screenWidth - 32),
            justifyContent: "center",
          }}
        >
          <View style={styles.verticalContainer}>
            {datos.map((item, i) => {
              const barHeight = new Animated.Value(0);
              Animated.timing(barHeight, {
                toValue: maxMonto > 0 ? (item.monto / maxMonto) * 220 : 0,
                duration: 900,
                useNativeDriver: false,
              }).start();

              return (
                <View style={styles.columnItem} key={i}>
                  <Animated.View
                    style={[styles.verticalBar, { height: barHeight, backgroundColor: item.color }]}
                  />
                  <Text style={[styles.verticalValue, { color: colors.texto }]}>
                    {item.monto}
                  </Text>
                  <Text style={[styles.verticalLabel, { color: colors.textoSuave }]}>
                    {item.mes}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.fondo }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.verde} />

      {/* ------------------------------------------------ */}
      {/* ✔✔ BARRA VERDE SUPERIOR ARREGLADA (HORIZONTAL) ✔✔ */}
      {/* ------------------------------------------------ */}
      {/* ------------------------------------------------ */}
      {/* ✔✔ BARRA VERDE SUPERIOR ARREGLADA (HORIZONTAL) ✔✔ */}
      {/* ------------------------------------------------ */}
      <HeaderVerde titulo="Gráficas" />
      {/* ------------------------------------------------ */}

      {/* ---------- TABS ---------- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "ahorro" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("ahorro")}
        >
          <Ionicons name="wallet-outline" size={18} color={vista === "ahorro" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "ahorro" && { color: "#fff" }]}>
            Ahorros
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "mes" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("mes")}
        >
          <Ionicons name="calendar-outline" size={18} color={vista === "mes" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "mes" && { color: "#fff" }]}>
            Mes
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------- CONTENIDO ---------- */}
      <ScrollView style={{ padding: 16 }}>
        {vista === "ahorro" && (
          ahorrosMes.length > 0 ? (
            <VerticalChart titulo="Ahorros por Mes" datos={ahorrosMes} icono="wallet-outline" />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>No hay datos suficientes para mostrar ahorros.</Text>
          )
        )}

        {vista === "mes" && (
          <>
            {ingresosMes.length > 0 ? (
              <VerticalChart titulo="Ingresos Mensuales" datos={ingresosMes} icono="trending-up-outline" />
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>No hay ingresos registrados.</Text>
            )}

            {egresosMes.length > 0 ? (
              <VerticalChart titulo="Egresos Mensuales" datos={egresosMes} icono="trending-down-outline" />
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>No hay egresos registrados.</Text>
            )}
          </>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomMenu colorActivo={colors.naranja} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  encabezado: {
    paddingVertical: 22,
    paddingHorizontal: 16,
  },

  titulo: { fontSize: 22, fontWeight: "700", textAlign: "center" },

  saldoTarjeta: {
    marginTop: 10,
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  iconosAccion: {
    flexDirection: "row",
    alignItems: "center",
  },

  saldo: { fontSize: 20, fontWeight: "700" },
  moneda: { fontSize: 14 },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 12,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginHorizontal: 10,
    gap: 6,
  },

  tabTexto: { fontSize: 15, fontWeight: "600", color: "#666" },

  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },

  cardTitle: { fontSize: 20, fontWeight: "700" },

  verticalContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 10,
    paddingBottom: 10,
  },

  columnItem: { alignItems: "center", width: 50 },

  verticalBar: { width: 28, borderRadius: 10 },

  verticalValue: { marginTop: 5, fontWeight: "700" },

  verticalLabel: { fontSize: 13, fontWeight: "600", marginTop: 4 },
});

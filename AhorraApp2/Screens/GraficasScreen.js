import React, { useState, useContext } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";

// Función que genera variaciones de datos
function generarVariaciones(datos, variacion = 0.35) {
  return datos.map((item) => {
    const cambio =
      (Math.random() * item.monto * variacion) *
      (Math.random() > 0.5 ? 1 : -1);
    return { ...item, monto: Math.max(400, Math.round(item.monto + cambio)) };
  });
}

export default function GraficasScreen() {
  const { colors, toggleTheme } = useContext(ThemeContext);
  const [vista, setVista] = useState("ahorro");
  const screenWidth = Dimensions.get("window").width;

  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const coloresBarras = ["#98d4b3", "#a7d2e0", "#e0b0af"];
  const categoriasIngresos = ["Sueldo", "Freelance", "Otros"];
  const categoriasEgresos = ["Alimentación", "Transporte", "Entretenimiento"];

  const baseIngresos = meses.map((m, i) => ({
    categoria: categoriasIngresos[i % categoriasIngresos.length],
    mes: m,
    monto: 6000 + Math.floor(Math.random() * 2500),
    color: coloresBarras[i % 3],
  }));

  const baseEgresos = meses.map((m, i) => ({
    categoria: categoriasEgresos[i % categoriasEgresos.length],
    mes: m,
    monto: 2500 + Math.floor(Math.random() * 1500),
    color: coloresBarras[i % 3],
  }));

  const ingresosMes = generarVariaciones(baseIngresos);
  const egresosMes = generarVariaciones(baseEgresos);

  const ahorrosMes = ingresosMes.map((ing, i) => ({
    categoria: ing.mes,
    monto: ing.monto - egresosMes[i].monto,
    color: ing.color,
    mes: ing.mes,
  }));

  const FiltrarPorCategoria = (datos, cat) =>
    datos
      .filter((item) => item.categoria === cat)
      .map((item) => ({ categoria: item.mes, monto: item.monto, color: item.color, mes: item.mes }));

  const VerticalChart = ({ titulo, datos, icono }) => {
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
                toValue: (item.monto / maxMonto) * 220,
                duration: 900,
                useNativeDriver: false,
              }).start();

              return (
                <View style={styles.columnItem} key={i}>
                  <Animated.View
                    style={[styles.verticalBar, { height: barHeight, backgroundColor: item.color }]}
                  />
                  <Text style={[styles.verticalValue, { color: colors.texto }]}>{item.monto}</Text>
                  <Text style={[styles.verticalLabel, { color: colors.textoSuave }]}>{item.mes || item.categoria}</Text>
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

      {/* ---------- BARRA VERDE SUPERIOR CON TARJETA ---------- */}
      <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
        <Text style={[styles.titulo, { color: colors.tarjeta }]}>Gráficas</Text>

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

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "ahorro" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("ahorro")}
        >
          <Ionicons name="wallet-outline" size={18} color={vista === "ahorro" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "ahorro" && { color: "#fff" }]}>Ahorros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "mes" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("mes")}
        >
          <Ionicons name="calendar-outline" size={18} color={vista === "mes" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "mes" && { color: "#fff" }]}>Mes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "categoriaIngresos" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("categoriaIngresos")}
        >
          <Ionicons name="arrow-up-outline" size={18} color={vista === "categoriaIngresos" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "categoriaIngresos" && { color: "#fff" }]}>Ingresos Cat.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "categoriaEgresos" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("categoriaEgresos")}
        >
          <Ionicons name="arrow-down-outline" size={18} color={vista === "categoriaEgresos" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "categoriaEgresos" && { color: "#fff" }]}>Egresos Cat.</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      <ScrollView style={{ padding: 16 }}>
        {vista === "ahorro" && <VerticalChart titulo="Ahorros por Mes" datos={ahorrosMes} icono="wallet-outline" />}
        {vista === "mes" && (
          <>
            <VerticalChart titulo="Ingresos Mensuales" datos={ingresosMes} icono="trending-up-outline" />
            <VerticalChart titulo="Egresos Mensuales" datos={egresosMes} icono="trending-down-outline" />
          </>
        )}
        {vista === "categoriaIngresos" &&
          categoriasIngresos.map((cat) => (
            <VerticalChart key={cat} titulo={`Ingresos: ${cat}`} datos={FiltrarPorCategoria(ingresosMes, cat)} icono="arrow-up-outline" />
          ))}
        {vista === "categoriaEgresos" &&
          categoriasEgresos.map((cat) => (
            <VerticalChart key={cat} titulo={`Egresos: ${cat}`} datos={FiltrarPorCategoria(egresosMes, cat)} icono="arrow-down-outline" />
          ))}
        <View style={{ height: 140 }} />
      </ScrollView>

      <BottomMenu colorActivo={colors.naranja} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  encabezado: { paddingVertical: 20 },
  titulo: { fontSize: 22, fontWeight: "700", textAlign: "center" },

  saldoTarjeta: {
    marginTop: 10,
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saldo: { fontSize: 20, fontWeight: '700' },
  moneda: { fontSize: 14 },
  iconosAccion: { flexDirection: 'row', alignItems: 'center' },

  tabsContainer: { flexDirection: "row", justifyContent: "center", marginTop: 18, marginBottom: 12, flexWrap: "wrap" },
  tab: { flexDirection: "row", alignItems: "center", backgroundColor: "#e0e0e0", paddingVertical: 10, paddingHorizontal: 22, borderRadius: 12, marginHorizontal: 10, marginBottom: 8, gap: 6 },
  tabTexto: { fontSize: 15, fontWeight: "600", color: "#666" },

  card: { padding: 20, borderRadius: 16, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 5 },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  cardTitle: { fontSize: 20, fontWeight: "700" },
  verticalContainer: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 10, paddingBottom: 10 },
  columnItem: { alignItems: "center", width: 50 },
  verticalBar: { width: 28, borderRadius: 10 },
  verticalValue: { marginTop: 5, fontWeight: "700" },
  verticalLabel: { fontSize: 13, fontWeight: "600", marginTop: 4 },
});

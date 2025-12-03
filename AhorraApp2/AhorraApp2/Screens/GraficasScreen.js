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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import BottomMenu from "./BottomMenu";
import { ThemeContext } from "./ThemeContext";
import DatabaseService from "../database/DatabaseService";

export default function GraficasScreen() {
  const { colors, toggleTheme } = useContext(ThemeContext);
  const [vista, setVista] = useState("categoriaIngresos");
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
  const procesarDatos = (tipo) => {
    // Filtrar por tipo (ingreso/gasto)
    const filtrados = registros.filter(r => r.tipo === tipo);

    // Agrupar por categoría y mes
    // Estructura deseada: { "Categoria": [ { mes: "Enero", monto: 100, color: ... }, ... ] }
    const categorias = [...new Set(filtrados.map(r => r.categoria))];

    return categorias.map(cat => {
      const datosCategoria = filtrados.filter(r => r.categoria === cat);

      // Mapear a meses (esto es simplificado, asume año actual o mezcla años)
      const datosPorMes = meses.map((mes, index) => {
        const montoMes = datosCategoria
          .filter(r => {
            const fecha = new Date(r.fecha_creacion);
            return fecha.getMonth() === index;
          })
          .reduce((sum, r) => sum + r.monto, 0);

        return {
          mes,
          monto: montoMes,
          color: coloresBarras[index % coloresBarras.length]
        };
      });

      // Filtrar meses con monto 0 para limpiar la gráfica (opcional)
      const datosVisibles = datosPorMes.filter(d => d.monto > 0);

      return {
        categoria: cat,
        datos: datosVisibles.length > 0 ? datosVisibles : []
      };
    });
  };

  const datosIngresos = procesarDatos('ingreso');
  const datosEgresos = procesarDatos('gasto');

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
                    style={[styles.verticalBar, {
                      height: barHeight,
                      backgroundColor: item.color
                    }]}
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

      <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
        <Text style={[styles.titulo, { color: colors.tarjeta }]}>Gráficas</Text>

        <View style={[styles.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
          <TouchableOpacity>
            <Text style={{ fontSize: 24, color: colors.naranja }}>🏦</Text>
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.saldo, { color: colors.texto }]}>
              {/* Calcular saldo total real */}
              {(registros.filter(r => r.tipo === 'ingreso').reduce((acc, r) => acc + r.monto, 0) -
                registros.filter(r => r.tipo === 'gasto').reduce((acc, r) => acc + r.monto, 0)).toFixed(2)}
            </Text>
            <Text style={[styles.moneda, { color: colors.textoSuave }]}>MXN</Text>
          </View>

          <View style={styles.iconosAccion}>
            <TouchableOpacity style={{ marginRight: 8 }}>
              <Ionicons name="notifications-outline" size={20} color={colors.verde} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleTheme}>
              <Ionicons name="settings-outline" size={20} color={colors.naranja} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- SOLO CATEGORÍAS --- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "categoriaIngresos" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("categoriaIngresos")}
        >
          <Ionicons name="arrow-up-outline" size={18} color={vista === "categoriaIngresos" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "categoriaIngresos" && { color: "#fff" }]}>
            Ingresos Cat.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "categoriaEgresos" && { backgroundColor: colors.naranja }]}
          onPress={() => setVista("categoriaEgresos")}
        >
          <Ionicons name="arrow-down-outline" size={18} color={vista === "categoriaEgresos" ? "#fff" : colors.textoSuave} />
          <Text style={[styles.tabTexto, vista === "categoriaEgresos" && { color: "#fff" }]}>
            Egresos Cat.
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {vista === "categoriaIngresos" && (
          datosIngresos.length > 0 ? (
            datosIngresos.map((item) => (
              <VerticalChart
                key={item.categoria}
                titulo={`Ingresos: ${item.categoria}`}
                datos={item.datos}
                icono="arrow-up-outline"
              />
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>No hay datos de ingresos registrados.</Text>
          )
        )}

        {vista === "categoriaEgresos" && (
          datosEgresos.length > 0 ? (
            datosEgresos.map((item) => (
              <VerticalChart
                key={item.categoria}
                titulo={`Egresos: ${item.categoria}`}
                datos={item.datos}
                icono="arrow-down-outline"
              />
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>No hay datos de egresos registrados.</Text>
          )
        )}

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
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  saldo: { fontSize: 20, fontWeight: "700" },
  moneda: { fontSize: 14 },
  iconosAccion: { flexDirection: "row", alignItems: "center" },

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

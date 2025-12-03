import React, { useState, useContext, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "./ThemeContext";
import DatabaseService from "../database/DatabaseService";

export default function HeaderVerde({ titulo, onBankIconPress }) {
    const { colors, toggleTheme } = useContext(ThemeContext);

    const [saldoTotal, setSaldoTotal] = useState(0);
    const [notificaciones, setNotificaciones] = useState([]);
    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

    // Cargar datos desde la base de datos
    const cargarDatos = useCallback(async () => {
        try {
            // Cargar registros
            const regs = await DatabaseService.getAll('registros');

            // Calcular saldo total
            const ingresos = regs.filter(r => r.tipo === 'ingreso').reduce((sum, r) => sum + r.monto, 0);
            const gastos = regs.filter(r => r.tipo === 'gasto').reduce((sum, r) => sum + r.monto, 0);
            const saldo = ingresos - gastos;
            setSaldoTotal(saldo);

            // Cargar presupuestos
            const preps = await DatabaseService.getAll('presupuestos');

            // Generar notificaciones
            generarNotificaciones(regs, preps, saldo);
        } catch (error) {
            console.error("Error al cargar datos en HeaderVerde:", error);
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

    return (
        <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
            <Text style={[styles.titulo, { color: colors.tarjeta }]}>{titulo}</Text>

            <View style={[styles.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
                <TouchableOpacity onPress={onBankIconPress} disabled={!onBankIconPress}>
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
        </View>
    );
}

const styles = StyleSheet.create({
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

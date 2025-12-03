import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    FlatList, Modal, TextInput, Alert, ActivityIndicator, StatusBar, Platform
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';
import { PresupuestoController } from '../controllers/PresupuestoController';
import BottomMenu from './BottomMenu'; // Asumiendo que existe y se quiere unificar el layout

const presupuestoController = new PresupuestoController();

export default function PresupuestosScreen({ navigation }) {
    const { colors, isDark } = useContext(ThemeContext);
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editando, setEditando] = useState(null);

    // Formulario
    const [categoria, setCategoria] = useState('');
    const [monto, setMonto] = useState('');
    const [guardando, setGuardando] = useState(false);

    // Categorías predefinidas (mismas que en registros)
    const categoriasOpciones = ["Alimentos", "Transporte", "Entretenimiento", "Salud", "Educación", "Otros"];

    const cargarPresupuestos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await presupuestoController.obtenerPresupuestos();
            // Simulación de los datos de la imagen (Esto es solo para fines de demostración si la base de datos está vacía)
            // const dummyData = [
            //     { id: 1, categoria: "Otros", monto: 1200 },
            //     { id: 2, categoria: "Salud", monto: 1000 },
            //     { id: 3, categoria: "Entretenimiento", monto: 200 },
            //     { id: 4, categoria: "Alimentos", monto: 500 },
            //     { id: 5, categoria: "Transporte", monto: 100 },
            // ];
            // setPresupuestos(dummyData); // Usar `data` en la aplicación real
            setPresupuestos(data); // Usar los datos reales
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            cargarPresupuestos();
        }, [cargarPresupuestos])
    );

    const guardarPresupuesto = async () => {
        if (!categoria || !monto) {
            Alert.alert("Error", "Completa todos los campos");
            return;
        }

        setGuardando(true);
        try {
            if (editando) {
                await presupuestoController.actualizarPresupuesto(editando.id, categoria, monto);
                Alert.alert("Éxito", "Presupuesto actualizado");
            } else {
                await presupuestoController.crearPresupuesto(categoria, monto);
                Alert.alert("Éxito", "Presupuesto creado");
            }
            setModalVisible(false);
            limpiarFormulario();
            cargarPresupuestos();
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setGuardando(false);
        }
    };

    const eliminarPresupuesto = (id) => {
        Alert.alert(
            "Eliminar",
            "¿Estás seguro de eliminar este presupuesto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar", style: "destructive", onPress: async () => {
                        try {
                            await presupuestoController.eliminarPresupuesto(id);
                            cargarPresupuestos();
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    }
                }
            ]
        );
    };

    const abrirEditar = (item) => {
        setEditando(item);
        setCategoria(item.categoria);
        setMonto(item.monto.toString());
        setModalVisible(true);
    };

    const limpiarFormulario = () => {
        setEditando(null);
        setCategoria('');
        setMonto('');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.fondo }]}>
            <StatusBar barStyle={colors.statusBar} />

            {/* HEADER - MODIFICADO PARA PARECERSE A RegScreen */}
            <View style={[styles.header, { backgroundColor: colors.verde }]}>
                <Text style={[styles.headerTitle, { color: colors.tarjeta }]}>Presupuestos Mensuales</Text>
            </View>

            {/* CONTENIDO */}
            {loading ? (
                <ActivityIndicator size="large" color={colors.verde} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={presupuestos}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 15, paddingBottom: 80 }} // Agregado padding para el BottomMenu
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textoSuave }}>
                            No tienes presupuestos definidos.
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: colors.tarjeta }]}>
                            <View style={styles.cardInfo}>
                                <Text style={[styles.cardTitle, { color: colors.texto }]}>{item.categoria}</Text>
                                <Text style={[styles.cardAmount, { color: colors.verde }]}>${item.monto}</Text>
                            </View>
                            <View style={styles.cardActions}>
                                <TouchableOpacity onPress={() => abrirEditar(item)} style={styles.actionButton}>
                                    <FontAwesome5 name="edit" size={18} color={colors.naranja} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => eliminarPresupuesto(item.id)} style={styles.actionButton}>
                                    <FontAwesome5 name="trash" size={18} color={colors.rojo || '#FF3B30'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            {/* FAB ADD BUTTON */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.naranja }]}
                onPress={() => {
                    limpiarFormulario();
                    setModalVisible(true);
                }}
            >
                <FontAwesome5 name="plus" size={20} color="#fff" />
            </TouchableOpacity>

            {/* MODAL (sin cambios, ya estaba funcional) */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.tarjeta || colors.background }]}>
                        <Text style={[styles.modalTitle, { color: colors.texto }]}>
                            {editando ? "Editar Presupuesto" : "Nuevo Presupuesto"}
                        </Text>

                        <Text style={[styles.label, { color: colors.texto }]}>Categoría</Text>
                        <View style={styles.categoryContainer}>
                            {categoriasOpciones.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryChip,
                                        { borderColor: colors.borde || '#ccc' },
                                        categoria === cat && { backgroundColor: colors.verde, borderColor: colors.verde }
                                    ]}
                                    onPress={() => setCategoria(cat)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        categoria === cat ? { color: '#fff' } : { color: colors.texto }
                                    ]}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { color: colors.texto }]}>Monto Límite</Text>
                        <TextInput
                            style={[styles.input, { color: colors.texto, borderColor: colors.borde || '#ccc', backgroundColor: colors.fondo }]}
                            placeholder="0.00"
                            placeholderTextColor={colors.textoSuave}
                            keyboardType="numeric"
                            value={monto}
                            onChangeText={setMonto}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.gris || '#ccc' }]}
                                onPress={() => { setModalVisible(false); limpiarFormulario(); }}
                                disabled={guardando}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.verde, opacity: guardando ? 0.7 : 1 }]}
                                onPress={guardarPresupuesto}
                                disabled={guardando}
                            >
                                <Text style={styles.modalButtonText}>{guardando ? "Guardando..." : "Guardar"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomMenu />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    // NUEVOS ESTILOS DE ENCABEZADO UNIFICADO
    header: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 6 : 6, // Ajuste para Android
        paddingBottom: 12,
        paddingHorizontal: 16,
        alignItems: 'center', // Para centrar el título verticalmente si no hay otros elementos
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        // marginBottom: 8, // Quitado para centrar mejor
    },
    // FIN NUEVOS ESTILOS

    // Estilos de la tarjeta de lista (actualizados para usar theme context)
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    cardInfo: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardAmount: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    cardActions: { flexDirection: 'row' },
    actionButton: { padding: 10, marginLeft: 10 },
    fab: {
        position: 'absolute',
        bottom: 80, // Subido para no chocar con el BottomMenu
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        zIndex: 10, // Asegurar que esté por encima de BottomMenu
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, marginBottom: 10, fontWeight: '600' },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: { fontSize: 14 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    modalButtonText: { color: '#fff', fontWeight: 'bold' },
});
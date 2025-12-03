import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
    FlatList, Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ThemeContext } from './ThemeContext';
import { PresupuestoController } from '../controllers/PresupuestoController';

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
            setPresupuestos(data);
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
            {/* HEADER */}
            <View style={[styles.header, { backgroundColor: colors.verde }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Presupuestos Mensuales</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* CONTENIDO */}
            {loading ? (
                <ActivityIndicator size="large" color={colors.verde} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={presupuestos}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 15 }}
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

            {/* MODAL */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
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
                                        categoria === cat && { backgroundColor: colors.verde }
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
                            style={[styles.input, { color: colors.texto, borderColor: colors.borde || '#ccc' }]}
                            placeholder="0.00"
                            placeholderTextColor={colors.textoSuave}
                            keyboardType="numeric"
                            value={monto}
                            onChangeText={setMonto}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: colors.verde }]}
                                onPress={guardarPresupuesto}
                                disabled={guardando}
                            >
                                <Text style={styles.modalButtonText}>{guardando ? "Guardando..." : "Guardar"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        elevation: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: { padding: 5 },
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
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
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
        borderColor: '#ccc',
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

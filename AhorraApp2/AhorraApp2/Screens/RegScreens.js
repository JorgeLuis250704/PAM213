// screens/RegScreen.js
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal,
    Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StatusBar, Platform
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';
import { RegistroController } from '../controllers/RegistroController';
import { ThemeContext } from './ThemeContext';

const registroController = new RegistroController();
const categoriasOpciones = ['Alimentos', 'Transporte', 'Renta', 'Entretenimiento', 'Otros'];

// Función auxiliar para alertas compatibles con web y móvil
const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function RegScreen() {
    const { colors, toggleTheme } = useContext(ThemeContext);

    const [registros, setRegistros] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editId, setEditId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tipo, setTipo] = useState('gasto'); // 'ingreso' o 'gasto'
    const [guardando, setGuardando] = useState(false);

    // Filtros
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const cargarRegistros = useCallback(async () => {
        try {
            const lista = await registroController.obtenerRegistros();
            setRegistros(lista);
        } catch {
            showAlert("Error", "No se pudieron cargar los registros.");
        }
    }, []);

    useEffect(() => {
        const observer = () => cargarRegistros();
        registroController.addListener(observer);

        const init = async () => {
            await registroController.initialize();
            cargarRegistros();
        };
        init();

        return () => registroController.removeListener(observer);
    }, [cargarRegistros]);

    const abrirAgregar = () => {
        setModalMode('add');
        setEditId(null);
        setNombre('');
        setMonto('');
        setCategoria('');
        setTipo('gasto');
        setModalVisible(true);
    };

    const abrirEditar = (item) => {
        setModalMode('edit');
        setEditId(item.id);
        setNombre(item.nombre);
        setMonto(String(item.monto));
        setCategoria(item.categoria);
        setTipo(item.tipo || 'gasto');
        setModalVisible(true);
    };

    const guardarRegistro = async () => {
        if (!nombre.trim() || !monto.trim() || !categoria.trim()) {
            showAlert('Error', 'Completa todos los campos.');
            return;
        }

        setGuardando(true);

        try {
            if (modalMode === 'add') {
                await registroController.crearRegistro(nombre, Number(monto), categoria, tipo);
            } else {
                await registroController.actualizarRegistro(editId, nombre, Number(monto), categoria, tipo);
            }

            setModalVisible(false);
            setNombre('');
            setMonto('');
            setCategoria('');
            setTipo('gasto');
            setEditId(null);
            setModalMode('add');

        } catch (error) {
            showAlert('Error', error.message);
        } finally {
            setGuardando(false);
        }
    };

    const eliminarRegistro = (id) => {
        if (Platform.OS === 'web') {
            // Para web, usar window.confirm
            if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                registroController.eliminarRegistro(id);
            }
        } else {
            // Para móvil, usar Alert.alert
            Alert.alert('Confirmar', '¿Eliminar este registro?', [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => registroController.eliminarRegistro(id)
                }
            ]);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.fondo }]}>
            <StatusBar barStyle={colors.statusBar} />

            {/* ENCABEZADO */}
            <View style={[styles.encabezado, { backgroundColor: colors.verde }]}>
                <Text style={[styles.titulo, { color: colors.tarjeta }]}>Registros</Text>
                <View style={[styles.saldoTarjeta, { backgroundColor: colors.tarjeta }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.saldo, { color: colors.texto }]}>
                            ${registros.reduce((sum, r) => sum + (r.tipo === 'ingreso' ? r.monto : -r.monto), 0).toFixed(2)}
                        </Text>
                        <Text style={[styles.moneda, { color: colors.textoSuave }]}>Balance Total</Text>
                    </View>
                    <View style={styles.iconosAccion}>
                        <TouchableOpacity onPress={toggleTheme}>
                            <Ionicons name="settings-outline" size={20} color={colors.naranja} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* LISTA DE REGISTROS */}
            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}>
                {registros.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.textoSuave }]}>
                            No hay registros aún
                        </Text>
                    </View>
                ) : (
                    registros.map((item, index) => (
                        <View
                            key={item.id}
                            style={[
                                styles.userItem,
                                {
                                    backgroundColor: colors.tarjeta,
                                    borderLeftColor: item.tipo === 'ingreso' ? colors.verde : colors.rojo
                                }
                            ]}
                        >
                            <View style={[styles.userNumber, { backgroundColor: item.tipo === 'ingreso' ? colors.verde : colors.rojo }]}>
                                <Text style={styles.userNumberText}>{index + 1}</Text>
                            </View>
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: colors.texto }]}>{item.nombre}</Text>
                                <Text style={[styles.userId, { color: colors.textoSuave }]}>
                                    {item.categoria} • ${item.monto.toFixed(2)}
                                </Text>
                                <Text style={[styles.userDate, { color: colors.textoSuave }]}>
                                    {new Date(item.fechaCreacion).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.naranja }]}
                                    onPress={() => abrirEditar(item)}
                                >
                                    <FontAwesome5 name="edit" size={14} color="#fff" />
                                    <Text style={styles.actionButtonText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, { backgroundColor: colors.rojo }]}
                                    onPress={() => eliminarRegistro(item.id)}
                                >
                                    <FontAwesome5 name="trash" size={14} color="#fff" />
                                    <Text style={styles.actionButtonText}>Borrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* BOTÓN AGREGAR */}
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.verde }]}
                onPress={abrirAgregar}
            >
                <Ionicons name="add" size={40} color="#fff" />
            </TouchableOpacity>

            {/* MODAL AGREGAR/EDITAR */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={styles.modalWrapper}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.modalContent, { backgroundColor: colors.tarjeta }]}>
                            <Text style={[styles.modalTitle, { color: colors.texto }]}>
                                {modalMode === 'add' ? 'Agregar registro' : 'Editar registro'}
                            </Text>

                            {/* TIPO SELECTOR */}
                            <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        tipo === 'gasto' && { backgroundColor: colors.rojo || '#FF3B30' },
                                        { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                                    ]}
                                    onPress={() => setTipo('gasto')}
                                >
                                    <Text style={[styles.typeText, tipo === 'gasto' && { color: '#fff' }]}>Gasto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.typeButton,
                                        tipo === 'ingreso' && { backgroundColor: colors.verde },
                                        { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                                    ]}
                                    onPress={() => setTipo('ingreso')}
                                >
                                    <Text style={[styles.typeText, tipo === 'ingreso' && { color: '#fff' }]}>Ingreso</Text>
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={[styles.input, { backgroundColor: colors.fondo, color: colors.texto }]}
                                placeholder="Nombre"
                                placeholderTextColor={colors.textoSuave}
                                value={nombre}
                                onChangeText={setNombre}
                            />

                            <TextInput
                                style={[styles.input, { backgroundColor: colors.fondo, color: colors.texto }]}
                                placeholder="Monto"
                                placeholderTextColor={colors.textoSuave}
                                keyboardType="numeric"
                                value={monto}
                                onChangeText={setMonto}
                            />

                            <View style={styles.optionsContainer}>
                                {categoriasOpciones.map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[
                                            styles.optionButton,
                                            categoria === cat && {
                                                backgroundColor: colors.verde,
                                                borderColor: colors.verde
                                            }
                                        ]}
                                        onPress={() => setCategoria(cat)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                { color: categoria === cat ? '#fff' : colors.texto }
                                            ]}
                                        >
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, marginRight: 10 }]}
                                    onPress={() => setModalVisible(false)}
                                    disabled={guardando}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        guardando && styles.buttonDisabled,
                                        { flex: 1 }
                                    ]}
                                    onPress={guardarRegistro}
                                    disabled={guardando}
                                >
                                    <Text style={styles.buttonText}>
                                        {guardando ? 'Guardando...' : 'Guardar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>

            <BottomMenu />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    /* -------- ENCABEZADO IGUAL QUE PrincipalScreen -------- */
    encabezado: {
        paddingTop: 6,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    titulo: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    saldoTarjeta: {
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    saldo: { fontSize: 26, fontWeight: '800' },
    moneda: { fontSize: 12 },
    iconosAccion: { flexDirection: 'row', marginLeft: 12 },

    /* -------- LISTA -------- */
    userItem: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 3,
        borderLeftWidth: 5,
    },
    userNumber: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userNumberText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    userInfo: { flex: 1 },
    userName: { fontSize: 18, fontWeight: '700' },
    userId: { fontSize: 14 },
    userDate: { fontSize: 12 },
    actionsContainer: { flexDirection: 'row', marginLeft: 10 },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    actionButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },

    emptyContainer: { alignItems: 'center', paddingVertical: 50 },
    emptyText: { fontSize: 18 },

    /* -------- AGREGAR -------- */
    addButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 80,
        right: 20,
        elevation: 8,
    },

    /* -------- MODAL -------- */
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        borderRadius: 15,
        padding: 25,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        marginBottom: 15,
        fontSize: 16,
    },

    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    optionButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 8,
        marginBottom: 8,
    },
    optionText: { fontSize: 14 },

    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonDisabled: { backgroundColor: '#ccc' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

    /* -------- FILTROS -------- */
    filterContainer: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    monthFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    monthText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    categoryFilter: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    filterChip: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginRight: 8,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },

    /* -------- TIPO SELECTOR -------- */
    typeButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
    },
    typeText: {
        fontWeight: 'bold',
        color: '#333',
    },
});

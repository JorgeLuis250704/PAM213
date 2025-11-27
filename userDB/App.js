// App.js
import { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Platform,
    Modal,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Importa el controlador (ajusta la ruta si tu estructura es diferente)
import { UsuarioController } from './controllers/UsuarioController';

// Instancia única del controlador
const usuarioController = new UsuarioController();

export default function App() {
    // Datos y estados
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    // Estados para EDIT (modal)
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // objeto usuario
    const [editName, setEditName] = useState('');
    const [guardandoEdit, setGuardandoEdit] = useState(false);

    // --- Cargar usuarios (SELECT) ---
    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const lista = await usuarioController.obtenerUsuarios();
            setUsuarios(lista);
        } catch (err) {
            console.error('Error al cargar:', err?.message || err);
            setError('Error al cargar usuarios.');
            Alert.alert('Error', 'No se pudo cargar la lista de usuarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Crear usuario (INSERT) ---
    const handleCrearUsuario = async () => {
        if (nombre.trim() === '') {
            setError('El nombre no puede estar vacío.');
            return;
        }

        setGuardando(true);
        setError('');
        try {
            const usuarioCreado = await usuarioController.crearUsuario(nombre);
            setNombre('');
            Alert.alert(
                'Usuario Creado',
                `"${usuarioCreado.nombre}" guardado con ID: ${usuarioCreado.id}`
            );
            // No llamamos a cargarUsuarios() manualmente: observer lo hará
        } catch (err) {
            console.error('Error al guardar:', err?.message || err);
            setError(err?.message || 'Error al guardar el usuario.');
            Alert.alert('Error', err?.message || 'Error al guardar el usuario.');
        } finally {
            setGuardando(false);
        }
    };

    // --- ELIMINAR 1 USUARIO ---
    const handleDelete = (id) => {
        Alert.alert(
            'Confirmar',
            '¿Deseas eliminar este usuario?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await usuarioController.eliminarUsuario(id);
                            // notifyListeners actualizará la lista
                        } catch (err) {
                            console.error('Error al eliminar:', err?.message || err);
                            Alert.alert('Error', err?.message || 'No se pudo eliminar.');
                        }
                    }
                }
            ]
        );
    };

    // --- ELIMINAR TODOS ---
    const handleDeleteAll = () => {
        Alert.alert(
            'Confirmar',
            '¿Eliminar TODOS los usuarios?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar Todo',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await usuarioController.eliminarTodos();
                        } catch (err) {
                            console.error('Error al eliminar todo:', err?.message || err);
                            Alert.alert('Error', err?.message || 'No se pudo eliminar todo.');
                        }
                    }
                }
            ]
        );
    };

    // --- ABRIR MODAL DE EDICIÓN ---
    const handleOpenEdit = (usuario) => {
        setEditingUser(usuario);
        setEditName(usuario.nombre);
        setEditModalVisible(true);
    };

    // --- GUARDAR CAMBIOS (UPDATE) ---
    const handleSaveEdit = async () => {
        if (!editingUser) return;
        if (!editName || editName.trim() === '') {
            Alert.alert('Validación', 'El nombre no puede estar vacío.');
            return;
        }

        setGuardandoEdit(true);
        try {
            await usuarioController.actualizarUsuario(editingUser.id, editName.trim());
            setEditModalVisible(false);
            setEditingUser(null);
            setEditName('');
            Alert.alert('Actualizado', 'Usuario actualizado correctamente.');
            // notifyListeners actualizará la lista
        } catch (err) {
            console.error('Error al actualizar:', err?.message || err);
            Alert.alert('Error', err?.message || 'No se pudo actualizar.');
        } finally {
            setGuardandoEdit(false);
        }
    };

    // --- Observer + Inicialización ---
    useEffect(() => {
        const observerCallback = () => {
            console.log('NOTIFICACIÓN: recargando lista desde observer.');
            cargarUsuarios();
        };

        const initializeApp = async () => {
            try {
                await usuarioController.initialize();
                await cargarUsuarios();
                usuarioController.addListener(observerCallback);
            } catch (initError) {
                console.error('Error de inicialización:', initError);
                setError('Error grave de inicialización de la base de datos.');
            }
        };

        initializeApp();

        return () => {
            usuarioController.removeListener(observerCallback);
        };
    }, [cargarUsuarios]);

    // --- RENDER ITEM con botones EDIT y DELETE ---
    const renderUserItem = ({ item, index }) => (
        <View style={styles.userItem}>
            <View style={styles.userNumber}>
                <Text style={styles.userNumberText}>{index + 1}</Text>
            </View>

            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.nombre}</Text>
                <Text style={styles.userId}>ID: {item.id}</Text>
                <Text style={styles.userDate}>
                    Creado: {new Date(item.fechaCreacion).toLocaleString()}
                </Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.updateButton]}
                    onPress={() => handleOpenEdit(item)}
                >
                    <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                >
                    <Text style={styles.actionButtonText}>Borrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <Text style={styles.title}>INSERT & SELECT</Text>
            <Text style={styles.subtitle}>
                {Platform.OS === 'web' ? ' WEB (LocalStorage)' : ` ${Platform.OS.toUpperCase()} (SQLite)`}
            </Text>

            {/* Error */}
            {error ? <Text style={[styles.errorText, { marginBottom: 15 }]}>{error}</Text> : null}

            {/* Insert section */}
            <View style={styles.insertSection}>
                <Text style={styles.sectionTitle}>Insertar Usuario</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Escribe el nombre del usuario"
                    value={nombre}
                    onChangeText={setNombre}
                    editable={!guardando}
                />

                <TouchableOpacity
                    style={[styles.button, (guardando || nombre.trim().length === 0) && styles.buttonDisabled]}
                    onPress={handleCrearUsuario}
                    disabled={guardando || nombre.trim().length === 0}
                >
                    <Text style={styles.buttonText}>
                        {guardando ? ' Guardando...' : 'Agregar Usuario'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Select / list */}
            <View style={styles.selectSection}>
                <View style={styles.selectHeader}>
                    <Text style={styles.sectionTitle}>Lista de Usuarios</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={cargarUsuarios}
                            disabled={loading}
                        >
                            <Text style={styles.refreshText}>
                                {loading && usuarios.length > 0 ? 'Cargando...' : 'Recargar'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteAllButton}
                            onPress={handleDeleteAll}
                        >
                            <Text style={styles.deleteAllText}>Eliminar Todo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {loading && usuarios.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        <Text style={styles.loadingText}>Cargando usuarios...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={usuarios}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderUserItem}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}> No hay usuarios</Text>
                                <Text style={styles.emptySubtext}>Agrega el primero arriba</Text>
                            </View>
                        }
                        contentContainerStyle={usuarios.length === 0 && styles.emptyList}
                    />
                )}
            </View>

            {/* EDIT MODAL */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => {
                    if (!guardandoEdit) {
                        setEditModalVisible(false);
                        setEditingUser(null);
                        setEditName('');
                    }
                }}
            >
                <KeyboardAvoidingView
                    style={styles.modalWrapper}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Editar Usuario</Text>

                            <TextInput
                                style={styles.input}
                                value={editName}
                                onChangeText={setEditName}
                                editable={!guardandoEdit}
                                placeholder="Nuevo nombre"
                            />

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={[styles.button, { flex: 1, marginRight: 8 }]}
                                    onPress={() => {
                                        setEditModalVisible(false);
                                        setEditingUser(null);
                                        setEditName('');
                                    }}
                                    disabled={guardandoEdit}
                                >
                                    <Text style={styles.buttonText}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, (guardandoEdit) && styles.buttonDisabled, { flex: 1 }]}
                                    onPress={handleSaveEdit}
                                    disabled={guardandoEdit}
                                >
                                    <Text style={styles.buttonText}>
                                        {guardandoEdit ? 'Guardando...' : 'Guardar'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    insertSection: {
        backgroundColor: '#fff',
        padding: 20,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectSection: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 12,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    selectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    refreshButton: {
        padding: 8,
    },
    refreshText: {
        color: '#007AFF',
        fontSize: 14,
    },
    deleteAllButton: {
        marginLeft: 12,
    },
    deleteAllText: {
        color: 'red',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },
    // Lista
    userItem: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        alignItems: 'center',
    },
    userNumber: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userNumberText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    userId: {
        fontSize: 12,
        color: '#007AFF',
        marginBottom: 2,
    },
    userDate: {
        fontSize: 12,
        color: '#666',
    },
    actionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginBottom: 5,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    updateButton: {
        backgroundColor: '#FF9500',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyList: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
    },
    mvcInfo: {
        backgroundColor: '#e3f2fd',
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    mvcTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 8,
    },
    mvcText: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontWeight: '600',
    },

    /* Modal styles */
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
    },
});

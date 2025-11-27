import { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { UsuarioController } from '../src/controllers/UsuarioController';

// Instancia única del controlador
const usuarioController = new UsuarioController();

export default function UpdateUsuarioScreen() {

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    // --- Cargar lista de usuarios ---
    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const lista = await usuarioController.obtenerUsuarios();
            setUsuarios(lista);

            // Si no hay usuario seleccionado, selecciona el primero
            if (lista.length > 0 && !usuarioSeleccionado) {
                setUsuarioSeleccionado(lista[0].id);
                setNuevoNombre(lista[0].nombre);
            }

        } catch (err) {
            console.error("Error al cargar:", err.message);
            setError("No se pudo cargar la lista.");
        } finally {
            setLoading(false);
        }
    }, [usuarioSeleccionado]);

    // --- Cambiar usuario seleccionado ---
    const manejarSeleccionUsuario = (id) => {
        setUsuarioSeleccionado(id);

        const user = usuarios.find(u => u.id === id);
        if (user) {
            setNuevoNombre(user.nombre);
        }
    };

    // --- Actualizar usuario ---
    const handleActualizar = async () => {

        if (!usuarioSeleccionado) {
            Alert.alert("Error", "Selecciona un usuario.");
            return;
        }

        if (nuevoNombre.trim() === '') {
            Alert.alert("Validación", "El nombre no puede estar vacío.");
            return;
        }

        setGuardando(true);

        try {
            await usuarioController.actualizarUsuario(usuarioSeleccionado, nuevoNombre);
            Alert.alert("Éxito", "Usuario actualizado correctamente.");
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setGuardando(false);
        }
    };

    // --- Observer + inicialización ---
    useEffect(() => {

        const observerCallback = () => {
            cargarUsuarios();
        };

        const initApp = async () => {
            try {
                await usuarioController.initialize();
                cargarUsuarios();
                usuarioController.addListener(observerCallback);
            } catch (err) {
                setError("Error al inicializar la base de datos.");
            }
        };

        initApp();

        return () => usuarioController.removeListener(observerCallback);

    }, [cargarUsuarios]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actualizar Usuario</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={{ color: '#777' }}>Cargando usuarios...</Text>
                </View>
            ) : usuarios.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay usuarios para actualizar.</Text>
                </View>
            ) : (
                <>
                    {/* Selector de usuarios */}
                    <Text style={styles.label}>Selecciona un usuario:</Text>

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={usuarioSeleccionado}
                            onValueChange={manejarSeleccionUsuario}
                            style={styles.picker}
                        >
                            {usuarios.map(u => (
                                <Picker.Item 
                                    label={`${u.nombre} (ID: ${u.id})`} 
                                    value={u.id} 
                                    key={u.id} 
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Input del nuevo nombre */}
                    <Text style={styles.label}>Nuevo nombre:</Text>
                    <TextInput
                        style={styles.input}
                        value={nuevoNombre}
                        onChangeText={setNuevoNombre}
                        editable={!guardando}
                    />

                    {/* Botón Actualizar */}
                    <TouchableOpacity
                        style={[styles.button, guardando && styles.buttonDisabled]}
                        onPress={handleActualizar}
                        disabled={guardando}
                    >
                        <Text style={styles.buttonText}>
                            {guardando ? "Actualizando..." : "Guardar Cambios"}
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#777',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
});

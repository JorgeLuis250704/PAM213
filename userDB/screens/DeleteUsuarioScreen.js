import { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from 'react-native';

import { UsuarioController } from '../src/controllers/UsuarioController';

// Instancia única del controlador
const usuarioController = new UsuarioController();

export default function DeleteUsuarioScreen() {

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- CARGAR USUARIOS ---
    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const lista = await usuarioController.obtenerUsuarios();
            setUsuarios(lista);
        } catch (err) {
            console.error("Error al cargar usuarios:", err.message);
            setError("No se pudo obtener la lista.");
        } finally {
            setLoading(false);
        }
    }, []);

    // --- ELIMINAR USUARIO ---
    const handleEliminar = (id, nombre) => {

        Alert.alert(
            "Confirmar eliminación",
            `¿Seguro que deseas eliminar a "${nombre}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Eliminar",
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await usuarioController.eliminarUsuario(id);
                        } catch (err) {
                            Alert.alert("Error", "No se pudo eliminar.");
                        }
                    } 
                }
            ]
        );
    };

    // --- OBSERVER + INITIALIZE ---
    useEffect(() => {

        const observerCallback = () => {
            cargarUsuarios();
        };

        const initializeApp = async () => {
            try {
                await usuarioController.initialize();
                cargarUsuarios();
                usuarioController.addListener(observerCallback);
            } catch (err) {
                setError("Error al inicializar base de datos.");
            }
        };

        initializeApp();

        return () => usuarioController.removeListener(observerCallback);

    }, [cargarUsuarios]);

    // --- RENDER ITEM ---
    const renderItem = ({ item }) => (
        <View style={styles.userItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.nombre}</Text>
                <Text style={styles.userId}>ID: {item.id}</Text>
            </View>

            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleEliminar(item.id, item.nombre)}
            >
                <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Eliminar Usuarios</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ff4444" />
                    <Text style={{ color: '#666' }}>Cargando...</Text>
                </View>
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay usuarios</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#fafafa'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        elevation: 2
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333'
    },
    userId: {
        fontSize: 12,
        color: '#888'
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#777'
    }
});

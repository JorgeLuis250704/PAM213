import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Importa el controlador
// CORRECCIÓN DE RUTA APLICADA: Asume que 'controllers' está al mismo nivel que 'App.js'
import { UsuarioController } from './controllers/UsuarioController'; 

// Crea una instancia única del controlador
const usuarioController = new UsuarioController();

// Componente para renderizar cada usuario en la lista (basado en el diseño deseado)
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
    </View>
);

export default function App() {
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState('');
    const [loading, setLoading] = useState(true); // Para la carga inicial/recarga
    const [guardando, setGuardando] = useState(false); // Para el botón de inserción
    const [error, setError] = useState('');

    // --- Funciones del Controlador ---

    // Función de recarga de datos (SELECT)
    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // El controlador invoca el servicio de consulta (SELECT)
            const lista = await usuarioController.obtenerUsuarios(); 
            setUsuarios(lista);
        } catch (err) {
            console.error("Error al cargar:", err.message);
            setError("Error al cargar usuarios.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Función de inserción de datos (INSERT)
    const handleCrearUsuario = async () => {
        if (nombre.trim() === '') {
            setError("El nombre no puede estar vacío.");
            return;
        }

        setGuardando(true);
        setError('');
        try {
            // 1. Llama al controlador para crear el usuario y CAPTURA el objeto devuelto.
            // El controlador valida, inserta y notifica a los observadores.
            const usuarioCreado = await usuarioController.crearUsuario(nombre); 
            
            setNombre(''); 
            
            // 2. Muestra la alerta de éxito al usuario (responsabilidad de la Vista).
            Alert.alert(
                "Usuario Creado",
                `"${usuarioCreado.nombre}" guardado con ID: ${usuarioCreado.id}`
            );

            // La lista se actualiza automáticamente debido a la notificación del Observer.
        } catch (err) {
            console.error("Error al guardar:", err.message);
            // Muestra el error de validación del modelo
            setError(err.message); 
            Alert.alert("Error", err.message);
        } finally {
            setGuardando(false);
        }
    };

    // --- Inicialización y Observador (Patrón Observer) ---

    useEffect(() => {
        // Callback del Observador: se ejecuta cuando el controlador notifica un cambio
        const observerCallback = () => {
            console.log("NOTIFICACIÓN RECIBIDA: El controlador forzará la recarga de la lista.");
            cargarUsuarios(); 
        };

        const initializeApp = async () => {
            try {
                // 1. Inicializa la BD (crea tablas, etc.)
                await usuarioController.initialize();
                
                // 2. Carga la lista inicial
                cargarUsuarios(); 
                
                // 3. Se suscribe al controlador para recibir notificaciones
                usuarioController.addListener(observerCallback);

            } catch (initError) {
                console.error("Error de inicialización:", initError);
                setError("Error grave de inicialización de la base de datos.");
            }
        };

        initializeApp();

        // 4. Función de cleanup (Desuscripción)
        return () => {
            usuarioController.removeListener(observerCallback);
        };
    }, [cargarUsuarios]);

    // --- Renderizado de la Pantalla ---

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            {/* Zona del encabezado */}
            <Text style={styles.title}>INSERT & SELECT</Text>
            <Text style={styles.subtitle}>
                {Platform.OS === 'web' ? ' WEB (LocalStorage)' : ` ${Platform.OS.toUpperCase()} (SQLite)`}
            </Text>

            {/* Mensaje de Error */}
            {error ? <Text style={[styles.errorText, { marginBottom: 15 }]}>{error}</Text> : null}

            {/* Zona del INSERT */}
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
                    disabled={guardando || nombre.trim().length === 0} >

                    <Text style={styles.buttonText}>
                        {guardando ? ' Guardando...' : 'Agregar Usuario'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Zona del SELECT */}
            <View style={styles.selectSection}>
                <View style={styles.selectHeader}>
                    <Text style={styles.sectionTitle}>Lista de Usuarios</Text>
                    
                    {/* Botón de recarga manual */}
                    <TouchableOpacity 
                        style={styles.refreshButton}
                        onPress={cargarUsuarios}
                        disabled={loading} >
                        <Text style={styles.refreshText}>{loading && usuarios.length > 0 ? 'Cargando...' : 'Recargar'}</Text>
                    </TouchableOpacity>

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
    // Estilos para la lista (Diseño de la imagen)
    userItem: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
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
});
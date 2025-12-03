import { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Platform 
} from 'react-native';
import { UsuarioController } from '../src/controllers/UsuarioController'; 

const usuarioController = new UsuarioController();

const renderUserItem = ({ item, index }) => (
    <View style={styles.userItem}>
        <View style={styles.userNumber}>
            <Text style={styles.userNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.nombre}</Text>
            <Text>ID: {item.id}</Text>
            <Text>Monto: {item.monto}</Text>
            <Text>Categoria: {item.categoria}</Text>
            <Text>Creado: {new Date(item.fechaCreacion).toLocaleString()}</Text>
        </View>
    </View>
);

export default function InsertUsuarioScreen() {
    const [usuarios, setUsuarios] = useState([]);
    const [nombre, setNombre] = useState('');
    const [monto, setMonto] = useState('');
    const [categoria, setCategoria] = useState('');
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const lista = await usuarioController.obtenerUsuarios();
            setUsuarios(lista);
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios.");
            Alert.alert("Error", "No se pudo cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCrearUsuario = async () => {
        if (!nombre.trim() || !monto.trim() || !categoria.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        setGuardando(true);
        setError('');
        try {
            await usuarioController.crearUsuario(nombre, monto, categoria);
            setNombre('');
            setMonto('');
            setCategoria('');
        } catch (err) {
            console.error(err);
            Alert.alert("Error de validación", err.message);
        } finally {
            setGuardando(false);
        }
    };

    useEffect(() => {
        const observerCallback = () => cargarUsuarios();

        const initializeApp = async () => {
            try {
                await usuarioController.initialize();
                cargarUsuarios();
                usuarioController.addListener(observerCallback);
            } catch (initError) {
                console.error(initError);
                setError("Error de inicialización de la base de datos.");
            }
        };
        initializeApp();

        return () => usuarioController.removeListener(observerCallback);
    }, [cargarUsuarios]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Insertar Usuario</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                editable={!guardando}
            />
            <TextInput
                style={styles.input}
                placeholder="Monto"
                value={monto}
                onChangeText={setMonto}
                editable={!guardando}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={categoria}
                onChangeText={setCategoria}
                editable={!guardando}
            />

            <TouchableOpacity 
                style={[styles.button, guardando && styles.buttonDisabled]} 
                onPress={handleCrearUsuario}
                disabled={guardando || !nombre || !monto || !categoria} >
                <Text style={styles.buttonText}>
                    {guardando ? 'Guardando...' : 'Agregar Usuario'}
                </Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={usuarios}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderUserItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay usuarios</Text>}
                    style={{ marginTop: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fafafa', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
    button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonDisabled: { backgroundColor: '#999' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    userItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
    userNumber: { width: 30, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    userNumberText: { fontWeight: 'bold', color: '#007AFF' },
    userInfo: { flex: 1 },
    userName: { fontWeight: 'bold', fontSize: 16 },
    errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

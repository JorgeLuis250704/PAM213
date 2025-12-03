import { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { UsuarioController } from '../src/controllers/UsuarioController';

const usuarioController = new UsuarioController();

export default function UpdateUsuarioScreen() {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
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
            if (lista.length > 0 && !usuarioSeleccionado) {
                setUsuarioSeleccionado(lista[0].id);
                setNombre(lista[0].nombre);
                setMonto(lista[0].monto);
                setCategoria(lista[0].categoria);
            }
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la lista.");
        } finally {
            setLoading(false);
        }
    }, [usuarioSeleccionado]);

    const manejarSeleccionUsuario = (id) => {
        setUsuarioSeleccionado(id);
        const user = usuarios.find(u => u.id === id);
        if (user) {
            setNombre(user.nombre);
            setMonto(user.monto);
            setCategoria(user.categoria);
        }
    };

    const handleActualizar = async () => {
        if (!usuarioSeleccionado) return Alert.alert("Error", "Selecciona un usuario");
        if (!nombre.trim() || !monto.trim() || !categoria.trim()) {
            return Alert.alert("Validación", "Todos los campos son obligatorios");
        }

        setGuardando(true);
        try {
            await usuarioController.actualizarUsuario(usuarioSeleccionado, nombre, monto, categoria);
            Alert.alert("Éxito", "Usuario actualizado correctamente");
        } catch (err) {
            Alert.alert("Error", err.message);
        } finally {
            setGuardando(false);
        }
    };

    useEffect(() => {
        const observerCallback = () => cargarUsuarios();
        const initApp = async () => {
            try {
                await usuarioController.initialize();
                cargarUsuarios();
                usuarioController.addListener(observerCallback);
            } catch (err) {
                setError("Error al inicializar la BD.");
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
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
            ) : usuarios.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 40 }}>No hay usuarios</Text>
            ) : (
                <>
                    <Text style={styles.label}>Selecciona usuario:</Text>
                    <Picker
                        selectedValue={usuarioSeleccionado}
                        onValueChange={manejarSeleccionUsuario}
                        style={styles.picker}
                    >
                        {usuarios.map(u => (
                            <Picker.Item key={u.id} label={`${u.nombre} (ID:${u.id})`} value={u.id} />
                        ))}
                    </Picker>

                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput style={styles.input} value={nombre} onChangeText={setNombre} editable={!guardando} />

                    <Text style={styles.label}>Monto:</Text>
                    <TextInput style={styles.input} value={monto} onChangeText={setMonto} editable={!guardando} keyboardType="numeric" />

                    <Text style={styles.label}>Categoría:</Text>
                    <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} editable={!guardando} />

                    <TouchableOpacity
                        style={[styles.button, guardando && styles.buttonDisabled]}
                        onPress={handleActualizar}
                        disabled={guardando}
                    >
                        <Text style={styles.buttonText}>{guardando ? "Actualizando..." : "Guardar Cambios"}</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fafafa', paddingTop: 50 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, marginTop: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: '#fff' },
    picker: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff', marginBottom: 12 },
    button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#999' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    error: { color: 'red', textAlign: 'center', marginBottom: 10 },
});

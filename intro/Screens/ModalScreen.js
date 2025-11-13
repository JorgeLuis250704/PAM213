import { Text, StyleSheet, View, TouchableOpacity, Switch, TextInput, Alert, Platform, Modal } from 'react-native'
import React, { useState } from 'react'
// Importamos Modal de 'react-native' en lugar de 'react-native-web'

const ModalScreen = () => {
    // 1. Uso correcto de Hooks (useState)
    const [modalVisible, setModalVisible] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [numfav, setNumFav] = useState('');
    const [gasto, setGasto] = useState(true);

    const botonCerrar = () => {
        setModalVisible(false);
        setDescripcion('');
        setNumFav('');
        setGasto(true);
    };

    const botonGuardar = () => {
        Alert.alert('Guardado', `Descripción: ${descripcion}, Número: ${numfav}, Gasto: ${gasto ? 'Activo' : 'Inactivo'}`);
        botonCerrar(); // Cierra el modal después de guardar
    };

    return (
        // 2. Corregido: Usar 'style' en lugar de 'styles'
        <View style={styles.container}>
            {/* 3. Corregido: Usar 'style' en lugar de 'styles' y <Text> en lugar de <text> */}
            <TouchableOpacity style={styles.botonMostrar} onPress={() => setModalVisible(true)}>
                <Text style={styles.botonMostrarTexto}>Mostrar Modal</Text>
            </TouchableOpacity>

            <Modal 
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={botonCerrar}
            >

                {/* 4. Corregido: Usar <View> en lugar de <view> */}
                <View style={styles.modalContenedor}>
                    <View style={styles.modalVista}>
                        {/* 5. Corregido: Usar <Text> en lugar de <text> */}
                        <Text style={styles.modalTitulo}>Prueba De Modal</Text>

                        {/* 6. Corregido: Usar '.' en lugar de '-' para acceder a estilos */}
                        <TextInput style={styles.modalInput}
                            placeholder='name'
                            placeholderTextColor="#888"
                            value={descripcion} // 7. Corregido: Usar variable de estado, no string
                            onChangeText={setDescripcion}
                        />

                        <TextInput style={styles.modalInput}
                            placeholder='numero'
                            placeholderTextColor="#888"
                            value={numfav} // 7. Corregido: Usar variable de estado, no string
                            keyboardType='numeric'
                            onChangeText={setNumFav}
                        />

                        <View style={styles.switchContenedor}>
                            {/* 8. Corregido: Usar '.' en lugar de '-' y estilo condicional */}
                            <Text style={[styles.switchTexto, !gasto && styles.switchTextoActivoVerde]}>Activo</Text>
                            
                            <Switch 
                                trackColor={{ false: '#DCFCE7', true: '#FEE2E2' }}
                                thumbColor={gasto ? '#EF4444' : '#22C55E'}
                                onValueChange={() => setGasto(!gasto)} // 9. Corregido: onValueChange
                                value={gasto}
                            />
                            
                            {/* 8. Corregido: Estilo condicional */}
                            <Text style={[styles.switchTexto, gasto && styles.switchTextoActivoRojo]}>Inactivo</Text>
                        </View>

                        <View style={styles.modalBotones}>
                            <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={botonCerrar}>
                                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                            </TouchableOpacity>

                            {/* 10. Corregido: Eliminada la View duplicada y botón guardar */}
                            <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={botonGuardar}>
                                <Text style={styles.botonGuardarTexto}>Guardar</Text> 
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ModalScreen;

// 11. Estilos Básicos añadidos para que sea visible
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botonMostrar: {
        backgroundColor: '#6200EE',
        padding: 10,
        borderRadius: 5,
    },
    botonMostrarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    },
    modalVista: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
        width: '80%',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        fontSize: 16,
    },
    switchContenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 15,
    },
    switchTexto: {
        fontSize: 16,
        marginHorizontal: 10,
        color: '#888',
    },
    switchTextoActivoVerde: {
        color: '#22C55E', // Activo cuando el switch está en false
        fontWeight: 'bold',
    },
    switchTextoActivoRojo: {
        color: '#EF4444', // Inactivo cuando el switch está en true
        fontWeight: 'bold',
    },
    modalBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    botonBase: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    botonCancelar: {
        backgroundColor: '#ccc',
    },
    botonGuardar: {
        backgroundColor: '#6200EE',
    },
    botonCancelarTexto: {
        color: '#000',
        fontWeight: 'bold',
    },
    botonGuardarTexto: {
        color: '#FFF',
        fontWeight: 'bold',
    },
});
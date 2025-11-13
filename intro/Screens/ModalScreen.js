import { Text, StyleSheet, View, TouchableOpacity, Switch, TextInput, Alert, Platform, Modal } from 'react-native'
import React, { useState } from 'react'

const ModalScreen = () => {
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
    if (!descripcion || !numFavorito) {
      if (Platform.OS === 'web') {
        alert('Error: Por favor completa todos los campos');
      } else {
        Alert.alert('Error', 'Por favor completa todos los campos');
      }
      return;
    }

    if (Platform.OS === 'web') {
      alert(`Éxito: Prueba Realizada. Nombre: ${descripcion} y Número favorito: ${numFavorito}`);
    } else {
      Alert.alert('Éxito', `Prueba Realizada. Nombre: ${descripcion} y Número favorito: ${numFavorito}`);
      alert('Éxito', `Prueba Realizada. Nombre: ${descripcion} y Número favorito: ${numFavorito}`);
    }

    botonCerrar();
  };

  const botonCerrar = () => {
    setModalVisible(false);
    setDescripcion('');
    setNumFavorito('');
    setGasto(true);
  };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.botonMostrar} onPress={() => setModalVisible(true)}>
                <Text style={styles.botonMostrarTexto}>Mostrar Modal</Text>
            </TouchableOpacity>

            <Modal 
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={botonCerrar}
            >

                <View style={styles.modalContenedor}>
                    <View style={styles.modalVista}>
                        <Text style={styles.modalTitulo}>Prueba De Modal</Text>
                        <TextInput style={styles.modalInput}
                            placeholder='name'
                            placeholderTextColor="#888"
                            value={descripcion} 
                            onChangeText={setDescripcion}
                        />

                        <TextInput style={styles.modalInput}
                            placeholder='numero'
                            placeholderTextColor="#888"
                            value={numfav}
                            keyboardType='numeric'
                            onChangeText={setNumFav}
                        />

                        <View style={styles.switchContenedor}>
                            <Text style={[styles.switchTexto, !gasto && styles.switchTextoActivoVerde]}>Activo</Text>
                            
                            <Switch 
                                trackColor={{ false: '#DCFCE7', true: '#FEE2E2' }}
                                thumbColor={gasto ? '#EF4444' : '#22C55E'}
                                onValueChange={() => setGasto(!gasto)}
                                value={gasto}
                            />
                            <Text style={[styles.switchTexto, gasto && styles.switchTextoActivoRojo]}>Inactivo</Text>
                        </View>

                        <View style={styles.modalBotones}>
                            <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={botonCerrar}>
                                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                            </TouchableOpacity>

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



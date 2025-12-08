import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Alert,
    Platform
} from 'react-native';

export default function GalleryScreen() {
    const { width } = Dimensions.get('window');
    // Ajustar el ancho de cada tarjeta para que quepan 2 con algo de margen
    // (Ancho total - márgenes) / 2
    const cardWidth = (width - 40) / 2;

    // Declaración independiente de cada imagen en el estado
    const [images, setImages] = useState([
        { id: '1', title: 'Imagen 1', source: require('../assets/OIP.jpg') },
        { id: '2', title: 'Imagen 2', source: require('../assets/OIP.jpg') },
        { id: '3', title: 'Imagen 3', source: require('../assets/OIP.jpg') },
        { id: '4', title: 'Imagen 4', source: require('../assets/OIP.jpg') },
        { id: '5', title: 'Imagen 5', source: require('../assets/OIP.jpg') },
        { id: '6', title: 'Imagen 6', source: require('../assets/OIP.jpg') },
    ]);

    const mostrarAlerta = (titulo) => {
        if (Platform.OS === 'web') {
            alert(`Detalles de ${titulo}`);
        } else {
            Alert.alert(
                titulo,
                'Esta es una descripción más detallada de la imagen seleccionada.',
                [{ text: 'Cerrar', style: 'cancel' }]
            );
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <ImageBackground
                source={item.source}
                style={[styles.image, { width: cardWidth, height: 150 }]}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <Text style={styles.desc}>{item.title}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => mostrarAlerta(item.title)}>
                        <Text style={styles.buttonText}>Ver</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={images}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={
                    <Text style={styles.mainTitle}>Galería de Imágenes</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 40,
    },
    listContent: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        paddingBottom: 50,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    mainTitle: {
        color: '#fff',
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    card: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        justifyContent: 'flex-end',
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        alignItems: 'center',
    },
    desc: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#00ADB5',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'center', // Center button since it's alone again? Or keep it as before.
        // Original didn't have alignSelf. Let's stick to original overlay styles
        // Overlay has alignItems: 'center'.
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

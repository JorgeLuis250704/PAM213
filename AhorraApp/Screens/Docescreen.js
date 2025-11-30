import React, { useState } from "react";
import {Alert,View,Text,StyleSheet,TouchableOpacity,Platform, SafeAreaView,StatusBar} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const color = {
  fondoPantalla: "#ecf0f1", 
  fondoTarjeta: "#ffffff",
  verdePrincipal: "#4CAF50", 
  verdeFondoOscuro: "#2f8a4f",
  textoOscuro: "#101010",
  textoClaro: "#ffffff",
  textoSuave: "#666",
  grisIcono: "#dcdcdc",
  botonFiltrarFecha: "#f5e0e0",
  botonFiltrarCategoria: "#e0f5e0",
};

const mostrarAlerta = (mensaje) => {
  const titulo = "Función No Disponible";
  if (Platform.OS === "web") {
    console.log("ALERTA INTENTADA (Web): " + mensaje);
    window.alert(`${titulo}\n${mensaje}`);
  } else {
    Alert.alert(titulo, mensaje);
  }
};
function Encabezado({ titulo, saldo = 9638.35, moneda = "MXN" }) {
  const mostrarNotificacion = () => {
    mostrarAlerta("No tienes nuevas notificaciones.");
  };

  const mostrarConfiguracion = () => {
    mostrarAlerta("Abriendo configuración.");
  };

  return (
    <View style={estilos.encabezado}>
      <StatusBar barStyle="light-content" backgroundColor={color.verdeFondoOscuro} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.saldoTarjeta}>
        
        <TouchableOpacity style={estilos.iconoCasa} onPress={() => mostrarAlerta("Acceso a detalles de la cuenta bancaria.")}>
          <Text>🏦</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={estilos.saldo}>{saldo.toLocaleString("es-MX")}</Text>
          <Text style={estilos.moneda}>{moneda}</Text>
        </View>

        
        <View style={estilos.iconosAccion}>
          
          <TouchableOpacity onPress={mostrarNotificacion}>
            <Ionicons name="notifications-outline"size={22} color={color.textoSuave} style={{ marginRight: 10 }}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={mostrarConfiguracion}>
            <Ionicons name="settings-outline" size={22} color={color.textoSuave} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function Docescreen() {
  
    const [transferencias] = useState([]);
    
    const [feedbackMessage, setFeedbackMessage] = useState(
        "Aquí se mostraría la lista de transferencias filtradas."
    );

    const handleAction = (action) => {
        mostrarAlerta(`Presionaste el botón de acción: ${action}.`);
        setFeedbackMessage(`Acción: ${action} registrada en pantalla.`);
    };

    const handleFilter = (filterType) => {
        mostrarAlerta(`Aplicando filtro: ${filterType}.`);
        setFeedbackMessage(`Filtro aplicado por: ${filterType}. ¡Visualización simulada!`);
    };
    
    const mostrarAlertaInicio = () => {
        mostrarAlerta("Navegando a la pantalla de Inicio/Home.");
        setFeedbackMessage("Navegando a Inicio.");
    };

    const handleNavPress = (iconName) => {
        mostrarAlerta(`Navegando a la sección: ${iconName}.`);
        setFeedbackMessage(`Navegando a: ${iconName}.`);
    };

    return (
        <SafeAreaView style={estilos.safeArea}>
            <Encabezado titulo="Listado de las transferencias" />
            
            <View style={estilos.cuerpo}>
                <View style={estilos.cajaBlanca}>
                    <View style={estilos.filtrosFila}>
                        <TouchableOpacity 
                            style={[estilos.botonFiltro, { backgroundColor: color.botonFiltrarFecha }]} 
                            onPress={() => handleFilter('fecha')}
                        >
                            <Text style={estilos.textoBotonFiltro}>Filtrar por fecha</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[estilos.botonFiltro, { backgroundColor: color.botonFiltrarCategoria }]} 
                            onPress={() => handleFilter('categoría')}
                        >
                            <Text style={estilos.textoBotonFiltro}>Filtrar por categoría</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={estilos.espacioVacio}>
                        <Text style={estilos.textoSuave}>
                            {feedbackMessage}
                        </Text>
                    </View>
                
                </View>
            </View>

            <View style={estilos.barraInferior}>
                
                <TouchableOpacity style={estilos.icono} onPress={() => handleNavPress('Perfil')}>
                    <Ionicons name="person-outline" size={26} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={estilos.icono} onPress={() => handleNavPress('Lista/Configuración')}>
                    <Ionicons name="options-outline" size={26} color="gray" /> 
                </TouchableOpacity>

                <TouchableOpacity style={estilos.botonCentral} onPress={mostrarAlertaInicio}>
                    <Ionicons name="home-outline" size={30} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={estilos.icono} onPress={() => handleNavPress('Estadísticas')}>
                    <Ionicons name="stats-chart-outline" size={26} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={estilos.icono} onPress={() => handleNavPress('Calendario')}>
                    <Ionicons name="calendar-outline" size={26} color="gray" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilos
const estilos = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: color.fondoPantalla },
    encabezado: {
        backgroundColor: color.verdeFondoOscuro,
        paddingTop: 6,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    titulo: { color: "white", fontSize: 16, marginBottom: 8, fontWeight: "600",
        paddingTop: Platform.OS === 'ios' ? 20 : 0, 
    },
    saldoTarjeta: {
        backgroundColor: color.fondoTarjeta,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    iconoCasa: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: color.grisIcono,
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    iconosAccion: { flexDirection: "row", marginLeft: 12 },
    saldo: { fontSize: 28, fontWeight: "800", color: color.textoOscuro },
    moneda: { fontSize: 12, color: color.textoSuave },
    cuerpo: { paddingHorizontal: 16, marginTop: 14, flex: 1 },
    cajaBlanca: {
        flex: 1,
        backgroundColor: color.fondoTarjeta,
        borderRadius: 16,
        padding: 12,
        marginBottom: 70,
    },
    espacioVacio: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: 20, 
    },
    filtrosFila: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 14,
        paddingHorizontal: 0,
    },
    botonFiltro: {
        borderRadius: 20, 
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.0, 
        shadowRadius: 0,
        elevation: 0,
    },
    textoBotonFiltro: {
        fontSize: 14,
        fontWeight: '500',
    },
    barraInferior: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.fondoTarjeta,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        height: 70,
        borderTopWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        zIndex: 10,
    },
    icono: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    botonCentral: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: color.verdePrincipal,
        alignItems: "center",
        justifyContent: "center",
        marginTop: -30, 
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    textoSuave: {
        color: color.textoSuave
    },
});
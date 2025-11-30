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
  // Colores para las graficas
  barraGastos: '#e0b0af',
  barraIngresos: "#98d4b3",
  barraEgresos: "#a7d2e0",
  textoEtiqueta: "#444",
  // Colores para botones de mes
  fondoBotonMes: "#e0e0e0",
  textoBotonMes: "#555",
};

const Barra = ({label, barColor, widthPercentage})=>(
  <View style={estilos.barraItem}>
    <Text style={estilos.etiquetaBarra}>{label}</Text>

    <View style={estilos.barraContainer}>
      <View
        style={[
          estilos.barra,
          {
            backgroundColor: barColor,
            width: `${widthPercentage}%`
          }
        ]}
      />
    </View>
  </View>
);

const mostrarAlerta = (mensaje) => {
  const titulo = "Función No Disponible";
  if (Platform.OS === "web") {
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
  
    const [mesSeleccionado, setMesSeleccionado] = useState('Enero');

    const meses=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ];
    
   const handleMesPress = (mes) =>{
    setMesSeleccionado(mes);
    mostrarAlerta(`Seleccionaste el mes: ${mes}.`);
   };
  
    const mostrarAlertaInicio = () => {
        mostrarAlerta("Navegando a la pantalla de Inicio/Home.");
    };

    const handleNavPress = (iconName) => {
        mostrarAlerta(`Navegando a la sección: ${iconName}.`);
    };

    return (
        <SafeAreaView style={estilos.safeArea}>
            <Encabezado titulo="Graficas" />
            
            <View style={estilos.cuerpo}>
                <View style={estilos.cajaBlanca}>
                    <View style={estilos.graficaContainer}>
                       <Barra label="Gastos" barColor={color.barraGastos} widthPercentage={85}/>
                       <Barra label="Ingresos" barColor={color.barraIngresos} widthPercentage={70}/>
                       <Barra label="Egresos" barColor={color.barraEgresos} widthPercentage={95}/>
                    </View>
                        <View style={estilos.mesesContainer}>
                          {meses.map((mes)=>(
                            <TouchableOpacity
                              key={mes}
                              style={[
                                estilos.botonMes,
                                mesSeleccionado === mes && estilos.botonMesActivo
                              ]}
                              onPress={() => handleMesPress(mes)}
                            >  
                              <Text style={estilos.textoBotonMes}>{mes}</Text>
                            </TouchableOpacity>
                          ))}
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
    cuerpo: { paddingHorizontal: 16, marginTop: 14, flex: 1, paddingVertical: 16 },
    cajaBlanca: {
        flex: 1,
        backgroundColor: color.fondoTarjeta,
        borderRadius: 16,
        padding: 20,
        marginBottom: 70,
        justifyContent:'space-between'
    },
    espacioVacio: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        paddingBottom: 20, 
    },
    graficaContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 30,
    },
    barraItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%'
    },
    etiquetaBarra: {
        fontSize: 14,
        fontWeight: '600',
        color: color.textoEtiqueta,
        width: 70,
        textAlign: 'right',
        marginRight: 10,
        transform: [{rotate: '-90deg'}],
    },
    barraWrapper: {
      height: 35,
      borderRadius: 8,
      overflow: 'hidden',
    },
    barra: {
      height:'100%',
      borderRadius: 8,
    },
    mesesContainer:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 20,
    },
    botonMes:{
      backgroundColor: color.fondoBotonMes,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      margin: 4,
    },
    textoBotonMes: {
      fontSize: 12,
      color: color.textoBotonMes,
      fontWeight: '500',
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
    barraContainer:{
      flex: 1,
      height: 35,
      backgroundColor: '#e9e9e9',
      borderRadius: 8,
      overflow: 'hidden',
    },
});
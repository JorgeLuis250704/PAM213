//zona 1 import: Zona de importaciones
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React,{useState} from 'react';

//zona 2 main: Zona de componentes
export default function App() {

  const [contador,setContador]=useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.texto}> Contador:</Text>
      <Text style={styles.texto2}>{contador} </Text>      {/*soy un comentario shift + alt + A */}
        <View style={styles.botonesContainer}>
          <Button color='red' title="Agregar" onPress={()=>setContador(contador + 1)}/>      {/* <Button/> y <Button></Button> tambien funciona*/}
          <Button color='green' title="Quitar"  onPress={()=>setContador(contador - 1)}/>
          <Button color='grey' title="Reiniciar" onPress={()=>setContador(contador - contador)}/>
      </View>
     <StatusBar style="auto" />
    </View>
  );
}

//Zona 3: Zona de los estilos, o zona de estetica y posicionamiento
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6fc4f5ff', //color de fondo 
    alignItems: 'center',//alinea en eje x
    justifyContent: 'center',//alinea en eje y
  },
  texto:{
    color:"#661d02ff",
    fontSize: 30,
    fontFamily: 'Times New Roman',
    fontWeight:'bold',
    fontStyle:'italic',
    textDecorationLine:'line-through',
  },
  
  texto2:{
    color:"#eefb62ff",
    fontSize: 35,
    fontFamily: 'Courier',
    fontWeight:'900',//que tan gruesa la letra
    fontStyle:'normal',
    textDecorationLine:'underline',
  },
  botonesContainer: {
    marginTop: 15, //margen haia arriba
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    gap:10, //separacion entre botones
  },
});
import { Text, StyleSheet, View, FlatList } from 'react-native';
import { useState } from 'react';

class Producto {
  constructor(id, titulo, descripcion, precio) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
  }
}

export const productos2 = [
  new Producto('1', 'Auriculares inalambricos', 'Experimenta algo sensacional', 99),
  new Producto('2', 'Computadoras', 'Para el trabajo y los videojuegos', 234),
  new Producto('3', 'Auriculares inalambricos', 'Experimenta algo sensacional', 99),
  new Producto('4', 'Computadoras', 'Para el trabajo y los videojuegos', 234),
  new Producto('5', 'Auriculares inalambricos', 'Experimenta algo sensacional', 99),
  new Producto('6', 'Computadoras', 'Para el trabajo y los videojuegos', 234),
  new Producto('7', 'Computadoras', 'Para el trabajo y los videojuegos', 234),
  new Producto('8', 'Auriculares inalambricos', 'Experimenta algo sensacional', 99),
  new Producto('9', 'Computadoras', 'Para el trabajo y los videojuegos', 234),
];

export default function FlatListScreen() {
  const [productList, setProductList] = useState(productos2);

  return (
    <View style={styles.lista}>
      <FlatList
        data={productList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>
            <Text>{item.precio}</Text>
            <Text style={styles.detalles}>Ver detalles</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lista: {
    flex: 1, 
    paddingVertical: 20, 
  },
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f0f0f0',
  },
  detalles: {
    color: 'blue', 
  },
});


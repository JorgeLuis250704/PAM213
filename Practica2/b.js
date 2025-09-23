const productos = [
  { nombre: "Laptop", precio: 12000 },
  { nombre: "Mouse", precio: 250 },
  { nombre: "Teclado", precio: 750 },
  { nombre: "Monitor", precio: 3000 }
];

// Filtra los productos con precio mayor a 1000
const productosFiltrados = productos.filter(producto => producto.precio > 1000);

// Usa .map() para obtener solo los nombres de los productos filtrados
const nombres = productosFiltrados.map(producto => producto.nombre);

// Muestra el resultado
console.log(nombres); // ["Laptop", "Monitor"]
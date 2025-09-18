// 'nombre' se declara con 'let' porque su valor se reasigna más adelante.
let nombre = "Armando";

// 'edad' se declara con 'const' porque su valor no cambia.
const edad = 25;

// Se reasigna el valor de la variable 'nombre'.
nombre = "Ana Maria";

// 'saludo' se declara con 'const'. Se usan plantillas de texto (template literals)
// para una sintaxis más limpia y legible en lugar de la concatenación.
const saludo = `Hola, ${nombre}. Tienes ${edad} años.`;

// Muestra en la consola el contenido de 'saludo' como lo indicaba el comentario.
console.log(saludo);
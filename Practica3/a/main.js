// Importa la función 'restar' desde el módulo utils.js
import { restar } from './utils.js';

// Ejecutar varias pruebas
console.log('Prueba 1: 5 - 3 =', restar(5, 3));      // Esperado: 2
console.log('Prueba 2: 10 - 7 =', restar(10, 7));    // Esperado: 3
console.log('Prueba 3: 0 - 5 =', restar(0, 5));      // Esperado: -5
console.log('Prueba 4: -2 - 8 =', restar(-2, 8));    // Esperado: -10

console.log('Prueba 5: 3.5 - 1.2 =', restar(3.5, 1.2)); // Esperado: 2.3
console.log('Prueba 6: -4 - (-2) =', restar(-4, -2)); // Esperado: -2
console.log('Prueba 7: 1000 - 999 =', restar(1000, 999)); // Esperado: 1
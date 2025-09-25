// Función declarada con const y Arrow Function
const verificarUsuario = (usuario) => {
  return new Promise((resolve, reject) => {
    // Simula una verificación asíncrona
    if (usuario === 'admin') {
      resolve('Acceso concedido'); // Éxito
    } else {
      // Se rechaza si el usuario no es 'admin'
      reject('Acceso denegado'); 
    }
  });
};

console.log('\n--- Prueba de Promesas ---');

// Caso 1: Usuario 'admin' (éxito)
verificarUsuario('admin')
  .then(res => console.log(`Usuario 'admin': ${res}`))
  .catch(err => console.error(`Usuario 'admin': ${err}`));

// Caso 2: Usuario 'Ivan' (error)
verificarUsuario('Ivan')
  .then(res => console.log(`Usuario 'Ivan': ${res}`))
  .catch(err => console.error(`Usuario 'Ivan': ${err}`));
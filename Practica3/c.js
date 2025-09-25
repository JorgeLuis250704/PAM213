// Función que retorna una Promesa que resuelve en 3 segundos
const simularPeticionAPI = () => {
  return new Promise((resolve) => {
    // Usa setTimeout para simular el retraso de una API
    setTimeout(() => {
      resolve('Datos recibidos correctamente después de 3000 ms.');
    }, 3000);
  });
};

// Función asíncrona declarada con 'const async'
const obtenerDatos = async () => {
  console.log('Iniciando la obtención de datos (espera 3 segundos)...');

  try {
    // 'await' pausa la ejecución hasta que simularPeticionAPI se resuelva
    const resultado = await simularPeticionAPI();
    
    console.log('Resultado (usando await):');
    console.log(resultado); // Imprime el resultado
    
  } catch (error) {
    // En caso de que la Promesa se rechace (aunque aquí siempre resuelve)
    console.error('Ocurrió un error:', error);
  }
};

console.log('\n--- Prueba de Async/Await ---');

// Llama a la función y ejecuta el código no bloqueante
obtenerDatos();
console.log('*** Este mensaje aparece inmediatamente (código no bloqueante). ***');
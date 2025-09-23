const personas = [
  { nombre: "Ana", edad: 22 },
  { nombre: "Luis", edad: 35 },
  { nombre: "María", edad: 28 }
];

// 1. Usa .find() para buscar a la persona con nombre "Luis"
const luis = personas.find(persona => persona.nombre === "Luis");
console.log(luis); // { nombre: "Luis", edad: 35 }

// 2. Usa .forEach() para imprimir el nombre y edad de cada persona
personas.forEach(persona => {
  console.log(`${persona.nombre} tiene ${persona.edad} años.`);
});

// 3. Usa .reduce() para sumar todas las edades
const edadTotal = personas.reduce((acumulador, persona) => {
  return acumulador + persona.edad;
}, 0);
console.log(`La suma de todas las edades es: ${edadTotal}`); // La suma de todas las edades es: 85
// Utilidades: delays y selección aleatoria
// Retarda ejecución en milisegundos(Delay)
export function sleep(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retorna elemento aleatorio del arreglo
export function chooseRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

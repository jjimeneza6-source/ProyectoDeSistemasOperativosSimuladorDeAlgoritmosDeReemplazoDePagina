// Representa una página con bits R/M y contador
// Genera bit aleatorio (0 o 1)
function randomBit() {
  return Math.random() < 0.5 ? 0 : 1;
}

// Genera contador envejecimiento 0-255
function randomAgingCounter() {
  return Math.floor(Math.random() * 256);
}

export default class Pagina {
  // Crea página con bits y contadores
  constructor(id, bitR = randomBit(), bitM = randomBit(), loadTime = Date.now(), agingCounter = randomAgingCounter()) {
    this.id = id;
    this.bitR = bitR;
    this.bitM = bitM;
    this.loadTime = loadTime;
    this.agingCounter = agingCounter;
  }
}

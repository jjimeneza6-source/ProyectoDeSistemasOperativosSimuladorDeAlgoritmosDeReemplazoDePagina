// Algoritmo del reloj con puntero circular
import { sleep } from './util.js';

export default class ClockSimulator {
  // Inicializa algoritmo con delay configurable
  constructor(delay = 520) {
    this.delay = delay;
  }

  // Rota aguja hasta encontrar página sin bit R
  async seleccionarVictima(ram, onStep) {
    const total = ram.marcos.length;
    let pasos = 0;

    while (pasos < total * 4) {
      const index = ram.clockPointer;
      const marco = ram.marcos[index];

      if (!marco.pagina) {
        ram.clockPointer = (ram.clockPointer + 1) % total;
        pasos += 1;
        continue;
      }

      await onStep({ index, message: `Aguja apunta al marco ${index}` });
      await sleep(this.delay);

      if (marco.pagina.bitR === 1) {
        marco.pagina.bitR = 0;
        await onStep({ index, message: `Bit R=1 en marco ${index}, limpiar y seguir` });
        ram.clockPointer = (ram.clockPointer + 1) % total;
      } else {
        const victima = index;
        ram.clockPointer = (ram.clockPointer + 1) % total;
        await onStep({ index, message: `Victima encontrada en marco ${victima}` });
        return victima;
      }

      pasos += 1;
    }

    return ram.clockPointer;
  }
}

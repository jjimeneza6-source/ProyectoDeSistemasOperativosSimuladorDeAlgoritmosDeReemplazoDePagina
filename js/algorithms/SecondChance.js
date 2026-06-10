// Segunda oportunidad basada en bit R
import { sleep } from './util.js';

export default class SecondChanceSimulator {
  // Inicializa algoritmo con delay configurable
  constructor(delay = 520) {
    this.delay = delay;
  }

  // Otorga segunda oportunidad si bit R es 1
  async seleccionarVictima(ram, onStep) {
    const cola = ram.obtenerMarcosOrdenadosPorCarga().filter((marco) => marco.pagina);

    while (cola.length > 0) {
      const marco = cola.shift();
      await onStep({ index: marco.index, message: `Inspeccionando marco ${marco.index}` });
      await sleep(this.delay);

      if (marco.pagina.bitR === 1) {
        marco.pagina.bitR = 0;
        marco.pagina.loadTime = Date.now();
        cola.push(marco);
        await onStep({ index: marco.index, message: `Segunda oportunidad: marco ${marco.index} reingresa al final` });
      } else {
        return marco.index;
      }
    }

    return 0;
  }
}

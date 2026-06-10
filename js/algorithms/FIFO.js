// First In First Out por tiempo de carga
import { sleep } from './util.js';

export default class FIFOSimulator {
  // Inicializa algoritmo con delay configurable
  constructor(delay = 520) {
    this.delay = delay;
  }

  // Elige página con tiempo de carga más antiguo
  async seleccionarVictima(ram, onStep) {
    const orden = ram.obtenerMarcosOrdenadosPorCarga();
    let victima = null;

    for (const marco of orden) {
      if (!marco.pagina) {
        continue;
      }
      await onStep({ index: marco.index, message: `Evaluando marco ${marco.index} con carga ${marco.pagina.loadTime}` });
      await sleep(this.delay);
      if (!victima || marco.pagina.loadTime < victima.pagina.loadTime) {
        victima = marco;
      }
    }

    return victima.index;
  }
}

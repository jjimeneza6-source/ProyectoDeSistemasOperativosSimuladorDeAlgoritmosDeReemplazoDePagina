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
      await onStep({ index: marco.index, message: `Evaluando marco ${marco.index} con tiempo de carga ${new Date(marco.pagina.loadTime).toLocaleTimeString()}` });
      await sleep(this.delay);
      if (!victima || marco.pagina.loadTime < victima.pagina.loadTime) {
        victima = marco;
      }
    }

    if (!victima) {
      return { index: 0, reason: 'No se encontró ninguna página cargada en RAM para reemplazar.' };
    }

    return {
      index: victima.index,
      reason: `Se expulsa la página ${victima.pagina.id} porque es la que más tiempo lleva en RAM.`,
    };
  }
}

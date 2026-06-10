// Algoritmo de envejecimiento con contadores de 8 bits
import { sleep } from './util.js';

export default class AgingSimulator {
  // Envejece contadores y limpia bits R
  aplicarTick(ram) {
    for (const marco of ram.marcos) {
      if (!marco.pagina) {
        continue;
      }
      const pagina = marco.pagina;
      pagina.agingCounter = (pagina.agingCounter >>> 1) | (pagina.bitR ? 0b10000000 : 0);
      pagina.bitR = 0;
    }
  }

  // Elige página con contador envejecimiento más bajo
  async seleccionarVictima(ram, onStep) {
    let victima = null;
    for (const marco of ram.marcos) {
      if (!marco.pagina) {
        continue;
      }
      await onStep({ index: marco.index, message: `Revisando contador ${marco.pagina.agingCounter} en marco ${marco.index}` });
      await sleep(this.delay);
      if (
        !victima ||
        marco.pagina.agingCounter < victima.pagina.agingCounter ||
        (marco.pagina.agingCounter === victima.pagina.agingCounter && marco.pagina.id < victima.pagina.id)
      ) {
        victima = marco;
      }
    }
    return {
      index: victima?.index ?? 0,
      reason: victima
        ? `Se expulsa la página ${victima.pagina.id} por tener el menor contador de envejecimiento (${victima.pagina.agingCounter}).`
        : 'No se encontró ninguna página cargada en RAM para reemplazar.',
    };
  }
}

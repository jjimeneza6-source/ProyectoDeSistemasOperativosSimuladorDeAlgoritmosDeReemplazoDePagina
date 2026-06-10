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
        await onStep({ index: marco.index, message: `Segunda oportunidad: marco ${marco.index} se reubica al final de la cola y su bit R se limpia.` });
      } else {
        return {
          index: marco.index,
          reason: `Se expulsa la página ${marco.pagina.id} porque su bit R es 0 después de aplicar segunda oportunidad.`,
        };
      }
    }

    return { index: 0, reason: 'No se encontró ninguna página válida para reemplazar.' };
  }
}

// Not Recently Used basado en bits R/M
import { sleep, chooseRandom } from './util.js';

export default class NRUSimulator {
  // Inicializa algoritmo con delay configurable
  constructor(delay = 520) {
    this.delay = delay;
  }

  // Clasifica páginas por bits R/M y elige aleatoria cualquiera de la clase más baja para salir 
  async seleccionarVictima(ram, onStep) {
    const tiposDeClasesDelALgoritmo = [[], [], [], []]; // 0: R=0 M=0, 1: R=0 M=1, 2: R=1 M=0, 3: R=1 M=1
    for (const marcoActual of ram.marcos) {
      if (!marcoActual.pagina) { // Sin página, no se considera
        continue;
      }
      const indiceClaseDePertenecenciaMarco = marcoActual.pagina.bitR * 2 + marcoActual.pagina.bitM; // Si R=0 y M=0, clase=0; R=0 M=1, clase=1; R=1 M=0, clase=2; R=1 M=1, clase=3. (0*2 + 0 = 0); (0*2 + 1 = 1) ..
      tiposDeClasesDelALgoritmo[indiceClaseDePertenecenciaMarco].push(marcoActual.index);
      await onStep({ index: marcoActual.index, message: `Evaluando marco ${marcoActual.index}: clase ${indiceClaseDePertenecenciaMarco}` });
      await sleep(this.delay);
    }

    const claseElegida = tiposDeClasesDelALgoritmo.findIndex((lista) => lista.length > 0);
    if (claseElegida === -1) {
      return { index: 0, reason: 'No se encontró ninguna página cargada en RAM para reemplazar.' };
    }
    const victima = chooseRandom(tiposDeClasesDelALgoritmo[claseElegida]);
    await onStep({ index: victima, message: `Seleccionada víctima del marco ${victima} dentro de la clase ${claseElegida}` });
    return {
      index: victima,
      reason: `Se expulsa la página del marco ${victima} porque pertenece a la clase ${claseElegida}, la clase de menor prioridad disponible en NRU.`,
    };
  }
}

// Gestiona 8 marcos y generación de páginas
import Pagina from './Pagina.js';
import Marco from './Marco.js';

function getRandomId(existingIds = []) {
  let id;
  do {
    id = Math.floor(Math.random() * 90) + 10;
  } while (existingIds.includes(id));
  return id;
}

export default class RAM {
  // Crea 8 marcos vacíos con puntero Clock
  constructor() {
    this.marcos = Array.from({ length: 8 }, (_, index) => new Marco(index));
    this.clockPointer = 0;
  }

  // Llena todos los marcos con páginas aleatorias y tiempos de carga distintos
  inicializarConPaginas() {
    const ids = [];
    const now = Date.now();
    const offsets = Array.from({ length: this.marcos.length }, (_, i) => i * 1000 + Math.floor(Math.random() * 1000));
    offsets.sort((a, b) => a - b);

    this.marcos.forEach((marco, index) => {
      const id = getRandomId(ids);
      ids.push(id);
      const loadTime = now - offsets[index];
      marco.pagina = new Pagina(id, undefined, undefined, loadTime, undefined);
    });
  }

  // Retorna IDs de páginas actualmente en RAM
  obtenerIdsEnRAM() {
    return this.marcos.filter((marco) => marco.pagina).map((marco) => marco.pagina.id);
  }

  // Genera página nueva con ID único
  generarPaginaEntrante(excludedId) {
    const existingIds = this.obtenerIdsEnRAM();
    const prohibited = new Set(existingIds);
    if (typeof excludedId === 'number') {
      prohibited.add(excludedId);
    }

    let id;
    do {
      id = getRandomId([]);
    } while (prohibited.has(id));

    return new Pagina(id);
  }

  // Reemplaza página en marco indicado
  reemplazarMarco(index, nuevaPagina) {
    if (!this.marcos[index]) {
      throw new Error('Marco inválido');
    }
    this.marcos[index].pagina = nuevaPagina;
  }

  // Ordena marcos por antigüedad de carga
  obtenerMarcosOrdenadosPorCarga() {
    return this.marcos.slice().sort((a, b) => (a.pagina?.loadTime ?? Infinity) - (b.pagina?.loadTime ?? Infinity));
  }
}

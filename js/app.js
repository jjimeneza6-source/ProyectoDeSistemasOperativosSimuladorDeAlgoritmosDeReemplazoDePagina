// Controlador principal de la aplicación
import RAM from './entities/RAM.js';
import Marco from './entities/Marco.js';
import NRUSimulator from './algorithms/NRU.js';
import FIFOSimulator from './algorithms/FIFO.js';
import SecondChanceSimulator from './algorithms/SecondChance.js';
import ClockSimulator from './algorithms/Clock.js';
import AgingSimulator from './algorithms/Aging.js';
import ConsoleLogger from './ui/ConsoleLogger.js';
import Dashboard from './ui/Dashboard.js';

const algorithmMap = {
  nru: NRUSimulator,
  fifo: FIFOSimulator,
  second_chance: SecondChanceSimulator,
  clock: ClockSimulator,
  aging: AgingSimulator,
};

export function createApp(algorithmName) {
  // Inicializa app con algoritmo seleccionado
  const AlgorithmClass = algorithmMap[algoKey];
  const ram = new RAM();
  ram.inicializarConPaginas();
  const incomingPage = { current: ram.generarPaginaEntrante() };
  const logger = new ConsoleLogger(document.getElementById('log-console'));
  const dashboard = new Dashboard(algoKey, logger);
  const algorithm = new AlgorithmClass();
  const agingSimulator = algoKey === 'aging' ? new AgingSimulator() : null;

  logger.log('Inicializando simulador con algoritmo ' + algoKey.toUpperCase());
  dashboard.renderRAM(ram, incomingPage.current);
  dashboard.updateButtons({ simulate: true, next: false });

  const simulateBtn = document.getElementById('simulate-btn');
  const nextBtn = document.getElementById('next-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const reorganizeBtn = document.getElementById('reorganize-btn');
  const tickBtn = document.getElementById('tick-btn');
  let lastVictimId = null;

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      logger.clear();
      logger.log('Logs limpiados.');
    });
  }

  if (reorganizeBtn) {
    reorganizeBtn.addEventListener('click', () => {
      // Crear nueva RAM
      ram.marcos = Array.from({ length: 8 }, (_, index) => {
        return new Marco(index);
      });
      ram.inicializarConPaginas();
      ram.clockPointer = 0;
      
      // Generar nueva página entrante
      incomingPage.current = ram.generarPaginaEntrante();
      lastVictimId = null;
      
      // Limpiar logs y renderizar
      logger.clear();
      logger.log('RAM reorganizada aleatoriamente. Nueva simulación lista.');
      dashboard.renderRAM(ram, incomingPage.current);
      dashboard.updateButtons({ simulate: true, next: false });
      dashboard.hideModal();
    });
  }

  if (tickBtn && agingSimulator) {
    tickBtn.addEventListener('click', () => {
      agingSimulator.aplicarTick(ram);
      logger.log('Interrupción de reloj aplicada. Contadores envejecidos.');
      dashboard.renderRAM(ram, incomingPage.current);
    });
  }

  async function runSimulation() {
    dashboard.updateButtons({ simulate: false, next: false });
    dashboard.clearHighlights();
    logger.log('Iniciando análisis de reemplazo.');

    const victimIndex = await algorithm.seleccionarVictima(ram, async ({ index, message }) => {
      dashboard.highlightFrame(index, 'evaluating');
      logger.log(message);
    });

    const victimPage = ram.marcos[victimIndex].pagina;
    lastVictimId = victimPage?.id ?? null;
    dashboard.highlightFrame(victimIndex, 'victim');
    logger.log(`Página víctima: ${victimPage.id} en marco ${victimIndex}`);

    ram.reemplazarMarco(victimIndex, incomingPage.current);
    dashboard.renderRAM(ram, incomingPage.current);
    dashboard.highlightFrame(victimIndex, 'loaded');

    const details = `
      <p>Se expulsó la página <strong>${victimPage.id}</strong> del marco <strong>${victimIndex}</strong>.</p>
      <p>Se cargó la nueva página <strong>${incomingPage.current.id}</strong> con R:${incomingPage.current.bitR} y M:${incomingPage.current.bitM}.</p>
      <p>Pasos registrados en la consola lateral.</p>
    `;

    dashboard.showModal({
      title: 'Simulación Finalizada: Página Reemplazada',
      details,
      actionText: 'Siguiente Simulación (Preservar RAM)',
    });
    dashboard.updateButtons({ simulate: false, next: true });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => runSimulation());
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      incomingPage.current = ram.generarPaginaEntrante(lastVictimId);
      dashboard.renderRAM(ram, incomingPage.current);
      dashboard.updateButtons({ simulate: true, next: false });
      dashboard.hideModal();
      logger.log('Avanzando a la siguiente simulación con la RAM preservada.');
    });
  }
}

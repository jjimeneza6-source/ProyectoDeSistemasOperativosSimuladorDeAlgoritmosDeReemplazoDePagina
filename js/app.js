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
  const AlgorithmClass = algorithmMap[algorithmName];
  const ram = new RAM();
  ram.inicializarConPaginas();
  const incomingPage = { current: ram.generarPaginaEntrante() };
  const logger = new ConsoleLogger(document.getElementById('log-console'));
  const dashboard = new Dashboard(algorithmName, logger);
  const algorithm = new AlgorithmClass();
  const agingSimulator = algorithmName === 'aging' ? new AgingSimulator() : null;

  logger.log('Inicializando simulador con algoritmo ' + algorithmName.toUpperCase());
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
      dashboard.hideResult();
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
    dashboard.hideResult();
    logger.log('Iniciando análisis de reemplazo.');

    const selection = await algorithm.seleccionarVictima(ram, async ({ index, message }) => {
      dashboard.highlightFrame(index, 'evaluating');
      logger.log(message);
    });

    const victimIndex = selection.index;
    const victimReason = selection.reason || 'Se seleccionó la página víctima según la política del algoritmo.';
    const victimPage = ram.marcos[victimIndex].pagina;
    lastVictimId = victimPage?.id ?? null;
    dashboard.highlightFrame(victimIndex, 'victim');
    logger.log(`Página víctima: ${victimPage.id} en marco ${victimIndex}`);
    logger.log(victimReason);

    ram.reemplazarMarco(victimIndex, incomingPage.current);
    dashboard.renderRAM(ram, incomingPage.current);
    dashboard.highlightFrame(victimIndex, 'loaded');

    const details = `
      <p>${victimReason}</p>
      <p>Se expulsó la página <strong>${victimPage.id}</strong> del marco <strong>${victimIndex}</strong>.</p>
      <p>Se cargó la nueva página <strong>${incomingPage.current.id}</strong>.</p>
      <p>Revisa el proceso completo en la consola de logs.</p>
    `;

    dashboard.showResult('Simulación Finalizada: Página Reemplazada', details);
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
      dashboard.hideResult();
      logger.log('Avanzando a la siguiente simulación con la RAM preservada.');
    });
  }
}

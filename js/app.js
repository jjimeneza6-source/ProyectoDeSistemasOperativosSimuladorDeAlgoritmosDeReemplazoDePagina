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
  const commitBtn = document.getElementById('commit-btn');
  const clearLogsBtn = document.getElementById('clear-logs-btn');
  const reorganizeBtn = document.getElementById('reorganize-btn');
  const tickBtn = document.getElementById('tick-btn');
  let lastVictimId = null;
  let activeSelection = null;
  let simulationRunning = false;

  function setButtonStates({ simulate = true, commit = false, next = false, clearLogs = true }) {
    if (simulateBtn) simulateBtn.disabled = !simulate;
    if (commitBtn) commitBtn.disabled = !commit;
    if (nextBtn) nextBtn.disabled = !next;
    if (clearLogsBtn) clearLogsBtn.disabled = !clearLogs;
  }

  setButtonStates({ simulate: true, commit: false, next: false, clearLogs: true });

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      if (simulationRunning) {
        return;
      }
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
      activeSelection = null;
      simulationRunning = false;
      
      // Limpiar logs y renderizar
      logger.clear();
      logger.log('RAM reorganizada aleatoriamente. Nueva simulación lista.');
      dashboard.renderRAM(ram, incomingPage.current);
      setButtonStates({ simulate: true, commit: false, next: false, clearLogs: true });
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
    simulationRunning = true;
    activeSelection = null;
    dashboard.clearHighlights();
    dashboard.hideResult();
    logger.clear();
    logger.log('Iniciando análisis de reemplazo.');
    setButtonStates({ simulate: false, commit: false, next: false, clearLogs: false });

    const selection = await algorithm.seleccionarVictima(ram, async ({ index, message }) => {
      dashboard.renderRAM(ram, incomingPage.current);
      dashboard.highlightFrame(index, 'evaluating');
      logger.log(message);
    });

    const victimIndex = selection.index;
    const victimReason = selection.reason || 'Se seleccionó la página víctima según la política del algoritmo.';
    const victimPage = ram.marcos[victimIndex].pagina;
    lastVictimId = victimPage?.id ?? null;
    activeSelection = { victimIndex, victimPage, reason: victimReason };

    dashboard.highlightFrame(victimIndex, 'victim');
    logger.log(`Página víctima: ${victimPage.id} en marco ${victimIndex}`);
    logger.log(victimReason);

    const details = `
      <p>${victimReason}</p>
      <p>La página saliente tenía R:${victimPage.bitR}, M:${victimPage.bitM} y tiempo de carga ${new Date(victimPage.loadTime).toLocaleTimeString()}.</p>
      <p>Presiona <strong>Finalizar Reemplazo</strong> para confirmar la expulsión y cargar la nueva página <strong>${incomingPage.current.id}</strong>.</p>
    `;

    dashboard.showResult('Página lista para reemplazar', details);
    setButtonStates({ simulate: false, commit: true, next: false, clearLogs: false });
  }

  async function finishReplacement() {
    if (!activeSelection) return;

    const { victimIndex, victimPage } = activeSelection;
    ram.reemplazarMarco(victimIndex, incomingPage.current);
    dashboard.renderRAM(ram, incomingPage.current);
    dashboard.highlightFrame(victimIndex, 'loaded');

    logger.log(`Reemplazo confirmado: página ${victimPage.id} expulsada del marco ${victimIndex}.`);
    logger.log(`Se cargó la nueva página ${incomingPage.current.id} con R:${incomingPage.current.bitR} y M:${incomingPage.current.bitM}.`);

    const details = `
      <p>La página <strong>${victimPage.id}</strong> fue expulsada del marco <strong>${victimIndex}</strong>.</p>
      <p>Se cargó la nueva página <strong>${incomingPage.current.id}</strong> con R:${incomingPage.current.bitR} y M:${incomingPage.current.bitM}.</p>
      <p>La simulación ha finalizado. Presiona "Siguiente Simulación" para continuar.</p>
    `;

    dashboard.showResult('Reemplazo completado', details);
    activeSelection = null;
    simulationRunning = false;
    setButtonStates({ simulate: false, commit: false, next: true, clearLogs: true });
  }

  if (simulateBtn) {
    simulateBtn.addEventListener('click', () => runSimulation());
  }

  if (commitBtn) {
    commitBtn.addEventListener('click', () => finishReplacement());
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeSelection = null;
      simulationRunning = false;
      logger.clear();
      incomingPage.current = ram.generarPaginaEntrante(lastVictimId);
      dashboard.renderRAM(ram, incomingPage.current);
      dashboard.hideResult();
      setButtonStates({ simulate: true, commit: false, next: false, clearLogs: true });
      logger.log('Nueva simulación lista con la RAM preservada.');
    });
  }
}

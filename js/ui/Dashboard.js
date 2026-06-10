// Renderiza interfaz y controla animaciones
export default class Dashboard {
  // Inicializa referencias a elementos DOM
  constructor(algorithmName, logger) {
    this.algorithmName = algorithmName;
    this.logger = logger;
    this.ramGrid = document.getElementById('ram-grid');
    this.clockRing = document.getElementById('clock-ring');
    this.incomingLabel = document.getElementById('incoming-label');
    this.nextButton = document.getElementById('next-btn');
    this.simulateButton = document.getElementById('simulate-btn');
    this.modal = document.getElementById('result-modal');
    this.modalTitle = document.getElementById('result-modal-title');
    this.modalDetails = document.getElementById('result-modal-details');
    this.modalAction = document.getElementById('modal-close-btn');
    this.clockPointer = document.getElementById('clock-pointer');
    this.isClock = algorithmName === 'clock';

    this.modalAction.addEventListener('click', () => this.hideModal());
  }

  // Dibuja interfaz según algoritmo (grid/círculo)
  renderRAM(ram, incomingPage) {
    if (this.isClock) {
      this.renderClockLayout(ram);
      this.positionClockFrames();
    } else {
      this.renderGridLayout(ram);
    }

    this.setIncoming(incomingPage);
  }

  // Dibuja marcos en disposición de grilla
  renderGridLayout(ram) {
    if (!this.ramGrid) return;
    this.ramGrid.innerHTML = ram.marcos
      .map((marco) => {
        const pagina = marco.pagina;
        return `
          <article class="frame-card" data-frame-index="${marco.index}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <h3>Marco ${marco.index}</h3>
              <span class="frame-badge">${pagina ? `Página ${pagina.id}` : 'Vacío'}</span>
            </div>
            ${pagina ? `
              <div class="status-line">
                <span class="status-pill R">R:${pagina.bitR}</span>
                <span class="status-pill M">M:${pagina.bitM}</span>
                <span class="status-pill">Carga:${new Date(pagina.loadTime).toLocaleTimeString()}</span>
                <span class="status-pill">Aging:${pagina.agingCounter}</span>
              </div>
            ` : '<p class="info-box">Marco sin página asignada.</p>'}
          </article>`;
      })
      .join('');
  }

  // Dibuja marcos en disposición circular
  renderClockLayout(ram) {
    if (!this.clockRing) return;
    this.clockRing.innerHTML = '';
    const ring = document.createElement('div');
    ring.className = 'clock-container';
    const inner = document.createElement('div');
    inner.className = 'clock-ring';

    ram.marcos.forEach((marco) => {
      const card = document.createElement('article');
      card.className = 'clock-frame';
      card.dataset.frameIndex = String(marco.index);
      card.innerHTML = `
        <h3>Marco ${marco.index}</h3>
        <span class="frame-badge">${marco.pagina ? `Página ${marco.pagina.id}` : 'Vacío'}</span>
        ${marco.pagina ? `
          <div class="status-line">
            <span class="status-pill R">R:${marco.pagina.bitR}</span>
            <span class="status-pill M">M:${marco.pagina.bitM}</span>
            <span class="status-pill">Aging:${marco.pagina.agingCounter}</span>
          </div>
        ` : '<p class="info-box">Vacío</p>'}
      `;
      inner.appendChild(card);
    });

    const pointer = document.createElement('div');
    pointer.className = 'clock-pointer';
    pointer.id = 'clock-pointer';
    const center = document.createElement('div');
    center.className = 'clock-center';

    inner.appendChild(pointer);
    inner.appendChild(center);
    ring.appendChild(inner);
    this.clockRing.appendChild(ring);
  }

  // Posiciona marcos en círculo usando trigonometría
  positionClockFrames() {
    const frameElements = this.clockRing.querySelectorAll('.clock-frame');
    const radius = 35;
    const centerX = 50;
    const centerY = 50;
    const total = frameElements.length;

    frameElements.forEach((frame, index) => {
      const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      frame.style.left = `${x}%`;
      frame.style.top = `${y}%`;
    });
  }

  // Muestra página entrante con bits
  setIncoming(incomingPage) {
    if (!this.incomingLabel || !incomingPage) return;
    this.incomingLabel.innerHTML = `Página entrante: <strong>${incomingPage.id}</strong> (R:${incomingPage.bitR} M:${incomingPage.bitM})`;
  }

  // Resalta marco y rotación reloj si aplica
  highlightFrame(index, state) {
    this.clearHighlights();
    const frame = document.querySelector(`[data-frame-index="${index}"]`);
    if (!frame) return;
    frame.classList.add(state);
    if (this.isClock && this.clockPointer) {
      const total = document.querySelectorAll('.clock-frame').length;
      const angle = (index / total) * 360 - 90;
      this.clockPointer.style.transform = `rotate(${angle}deg)`;
    }
  }

  // Elimina resaltes de todos los marcos
  clearHighlights() {
    document.querySelectorAll('.frame-card, .clock-frame').forEach((frame) => {
      frame.classList.remove('evaluating', 'victim', 'loaded');
    });
  }

  // Habilita o deshabilita botones de control
  updateButtons({ simulate = true, next = false }) {
    if (this.simulateButton) this.simulateButton.disabled = !simulate;
    if (this.nextButton) this.nextButton.disabled = !next;
  }

  // Muestra modal con resultados de reemplazo
  showModal({ title, details, actionText }) {
    if (!this.modal) return;
    this.modalTitle.textContent = title;
    this.modalDetails.innerHTML = details;
    this.modalAction.textContent = actionText;
    this.modal.classList.add('active');
  }

  // Oculta modal de resultados
  hideModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }
}

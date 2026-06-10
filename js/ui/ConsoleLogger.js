// Sistema de logs con timestamps
export default class ConsoleLogger {
  // Vincula contenedor DOM para logs
  constructor(container) {
    this.container = container;
  }

  // Añade mensaje con timestamp al log
  log(message) {
    const entry = document.createElement('p');
    entry.className = 'log-line';
    entry.innerHTML = `<strong>${new Date().toLocaleTimeString()}</strong> — ${message}`;
    this.container.prepend(entry);
  }

  // Limpia todos los logs
  clear() {
    this.container.innerHTML = '';
  }
}

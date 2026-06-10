// Representa un marco físico de RAM
export default class Marco {
  // Inicializa marco con índice y página
  constructor(index, pagina = null) {
    this.index = index;
    this.pagina = pagina;
  }
}

# Simulador Visual de Reemplazo de Páginas

Un simulador interactivo y educativo de algoritmos de reemplazo de páginas en memoria virtual, desarrollado como proyecto de Sistemas Operativos.

## 🎯 Descripción General

Este proyecto implementa una plataforma visual que simula el comportamiento de cinco algoritmos clásicos de reemplazo de páginas en sistemas operativos:

- **NRU (Not Recently Used)** - Clasifica páginas en clases según bits de referencia y modificación
- **FIFO (First In First Out)** - Reemplaza la página cargada más antiguamente
- **Clock (Reloj)** - Utiliza un puntero circular para evaluar páginas de forma cíclica
- **Segunda Oportunidad** - Otorga segunda oportunidad a páginas frecuentemente referenciadas
- **Aging (Envejecimiento)** - Utiliza contadores de 8 bits desplazables para priorizar páginas

## 🌟 Características

### Visualización Interactiva
- **Representación visual de marcos de RAM** con estados dinámicos
- **Animaciones paso a paso** que muestran la evaluación de cada página
- **Consola de logs en tiempo real** que registra cada decisión del algoritmo
- **Modo circular especial para Clock** que simula el puntero rotativo
- **Interfaz completamente responsiva** que se adapta a cualquier dispositivo

### Funcionalidades
- ✅ Simulación paso a paso controlada por el usuario
- ✅ Preservación de estado de RAM entre simulaciones
- ✅ Botón para reorganizar RAM aleatoriamente
- ✅ Limpieza de logs
- ✅ Modal informativo con detalles de cada reemplazo
- ✅ Responsive design (mobile, tablet, desktop)

### Persistencia de Estado
- La RAM mantiene su estado después de cada simulación
- Las páginas nuevas siempre son diferentes a las existentes
- Se muestra información detallada de cada página (ID, bits R/M, tiempo de carga, contador de envejecimiento)

## 🏗️ Arquitectura

### Estructura de Carpetas
```
Proyecto de SO/
├── index.html              # Página de inicio
├── README.md              # Este archivo
├── Specification Document # Documento de especificación
├── css/
│   ├── main.css           # Estilos principales (responsivos)
│   └── clock.css          # Estilos específicos para Clock
├── js/
│   ├── app.js             # Controlador principal
│   ├── algorithms/        # Implementación de algoritmos
│   │   ├── NRU.js
│   │   ├── FIFO.js
│   │   ├── Clock.js
│   │   ├── SecondChance.js
│   │   ├── Aging.js
│   │   └── util.js
│   ├── entities/          # Modelos de datos
│   │   ├── RAM.js
│   │   ├── Marco.js
│   │   └── Pagina.js
│   └── ui/                # Componentes de interfaz
│       ├── Dashboard.js   # Renderizado visual
│       └── ConsoleLogger.js # Sistema de logs
└── views/                 # Páginas de simulación
    ├── nru.html
    ├── fifo.html
    ├── clock.html
    ├── second_chance.html
    └── aging.html
```

### Módulos Principales

#### **app.js** - Orquestación
Controlador central que:
- Inicializa la RAM y los algoritmos
- Gestiona eventos de botones
- Orquesta la ejecución de simulaciones
- Maneja la preservación y reorganización de estado

#### **Entidades de Datos**
- `RAM.js`: Gestiona marcos y generación de páginas
- `Marco.js`: Representa un marco individual
- `Pagina.js`: Representa una página con bits R/M y contador de envejecimiento

#### **Algoritmos**
Cada algoritmo implementa la interfaz `seleccionarVictima(ram, onStep)`:
- Retorna el índice del marco víctima
- Ejecuta callback `onStep` para cada paso del algoritmo
- Simula delays para visualización

#### **UI**
- `Dashboard.js`: Renderiza marcos, maneja highlights, muestra modales
- `ConsoleLogger.js`: Sistema de logs con append y clear

## 🎮 Cómo Usar

### Acceso
1. Abre `index.html` en un navegador web
2. Selecciona el algoritmo que deseas simular

### Uso de Simulaciones
1. **Ejecutar Paso a Paso** - Comienza a analizar y seleccionar una víctima
2. **Siguiente Simulación** - Genera una nueva página entrante manteniendo la RAM
3. **Reorganizar RAM** - Crea una nueva configuración aleatoria de marcos y páginas
4. **Limpiar Logs** - Vacía la consola de mensajes
5. *(Solo Aging)* **Simular Interrupción de Reloj** - Aplica el tick del reloj del sistema

### Información Mostrada

**Para cada página:**
- **ID**: Identificador único de la página
- **R (Referenced)**: Bit de referencia (1 = fue accedida recientemente)
- **M (Modified)**: Bit de modificación (1 = fue escrita)
- **Carga**: Timestamp de cuándo se cargó en RAM
- **Aging**: Contador de 8 bits (solo visible en Aging)

## 🎨 Diseño Responsivo

La interfaz se adapta automáticamente a diferentes tamaños de pantalla:

| Dispositivo | Comportamiento |
|---|---|
| **Desktop** (>1024px) | Layout de 2 columnas (RAM + Logs lado a lado) |
| **Tablet** (768-1024px) | Layout de 1 columna, botones compactos |
| **Mobile** (480-768px) | Grid de marcos reducido, navegación simplificada |
| **Pequeño** (<480px) | Botones en columna, máximo uso de viewport |

**Técnicas utilizadas:**
- `clamp()` para ajustes fluidos de tamaños
- `grid` adaptativo con `auto-fit`
- Media queries en breakpoints clave
- Padding y espaciado escalable

## 🔧 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño responsivo con clamp(), media queries, gradientes
- **JavaScript (ES6+)** - Módulos, Async/Await, Destructuring
- **Arquitectura modular** - Separación de responsabilidades

## 📊 Implementación de Algoritmos

### NRU (Not Recently Used)
Clasifica páginas en 4 clases según bits R y M:
- **Clase 0**: R=0, M=0 (No referenciada, no modificada) ← Mejor candidata
- **Clase 1**: R=0, M=1 (No referenciada, modificada)
- **Clase 2**: R=1, M=0 (Referenciada, no modificada)
- **Clase 3**: R=1, M=1 (Referenciada, modificada) ← Peor candidata

Selecciona aleatoriamente de la clase de menor número disponible.

### FIFO (First In First Out)
Mantiene orden de carga de páginas. La página cargada más antiguamente es víctima.
- Ordena marcos por `loadTime`
- Selecciona la más antigua
- Simple pero puede reemplazar páginas muy usadas

### Clock (Reloj)
Utiliza un puntero circular que rota a través de marcos:
1. Si bit R=1, lo limpia a 0 y avanza
2. Si bit R=0, es víctima
3. El puntero sigue rotando indefinidamente

Mejor que FIFO porque considera frecuencia de uso reciente.

### Segunda Oportunidad
Similar a Clock, pero usa cola FIFO:
1. Examina primer marco de cola
2. Si R=1, lo limpia, reactualiza `loadTime` y reinserta al final
3. Si R=0, es víctima

Proporciona segunda oportunidad a páginas activas.

### Aging (Envejecimiento)
Cada interrupción de reloj (tick) desplaza contadores de envejecimiento:
```
Inicio:        R=1, Counter=00000000 (0)
Después tick:  R=0, Counter=10000000 (128)
Después tick:  R=0, Counter=01000000 (64)
...
```
Selecciona la página con menor contador (considera historial completo).

## 📝 Cambios Recientes

### Versión 1.4 - Interfaz Responsiva ⭐ NUEVO
- ✅ Media queries completas para todos los breakpoints
- ✅ Uso de `clamp()` para escalado fluido de componentes
- ✅ Grid de marcos adaptativo (`auto-fit`)
- ✅ Console de logs responsivo
- ✅ Botones y texto escalan automáticamente
- ✅ Testeado en móvil, tablet y desktop

### Versión 1.3 - Reorganización y Mejoras
- ✅ Botón "Reorganizar RAM" en todas las simulaciones
- ✅ Mejora visual de Clock (sin sobreposiciones)
- ✅ Marcos circulares distribuidos equitativamente

### Versión 1.2 - Sistema de Logs
- ✅ Botón para limpiar logs
- ✅ Console con altura fija y scroll vertical
- ✅ Logging completo de cada paso del algoritmo

### Versión 1.1 - Completitud de Algoritmos
- ✅ FIFO completamente funcional
- ✅ Clock con puntero rotativo
- ✅ Segunda Oportunidad con cola
- ✅ Aging con contador de 8 bits

### Versión 1.0 - Base
- ✅ Implementación inicial de NRU
- ✅ Estructura modular
- ✅ Visualización básica
- ✅ Sistema de estado

## 🎓 Propósito Educativo

Este proyecto fue creado como material didáctico para:
- Comprender el funcionamiento de algoritmos de reemplazo de páginas
- Visualizar decisiones de planificación de memoria
- Experimentar interactivamente con diferentes estrategias
- Comparar eficiencia relativa entre algoritmos
- Aprender arquitectura modular en JavaScript

## 📋 Especificación Técnica

Para detalles profundos de implementación, consulta `Specification Document (English).md`

## 🚀 Posibles Mejoras Futuras

- Estadísticas de hit/miss rate
- Comparación lado a lado de múltiples algoritmos
- Generador de cargas de trabajo personalizables
- Exportación de resultados
- Tema claro/oscuro
- Internacionalización (español/inglés)
- Gráficas de rendimiento

## 🐛 Notas de Desarrollo

- Los algoritmos no manipulan el DOM directamente
- El estado de RAM se preserva entre simulaciones
- Cada página tiene ID único garantizado
- Los marcos se renderizaban con superposición en Clock (SOLUCIONADO en v1.3)

---

**Última actualización:** Junio 2026  
**Versión:** 1.4

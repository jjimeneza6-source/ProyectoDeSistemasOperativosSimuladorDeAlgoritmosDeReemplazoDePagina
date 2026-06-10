# **Software Requirement Specification (SRS) for AI Agent**

## **Project: Page Replacement Algorithms Simulator (Virtual Memory \- Tanenbaum)**

This document contains the engineering guidelines, academic business logic, interface requirements, and folder structure needed to implement the **Visual Page Replacement Simulator** in a robust manner that is strictly faithful to Andrew S. Tanenbaum's literature (*Modern Operating Systems*).

## **⚠️ CRITICAL MANDATE: APPLICATION LANGUAGE**

* **IMPORTANT:** Although this technical specification is written in English to optimize AI token/credit usage, **the final web application must be built entirely in SPANISH**.  
* All user interface text, labels, button actions, descriptive modals, log messages printed in the console, and even code comments **must be written in Spanish** to accommodate a target audience with low English proficiency.

## **1\. Definition of Work and Interaction**

The primary goal is to build an interactive web application that graphically simulates the behavior of 5 page replacement algorithms when a **page fault** occurs.

### **User Experience (UX) Flow**

1. **Welcome Screen (Navigation):**  
   * The user enters a clean, modern dashboard interface.  
   * A menu displays cards describing each algorithm: **NRU, FIFO, Second Chance, Clock, and Aging** (translated to Spanish equivalents in the UI: *NRU, FIFO, Segunda Oportunidad, Reloj, e Envejecimiento*).  
   * Clicking on an algorithm triggers a dynamic view change or redirection to the specific simulation screen for that algorithm.  
2. **Simulation Screen (The Simulator):**  
   * **Initialization:** Upon loading, the RAM (represented by a fixed set of **8 physical frames**) automatically initializes with virtual pages containing randomized IDs, Reference (![][image1]) bits, Modification (![][image2]) bits, or binary counters.  
   * **Incoming Page:** The system generates a single virtual page currently outside the RAM (e.g., ID 99\) that will deliberately cause the page fault.  
   * **Step Execution (Step-by-Step or Automatic Button):** The user triggers the visual traversal of the selected algorithm through the RAM frames.  
   * **Animation and Highlighting:**  
     * Each frame evaluated in real-time lights up in a transition color (**Yellow/Blue for evaluation**).  
     * The algorithm makes a decision based on its specific academic logic.  
     * The page chosen to be evicted (the victim) blinks in **Red**, and the search loop/animation halts immediately.  
   * **Simulation End and Results:**  
     * The moment the victim page is found and processed, the simulation **must pause instantly**.  
     * An elegant modal or results panel pops up displaying **detailed replacement metrics** (Evicted Page ID, Loaded Page ID, reasoning based on the algorithm, and evaluated steps) written in clear Spanish.  
     * Execution controls are disabled, and the user is presented with a prominent **"Next Simulation (Keep RAM State)"** button (in Spanish: *"Siguiente Simulación (Mantener RAM)"*).  
   * **Simulation Chaining (State Persistence):**  
     * When clicking "Next Simulation", the system **retains the exact state of the RAM frames** as they were left after the last replacement (preserving page IDs, updated ![][image1] and ![][image2] bits, load times, and aging counters).  
     * The system generates **only a new incoming page** (with a random ID that is neither currently in the RAM nor equal to the previously evicted page's ID) to simulate the next sequential page fault.  
   * **Console Logs:** A terminal-like side panel prints a detailed log of every logical check performed by the algorithm (in Spanish).

## **2\. Technologies to Use (Lightweight & Portable)**

To ensure **universal accessibility**, immediate performance, and to avoid heavy framework overhead (such as React, Angular, or Vue) which limits portability, only native standard web technologies must be used:

* **HTML5:** Semantic UI layout for multi-page routing or a Single Page Application (SPA) driven by state transitions.  
* **Tailwind CSS (or pure CSS3 with Flexbox/Grid):** For a premium "Admin Dashboard" look (dark mode, sans-serif typography, rounded corners, and depth through subtle shadows).  
* **Vanilla JavaScript (ES6+):** Pure Object-Oriented Programming (OOP) to model entities and the simulation loop. Mandatory use of async/await and Promise wrappers to delay execution by configurable milliseconds, allowing step-by-step animations.  
* **External Icon Libraries (Optional):** Lucide Icons or FontAwesome loaded via CDN for polished UI visuals.

## **3\. System Architecture & Software Engineering**

### **File Decoupling Mandate (Crucial)**

**Each class, entity, interface, algorithm script, or controller must reside strictly within its own independent physical file**, adhering to the directory structure defined in Section 6\. Consolidating the application into a single, monolithic JavaScript file is strictly prohibited. This ensures clean modularity, making algorithms easy to test and scale.

### **Suggested Class Structure (OOP)**

#### **A. Class Pagina (File: js/entities/Pagina.js)**

* **Properties:**  
  * id: Unique integer representing the virtual page on disk.  
  * bitR: Integer (0 or 1). Reference bit.  
  * bitM: Integer (0 o 1). Modification ("dirty") bit.  
  * loadTime: Timestamp (long integer). Records the exact load time for chronological algorithms.  
  * agingCounter: Integer (8-bit representation / 0 to 255). Shift register for the Aging algorithm.

#### **B. Class Marco (File: js/entities/Marco.js)**

* **Properties:**  
  * index: Index of the physical frame in RAM (0 to 7).  
  * pagina: Reference to a Pagina object (or null if empty).

#### **C. Class RAM (File: js/entities/RAM.js)**

* **Properties:**  
  * marcos: Static array of 8 Marco objects.  
* **Methods:**  
  * inicializarConPaginas(): Generates random Pagina instances to populate all 8 frames.  
  * obtenerIdsEnRAM(): Returns a clean array of current IDs to prevent duplicates when spawning incoming pages.

#### **D. Algorithm Classes (Strategy Pattern \- Independent files in js/algorithms/)**

Each algorithm must be implemented as an isolated class or asynchronous module to preserve the Open/Closed Principle (OCP):

* NRUSimulator (js/algorithms/NRU.js): Groups pages into Class 0 through Class 3, then randomly selects a victim from the lowest non-empty priority category.  
* FIFOSimulator (js/algorithms/FIFO.js): Finds the physical frame containing the oldest loadTime value.  
* SecondChanceSimulator (js/algorithms/SecondChance.js): Linearly scans the queue of older pages. If ![][image3], it clears the bit, updates loadTime to the present (sending it to the back), and continues. If ![][image4], it selects it.  
* ClockSimulator (js/algorithms/Clock.js): Maintains a circular hand pointer (clockPointer). If the current frame has ![][image3], it clears ![][image4] and advances. If ![][image4], it halts the hand and triggers replacement at that index.  
* AgingSimulator (js/algorithms/Aging.js): At each clock interrupt, shifts all counters right (agingCounter \>\>\> 1\) and injects the ![][image1] bit on the left (adds 128 if ![][image3]). Selects the page with the lowest decimal counter value. Resolves ties using the lowest page ID.

## **4\. Academic Rules and Tanenbaum Behaviors (Fidelity)**

The AI agent must program the mathematical and conceptual rules exactly as specified in Tanenbaum's book:

### **1\. NRU (Not Recently Used)**

* When a page fault occurs, the system groups the current 8 frames into 4 conceptual lists based on their bits:  
  * **Class 0:** ![][image5] (Lowest priority; prime candidate for eviction).  
  * **Class 1:** ![][image6] (Modified, but not recently referenced).  
  * **Class 2:** ![][image7] (Referenced, but clean).  
  * **Class 3:** ![][image8] (Referenced and modified recently).  
* The algorithm finds the lowest-indexed class (0 to 3\) that contains at least one page and selects an evictee **at random** from that class.

### **2\. FIFO (First-In, First-Out)**

* The system evaluates only the loadTime property of each physical frame.  
* The page with the oldest timestamp (lowest numeric value) is selected. Bits ![][image1] and ![][image2] are completely ignored.

### **3\. Second Chance**

* Implements a queue-based lookup sorted by age.  
* Inspects the oldest page:  
  * If its reference bit ![][image9], the bit is cleared to ![][image10], its loadTime is updated to the current time (sending it to the back of the line), and the algorithm moves on to evaluate the next oldest page.  
  * If its reference bit ![][image11], it is immediately chosen for eviction and the search loop stops.

### **4\. Clock Algorithm**

* The 8 RAM frames are structured logically (and **visually**) as a circular layout (like a clock face, indices 0 to 7).  
* A global state variable tracks the circular pointer (clockPointer).  
* On a page fault, the clock hand sweeps to the frame at clockPointer:  
  * If the page has ![][image9], ![][image1] is set to ![][image10], the pointer advances (clockPointer \= (clockPointer \+ 1\) % 8), and the hand moves to the next frame.  
  * If the page has ![][image11], the pointer halts, that page is marked as the victim, and is replaced. The pointer advances by one position so that the clock hand is positioned ready for the next page fault cycle.

### **5\. Aging Algorithm**

* Each page possesses a software shift register represented as an 8-bit integer (0 to 255).  
* **Clock Interrupt (Tick):** The simulator must provide a manual "Simulate Clock Interrupt" button (or automatic periodic trigger):  
  * Every page's counter shifts 1 bit to the right.  
  * The current reference bit ![][image1] is appended to the most significant bit on the left (equivalent to adding decimal 128 if ![][image3]).  
  * The ![][image1] bit is then cleared to 0\.  
* When a page fault occurs, the simulator scans all frames and chooses the page with the **lowest decimal value** in its aging counter (indicating lack of access over the past 8 clock periods).  
* **Tie Breaking:** If two or more pages share the exact same minimum counter value, the tie must be broken by evicting the page with the **lowest virtual page ID** (Tanenbaum's standard rule).

## **5\. UI/UX and Visual Style Guide**

The visual design should look like a highly professional, dark-themed system administration console.

### **Layout Requirements**

* **Color Scheme:** Premium Dark Mode. Deep slate/blue backgrounds (bg-slate-950 or \#0b0f19), dark card wrappers (bg-slate-900), and subtle borders using \#1e293b.  
* **Visual States for Frames (Reactive CSS Classes):**  
  * **Normal State:** Neutral dark border. Highly readable metrics (Page ID, ![][image1] and ![][image2] bit statuses).  
  * **Evaluation State (Active Search):** The frame currently being inspected by the running algorithm must glow with a **Yellow or Electric Blue** border (border-yellow-500 / border-blue-500).  
  * **Victim State (Evicted):** The selected frame must blink or highlight intensely in **Red** (border-red-500, bg-red-950/20).  
  * **Loaded State (New Page):** The frame receiving the incoming page must glow briefly in **Green** (border-emerald-500, bg-emerald-950/20).  
* **Circular Clock Interface:**  
  * For the Clock algorithm, the RAM container must not be a traditional grid or list. It must render as an **annular ring**.  
  * Use CSS and basic JS trigonometry (sin and cos) or absolute positioning coordinates to distribute the 8 frames in a perfect circle.  
  * An elegant clock hand must sit in the center, rotating dynamically (transform: rotate(deg)) to point directly at the frame currently being evaluated.  
* **Results Modal & "New Simulation" Action:**  
  * A modal with a smooth transition must appear on algorithm completion reading **"Simulación Finalizada: Página Reemplazada"** (or academic equivalent).  
  * Display statistics in Spanish: Página desalojada, Página cargada, Pasos evaluados.  
  * Feature a prominent **"Siguiente Simulación (Mantener Estado de RAM)"** button. Pressing it hides the modal, resets the visual highlights to neutral, and generates a new incoming page ID, but preserves the exact page allocations and state of the RAM frames.

## **6\. Project Folder Structure**

Every module, class, animation, and interaction script must be decoupled according to this directory tree:

simulador-ram/  
│  
├── index.html                 \# Welcome screen (main menu & algorithm selector in Spanish)  
│  
├── css/  
│   ├── main.css               \# Global dashboard styles, variables, and typography  
│   └── clock.css              \# Absolute positioning and rotation styles for the Clock layout  
│  
├── js/  
│   ├── entities/  
│   │   ├── Pagina.js          \# Pagina entity class (R, M, timestamp, aging counter)  
│   │   ├── Marco.js           \# Marco (Frame) entity class  
│   │   └── RAM.js             \# RAM class (handles the vector of 8 physical frames)  
│   │  
│   ├── algorithms/  
│   │   ├── NRU.js             \# Asynchronous simulation module for NRU  
│   │   ├── FIFO.js            \# Asynchronous simulation module for FIFO  
│   │   ├── SecondChance.js    \# Asynchronous simulation module for Second Chance  
│   │   ├── Clock.js           \# Asynchronous simulation module for Clock  
│   │   └── Aging.js           \# Asynchronous simulation module for Aging  
│   │  
│   ├── ui/  
│   │   ├── Dashboard.js       \# Main DOM manager, RAM renderers, and button event listeners (in Spanish)  
│   │   └── ConsoleLogger.js   \# Formatted, color-coded logging utility (generating Spanish logs)  
│   │  
│   └── app.js                 \# App controller. Boots the selected simulation view and logic  
│  
└── views/  
    ├── nru.html               \# UI view for the NRU simulator (Spanish translation)  
    ├── fifo.html              \# UI view for the FIFO simulator (Spanish translation)  
    ├── second\_chance.html     \# UI view for the Second Chance simulator (Spanish translation)  
    ├── clock.html             \# UI view for the Clock simulator (circular layout \- Spanish translation)  
    └── aging.html             \# UI view for the Aging simulator (shift register layout \- Spanish translation)

## **7\. Instructions for AI Agent Implementation**

When implementing this software, you must strictly satisfy the following development checklist:

1. **Absolute Decoupling & Single-Class-Per-File:** Do not let classes inside the algorithms/ directory touch the DOM. Their sole responsibility is to take the current RAM instance, execute their replacement search, and return the chosen victim frame index. Additionally, **never program more than one main class per file**. Each entity listed in Section 6's directory structure must have its own dedicated JS file.  
2. **Zero Browser Alerts (alert()):** Use only custom designed modals inside the dashboard for success notifications or error states so that the simulation flow is never interrupted by intrusive native dialogs.  
3. **Real Step-by-Step Flow with Mandatory Pause:** Traversal loops through the RAM frames must use await sleep(delay) on each iteration, allowing the user to clearly see the active highlight moving through the frames. The exact moment the victim page is identified, the search loop must exit (break/return), the control buttons must lock, and the results modal must trigger.  
4. **RAM Persistence Between Consecutive Runs:** When starting consecutive runs through the results modal, the application **MUST NOT call** ram.inicializarConPaginas(). It must reuse the active RAM instance (retaining the modifications from the previous replacements) and use a helper method to generate a new incoming page ID that does not exist in any currently loaded frame.  
5. **Mandatory Language Constraint (SPANISH):** All presentation text on screens, views, card labels, console outputs, button actions, variables descriptive text, error messages, and in-code comments must be written **entirely in Spanish** (es-ES).

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAABR0lEQVR4XmNgGAUoQF5e3hGInwPxfyT8Coh/AfFfOTm5k0A6GKiUGV0vCgAqmgPEv4EabJCEmYH8NKhBZUA+I5IcAqirq/MCFR0G4ruKioriyHJAMUkgfohNDg6AkppA/BaI1wC5LMhysrKypkDxb0B8VUpKSgRZDg6AivyACv4rKCiko8sBxRpAckBcjC4HB0DJSfJo/jc2NmYFiiVDXVYK4iPrgQNRUVEeoIID8pBQPwZlXwfZCjRwurS0tDC6HhQgj93/jECnV8pDQt8VSTkmgPkfiIuQxYEajYFiX4F4DrI4BpDH4n+oeDTU4FZkcRRAIP5BBoPCoRxZHAUAna8DVPReHjP+WYBiq5ANALKrgWwXmEZbeUjqAjkRhl+BwgNmApAfDMR/QQYBNcYC6dkyMjKcMHmiAMhbQM2+oJggWfMoGPYAAKMeYojE4bMDAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAYAAACzdqxAAAABgUlEQVR4Xu2TP0sDQRDFc5BCQRs1CLlL9mITLEOw8Q9YaBlL/QA21jbRzsZCEMHaUiRNSgURC7+EpWCRYBUEUQtF4++ZPblsJHAWVvfgMXszb2fn3t5lMin+FcaYefgAu5a3+Xx+ytVFKBaLq2g+rFbx2vf9SVf3AwSHsA1bCAO3LqgB9QZ8gk1SWVfTh1wuN4bwNAzDY+ILU1VdDfCob8FdNJ9w2xUMgEYzCE+I63pFYs3VkK/Yxjus39EsupoBFAqFNU1CnGPTqztNEASj1PeIPrULeFcqlabjml+hTUywwoZZ2IH7Tn1Dddv43iTxVxemKTQNPKPkqU7TkKZ1lll7eDJ/2T9iD7kRtc70mtXV3GrrJqm/9tHTtJGHmlA2qKCDzV/8jZ7lL+yQX4YHujjlZRX5lkngb0N2RDn5Z3pfRhNWonxSfxcQnpfL5fFYrkaua+35vkDBvslwf/F1CdGjGli+wU3V2Fil6VX0/5M/gs9xLZpLLJro75oiRYqh+AIQR3fknMUiygAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAaCAYAAAD8K6+QAAAB20lEQVR4Xu2Wu0oDQRiFE4yFoCBqFHObhBRBsJEgNlqIxkKITezESlBrRUVFsPEFbCzME4gPYCkEBLEWKwstFAJqpYUS4jfsBsYxazYL2RTOgcPO/LfZs3PbQMDAwMA3CCGm4TOsKizDT1hJJBLXPAuEdui5foJ3GEulUnO6vSFILMIvhEwq5g76q7bAbfpBxddyJJPJCTku49/ID057R4/5E5lMpofEErznqwypPmzD8KGer9WwheUZex6+Ny2MpBH4As/phlRfPB4fx/4BbyORyIDq8wsIynoSxssvyKnmC63pPmyH0gc3dZ9f8CyMpGOh7a9sNtuJbcWeyS3ZV3P8hCdh4XC4m6RLYZ2CV3b7Ts4ShU6i0Wi/nqMjFov1EXsBH92S+gd6HSd4Eibq768gS3BXWKdhTglvCzwJq+0vuKHaa8VgUbW3A56EiTr7y7Yv2YKPVLsDgnLJCutqcEVWRK9exAlNC2twf0nBri5FebAQNwMX3VLeUXodJzQtjGU4SsKb+H1/hbCdqcJo79OeVWJ8Q00Y3NN9P4CgKWH9TVQVluV+q8XQL8CKFEjhZZ6nnH5dap1Wg1ldZ9wn7T1fYSmdTg/q8a4hlyei8jDntygDAwMDA4P/hm8z5azbtBPEPAAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAaCAYAAAD8K6+QAAACVUlEQVR4Xu2WvWsUQRjG70gEBaOiHiH3NXfHwRGwW2IaU4hJkSIpErtgJWopKCoiAUHyD9gENNiKYi2WgiEkZYogCEKSJhAIqWKhxPP3unPwZm7OrOCuzTzwsDPPvDPzPrvzsblcQEBAZjDGXIU7sK24C7/Dw2q1usZzltA+t28WaDabZ8jhLjm8gPNwyI35I+iwBH8wyBUl91G/bQ0+pJ5XbamjXq8ztVln7lu1Wu0k5UmeX9Avu7FetFqtATp9gl/pNKjb5A3BLV9byui3L/udlDsi9QWMfiiXy6dUrB8ED8M9dxBBpVIZQf8GN4rF4kXdliZIvsGcOzwfaR1tBh6gR1r3guSnCW7zme+4bWhPpQ3ed9vSBImPM+dP1xj1KZvPnNa9IOi5cfZXFEUn0G6a+Es+kLrukzY6BnoZc/UuFAqF0wR+NPEpuGLLn23nxVKpdMHt44L1fl7WPdxOSsafd8fRkMR9BqpJjRn//sqzBB+b+DScUOGZgbnv+QwkNtbZXzKQ1ukYoR3AJa1nhV4GeuldMJ79ZfU5a3hB6z2QlyVr4qshEVkR59xBNCQfm5fXGJzR+hEcc3+J4ePfTC4+aIi7Bq8nJcZG3XE02Lcl5t+UPLQuJ7eJt86w1o+AZXiJgH3TfX/J5fhWG6P8hPK4ikkbeeZ8BlcbjcZZEexJLXm9zjn37W9gaMzEfxNtxV3Zb50Y6rPwUAbC0A2eLxPd9v8QYoh53/OV3vCchK/gMsu+7Mb+FWR5YmoKTmRtSkH+VyO7hOVv47/8jAcEBAQEBKSNX1VEx8ULVDUJAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAaCAYAAACXbyOAAAAEP0lEQVR4Xu2ZXYhNURTH7+0OUb7CkJm5Z9+5c2uaiQfd8IAHmXnwgMwoTXghZt7UCCFRmjdPQykjH0kibyJ5UuSjpJSPUgovagpP5CPG/2/vzbLnnLlnxr3nNuxfrc7Za++99llrf52zTyrl8Xg8Ho9n3KGUWgF5AxkSMgj5AvkWBMF9XDtRNOPWTYJCoTANz7ADz3ACcgAyzy0Th9bW1omoe4o+WT9zuVy3W87S0NAwGWWu2LKQd3iOzW65JChXDH4BAychX2F0mVBnkN7OAOG6G+m0yKs4jY2NaFo9Qtvb0DGTcL8K1+fQL3bLxgU2WiCPIZ8h+9x8C9rZwLZDYpIoZY9Bc3PzVBi5BXkBI3NlHnTzIK/C8ipMjdID8DLvrRLpPjh+nTNPlI1NNptdAxvH6A+CdtbNJ9Dn0MZBXG5UwW9J+WOg9Gh/6xolCM4i6D9CntTV1c2WeZUEzuTR5htc90g9dB2QD9AXpT4u6MBDqL8OcpNSW1s7xSlSwzYhS5H/MiwmSVGRGJjRHrqHmeAMQXa6eZUEjrShze+uo0ivNs+zUerjwI5FvXNNTU1ZXM+rkFnLdrmE2/YhvTI/SSoRA46UfuXsTcVicQJ0W5We8buYlnUqjXUoylFXH4dAz5QBs/fRZ86avM2vr6+fxcHN5ZH23ZgkTZSvUfqSmNHOJY1v33fM/TNj7DgD4NZxQXBmoux1yOu4AvsHXDsSOhLmUDBWR1N6BUNn7uU9bPRCPnKbMtlp5PVAt9AMhqsqZOZHgTpdro8jCWw/QNwKrh1J2WOgwvdrOr5X6bfwdlE8MUxnDHNozI6m9JaEem28F3ZWM206uQe3aXRCvaryfk3KHgO7X9Ow1MNQEboPkJNSnxRRDkXpS2H3a6xUDUyLF89eLtscCHYV44BQVd6vSZSvUfqSqJD92ug30iCkT+ojSDNQSn+mxRIEd4ZrRMLnMc8V6iikQ+pLEYj9WqR5mET/t7CDbVmk95m2Y+/XZukf5meUcHso9R5U1hiU+L5mEGKNHj40yq2ErI8rCM4S145ELKX9Uo963UpvOy1GlcHb9RzbiVGYFeywTdNf+g15qPT7w8/l2nTaqPZrwsMP18eRBO2s5buOa0cyihiUBgGYjwrv1fC9iR/zl5TobNzvD8ToT4A0OwdyL5/PT6fCfCHwuS6kzPMq/cUwJHUu5u36jBIzQbyY8nAlZ/XB7xnvxqQaxIrBiKCTlyt9KsYgWRnk6LdlkO5U+hz5EgKwGdeBMZ3Y/AV0EO1eQ19cxHWV0mfbt+2+SwK9pH1Sepb+cWZsZuk545+Vu/ZwCHVPQzbxHr4tQN5Tp+wgbHRJm0kTJwZlgcsYgwlpT7qjBTyfL5rljydGw37ImE49Oppld5xRMgb/Deho/i04koqzrHnGNRl2NFcfN8Pzj6H0Z9xa3Cb6+9Xj8Xg8Ho/H4xkTPwDETbP4pNcFoQAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAaCAYAAACXbyOAAAAEXElEQVR4Xu1ZS2hUMRSdoVUU/KFWsTPzMp0WSosuZNAu1IX4gQq1WAWR6kbRdidUVFopCuLOlQqCih9ExOJOlOJKqPhBEQQ/IAjqQqGgrhQ/6HiOSTBN32vf/N60kgOHl9wkN7n35t28ycRiDg4ODg4ODpMOQojV4AcwZ3AY/AH+8jzvIZ6b0bXKHhsFGhoaZmENe7GGM2A/uMjuEwbNzc1TMfY8bdJ2ptPpLrufRjKZnI4+N3Rf8BPWscPuFyWwhqV1dXXrbXnegKJz4E8YtNIQV6G+hw7C8wDqcaOt7IBhmFo8xdy7EZhpKLfi+Qry5XbfsICOJvAZ+B3ss9s1MM9Wzu3jk0iBdbTQ91jHIzCH8kG7T15obGycCUVD4Gs4cqHZBtki8K1fW5lRLeQGvM6yFqJ+DAYP8s0z+oZGKpXaCB2naA8cecluJyBPY47DeNyugN0joILdhnVsAL8UHWwhd/tH27EEnLMM8q/g89ra2vlmWzkBozKY84NtHGQdyuisKQ8LOO8Ixm8C75A1NTUzrC7VnBNcgfY3fj6pBGhvSYKtdrvvGaackwP32W3lBIxaizl/28apXc71dJryMGBgMe5yfX19Cs8rwuet5bxM4Xp+sMdsrxRKFmwoOSGssymbzU6BbJeQb/x+1s0x5YYOqm1ckDwMPJktzqbl+U+bmTkyuj2RSMzj5uYRQf22TyqJkgRb7XamNH5931Pll8qhp+kAe4wNOGcu+g6C78IS+vttPSZolF9QvSKCzQyGYPayDB094FceU6o5jrZuyJaqzXBT+Lz5QcCYbbaNYxG6H8NvDbaeIHilCLbwP69peK+QX+HrjO6RQQVjVFC9IoLNtxbj1rJs6GljXQW5G8U4gpAQE+i8JkoSbH1e07mmXCsHz5nyqBAU1CD5eNDnNTJVknXjw7OHaZsbQWcxbggxgc5roiTBFj7ntZJ3qk1wzJQHIE5HCfkzLRTh3Dm2EhNcj1qXb7DBDlM+HjzjvDbqvEyi/TsZYN0X9T41d+jzWqX+UXYGkcdDPt9BRQd7nN/XdEKoN4iLRr814JawhHNabD0mjFR6wpRjXJeQx06TElXh63qBDmIQVAY7quu0l3aDT4T8fvibrlXQ8jqvCV4A2TaORczTzm8dW08QvGKDDQcshoLPYvTZxAuNATPYKB/yjN0fAeIMDvggk8nMpkD9QuC6rsbUeoX8xZAzZTbU1/VFYWQD48OUlytpLff+vfG2TyoKHWwxxq2fLxDkVULeitFJmsPc/boP6puFvEcewEQ78Dxb6K1VoWCQMe8txOIanq1C3m3f1ecu4cm0/k3It3TEvbl6Sy8r+zTv68shjL0AbmcZti1B2wur7zB0bDN1Ro20/IXw3lrXJ3CIGc3uXzCYxuhMcF3UgTbA+/msSn+8NRv1h4wK6sl80q7DJAUCzX9MjscmUNp1KA+qGGhmH7vB4T+DkD/j2lGM9O9XBwcHBwcHBwcHh4LwB+sdmQ4Mk+p6AAAAAElFTkSuQmCC>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAaCAYAAACXbyOAAAAEWklEQVR4Xu1ZW0gVQRg+By0KulFZ6NGd4/GAKPUgh/Kheog0MDBJgxDzpSh9C4wKDSmQ3nqyIEjpgkQkvUUhPQVGF4og6AJBUD0kCNlT0oWy72tnaBx3j+tp3YMxH3zszD+z/8z//3Pb2VjMwsLCwsLCYsFBCLEdHAOnNI6D38GfjuM8xrMFVQvMd6ME+lBTXl6+05QHRXV19WLouESblJ3JZLLDrKdQWlq6FHVuaT6ZgC/azXpRIJ1Or0DbR9CHi2AvWGzWmROgYBD8AaVbNXEB8ofpIDyPIx/XyuYdCEYt20X7T+hwpE+YdeYK6KkCX4DfwB6zXAFt70P5cw+fRAoMcMF+oA+H0KclSDfg+QbyzWbdQKisrFwOJaPgWyhZr5dBVgy+9yqbb8hgN6LtXeCXMIJdVla2G7rO0x7ov2qWE5An0dYpPO7mw24NhcKdhDeZVkLkz6B/I1x9tLrBINzR/slUSsA5myCfBF+WlJSs1cuiAgzLhBVsBPA0dO0B75FFRUXLjCqFbAfcgvJ3Xj6JCuhDCu2PmXZD1iz9kdHlgSBHu+ceJp0zBR41y6JCWMFmYKFnqKKiogzPa8Jj1qKNOi7hfKL8F9ill0cJ1QfTbsdd7RiTNl0eCHipXxh7UyaTWQTZQeHO+GPM6+9EibCCLWfKgNz7aDNnTUqVJxKJNRzcXB7ZlumTqKGCatrtJ58VcrRzSePp+4FMv5bKLtAB5jsm4JzVqDsCfghK6O819fjBCSnYXMEQzG6moa8LnOQ2JYvjKOuErEYOhtvCY+b7Ae+0mjZmI3Q/hd/Sph4dtNcrqE6uwRbe+zUN7xbuKbxeq54XOCEFm7MWOuqY1hzWyLwMcieScQQhIfK8XxPCHZAzgppzsNV+TcW6XDkYHNTl+UAYwVb7NVaqUua1g2cXl20OBLWKcUCIPO/XhF9Q/eSzQnjs11LeJgfBGV3ugzgdJdzPtECEc1eZSvwQRrAdbb/W8rxMov0HGGBVF/ke4eGTbJBL/ww7/cjtYbZzENuX/fAMNtisy7Nilu9rOiHQ6GGnUW8HuDco4ZxaU48fnOzBLsDpep0Koh/kCtan8rSXdoPPhHt++LNc57JfE7z8MG3MRrTTxLOOqUeHtp3063K82yHcrbdKl2cFHLABL3wWM/cmfswP68FG+qSjjf4ooYItPG68hPvFMAVej/nsr/J0fUVoM0E7mPJyJankzt8Zb/okH4ijH33go1QqtZIC+ZXE2PjaOw0I8jbh3orRSYrjHP2qDvItwr1HHoYD2vEcyOnG5h/AAxPa/Wj0cwIc5WxmHcdd0r4Kd5ZOuzOWs3TIeP+huhzCu5fB/UzDto0oe2XUHYeOVl1n1GCQ0Y876McNPBuEe79/X509QgOXMToTrI860HOBDOq5uSy7Cwz8R5GRWwBvzfL6UyqvQKD5t+BsLMiyZrGgUcBAc/UxCyz+Mwj3M64JyUh/v1pYWFhYWFhYWFjkhN+T4JkO33xxyQAAAABJRU5ErkJggg==>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHsAAAAaCAYAAACXbyOAAAADy0lEQVR4Xu1ZTUiUQRjeZS0KCqKy0N39ZjcDSeogS3ioDpF2CEzKQKS8FJRno0IjCqJbpwo6KP0gEUi3CKJTIBRRBEE/p6A6JAjZKemHsudxZmoYv29/dPZbi3ng4ZuZd+adfZ/5/b5NJDw8PDw8PDz+OQghdoIT4IzBSfA7+DMIgid4dqNqym4bJ/AbWvP5/G67vFy0tLQshY9rjEnHmcvljtn1NDKZzHLUuWtoMgUt+ux6cWKhGvwBHI2APxDQdqM4hfxRCoTnSeSThq3qwGC0sV/0/5SCI33KrlMp4GcT+BL8Bg7Zdg303QP7ixBNYoVzDZqbm1fC0Tj4FjNnvWlDWQP4PsxWbahAO9H3HvDLggMFstnsXvi6wnjg/6ZtJ1CeQ19n8XhQi7hNONdAyNn+CbyDbJ1pgzhbUT4NvmpsbFxr2uICAiw4CTQxK945+NoHPiTr6+tXWFXq2A+4DfZ3YZrUAs40ULM99AxT4syAx21bXHAVKAcWfkabmpqyeN4SIasWfbQj5h4+Yf8FDpj2WsGVBlzZl4R1NhUKhSUoOyLkij/BvNkmTrgKFO03wM8wBnOZinmCZdqeTqfXcHLzcsa+bE1qCScaqNnOLY2370cq/UbIy8BVCmC3sQFxVqPuffBDuYT/M7afKDgJNCF3MAzmINPwNwBO85hS5iRs/ShrVZPhnghZ+VFAm147xmKE72fQbaPtJwpONBDh5zUDHxTyFt5hVK8JnASakEcSfLQzHchLDyd0J/NqkPuRTGIQ0mIRndeEEw30eS2ss0k7B0fM8lrARaD6vMZOlWHeuHgOcNvmRNC7GCeEWETnNeFCg9DzWpUfVJPgglkegSSFEvI1rSxC3FW2kyi4CDQwzmsjz49JjP+wXvEE8kMiRJNiUFv/nDijyOOhknvQgjUo8X5NEcp6ieePRr1d4IFyCXHabD9RKBFoCrfrdXoQo6B2sPM6z3gZN/hcyPvD7HY9n/OaQF1hx1iM6KeLdx3bTxRKaFAaEGAzHHwWc8+mOpSNmYON9OnAmP1xQgcqQr54CfnGMAPeTkScr+p2fQN19usy42LKjys5XR78XfG2JjVFMQ2KAoO8Q8ivYhRJc5KzX9dBvlvI78hj6KgPz2GKZvqpNnhhQr8frd85BY5zNbNOIC9aX4VcpQ1We67SUav9Y/1xCG2vg4eYRmxbYHtt1Z2Ej17TZ9woRwMn4DZGMcGOuAe6EqhBvVzJtuvxjwIDnQcvJhbRtutRHaQ40Nx9bIPHfwYhX+O6kIz171cPDw8PDw8PDw+PeeE3urB+JMhG4owAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAaCAYAAAAKYioIAAACBklEQVR4Xu2WTStEURjHTSiKEobMyz0zjZqUjSbZsJCXhcKCjWSlsCaElI0vYGNhPoF8AEullNjKyoIFpbBiQeL3NHfqdMyM6yrNzfnXv3vO83Luc//33OeeigoLCwuLP4JSqh/ewQ+N9/AVvjuOc8p1gtBKMzcooP6uZDI5bNo9geQsfEOIXs1cyXzOFWiFeUjzlTUSiUSP1EztZ/KyGa+aMd8inU7Xk3wMr1C2Vfdha4PXhXzlDFeYUeoegc++hCGxAz7AA6ZVui8ej3djf4EXkUikWfcFAQiS8S0MDz8m2w2V500fti3xwSXTFwT8ShgSd5TRXzKZTDW2WXcnLctczwkKfAsTDofrSDxSub/QiTu+lF3CYrvRaLTJzDERi8UaiT2EN17J+puSy46cMn2lSN4592s3aygGx68wqnB/CVHwmsr9jYa08MDBtzD5/gIXdXt+QZjV7UGDb2FUgf7i2qddwbZ1exGE5JNTuV+7J7IjGySRa43pK0U5Mvyk3/kS5pvziwjm6WAkhRI3ACe9Us4Zkst9lekrRfLGpaeZNRSD40cYPqNOkp7U1/NLFbZ9XRjGG4wHtZhAIC8MXDd9X4AgfSp3mv3QeC/9Jh/DfAK+i0AsPsN1jzdVq69TzmBnLVDzrfGMj/A4lUq1mPE/gnxeiDIKh4IkioWFhYWFhYXFf8Mnx/zMbBcWFGIAAAAASUVORK5CYII=>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAA5klEQVR4XmNgGEJARkaGU15ePgqIZwFxl6Kiojq6GgYlJSV+oORuIG4WFRXlUVBQMACyrwFxMIpCOTm5cqDgaSAtCBMD8qOB+DrQZHGYIkGQIqApC+E6gUBWVtYUKP4FSPvBdGoC8Vt0hUADjIHiX4G4FUUAl0K4OFDAFyjwn6BCIMeTKIUYAtRQqAQUeI5LIRBXgQVAMQHkHADirUDFHEgKXYBiv0A0su4YIH4ElFCECjEC2c1AfAIUvXCFxsbGrECF04ES+4GmBkAVXQXFOVwREmAE6lYDaggBxq8dSDO6glGAEwAAKX5Nb6tjxO8AAAAASUVORK5CYII=>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAaCAYAAAAKYioIAAACgUlEQVR4Xu2XvWtUQRTFd4mCgl+oi7hfs7ssLAG7h6aJhZgUKaKQ2EiwCmopKBpEAgHJP2AjmJBWDKnFUlBEIU0KEQTBpAkExCoWStz8Lm9WLrNvsm8beQtz4PDenLl3cudkZt5sLhcQEBDwn2CMuQK3YVtxB/6Ge9Vq9RPPaUKH3Nyso9lsnqD+e9T/As7D825MT5C0DP8w0KiSh2jfsQY9op1XfZlGvV6nbLNB3bdrtdoR3id4fkW/5MZ60Wq1jpP4Dn4j8ZzuE5fhZlJfhnHI/qPX5L0j0l7EqDflcvmoivWDhGH4wx1IUKlULqL/gp+LxeJZ3ZdVMPkG9W7znNM62hTcRY+07gWTv0ZCm6V21+1DW5A++MDtyyqY+Bj1/nWNoT1p5zKjdS8IfGac8yWKosNosyZeSQ+lrXOyjI4BPmNcPRGFQuEYwW9N/BX6YN+/2AGel0qlM26OC/bsadm7cCstGX9eclmRN92+g0jeOn+v6dagQdxckgHVfowxyedLnoIfm/hrNK7CBwLUfT/JgL6M6ZwvMpjWSY7QduGy1gcBPgN8eiJMwvli9Rlr2KLWPcjLljPxpz0VWZGnJNHeMbr6fZQrQ6/zTuZi4jklGgOntN6FHvcXMSyVu1IocVfhjbTEkBHJlYuY23cQybsuZ5pbgwb9JWr/LnPQunx1TXxsDGu9C2yjCwT9NN33F7kgrWpjeH/C+5iKyTLy1PsUfmw0GidFsF9ZmdPLnHNX+wcMuWzi22xbcUfOm04M7Wm4J4NhyC2eS6lvjBmAGELNr1klr3hOwBX4ni1fdmP7hmwvTJmE44NkioL81ovsNpTb7sD9EA4ICAgICAgISIN9rH3nVogun1sAAAAASUVORK5CYII=>
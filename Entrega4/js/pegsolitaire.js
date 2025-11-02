const ratingStarSelector = document.querySelectorAll(".rating-star");
const timerDisplay = document.querySelector(".timer-display");
const timerTimeText = document.querySelector(".timer-time-text");
const winnerDisplayContainer = document.querySelector(
  ".winner-display-container"
);
const looserDisplayContainer = document.querySelector(
  ".lost-display-container"
);
const playAgainButtons = document.querySelectorAll(".play-again-button");
const prePegSolitarieDisplay = document.querySelector(".pegSolitarie-pre-display-container");
const gamePlayButton = document.querySelector(".game-play-button");

gamePlayButton.addEventListener("click", () => {
   canvas.classList.add("active"); 
  prePegSolitarieDisplay.classList.remove("active");

  resetTimer();
  fichaSeleccionada = null;
  arrastrando = false;
  tablero = generarTablero();
  dibujarTablero();
  startTimer();
});

playAgainButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    resetTimer();
    looserDisplayContainer.classList.remove("active");
    winnerDisplayContainer.classList.remove("active");
    canvas.classList.add("active");
    fichaSeleccionada = null;
    arrastrando = false;
    tablero = generarTablero();
    dibujarTablero();
    startTimer();
  });
});

ratingStarSelector.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    ratingStarSelector.forEach((b) =>
      b.childNodes[1].childNodes[1].classList.remove("active")
    );
    let count = 0;
    for (const star of ratingStarSelector) {
      if (count < index + 1) {
        // Accede al elemento HTML SVG -> luego al elemento G y finalmente al elemento path.
        star.childNodes[1].childNodes[1].classList.add("active");
        count++;
      }
    }
  });
});
// =======================
// CONFIGURACIÓN
// =======================
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const TAM = 7;
const RADIO = 25;
const ESPACIO = 60;

const tiempoMaximoOriginal = 360;
let temporizador = tiempoMaximoOriginal;
let timerInterval = null;

const fichaImg = new Image(); //creamos la ficha con una imagen
fichaImg.src =
  "https://imgs.search.brave.com/tG2PW5oiWrVaP4iNy6BnGvYvsuZq_1G_eM3Ei32beJE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vZmVva3Rpc3Rv/dmFzL2Zlb2t0aXN0/b3ZhczIxMTIvZmVv/a3Rpc3RvdmFzMjEx/MjAwMDUyLzE3OTY0/OTM5MC1tdXJjaSVD/MyVBOWxhZ28tdm9s/YWRvci1kZS1oYWxs/b3dlZW4tbXVyY2kl/QzMlQTlsYWdvLXZl/Y3RvcmlhbC12YW1w/aXJvLXNpbHVldGEt/b3NjdXJhLWRlLW11/cmNpJUMzJUE5bGFn/by12b2xhbmRvLmpw/Zz92ZXI9Ng"; // cambia por tu URL de imagen

const fichaImg2 = new Image(); //creamos la ficha con una imagen para la opcion 2
fichaImg2.src =
  "https://tse4.mm.bing.net/th/id/OIP.xyrTTwXcoFLxBLRHhFNIvgHaEo?rs=1&pid=ImgDetMain&o=7&rm=3";

const fichaImg3 = new Image(); //creamos la ficha con una imagen para la opcion 3
fichaImg3.src =
  "https://tse4.mm.bing.net/th/id/OIP.NJ7cdfQADdx_6fcDv7nL2QHaEo?rs=1&pid=ImgDetMain&o=7&rm=3";

let tablero = generarTablero(); // Matriz (booleana) con el tablero inicial

// --- estado de interacción ---
let fichaSeleccionada = null; // se guarda la fila y columna de la ficha seleccionada
let arrastrando = false;
let movimientosPosibles = []; // array con los movimientos posibles de la ficha seleccionada

// =======================
// TABLERO Y DIBUJO
// =======================

//lo que hace esta funcion es generar el tablero inicial del juego con las fichas en su posicion inicial
function generarTablero() {
  const t = [];
  for (let fila = 0; fila < TAM; fila++) {
    t[fila] = [];
    for (let col = 0; col < TAM; col++) {
      if ((fila >= 2 && fila <= 4) || (col >= 2 && col <= 4)) {
        // todas las posiciones con ficha menos el centro
        t[fila][col] = !(fila === 3 && col === 3);
      } else {
        t[fila][col] = null;
      }
    }
  }
  return t;
}

/* Esta función nos devuelve la posicion X-Y donde el tablero esta dibujado en canvas.
la podemos ver como un margen para centrar el tablero en el canvas*/
function obtenerOffset() {
  const ancho = (TAM - 1) * ESPACIO;
  const alto = (TAM - 1) * ESPACIO;
  return {
    x: (canvas.width - ancho) / 2,
    y: (canvas.height - alto) / 2,
  };
}

/*esta funcion se encarga de dibujar el tablero en el canvas con las fichas en sus posiciones correspondientes
es la funcion que se llama cada vez que hay un cambio en el tablero para actualizar la visualizacion*/
function dibujarTablero() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const offset = obtenerOffset();

  for (let fila = 0; fila < TAM; fila++) {
    for (let col = 0; col < TAM; col++) {
      const celda = tablero[fila][col];
      if (celda !== null) {
        const x = offset.x + col * ESPACIO;
        const y = offset.y + fila * ESPACIO;

        // aca lo que hacemos es dibujar el circulo de la celda
        ctx.beginPath();
        ctx.arc(x, y, RADIO, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.strokeStyle = "#00bfff";
        ctx.lineWidth = 3;
        ctx.stroke();

        /* Si hay ficha, dibujar imagen
   Dibujar la ficha solo si no es la que se está arrastrando*/
        if (
          celda === true &&
          !(
            arrastrando &&
            dragFicha &&
            dragFicha.fila === fila &&
            dragFicha.col === col
          )
        ) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, RADIO, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(fichaImg3, x - RADIO, y - RADIO, RADIO * 2, RADIO * 2);
          ctx.restore();
        }

        // Marcar la ficha seleccionada con un borde amarillo
        if (
          fichaSeleccionada &&
          fichaSeleccionada.fila === fila &&
          fichaSeleccionada.col === col
        ) {
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(x, y, RADIO, 0, Math.PI * 2);
          ctx.stroke();
        }

        //  Marcar las celdas destino posibles tambien con un corte amarillo
        for (const mov of movimientosPosibles) {
          if (mov.fila === fila && mov.col === col) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, RADIO, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }
  }
}

// =======================
// INTERACCIÓN
// =======================

/*en esta funcion calculamos los movimientos posibles de una ficha en base a su posicion actual
lo que hace es buscar un false(casilla vacia) a dos posiciones de distancia en linea recta(para arriba y para abajo) 
 y un true(casilla con ficha) en la posicion intermedia*/
function calcularMovimientosPosibles(fila, col) {
  const posibles = [];
  const direcciones = [
    { df: -2, dc: 0 }, // arriba
    { df: 2, dc: 0 }, // abajo
    { df: 0, dc: -2 }, // izquierda
    { df: 0, dc: 2 }, // derecha
  ];
  /*lo que hacemos en esta funcion es verificar si el jugador gano o no
para ganar debe quedar una sola ficha en el centro del tablero
calculamos la celda del medio y contamos las fichas restantes en el tablero recorriendo la matriz*/

  for (const { df, dc } of direcciones) {
    //lo que hace este for es recorrer las direcciones posibles para moverse
    const f2 = fila + df;
    const c2 = col + dc;
    const midF = fila + df / 2;
    const midC = col + dc / 2;

    // Validamos que esté dentro del tablero y si es asi agregamos la posicion a las posibles
    if (
      f2 >= 0 &&
      f2 < TAM &&
      c2 >= 0 &&
      c2 < TAM &&
      tablero[midF][midC] === true &&
      tablero[f2][c2] === false
    ) {
      posibles.push({ fila: f2, col: c2 });
    }
  }

  return posibles;
}

function verificarPerdio() {
  for (let fila = 0; fila < TAM; fila++) {
    for (let col = 0; col < TAM; col++) {
      if (tablero[fila][col] === true) {
        const movs = calcularMovimientosPosibles(fila, col);
        if (movs.length > 0) {
          // Si al menos una ficha tiene movimientos, el juego continúa
          return true;
        }
      }
    }
  }
  // Si ninguna ficha puede moverse, se perdió
  return false;
}

function verificarVictoria() {
  let contadorFichas = 0;
  let fichaCentral = tablero[3][3] === true; //verificamos si en la posicion central hay una ficha

  for (let fila = 0; fila < TAM; fila++) {
    for (let col = 0; col < TAM; col++) {
      if (tablero[fila][col] === true) {
        //aca verificamos si hay una ficha en la posicion actual
        contadorFichas++;
      }
    }
  }

  // Gana si solo hay una ficha y está en el centro
  return contadorFichas === 1 && fichaCentral;
}

function getCeldaDesdePos(x, y) {
  const offset = obtenerOffset(); // Obtenemos la posicion del tablero en canvas.
  const col = Math.round((x - offset.x) / ESPACIO);
  const fila = Math.round((y - offset.y) / ESPACIO);
  if (fila < 0 || fila >= TAM || col < 0 || col >= TAM) return null;
  return { fila, col };
}

// --- DRAG & DROP ---
let dragFicha = null;
let dragPos = null;

// Cuando presionas click dentro del canvas
canvas.addEventListener("mousedown", (e) => {
  if (temporizador == 0) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const celda = getCeldaDesdePos(x, y);
  if (celda && tablero[celda.fila][celda.col]) {
    arrastrando = true;
    dragFicha = celda;
    dragPos = { x, y };

    fichaSeleccionada = celda;
    movimientosPosibles = calcularMovimientosPosibles(celda.fila, celda.col);
  }
});

// Este event listener escucha cuando estamos moviendo una ficha en el tablero y la va renderizando para poder guiar el movimiento.
canvas.addEventListener("mousemove", (e) => {
  // Este evento captura el movimiento del cursor sobre el canvas
  if (temporizador == 0) return;
  if (!arrastrando) return;
  const rect = canvas.getBoundingClientRect();
  dragPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  dibujarTablero();

  // Dibujar ficha en movimiento
  ctx.save();
  ctx.beginPath();
  ctx.arc(dragPos.x, dragPos.y, RADIO, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(
    fichaImg3,
    dragPos.x - RADIO,
    dragPos.y - RADIO,
    RADIO * 2,
    RADIO * 2
  );
  ctx.restore();
});

// Cuando soltas el click dentro del canvas
canvas.addEventListener("mouseup", (e) => {
  if (temporizador == 0) return;
  if (!arrastrando) return;
  arrastrando = false;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const destino = getCeldaDesdePos(x, y);

  if (destino) moverFicha(dragFicha, destino);
  // Cuando mueve una ficha de manera correcta.
  dragFicha = null;
  dibujarTablero();

  // Despues de dibujar la ultima ficha, si gano se mostraria una pantalla
  if (verificarVictoria()) {
    pauseTimer();
    setTimeout(() => {
      canvas.classList.remove("active");
      winnerDisplayContainer.classList.add("active");
      timerDisplay.classList.add("success");
    }, 200);
  }
});

// --- CLICK SELECCIÓN ---
canvas.addEventListener("click", (e) => {
  if (temporizador == 0) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const celda = getCeldaDesdePos(x, y);
  if (!celda) return;

  if (fichaSeleccionada) {
    moverFicha(fichaSeleccionada, celda);
    fichaSeleccionada = null;
    movimientosPosibles = [];
  } else if (tablero[celda.fila][celda.col] === true) {
    fichaSeleccionada = celda;
    movimientosPosibles = calcularMovimientosPosibles(celda.fila, celda.col);
    dibujarTablero();
  }
});

canvas.addEventListener("click", (e) => {
  if (temporizador == 0) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const celda = getCeldaDesdePos(x, y);
  if (!celda) return;

  if (tablero[celda.fila][celda.col] === true) {
    fichaSeleccionada = celda;
    movimientosPosibles = calcularMovimientosPosibles(celda.fila, celda.col);
    dibujarTablero();
  }
});

// =======================
// LÓGICA DEL JUEGO
// =======================
function moverFicha(origen, destino) {
  const { fila: f1, col: c1 } = origen;
  const { fila: f2, col: c2 } = destino;

  // Hacemos calculos para saber cuanto (Distancia) se moveria la ficha
  const df = f2 - f1;
  const dc = c2 - c1;

  // movimiento válido si salta exactamente una ficha
  if (
    (Math.abs(df) === 2 && dc === 0) || // Solo puede un movimiento hacia 2 casillas en linea recta
    (Math.abs(dc) === 2 && df === 0) // No permite moverse en diagonal
  ) {
    const midF = f1 + df / 2;
    const midC = c1 + dc / 2;

    // Casilla del medio - Casilla destino
    if (tablero[midF][midC] && tablero[f2][c2] === false) {
      // Si la casilla del medio tiene ficha y la destino esta vacia.
      tablero[f1][c1] = false; // Vacia la casilla origen
      tablero[midF][midC] = false; // Vacia la casilla del medio
      tablero[f2][c2] = true;
      // Ocupa la ficha destino
    }
  } else {
    tablero[f1][c1] = true;
  }
}

fichaImg3.onload = dibujarTablero;
startTimer();

function updateTimer() {
  if (temporizador <= tiempoMaximoOriginal / 2) {
    timerDisplay.classList.add("warning");
    if (temporizador == 0) {
      pauseTimer();
      setTimeout(() => {
        canvas.classList.remove("active");
        looserDisplayContainer.classList.add("active");
      }, 500);
    }
  }

  const minutes = Math.floor(temporizador / 60);
  const remainingSeconds = temporizador % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  timerTimeText.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

function startTimer() {
  if (timerInterval) return; // evita múltiples intervalos

  timerInterval = setInterval(() => {
    temporizador--;
    updateTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  timerDisplay.classList.remove("warning");
  pauseTimer();
  temporizador = tiempoMaximoOriginal;
  updateTimer();
}

const ratingStarSelector = document.querySelectorAll(".rating-star");

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

const fichaImg = new Image();
fichaImg.src = "https://imgs.search.brave.com/tG2PW5oiWrVaP4iNy6BnGvYvsuZq_1G_eM3Ei32beJE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cy4x/MjNyZi5jb20vNDUw/d20vZmVva3Rpc3Rv/dmFzL2Zlb2t0aXN0/b3ZhczIxMTIvZmVv/a3Rpc3RvdmFzMjEx/MjAwMDUyLzE3OTY0/OTM5MC1tdXJjaSVD/MyVBOWxhZ28tdm9s/YWRvci1kZS1oYWxs/b3dlZW4tbXVyY2kl/QzMlQTlsYWdvLXZl/Y3RvcmlhbC12YW1w/aXJvLXNpbHVldGEt/b3NjdXJhLWRlLW11/cmNpJUMzJUE5bGFn/by12b2xhbmRvLmpw/Zz92ZXI9Ng"; // cambia por tu URL de imagen

const tablero = generarTablero(); // Matriz (booleana) con el tablero

// --- estado de interacción ---
let fichaSeleccionada = null; // {fila, col}
let arrastrando = false;

// =======================
// TABLERO Y DIBUJO
// =======================
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

// Esta función nos devuelve la posicion X-Y donde el tablero esta dibujado en canvas.
function obtenerOffset() {
  const ancho = (TAM - 1) * ESPACIO;
  const alto = (TAM - 1) * ESPACIO;
  return {
    x: (canvas.width - ancho) / 2,
    y: (canvas.height - alto) / 2,
  };
}

function dibujarTablero() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const offset = obtenerOffset();

  for (let fila = 0; fila < TAM; fila++) {
    for (let col = 0; col < TAM; col++) {
      const celda = tablero[fila][col];
      if (celda !== null) {
        const x = offset.x + col * ESPACIO;
        const y = offset.y + fila * ESPACIO;

        // Ficha con espacio
        ctx.beginPath();
        ctx.arc(x, y, RADIO, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.strokeStyle = "#00bfff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ficha con imagen
        if (celda === true) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, RADIO, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(fichaImg, x - RADIO, y - RADIO, RADIO * 2, RADIO * 2);
          ctx.restore();

          if (
            fichaSeleccionada &&
            fichaSeleccionada.fila === fila &&
            fichaSeleccionada.col === col
          ) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 4;
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

function getCeldaDesdePos(x, y) {
  const offset = obtenerOffset(); // Obtenemos la posicion del tablero en canvas.
  const col = Math.round((x - offset.x) / ESPACIO);
  const fila = Math.round((y - offset.y) / ESPACIO);
  if (fila < 0 || fila >= TAM || col < 0 || col >= TAM) return null;
  return { fila, col };
}

// --- CLICK SELECCIÓN ---
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect(); // Este metodo retorna un elemento con los datos del canvas en relacion al Viewport (pantalla)
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const celda = getCeldaDesdePos(x, y);
  if (!celda) return;

  if (fichaSeleccionada) {
    moverFicha(fichaSeleccionada, celda);
    fichaSeleccionada = null;
  } else if (tablero[celda.fila][celda.col] === true) {
    fichaSeleccionada = celda;
  }
  dibujarTablero();
});

// --- DRAG & DROP ---
let dragFicha = null;
let dragPos = null;

// Cuando presionas click dentro del canvas
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const celda = getCeldaDesdePos(x, y);
  if (celda && tablero[celda.fila][celda.col]) {
    arrastrando = true;
    dragFicha = celda;
    dragPos = { x, y };
  }
});

// Este event listener escucha cuando estamos moviendo una ficha en el tablero y la va renderizando para poder guiar el movimiento.
canvas.addEventListener("mousemove", (e) => { // Este evento captura el movimiento del cursor sobre el canvas
  if (!arrastrando) return; 
  const rect = canvas.getBoundingClientRect();
  dragPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  dibujarTablero();

  // Dibujar ficha en movimiento
  ctx.save();
  ctx.beginPath();
  ctx.arc(dragPos.x, dragPos.y, RADIO, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(fichaImg, dragPos.x - RADIO, dragPos.y - RADIO, RADIO * 2, RADIO * 2);
  ctx.restore();
});

// Cuando soltas el click dentro del canvas
canvas.addEventListener("mouseup", (e) => {
  if (!arrastrando) return;
  arrastrando = false;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const destino = getCeldaDesdePos(x, y);

  if (destino) moverFicha(dragFicha, destino);
  dragFicha = null;
  dibujarTablero();
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
    if (tablero[midF][midC] && tablero[f2][c2] === false) { // Si la casilla del medio tiene ficha y la destino esta vacia.
      tablero[f1][c1] = false; // Vacia la casilla origen
      tablero[midF][midC] = false; // Vacia la casilla del medio
      tablero[f2][c2] = true; // Ocupa la ficha destino
    }
  }
}

fichaImg.onload = dibujarTablero;
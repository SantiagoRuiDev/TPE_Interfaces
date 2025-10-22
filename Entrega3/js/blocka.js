const ratingStarSelector = document.querySelectorAll(".rating-star");
const startButton = document.querySelector(".game-play-button");
const nextButton = document.querySelector(".next-level-button");
const preBlockaDisplay = document.querySelector(".blocka-pre-display-container");
const postBlockaDisplay = document.querySelector(".blocka-next-level-container");
const blockaDisplay = document.querySelector(".blocka-display-container");

startButton.addEventListener('click', () => {
  preBlockaDisplay.classList.remove('active');
  blockaDisplay.classList.add('active');
})

nextButton.addEventListener('click', () => {
  postBlockaDisplay.classList.remove('active');
  blockaDisplay.classList.add('active');
}) 

const levels = [
  {
    id: 0,
    image: "../public/blocka/torre_eiffel.png",
    name: "Torre Eiffel",
  },
  {
    id: 1,
    image: "../public/blocka/palacio_carrouges.png",
    name: "Palacio Carrouges",
  },
  {
    id: 2,
    image: "../public/blocka/arco_triunfo.png",
    name: "Arco del Triunfo",
  },
  {
    id: 3,
    image: "../public/blocka/tandil_quijote.png",
    name: "Tandil Quijote",
  },
  {
    id: 4,
    image: "../public/blocka/puerto_madero.png",
    name: "Puerto Madero",
  },
  {
    id: 5,
    image: "../public/blocka/castillo_dracula.png",
    name: "Castillo de Dracula",
  },
];

const filters = [
  {
    id: 0,
    func: applyGrayscaleFilter,
    name: "Escala de grises",
  },
  {
    id: 1,
    func: applyBrightnessFilter,
    name: "Brillo al 30%",
  },
  {
    id: 2,
    func: applyNegativeFilter,
    name: "Colores negativo",
  }
];

let filter = 0;
let level = 0;

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
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Imagen original
const img = new Image();

const pieces = []; // Guarda info de cada subimagen

img.onload = () => {
  const w = 512;
  const h = 512;
  canvas.width = w;
  canvas.height = h;

  const pw = w / 2;
  const ph = h / 2;

  // Crear 4 subimágenes
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      pieces.push({
        // Coordenadas de recorte (sourceX) desde la imagen original
        sx: col * pw, // X de origen en la imagen original
        // Coordenadas de recorte (sourceY) desde la imagen original
        sy: row * ph, // Y de origen en la imagen original
        // Ancho y alto del fragmento a recortar (slice width & height)
        sw: pw, // Ancho del fragmento (mitad de la imagen)
        sh: ph, // Alto del fragmento (mitad de la imagen)
        // Coordenadas de dibujo en el canvas (destinationX / destinationY)
        dx: col * pw, // Posición X donde se dibujará el fragmento en el canvas
        dy: row * ph, // Posición Y donde se dibujará el fragmento en el canvas
        // Coordenadas originales para saber si la pieza está en su lugar correcto
        originalDx: col * pw, // Posición X original (para comparar más tarde)
        originalDy: row * ph, // Posición Y original (para comparar más tarde)
        // Ángulo original al cargar (usado para validar si el puzzle está armado)
        originalAngle: 0, // Ángulo con el que empezó la pieza (0°, 90°, 180°, o 270°)
        // Ángulo actual de rotación de la pieza
        angle: 0, // Ángulo actual de la pieza (cambia con clic izquierdo o derecho)
      });
    }
  }

  //Cada vez que se cargue el juego aplique uno de los 3 diferentes niveles (Filtro de grises, filtro de blur, brillo, negativo)
  rotateImagesRandom();
  
  drawAll();

  applyFilter();
};

function rotateImagesRandom () {
  for (const p of pieces) {
    const randomTurns = Math.floor(Math.random() * 4); // 0, 1, 2, o 3
    p.angle = randomTurns * 90;
  }
}

function isPuzzleSolved() {
  return pieces.every(
    (p) =>
      p.dx === p.originalDx &&
      p.dy === p.originalDy &&
      p.angle % 360 === p.originalAngle % 360
  );
}

function applyFilter () {
  filters.find((f) => f.id==filter).func();
}

function applyGrayscaleFilter() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // RGB promedio simple
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

    // Asignar promedio a R, G y B
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
    // data[i + 3] es alpha y no se modifica
  }

  ctx.putImageData(imageData, 0, 0);
}
function applyBrightnessFilter(percent = 30) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const factor = percent / 100;

  for (let i = 0; i < data.length; i += 4) {
    // Multiplicamos cada canal por el factor (por ejemplo 0.3)
    data[i]     = data[i] * factor;     // Red
    data[i + 1] = data[i + 1] * factor; // Green
    data[i + 2] = data[i + 2] * factor; // Blue
    // Alpha (data[i + 3]) no se modifica
  }

  ctx.putImageData(imageData, 0, 0);
}
function applyNegativeFilter() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i]     = 255 - data[i];     // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
    // Alpha (data[i + 3]) no se modifica
  }

  ctx.putImageData(imageData, 0, 0);
}


// Dibuja todas las piezas
function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of pieces) {
    ctx.save();
    ctx.translate(p.dx + p.sw / 2, p.dy + p.sh / 2);
    ctx.rotate((p.angle * Math.PI) / 180);
    ctx.drawImage(
      img,
      p.sx,
      p.sy,
      p.sw,
      p.sh,
      -p.sw / 2,
      -p.sh / 2,
      p.sw,
      p.sh
    );
    ctx.restore();
  }
}

// Detecta clic para rotar una pieza
canvas.addEventListener("mousedown", (e) => {
  rotateImage(e);
  if (isPuzzleSolved()) {
    if(filter < filters.length-1){
      filter++;
    } else {
      filter = 0;
      const levelImages = document.querySelectorAll('.game-level-image');
      levelImages[level].classList.toggle('active');
      level++;
    }
    rotateImagesRandom();
    drawAll();
    applyFilter();
  }
});

function setImage () {
  img.src = levels.find((l) => l.id == level).image;
}

const rotateImage = (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (const p of pieces) {
    if (
      mouseX >= p.dx &&
      mouseX <= p.dx + p.sw &&
      mouseY >= p.dy &&
      mouseY <= p.dy + p.sh
    ) {
      if (e.button === 2) {
        // Clic derecho - rotar 90° a la derecha
        p.angle = (p.angle + 90) % 360;
      } else if (e.button === 0) {
        // Clic izquierdo - rotar 90° a la izquierda
        p.angle = (p.angle - 90 + 360) % 360;
      }
      drawAll();
      applyFilter();
      break;
    }
  }
};

// Prevenir menú contextual por clic derecho
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

setImage();

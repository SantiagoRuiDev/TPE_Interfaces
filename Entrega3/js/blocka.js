let levels = [
  {
    id: 0,
    image: "../public/blocka/torre_eiffel.png",
    name: "Torre Eiffel",
    description:
      "Es una torre de hierro de 330 metros de altura, construida por Gustave Eiffel para la Exposición Universal de 1889. Es el símbolo más emblemático de París.",
  },
  {
    id: 1,
    image: "../public/blocka/palacio_carrouges.png",
    name: "Palacio Carrouges",
    description:
      "Una imponente fortaleza de piedra roja del siglo XIV, rodeada por fosos y jardines. Su mezcla de arquitectura medieval y renacentista refleja siglos de historia noble y conflictos. Un lugar que parece detenido en el tiempo.",
  },
  {
    id: 2,
    image: "../public/blocka/arco_triunfo.png",
    name: "Arco del Triunfo",
    description:
      "Uno de los monumentos más icónicos de París. Erigido en honor a los ejércitos napoleónicos, se alza en el centro de la Plaza Charles de Gaulle, rodeado por avenidas radiales. Desde su cima, se observa la majestuosidad de la capital francesa.",
  },
  {
    id: 3,
    image: "../public/blocka/tandil_quijote.png",
    name: "Tandil Quijote",
    description:
      "Una imponente escultura metálica del caballero de la triste figura, ubicada entre las sierras tandilenses. Representa la lucha idealista y la fuerza del espíritu, con un paisaje natural que evoca la nobleza y la aventura.",
  },
  {
    id: 4,
    image: "../public/blocka/puerto_madero.png",
    name: "Puerto Madero",
    description:
      "Una elegante estructura peatonal que se extiende sobre los diques de Buenos Aires. Diseñado por Santiago Calatrava, su forma simboliza a una pareja bailando tango. Modernidad, arte y movimiento se funden en un solo gesto arquitectónico.",
  },
  {
    id: 5,
    image: "../public/blocka/castillo_dracula.png",
    name: "Castillo de Dracula",
    description:
      "Ubicado en lo alto de una colina en Transilvania, este castillo inspira misterio y leyenda. Sus torres puntiagudas y pasillos oscuros esconden historias de condes inmortales y secretos ancestrales. Un símbolo eterno del terror gótico.",
  },
];

const ratingStarSelector = document.querySelectorAll(".rating-star");
const startButton = document.querySelector(".game-play-button");
const nextButton = document.querySelector(".next-level-button");
const preBlockaDisplay = document.querySelector(
  ".blocka-pre-display-container"
);
const levelDescription = document.querySelector("#level-description");
const levelStage = document.querySelector("#level-stage");
const choosedLevelDisplay = document.querySelector(
  ".blocka-choosed-level-container"
);
const choosedLevelTitle = document.querySelector(".level-title");
const postBlockaDisplay = document.querySelector(
  ".blocka-next-level-container"
);
const blockaDisplay = document.querySelector(".blocka-display-container");

// En este Listener se realiza la funcionalidad del inicio del juego.
startButton.addEventListener("click", () => {
  preBlockaDisplay.classList.remove("active");

  levels = shuffleArray(levels); // Mezclo los niveles aleatoriamente

  // Cambio la imagen del fondo y titulo de juego para mostrarle el nivel seleccionado
  choosedLevelDisplay.style.backgroundImage =
    "url(" + levels[level].image + ")";
  choosedLevelDisplay.classList.add("active");
  choosedLevelTitle.textContent = levels[level].name;

  setTimeout(() => {
    choosedLevelDisplay.classList.remove("active");
    setImage(); // Renderizo el recuadro de subimagenes
    blockaDisplay.classList.add("active");
  }, 2000);
});

nextButton.addEventListener("click", () => {
  postBlockaDisplay.classList.remove("active");
  blockaDisplay.classList.add("active");
  setImage();
});

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
  },
];

const img = new Image();
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

const pieces = []; // Guarda info de cada subimagen

function renderImage(img) {
  img.onload = () => {
    const w = 512;
    const h = 512;
    canvas.width = w;
    canvas.height = h;

    // 🔹 Limpiar piezas del nivel anterior
    pieces.length = 0;

    const pw = w / 2;
    const ph = h / 2;

    // Crear 4 subimágenes nuevas
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        pieces.push({
          sx: col * pw,
          sy: row * ph,
          sw: pw,
          sh: ph,
          dx: col * pw,
          dy: row * ph,
          originalDx: col * pw,
          originalDy: row * ph,
          originalAngle: 0,
          angle: 0,
        });
      }
    }

    rotateImagesRandom();
    drawAll();
    applyFilter();
  };
}

function rotateImagesRandom() {
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

function applyFilter() {
  filters.find((f) => f.id == filter).func();
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
    data[i] = data[i] * factor; // Red
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
    data[i] = 255 - data[i]; // Red
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
    setTimeout(() => {
      if (filter < filters.length - 1) {
        filter++;
      } else {
        filter = 0;
        const levelImages = document.querySelectorAll(".game-level-image");
        levelImages[level].classList.toggle("active");
        level++;

        blockaDisplay.classList.remove("active");
        // Mostramos la pantalla intermedia entre niveles
        postBlockaDisplay.style.backgroundImage =
          "url(" + levels[level - 1].image + ")";
        postBlockaDisplay.classList.add("active");
        return;
      }
      rotateImagesRandom();
      drawAll();
      applyFilter();
    }, 200);
  }
});

function setImage() {
  img.src = levels[level].image;
  levelDescription.textContent = levels[level].description;
  levelStage.textContent =
    levels[level].name + " (Nivel " + Number(level + 1) + ")";
  renderImage(img);
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Elegir un índice aleatorio entre 0 e i
    const j = Math.floor(Math.random() * (i + 1));

    // Intercambiar los elementos array[i] y array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Prevenir menú contextual por clic derecho
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

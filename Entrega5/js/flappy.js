const canvas = document.getElementById("canvas");
const playButton = document.querySelector(".game-play-button");
const flappyPreGame = document.querySelector(".flappy-pre-display-container");
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "../assets/images/FlappyMonkey.webp";

const pipeTopImg = new Image();
pipeTopImg.src = "../assets/images/BambuPipesTop.webp";

const pipeBottomImg = new Image();
pipeBottomImg.src = "../assets/images/BambuPipesBottom.webp";

const player = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  rotation: 0, // Ángulo actual
  spinTime: 0, // Tiempo restante de la animación
  spinDuration: 300, // Duración en ms de la voltereta
};

// Atributos del pajaro.
let birdX = 150;
let birdY = 200;
let birdSize = 15;
let velocity = 0;
let gravity = 0.5;
let jumpStrength = -8;
let lastTime = 0; // para la animación

// Atributos de los obstaculos
let pipes = [];
let pipeWidth = 150;
let pipeGap = 160; // Espaciado entre obstaculo de arriba y obstaculo de abajo.
let pipeSpeed = 2; // Velocidad con la que avanzan los tubos.

playButton.addEventListener("click", () => {
  flappyPreGame.classList.remove("active");
  update();
});

// Genera un obstáculo nuevo
function createPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 50);
  const bottomHeight = canvas.height - topHeight - pipeGap;

  pipes.push({
    x: canvas.width,
    topHeight,
    bottomHeight,
    scored: false,
  });
}

// Crear primer tubo
createPipe();

// Cada que vez que le doy a una tecla contemplada entre las que originalmente tiene el flappy bird
document.addEventListener("keydown", (e) => {
  const allowedKeys = ["w", "arrowup", " "];
  if (!allowedKeys.includes(e.key.toLowerCase())) return;
  velocity = jumpStrength;
});

// Cada vez que doy click dentro del canvas.
canvas.addEventListener("click", (e) => {
  velocity = jumpStrength;
});

// Loop
function update(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // fisica del mono
  velocity += gravity;
  birdY += velocity;

  // Limite inferior
  if (birdY + birdSize > canvas.height) {
    birdY = canvas.height - birdSize;
    velocity = 0;
  }

  // Limite superior
  if (birdY < 0) {
    birdY = birdSize;
    velocity = 0;
  }

  // Animacion
  if (player.spinTime > 0) {
    player.spinTime -= deltaTime;

    // Progreso 0 → 1
    const progress = 1 - player.spinTime / player.spinDuration;

    // 360 grados
    player.rotation = progress * 2 * Math.PI;
  } else {
    player.rotation = 0;
  }

  //mover los Pipes
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;
  });

  // Generar más pipes
  if (pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

    // Eliminar pipes fuera de pantalla
    if (pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }
    
    //Comprobamos si paso correctamente un Pipe
    pipes.forEach(pipe => {
        if (!pipe.scored && pipe.x + pipeWidth < birdX) {
            pipe.scored = true;
            console.log("¡Pasaste un tubo!");
            playSound("../assets/sounds/Backflip.wav");
            triggerFlip(); // activa animación de voltereta
        }
    });

  // Comprobar colisiones
  for (let pipe of pipes) {
    if (birdX + birdSize > pipe.x && birdX < pipe.x + pipeWidth) {
      if (
        birdY < pipe.topHeight ||
        birdY + birdSize > canvas.height - pipe.bottomHeight
      ) {
        resetGame();
      }
    }
  }

  draw();
  requestAnimationFrame(update);
}

// Dibujar el mono y las pipes
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Guardar estado del canvas
  ctx.save();

  // Mover origen al centro del mono
  ctx.translate(birdX + birdSize * 1.5, birdY + birdSize * 1.5);

  // aplicar rotacion
  ctx.rotate(player.rotation);

  // ---- RECORTE AUTOMÁTICO DEL MONO ----
  const cropMargin = 0.2; // recorta un 20% del borde
  const sx = birdImg.width * cropMargin;
  const sy = birdImg.height * cropMargin;
  const sWidth = birdImg.width * (1 - cropMargin * 2);
  const sHeight = birdImg.height * (1 - cropMargin * 2);

  // Dibujar el mono recortado
  ctx.drawImage(
    birdImg,
    sx,
    sy,
    sWidth,
    sHeight, // zona recortada del PNG
    -birdSize * 1.5,
    -birdSize * 1.5,
    birdSize * 3,
    birdSize * 3 // el tamaño final en pantalla
  );

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.strokeRect(-birdSize * 1.5, -birdSize * 1.5, birdSize * 3, birdSize * 3);

  ctx.restore();

  //Dibujar los pipes

  pipes.forEach((pipe) => {
    ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.drawImage(
      pipeBottomImg,
      pipe.x,
      canvas.height - pipe.bottomHeight,
      pipeWidth,
      pipe.bottomHeight
    );
  });
}

function resetGame() {
  // Resetear mono
  birdX = 50;
  birdY = 200;
  velocity = 0;

  // Resetear pipes
  pipes = [];
  createPipe(); // Genera el primer pipe

  // Opcional: evitar un salto automatico despues
  lastKeyPressed = false;
}

function playSound(src) {
  const sound = new Audio(src);
  sound.volume = 0.5; // volumen
  sound.play().catch((err) => {
    // Esto evita errores si el navegador bloquea reproducción sin interacción
    console.warn("No se pudo reproducir el sonido:", err);
  });
}

function triggerFlip() {
  player.spinTime = player.spinDuration;
}

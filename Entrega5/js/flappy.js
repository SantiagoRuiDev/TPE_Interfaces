const canvas = document.getElementById("canvas");
const playButton = document.querySelector(".game-play-button");
const flappyPreGame = document.querySelector(".flappy-pre-display-container");
const flappyGameOver = document.querySelector(".lost-display-container");
const flappyWinner = document.querySelector(".winner-display-container");
const gameOverScoreActual = document.querySelector("#score-actual-text");
const gameOverScoreHighest = document.querySelector("#score-highest-text");
const playAgainBtns = document.querySelectorAll(".play-again-button");
const backToMenuBtns = document.querySelectorAll(".back-to-menu-button");
const gameMaxScoreText = document.querySelector("#max-score");
const bonusScoreText = document.querySelector("#bonus-score");
const gameWinnerText = document.querySelector(".game-winner-text");
const bonusLimitScoreText = document.querySelector("#challenge-bonus");
const difficultySelector = document.querySelector("#difficulty-selector");
const difficultyOptions = document.querySelectorAll(".difficulty-option"); // ojo aca
const ctx = canvas.getContext("2d");

const birdImg = new Image();
birdImg.src = "../assets/images/FlappyMonkey.webp";

const pipeTopImg = new Image();
pipeTopImg.src = "../assets/images/BambuPipesTop.webp";

const pipeBottomImg = new Image();
pipeBottomImg.src = "../assets/images/BambuPipesBottom.webp";

/* Parallax Background Setup */
//aca lo que hacemos es crear las capas del parallax y asignarles una velocidad diferente para dar la sensación de profundidad
const parallax = new ParallaxBackground([
  new ParallaxLayer(
    "../assets/images/sky-layer.png",
    0,
    canvas.width,
    canvas.height
  ), //lejos
  new ParallaxLayer(
    "../assets/images/sun-background.png",
    0.2,
    canvas.width,
    canvas.height - 200
  ), //lejos
  new ParallaxLayer(
    "../assets/images/clouds-layer.png",
    0.7,
    canvas.width,
    canvas.height - 100
  ), //lejos
  new ParallaxLayer(
    "../assets/images/mountains-middle-cap.png",
    0.5,
    canvas.width,
    canvas.height
  ), //medio
  new ParallaxLayer(
    "../assets/images/trees-front-cap.png",
    1.3,
    canvas.width,
    canvas.height
  ), //cerca
]);

//aca cargamos la imagen de la banana que el mono debe recolectar
const bananaImg = new Image();
bananaImg.src = "../assets/images/banana.png";

let bananas = [];
let bananaSize = 35; // tamaño en pantalla

let animationFrameNumber = null;

// Contador de puntajes
const counter = {
  actual: 0,
  highest: 0,
  bonus: 0,
  bonusLimit: 10,
};

// Texto inicial del desafio de bananas que va a  indicar la cantidad a recolectar para ganar el juego 
bonusLimitScoreText.textContent = "Recolectar " + counter.bonusLimit + " bananas";

// creamos un objeto para manejar la animación de voltereta del mono
const player = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  rotation: 0, // Ángulo actual
  spinTime: 0, // Tiempo restante de la animación
  spinDuration: 300, // Duración en ms de la voltereta
};

// Atributos del mono.
let birdX = 150;
let birdY = 200;
let birdSize = 15;
let velocity = 0;
let gravity = 0.5;
let jumpStrength = -8;
let lastTime = 0; // para la animación

// Atributos de los obstaculos (pipes) 
let pipes = [];
let pipeWidth = 70;
let pipeGap = 160; // Espaciado entre obstaculo de arriba y obstaculo de abajo.
let pipeSpeed = 2; // Velocidad con la que avanzan los tubos.


// Evento para iniciar el juego
playButton.addEventListener("click", () => {
  flappyPreGame.classList.remove("active");
  gameMaxScoreText.textContent = "0";
  bonusScoreText.textContent = "0";
  resetGame();
  update();
});

//evento para reiniciar el juego desde la pantalla de game over o de victoria
playAgainBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (flappyPreGame.classList.contains("active")) return;
    flappyPreGame.classList.remove("active");
    flappyGameOver.classList.remove("active");
    flappyWinner.classList.remove("active");
    //reiniciar contadores
    counter.actual = 0;
    gameMaxScoreText.textContent = "0";
    bonusScoreText.textContent = "0";
    //reiniciamos la animación 
    cancelAnimationFrame(animationFrameNumber);
    resetGame();
    update();
  });
});

// Manejo de la selección de dificultad y ajuste de parámetros como la velocidad de los pipes y el límite de bananas a recolectar
difficultyOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    // Sacar selección previa
    difficultyOptions.forEach((o) => o.classList.remove("selected"));

    //aplicamos la clase selected al botón clickeado
    opt.classList.add("selected");

    //actualizamos el valor del selector de dificultad
    difficultySelector.value = opt.dataset.value;

    // manejamos los parámetros según la dificultad seleccionada
    if (difficultySelector.value === "Easy") {
      pipeSpeed = 2.5;
      counter.bonusLimit = 10;
    } else {
      pipeSpeed = 4;
      counter.bonusLimit = 20;
    }
    bonusLimitScoreText.textContent =
      "Recolectar " + counter.bonusLimit + " bananas";
  });
});
//en este evento manejamos el regreso al menú principal desde las pantallas de game over o victoria
backToMenuBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    flappyGameOver.classList.remove("active");
    flappyPreGame.classList.add("active");
    flappyWinner.classList.remove("active");
    counter.actual = 0;
    gameMaxScoreText.textContent = "0";
    bonusScoreText.textContent = "0";
    cancelAnimationFrame(animationFrameNumber);
    return;
  });
});

// esta funcion es la encargada de crear los tubos y las bananas en el juego
function createPipe() {
  const topHeight = Math.random() * (canvas.height - pipeGap - 50);//aca se calcula una altura aleatoria para el tubo superior
  const bottomHeight = canvas.height - topHeight - pipeGap;// y con eso se calcula la altura del tubo inferior

  //creamos el objeto del tubo y se agrega al array de tubos (pipes)
  pipes.push({
    x: canvas.width,
    topHeight,
    bottomHeight,
    scored: false,
  });

  // Crear banana en el espacio libre (pipeGap)
  if (Math.random() < 0.5) {
    // 50% probabilidad de que aparezca y si queremos cambiar la frecuencia podemos ajustar el valor que esta en el condicional (0,5)
    const gapTop = topHeight;
    const gapBottom = topHeight + pipeGap;

    bananas.push({
      x: canvas.width + pipeWidth / 2,
      y: gapTop + pipeGap / 2, // al centro del gap
      size: bananaSize,
      collected: false,
    });
  }
}

// Crear primer tubo
createPipe();

// Cada vez que le doy a una tecla contemplada para jugar activamos el salto del mono, el sonido de salto y evitamos que otras teclas interfieran (if)
document.addEventListener("keydown", (e) => {
  const allowedKeys = ["w", "arrowup", " "];
  playLowerSound("../assets/sounds/monkeyJump.mp3");
  if (!allowedKeys.includes(e.key.toLowerCase())) return;
  velocity = jumpStrength;
});

// Cada vez que doy click dentro del canvas.
canvas.addEventListener("click", (e) => {
  playLowerSound("../assets/sounds/monkeyJump.mp3");
  velocity = jumpStrength;
});

// en esta funcion lo que se hace es actualizar la posición del mono, los tubos y las bananas, ademas de manejar las colisiones y el puntaje
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

  // en esta parte manejamos la animación de voltereta del mono cuando pasa un tubo correctamente
  if (player.spinTime > 0) {
    player.spinTime -= deltaTime;

    // Progreso 0 → 1
    const progress = 1 - player.spinTime / player.spinDuration;

    // 360 grados
    player.rotation = progress * 2 * Math.PI;
  } else {
    player.rotation = 0;
  }

  //aca actualizamos la posición de los tubos y las bananas para que se muevan hacia la izquierda
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;
  });

  bananas.forEach((banana) => {
    banana.x -= pipeSpeed;
  });

  // Generar más pipes
  if (pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Eliminar pipes fuera de pantalla
  if (pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  // Eliminar bananas fuera de pantalla
  bananas = bananas.filter((b) => b.x + b.size > 0);

  //Comprobamos si el mono pasó correctamente un tubo para aumentar el puntaje
  pipes.forEach((pipe) => {
    if (!pipe.scored && pipe.x + pipeWidth < birdX) {
      pipe.scored = true;
      counter.actual++;
      gameMaxScoreText.textContent = counter.actual;
      playSound("../assets/sounds/Backflip.wav");
      triggerFlip(); // activa animación de voltereta
    }
  });

  // comprobamos si hubo colisión con los tubos y si es así mostramos la pantalla de game over
  for (let pipe of pipes) {
    if (birdX + birdSize > pipe.x && birdX < pipe.x + pipeWidth) {
      if (
        birdY < pipe.topHeight ||
        birdY + birdSize > canvas.height - pipe.bottomHeight
      ) {
        flappyGameOver.classList.add("active");
        gameOverScoreActual.textContent = counter.actual;
        if (counter.actual > counter.highest) {
          counter.highest = counter.actual;
        }
        gameOverScoreHighest.textContent = counter.highest;
        playSound("../assets/sounds/monkeyHit.wav");
        return;
      }
    }
  }

  // se comprueba si pudimos recolectar alguna banana
  bananas.forEach((banana) => {
    if (!banana.collected) {//si la banana no fue recolectada aun, se calcula la distancia entre el mono y la banana para ver si hubo colisión
      const dx = birdX + birdSize - (banana.x + banana.size / 2);
      const dy = birdY + birdSize - (banana.y + banana.size / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < birdSize + banana.size / 2) {// si la distancia es menor a la suma de los radios, hubo colisión y la contamos 
        banana.collected = true;
        counter.bonus++;
        bonusScoreText.textContent = counter.bonus;
        playSound("../assets/sounds/banana-collect.mp3");
        if (counter.bonus == counter.bonusLimit) {//si se alcanza al limite dado por la dificultad seleccionada, se muestra la pantalla de victoria
          setTimeout(() => {
            cancelAnimationFrame(animationFrameNumber);
            gameWinnerText.textContent = "¡Felicidades, recolectaste las " + counter.bonusLimit + " bananas!";
            flappyWinner.classList.add("active");
            return;
          }, 100);
        }
      }
    }
  });

  draw();
  animationFrameNumber = requestAnimationFrame(update);
}

// se encarga de dibujar todos los elementos del juego en el canvas, incluyendo el fondo parallax, el mono, las bananas y los tubos
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  parallax.update();
  parallax.draw(ctx);

  // Guardar estado del canvas
  ctx.save();

  // aca movemos el origen de coordenadas al centro del mono para facilitar la rotación
  ctx.translate(birdX + birdSize * 1.5, birdY + birdSize * 1.5);

  // aplicar rotacion
  ctx.rotate(player.rotation);

  // Recortar imagen para evitar bordes transparentes, osea recortamos por el  contorno del mono
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

  ctx.restore();

  //aca dibujamos las bananas que estan proximas a ser recolectadas
  bananas.forEach((banana) => {
    if (!banana.collected) {
      ctx.drawImage(
        bananaImg,
        banana.x - banana.size / 2,
        banana.y - banana.size / 2,
        banana.size,
        banana.size
      );
    }
  });
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
  bananas = [];
  createPipe(); // Genera el primer pipe
  counter.bonus = 0;

  // Opcional: evitar un salto automatico despues
  lastKeyPressed = false;
}
// Función para reproducir sonidos con un volumen específico
function playSound(src) {
  const sound = new Audio(src);
  sound.volume = 0.6; // volumen
  sound.play().catch((err) => {
    // Esto evita errores si el navegador bloquea reproducción sin interacción
    console.warn("No se pudo reproducir el sonido:", err);
  });
}
// Función para reproducir sonidos con un volumen más bajo para ciertos efectos
function playLowerSound(src) {
  const sound = new Audio(src);
  sound.volume = 0.1; // volumen mas bajo
  sound.play().catch((err) => {
    console.warn("No se pudo reproducir el sonido:", err);
  });
}
//lo que hacemos aca es activar la animación de voltereta del mono
function triggerFlip() {
  player.spinTime = player.spinDuration;
}

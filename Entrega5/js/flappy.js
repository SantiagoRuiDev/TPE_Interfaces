const canvas = document.getElementById("canvas");
const playButton = document.querySelector(".game-play-button");
const flappyPreGame = document.querySelector(".flappy-pre-display-container");
const ctx = canvas.getContext("2d");

// Atributos del pajaro.
let birdX = 50;
let birdY = 200;
let birdSize = 20;
let velocity = 0;
let gravity = 0.5;
let jumpStrength = -8;

// Atributos de los obstaculos
let pipes = [];
let pipeWidth = 50;
let pipeGap = 140; // Espaciado entre obstaculo de arriba y obstaculo de abajo.
let pipeSpeed = 2; // Velocidad con la que avanzan los tubos.

playButton.addEventListener('click', () => {
    flappyPreGame.classList.remove('active');
    update();
})

// Genera un obstáculo nuevo
function createPipe() {
    const topHeight = Math.random() * (canvas.height - pipeGap - 50);
    const bottomHeight = canvas.height - topHeight - pipeGap;

    pipes.push({
        x: canvas.width,
        topHeight,
        bottomHeight,
        scored: false
    });
}

// Crear primer tubo
createPipe();

// Cada que vez que le doy a una tecla contemplada entre las que originalmente tiene el flappy bird
document.addEventListener("keydown", (e) => {
    const allowedKeys = ["w", "arrowup", " "];
    if(!allowedKeys.includes(e.key.toLowerCase())) return;
    velocity = jumpStrength;
});

// Cada vez que doy click dentro del canvas.
canvas.addEventListener("click", (e) => {
    velocity = jumpStrength;
});

// Loop
function update() {
    velocity += gravity;
    birdY += velocity;

    // Evitar que caiga fuera del canvas
    if (birdY + birdSize > canvas.height) {
        birdY = canvas.height - birdSize;
        velocity = 0;
    }

    // Evitar que sobrepase el canvas
    if (birdY < 0) {
        birdY = 0 + birdSize;
        velocity = 0;
    }

    // --- Mover obstáculos ---
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Generar nuevos obstáculos
    if (pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    // Remover tubos fuera de pantalla
    if (pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }

    pipes.forEach(pipe => {
        // Si el pájaro pasó completamente el tubo
        if (!pipe.scored && pipe.x + pipeWidth < birdX) {
            pipe.scored = true;
            console.log("¡Pasaste un tubo!");
        }
    });

    // --- Detección de colisiones ---
    for (let pipe of pipes) {
            // Chequea cuando el pajaro esta dentro del tubo en X
        if (birdX + birdSize > pipe.x && birdX < pipe.x + pipeWidth) {
                // Chequea cuando toca los techos de los obstaculos
            if (birdY < pipe.topHeight || birdY + birdSize > canvas.height - pipe.bottomHeight) {
                resetGame()
            }
        }
    }

    draw();
    // Esta función de javascript es mas optima reemplaza el uso de interval. Actualiza el frame sincronizado con la velocidad de la pantalla (FPS)
    requestAnimationFrame(update);
}

// Dibujar el pajaro y las cañerias
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar pájaro
    ctx.fillStyle = "yellow";
    ctx.fillRect(birdX, birdY, birdSize, birdSize);

    // Dibujar tubos
    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        // Tubo de arriba
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Tubo de abajo     // Calcula posicion en Y restando altura del canvas menos su height.
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}

function resetGame() {
    // Resetear pájaro
    birdX = 50;
    birdY = 200;
    velocity = 0;

    // Resetear obstáculos
    pipes = [];
    createPipe(); // Genera el primer tubo

    // Opcional: evitar un salto automático después
    lastKeyPressed = false;
}
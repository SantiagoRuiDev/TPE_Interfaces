class ParallaxLayer {
    constructor(imageSrc, speed, canvasWidth, canvasHeight) {
        this.img = new Image();
        this.img.src = imageSrc;

        this.speed = speed;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // dos posiciones para scroll infinito
        this.x1 = 0;
        this.x2 = canvasWidth;
    }

    update() {
        this.x1 -= this.speed;
        this.x2 -= this.speed;

        // si sale de pantalla, se reinicia a la derecha
        if (this.x1 <= -this.canvasWidth) {
            this.x1 = this.canvasWidth;
        }
        if (this.x2 <= -this.canvasWidth) {
            this.x2 = this.canvasWidth;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x1, 0, this.canvasWidth, this.canvasHeight);
        ctx.drawImage(this.img, this.x2, 0, this.canvasWidth, this.canvasHeight);
    }
}

class ParallaxBackground {
    constructor(layers = []) {
        this.layers = layers; // array de ParallaxLayer
    }

    update() {
        this.layers.forEach(layer => layer.update());
    }

    draw(ctx) {
        this.layers.forEach(layer => layer.draw(ctx));
    }
}

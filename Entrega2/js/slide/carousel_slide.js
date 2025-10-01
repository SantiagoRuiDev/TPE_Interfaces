export const mapCarouselSlide = (game) => {
    return `
        <div class="carousel-card fade-in">
          <div class="carousel-card-display" 
               style="background-image: url('${game.image}'); background-size: cover; background-position: center;">
            <div class="carousel-card-information">
              <div class="carousel-card-text">
                <img src="${game.gameicon}" alt="Game Icon">
                <p>${game.description}</p>
              </div>
              <div class="carousel-card-price-action">
                <p>$${game.price}</p>
                <button class="carousel-card-button">Comprar ahora</button>
              </div>
            </div>
          </div>
          <div class="carousel-card-gradient">
            <div class="carousel-card-gradient-shadow"></div>
          </div>
        </div>
    `;
}
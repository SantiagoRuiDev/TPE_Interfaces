export const mapCarouselSlideDiscount = (game) => {
  return `
        <div class="carousel-card fade-in">
          <div class="carousel-card-display" 
               style="background-image: url('${
                 game.image
               }'); background-size: cover; background-position: center;">
            <div class="carousel-card-information">
              <div class="carousel-card-text">
                <img src="${game.gameicon}" alt="Game Icon">
                <p>${game.description}</p>
              </div>
              <div class="carousel-card-price-action">
                <div class="carousel-card-discount">
                  <div class="carousel-card-discount-price">
                    <p class="carousel-card-discount-original-price">$${game.price}</p>
                    <p>$${(
                      game.price -
                      (game.price * game.discount_percentage) / 100
                    ).toFixed(2)}</p>
                  </div>
                  <span class="carousel-card-discount-label">${
                    game.discount_percentage
                  }% OFF</span>
                </div>
                <button class="carousel-card-button">Comprar ahora</button>
              </div>
            </div>
          </div>
          <div class="carousel-card-gradient">
            <div class="carousel-card-gradient-shadow"></div>
          </div>
        </div>
    `;
};

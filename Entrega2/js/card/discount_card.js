export const mapDiscountCard = (game, catalogName) => {
  return `
    <div class="game-card">
          <img
            src="${game.image}"
            class="game-card-image"
            alt="Game Card Image"
          />
          <div class="game-card-body">
            <div class="game-card-information">
              <p>${game.category}</p>
              <h3>${game.gamename}</h3>
            </div>
            <div class="game-card-discount">
              <div class="game-card-discount-price">
                <p class="game-card-discount-original-price">$${game.price}</p>
                <p>$${(
                  game.price -
                  (game.price * game.discount_percentage) / 100
                ).toFixed(2)}</p>
              </div>
              <span class="game-card-discount-label">${
                game.discount_percentage
              }% OFF</span>
            </div>
          </div>
          <button class="${catalogName}-action-button action-button">
            <img src="../assets/images/Cart_Icon.svg" alt="Cart Menu Icon" />
            Comprar
          </button>
    </div>`;
};
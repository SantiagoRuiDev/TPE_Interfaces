export const mapNormalCard = (game) => {
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
            <p>$${game.price}</p>
          </div>
          <button class="action-button">
            <img src="../assets/images/Cart_Icon.svg" alt="Cart Menu Icon" />
            Comprar
          </button>
        </div>
        `;
};

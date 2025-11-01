export const mapOwnedCard = (game, catalogName) => {
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
            <p>En tu biblioteca</p>
          </div>
          <a href="blocka.html" class="${catalogName}-action-button action-button">
            <img src="../assets/images/Joystick_Icon.svg" alt="Play Icon" />
            Jugar
          </a>
        </div>
      `;
}
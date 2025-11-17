export const mapLevelCard = (level) => {
  return `
      <div class="game-image">
            <img
              src="${level.image}"
              alt="${level.name}"
              class="game-level-image"
            />
          </div>
      `;
};

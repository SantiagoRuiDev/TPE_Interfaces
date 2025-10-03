// Obtiene la parte de query de la URL actual
const queryString = window.location.search;

// Crea un objeto URLSearchParams
const urlParams = new URLSearchParams(queryString);

// Accede a los valores
const game = urlParams.get("game");       // "Fornite"
const category = urlParams.get("category"); // "Shooter"

const gameTitleElement = document.querySelector("#breadcrumb-game-title");
const categoryTitleElement = document.querySelector("#breadcrumb-category-title");
const gameHeaderTitleElement = document.querySelector("#game-title-text");

gameTitleElement.textContent = game;
gameHeaderTitleElement.textContent = game;
categoryTitleElement.textContent = category;
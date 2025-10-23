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
const ratingStarSelector = document.querySelectorAll(".rating-star");
const ratingFormButton =  document.querySelector(".game-rating-form-button");


gameTitleElement.textContent = game;
gameHeaderTitleElement.textContent = game;
categoryTitleElement.textContent = category;

ratingStarSelector.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      ratingStarSelector.forEach((b) => b.childNodes[1].childNodes[1].classList.remove("active"));
      let count = 0;
      for(const star of ratingStarSelector){
        if(count < index+1){
            // Accede al elemento HTML SVG -> luego al elemento G y finalmente al elemento path.
            star.childNodes[1].childNodes[1].classList.add('active');
            count++;
        }
      }
    })
})


ratingFormButton.addEventListener('click', (e) => {
    e.preventDefault();
})
import { mapDiscountCard } from "./card/discount_card.js";
import { mapFreeCard } from "./card/free_card.js";
import { mapNormalCard } from "./card/normal_card.js";
import { mapOwnedCard } from "./card/owned_card.js";

const catalog = document.querySelector(".game-list");
const next_btn = document.querySelector("#next-btn");
const prev_btn = document.querySelector("#prev-btn");
const catalog_items = [];
const items_per_page = 4;
let currentPage = 0;

next_btn.addEventListener('click', () => {
  const nextPage = currentPage + 1 < catalog_items.length ? currentPage + 1 : currentPage;
  currentPage = nextPage;
  renderCatalogPage(currentPage);
})

prev_btn.addEventListener('click', () => {
  const previousPage = currentPage - 1 >= 0 ? currentPage - 1 : currentPage;
  currentPage = previousPage;
  renderCatalogPage(currentPage);
})

const renderCatalogPage = (page) => {
  currentPage = page;
  catalog.innerHTML = ""; // Vaciar el catalogo
  for (const game of catalog_items[page]) {
    if (game.discount) {
      catalog.innerHTML += mapDiscountCard(game);
    } else if (game.is_free) {
      catalog.innerHTML += mapFreeCard(game);
    } else if (game.is_owned) {
      catalog.innerHTML += mapOwnedCard(game);
    } else {
      catalog.innerHTML += mapNormalCard(game);
    }
  }
};

/**
 *
 * Función inicial, consulta a la API y obtiene resultados para mapear catalogo de Juegos
 * (Los juegos mostrados en el catalogo pueden ser diferentes por sugerencias, generales o adquiridos)
 *
 */
const fetchCatalogItems = () => {
  try {
    fetch(API + "/catalog")
      .then((res) => res.json())
      .then((data) => {
        let aux_row = [];
        for (const i of data) {
          if (aux_row.length < items_per_page) {
            aux_row.push(i);
          } else {
            catalog_items.push(aux_row);
            aux_row = [];
            aux_row.push(i);
          }
        }
        renderCatalogPage(currentPage);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};

fetchCatalogItems();

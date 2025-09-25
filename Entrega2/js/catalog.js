import { mapDiscountCard } from "./card/discount_card.js";
import { mapFreeCard } from "./card/free_card.js";
import { mapNormalCard } from "./card/normal_card.js";
import { mapOwnedCard } from "./card/owned_card.js";
import { mapProductCartCard } from "./card/product_cart_card.js";

let cart = [];
const catalog = document.querySelector(".game-list");
const next_btn = document.querySelector("#next-btn");
const prev_btn = document.querySelector("#prev-btn");
const catalog_items = [];
const items_per_page = 4;
let currentPage = 0;

next_btn.addEventListener("click", () => {
  const nextPage =
    currentPage + 1 < catalog_items.length ? currentPage + 1 : currentPage;
  currentPage = nextPage;
  renderCatalogPage(currentPage);
});

prev_btn.addEventListener("click", () => {
  const previousPage = currentPage - 1 >= 0 ? currentPage - 1 : currentPage;
  currentPage = previousPage;
  renderCatalogPage(currentPage);
});

// En base a la pagina seleccionada elimina los items listados y carga los nuevos.
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

  // Esta función se dispara cuando se termina de cargar el catalogo, si se hace antes capturara una lista vacia.
  enableCartListing();
};

// Esta función captura el evento click para cada boton de acción de las cards del catalogo.
// Entonces nos permite saber cuando poner un elemento en el carrito.
const enableCartListing = () => {
  const buy_action_button = document.querySelectorAll(".action-button");
  buy_action_button.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = catalog_items[currentPage][index];
      addProductToCart(product);
    });
  });
};

// Se agrega el producto al carrito y se renderiza el HTML.
const addProductToCart = (product) => {
  if (!cart.find((p) => p.id == product.id)) {
    cart.push(product);
    renderCartProducts();
    listenCartActionButtons();
  }
};

// Se renderizan los productos (Primero de limpia el visualizador)
const renderCartProducts = () => {
  const cart_overview = document.querySelector(".cart-overview");
  cart_overview.innerHTML = "";
  cart.forEach((product) => {
    cart_overview.innerHTML += mapProductCartCard(product);
  });
  renderCartPricing();
};

const renderCartPricing = () => {
  const price_text = document.querySelector(".cart-price-text");
  const checkout_button = document.querySelector(".cart-action-button");
  if (cart.length > 0) {
    price_text.innerHTML =
      "Total a pagar: $" + cart.reduce((sum, p) => sum + p.price, 0);
    checkout_button.classList.add("active");
  } else {
    price_text.innerHTML = "No hay productos en el carrito";
    checkout_button.classList.remove("active");
  }
};

// Escucha eventos en los botones de eliminar del carrito.
const listenCartActionButtons = () => {
  const delete_action_buttons = document.querySelectorAll(
    ".cart-product-delete"
  );
  delete_action_buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      deleteProductFromCart(cart[index]); // En base al index del boton se elimina el elemento del carrito que coincida en esa pos.
    });
  });
};

// Elimina el producto del carrito. (Y renderiza el carrito nuevamente)
const deleteProductFromCart = (product) => {
  cart = cart.filter((p) => p.id !== product.id);
  renderCartProducts();
  listenCartActionButtons();
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

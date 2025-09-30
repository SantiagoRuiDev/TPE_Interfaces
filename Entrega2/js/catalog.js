import { mapCategoryButton } from "./button/category_button.js";
import { mapDiscountCard } from "./card/discount_card.js";
import { mapFreeCard } from "./card/free_card.js";
import { mapNormalCard } from "./card/normal_card.js";
import { mapOwnedCard } from "./card/owned_card.js";
import { mapProductCartCard } from "./card/product_cart_card.js";

let cart = [];
let categories = [];
const personal_catalog = document.querySelector("#personal-interest-games");
const category_selector = document.querySelector(".category-options");
const next_btn = document.querySelector("#next-btn");
const prev_btn = document.querySelector("#prev-btn");
const personal_catalog_items = [];
const items_per_page = 4;
let currentPage = 0;

next_btn.addEventListener("click", () => {
  const nextPage =
    currentPage + 1 < personal_catalog_items.length ? currentPage + 1 : currentPage;
  currentPage = nextPage;
  renderpersonal_catalogPage(currentPage);
});

prev_btn.addEventListener("click", () => {
  const previousPage = currentPage - 1 >= 0 ? currentPage - 1 : currentPage;
  currentPage = previousPage;
  renderpersonal_catalogPage(currentPage);
});

// En base a la pagina seleccionada elimina los items listados y carga los nuevos.
const renderpersonal_catalogPage = (page) => {
  currentPage = page;
  personal_catalog.innerHTML = ""; // Vaciar el personal_catalogo
  for (const game of personal_catalog_items[page]) {
    if (game.discount) {
      personal_catalog.innerHTML += mapDiscountCard(game);
    } else if (game.is_free) {
      personal_catalog.innerHTML += mapFreeCard(game);
    } else if (game.is_owned) {
      personal_catalog.innerHTML += mapOwnedCard(game);
    } else {
      personal_catalog.innerHTML += mapNormalCard(game);
    }
  }

  // Esta función se dispara cuando se termina de cargar el personal_catalogo, si se hace antes capturara una lista vacia.
  enableCartListing();
};

const renderCategorySelector = () => {
  for(const category of categories){
    category_selector.innerHTML += mapCategoryButton(category);
  }
  listenCategorySelector(); // Escuchar cambios de categoria.
}

// Esta función captura el evento click para cada boton de acción de las cards del personal_catalogo.
// Entonces nos permite saber cuando poner un elemento en el carrito.
const enableCartListing = () => {
  const buy_action_button = document.querySelectorAll(".action-button");
  buy_action_button.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = personal_catalog_items[currentPage][index];
      addProductToCart(product);
    });
  });
};

const listenCategorySelector = () => {
  const category_buttons = document.querySelectorAll(".category-action-button");
  category_buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      category_buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.toggle('active');
    });
  });
}

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
 * Función inicial, consulta a la API y obtiene resultados para mapear personal_catalogo de Juegos
 * (Los juegos mostrados en el personal_catalogo pueden ser diferentes por sugerencias, generales o adquiridos)
 *
 */
const fetchCatalogItems = () => {
  try {
    fetch(API + "/catalog")
      .then((res) => res.json())
      .then((data) => {
        let aux_row = [];
        for (const i of data) {
          if(categories.length == 0 || !categories.includes(i.category)){
            categories.push(i.category);
          }
          if (aux_row.length < items_per_page) {
            aux_row.push(i);
          } else {
            personal_catalog_items.push(aux_row);
            aux_row = [];
            aux_row.push(i);
          }
        }
        renderCategorySelector();
        renderpersonal_catalogPage(currentPage);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};

fetchCatalogItems();

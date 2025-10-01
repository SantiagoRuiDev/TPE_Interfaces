import { mapCategoryButton } from "./button/category_button.js";
import { mapDiscountCard } from "./card/discount_card.js";
import { mapFreeCard } from "./card/free_card.js";
import { mapNormalCard } from "./card/normal_card.js";
import { mapOwnedCard } from "./card/owned_card.js";
import { mapProductCartCard } from "./card/product_cart_card.js";

let cart = [];
let categories = [];
const category_selector = document.querySelector(".category-options");
const items_per_page = 4;
let currentPage = 0;
                      // "personal-interest-games" - "next-btn-personal" - "prev-btn-personal"
const createCatalog = (domSelector, nextBtn, prevBtn) => {
  return {
    domElement: document.querySelector(domSelector),
    nextBtn: document.querySelector(nextBtn),
    prevBtn: document.querySelector(prevBtn),
    items: [], // Matriz de paginas
    currentPage: 0,
  };
};

// En base a la pagina y catalogo seleccionado mostrara los items en esa pagina.
const renderCatalogPage = (catalog, page) => {
  catalog.currentPage = page;
  catalog.domElement.innerHTML = "";

  for (const game of catalog.items[page]) {
    if (game.discount) {
      catalog.domElement.innerHTML += mapDiscountCard(game);
    } else if (game.is_free) {
      catalog.domElement.innerHTML += mapFreeCard(game);
    } else if (game.is_owned) {
      catalog.domElement.innerHTML += mapOwnedCard(game);
    } else {
      catalog.domElement.innerHTML += mapNormalCard(game);
    }
  }

  enableCartListing(catalog);
};

// Activa la navegación para el catalogo escuchando los eventos en los botones de (Siguiente y anterior)
const toggleNavigation = (catalog) => {
  catalog.nextBtn.addEventListener("click", () => {
    const nextPage =
      catalog.currentPage + 1 < catalog.items.length
        ? catalog.currentPage + 1
        : 0;
    renderCatalogPage(catalog, nextPage);
  });

  catalog.prevBtn.addEventListener("click", () => {
    const prevPage =
      catalog.currentPage - 1 >= 0
        ? catalog.currentPage - 1
        : catalog.items.length - 1;
    renderCatalogPage(catalog, prevPage);
  });
};

// Renderiza los botones de las categorias en base a las categorias unicas entre todos los productos.
const renderCategorySelector = () => {
  for (const category of categories) {
    category_selector.innerHTML += mapCategoryButton(category);
  }
  listenCategorySelector(); // Escuchar cambios de categoria.
};

// Si hay un click en algun boton, primero activa la animación para que quede marcado y luego filtra.
const listenCategorySelector = () => {
  const category_buttons = document.querySelectorAll(".category-action-button");
  category_buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      category_buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.toggle("active");
    });
  });
};

// Esta función captura el evento click para cada boton de acción de las cards del personal_catalogo.
// Entonces nos permite saber cuando poner un elemento en el carrito.
const enableCartListing = (catalog) => {
  const buy_action_button = document.querySelectorAll(".action-button");
  buy_action_button.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = catalog.items[currentPage][index];
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
  renderCartPricing(); // Cada vez agregado un producto/eliminado se actualiza el precio.
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
const fetchCatalogItems = (catalog, endpoint) => {
  try {
    fetch(API + endpoint)
      .then((res) => res.json())
      .then((data) => {
        let aux_row = [];
        for (const i of data) {
          if (aux_row.length < items_per_page) {
            aux_row.push(i);
          } else {
            catalog.items.push(aux_row);
            aux_row = [i];
          }
        }
        renderCatalogPage(catalog, 0);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};

const fetchCatalogItemsAndCategories = (catalog, endpoint) => {
  try {
    fetch(API + endpoint)
      .then((res) => res.json())
      .then((data) => {
        let aux_row = [];
        for (const i of data) {
          if (categories.length == 0 || !categories.includes(i.category)) {
            categories.push(i.category);
          }
          if (aux_row.length < items_per_page) {
            aux_row.push(i);
          } else {
            catalog.items.push(aux_row);
            aux_row = [i];
          }
        }
        renderCategorySelector();
        renderCatalogPage(catalog, 0);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};


// Ejecución

const personalCatalog = createCatalog(
  "#personal-interest-games",
  "#next-btn-personal",
  "#prev-btn-personal"
);
const gamesCatalog = createCatalog(
  "#platform-available-games",
  "#next-btn-all",
  "#prev-btn-all"
);

toggleNavigation(personalCatalog);
toggleNavigation(gamesCatalog);

fetchCatalogItemsAndCategories(gamesCatalog, "/catalog");
fetchCatalogItems(personalCatalog, "/catalog");

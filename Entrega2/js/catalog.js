import { mapCategoryButton } from "./button/category_button.js";
import { mapDiscountCard } from "./card/discount_card.js";
import { mapFreeCard } from "./card/free_card.js";
import { mapNormalCard } from "./card/normal_card.js";
import { mapOwnedCard } from "./card/owned_card.js";
import { mapProductCartCard } from "./card/product_cart_card.js";
import { mapProductDiscountCartCard } from "./card/product_discount_cart_card.js";

let cart = [];
let categories = [];
let selectedCategory = "";
const category_selector = document.querySelector(".category-options");
const items_per_page = 4;
                      // "personal-interest-games" - "next-btn-personal" - "prev-btn-personal"
const createCatalog = (name, domSelector, nextBtn, prevBtn) => {
  return {
    name: name,
    domElement: document.querySelector(domSelector),
    nextBtn: document.querySelector(nextBtn),
    prevBtn: document.querySelector(prevBtn),
    items: [], // Matriz de paginas
    filtered: [],
    currentPage: 0,
  };
};

// En base a la pagina y catalogo seleccionado mostrara los items en esa pagina.
const renderCatalogPage = (catalog, page) => {
  catalog.currentPage = page;
  catalog.domElement.innerHTML = "";

  // Comprobamos de donde mapearemos los juegos dependiendo si hay filtro de categoria o no.
  const list = selectedCategory == "" ? catalog.items[page] : catalog.filtered[page];

  for (const game of list) {
    if (game.discount) {
      catalog.domElement.innerHTML += mapDiscountCard(game, catalog.name);
    } else if (game.is_free) {
      catalog.domElement.innerHTML += mapFreeCard(game, catalog.name);
    } else if (game.is_owned) {
      catalog.domElement.innerHTML += mapOwnedCard(game, catalog.name);
    } else {
      catalog.domElement.innerHTML += mapNormalCard(game, catalog.name);
    }
  }

  enableCartListing(catalog);
};

// Activa la navegación para el catalogo escuchando los eventos en los botones de (Siguiente y anterior)
const toggleNavigation = (catalog) => {
  catalog.nextBtn.addEventListener("click", () => {
    let nextPage = 0;
    if(selectedCategory == ""){
      nextPage =
      catalog.currentPage + 1 < catalog.items.length
        ? catalog.currentPage + 1
        : 0;
    } else nextPage = catalog.currentPage + 1 < catalog.filtered.length ? catalog.currentPage + 1 : 0;
    renderCatalogPage(catalog, nextPage);
  });

  catalog.prevBtn.addEventListener("click", () => {
    let prevPage = 0
    if(selectedCategory == ""){
      prevPage =
      catalog.currentPage - 1 >= 0
        ? catalog.currentPage - 1
        : catalog.items.length - 1;
    } else prevPage = catalog.currentPage - 1 >= 0 ? catalog.currentPage - 1 : catalog.filtered.length - 1;
    renderCatalogPage(catalog, prevPage);
  });
};

// Renderiza los botones de las categorias en base a las categorias unicas entre todos los productos.
const renderCategorySelector = (catalog) => {
  for (const category of categories) {
    category_selector.innerHTML += mapCategoryButton(category);
  }
  listenCategorySelector(catalog); // Escuchar cambios de categoria.
};

// Si hay un click en algun boton, primero activa la animación para que quede marcado y luego filtra.
const listenCategorySelector = (catalog) => {
  const category_buttons = document.querySelectorAll(".category-action-button");
  const category_reset = document.querySelector("#reset-category-button");
  category_reset.addEventListener('click', () => { // Si se clickea el boton de "Todo"
      category_buttons.forEach((b) => b.classList.remove("active"));
      selectedCategory = ""; // Resetea la categoria
      category_reset.classList.add('active');
      renderCatalogPage(catalog, 0) // Renderiza nuevamente el catalogo
  })
  category_buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      category_reset.classList.remove('active');
      category_buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.toggle("active");
      selectedCategory = categories[index];
      filterCatalogByCategory(catalog); // Filtramos por categoria
    });
  });
};

const filterCatalogByCategory = (catalog) => {
  let filteredPage = [] // Pagina
  let pagesManager = []; // Matriz
  for(const page of catalog.items){ // Recorremos las paginas tal cual las obtenemos de la API
    for(const game of page){
      if(game.category == selectedCategory){ // Chequeamos si la categoria es la misma
          if (filteredPage.length < items_per_page) {
            filteredPage.push(game);
          } else {
            pagesManager.push(filteredPage);
            filteredPage = [game];
          } // Comprobamos que no rebalse el limite de 4 items por pagina.
      }
    }
  }
  if(filteredPage.length > 0 && filteredPage.length < items_per_page){ // Si la pagina no quedo completa (menos de 4 items)
    pagesManager.push(filteredPage);
  }
  catalog.filtered = pagesManager; // El atributo filtered sera dinamico en base a la categoria seleccionada. (El .items sirve para guardar las paginas tal cual las envia la API)
  renderCatalogPage(catalog, 0); // Renderizamos.
}

// Esta función captura el evento click para cada boton de acción de las cards del personal_catalogo.
// Entonces nos permite saber cuando poner un elemento en el carrito.
const enableCartListing = (catalog) => {
  const buy_action_button = document.querySelectorAll("." + catalog.name + "-action-button"); // Es importante que los botones sean diferentes para cada catalogo para evitar que al escuchar los clicks escuche los de otros catalogos.
  buy_action_button.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const product = catalog.items[catalog.currentPage][index];
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
    if(product.discount) cart_overview.innerHTML += mapProductDiscountCartCard(product);
    else cart_overview.innerHTML += mapProductCartCard(product);
  });
  renderCartPricing(); // Cada vez agregado un producto/eliminado se actualiza el precio.
};

const renderCartPricing = () => {
  const price_text = document.querySelector(".cart-price-text");
  const checkout_button = document.querySelector(".cart-action-button");
  if (cart.length > 0) {
    let cart_total = 0;
    for(const p of cart) {
      if(p.discount) cart_total += p.price - (p.price * p.discount_percentage) / 100;
      else cart_total += p.price;
    }
    price_text.innerHTML =
      "Total a pagar: $" + cart_total.toFixed(2);
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
    fetch(API_2 + endpoint)
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
        if(aux_row.length < items_per_page){
          catalog.items.push(aux_row);
          aux_row = [];
        }
        renderCatalogPage(catalog, 0);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};

const fetchCatalogItemsAndCategories = (catalog, endpoint) => {
  try {
    fetch(API_1 + endpoint)
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
        if(aux_row.length < items_per_page){
          catalog.items.push(aux_row);
          aux_row = [];
        }
        renderCategorySelector(catalog);
        renderCatalogPage(catalog, 0);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};


// Ejecución

const personalCatalog = createCatalog(
  "personal-catalog",
  "#personal-interest-games",
  "#next-btn-personal",
  "#prev-btn-personal"
);
const gamesCatalog = createCatalog(
  "global-catalog",
  "#platform-available-games",
  "#next-btn-all",
  "#prev-btn-all"
);

toggleNavigation(personalCatalog);
toggleNavigation(gamesCatalog);

fetchCatalogItemsAndCategories(gamesCatalog, "/catalog");
fetchCatalogItems(personalCatalog, "/personal-suggestions");

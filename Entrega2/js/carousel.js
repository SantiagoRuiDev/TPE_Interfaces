import { mapCarouselSlide } from "./slide/carousel_slide.js";
import { mapCarouselSlideDiscount } from "./slide/carousel_slide_discount.js";

const carousel = document.querySelector(".carousel-display");
const carousel_navigation = document.querySelector(".carousel-navigation");
const carousel_items = [];
let currentIndex = 0;

const watchCarouselNavigation = () => {
  const buttons = document.querySelectorAll(".carousel-navigation-button");
  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentIndex = index;
      setCarouselNavigationButtonActive(buttons, btn); // Esta función marca al boton como activado (Lo cambia de color respecto los demas)
      renderCarouselItem(index); // Esta función renderiza el Juego correspondiente a la posición index en carousel_items
    });
  });
};

const setCarouselNavigationButtonActive = (buttons, btn) => {
  buttons.forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
};

const cycleCarouselSlideChanger = (time) => {
  const buttons = document.querySelectorAll(".carousel-navigation-button");
  setTimeout(() => {
    setInterval(() => {
      const index =
        currentIndex + 1 < carousel_items.length ? currentIndex + 1 : 0;
      currentIndex = index;
      setCarouselNavigationButtonActive(buttons, buttons[currentIndex]);
      renderCarouselItem(currentIndex);
    }, time);
  }, 5000); // Se ejecuta luego de 5 segundos debido a la animación al cargar la pagina.
};

function renderCarouselNavigationButton() {
  for (const i of carousel_items) {
    carousel_navigation.innerHTML += `<button class="carousel-navigation-button"></button>`;
  }
  const buttons = document.querySelectorAll(".carousel-navigation-button");
  setCarouselNavigationButtonActive(buttons, buttons[0]); // Muy importante para que el primer boton este marcado (Si no aparece en el color desmarcado)
  watchCarouselNavigation();
}

function renderCarouselItem(index) {
  const item = carousel_items[index];
  const card = document.querySelector(".carousel-card");
  if (card) {
    card.classList.add("fade-out");
    setTimeout(() => {
      if (item.discount) carousel.innerHTML = mapCarouselSlideDiscount(item);
      else carousel.innerHTML = mapCarouselSlide(item);
    }, 300); // mismo tiempo que el fade-out
  } else {
    if (item.discount) carousel.innerHTML = mapCarouselSlideDiscount(item);
    else carousel.innerHTML = mapCarouselSlide(item);
  }
}

/**
 *
 * Función inicial, consulta a la API y obtiene resultados para mapear carrusel
 * (Los juegos mostrados en el carrusel seria una selección general del sistema no son relacionados al usuario)
 *
 */
const fetchCarouselItems = () => {
  try {
    fetch(API + "/carousel")
      .then((res) => res.json())
      .then((data) => {
        carousel_items.push(...data);
        renderCarouselNavigationButton();
        renderCarouselItem(currentIndex);
        cycleCarouselSlideChanger(4000);
      })
      .catch((err) => console.log(err));
  } catch (error) {}
};

fetchCarouselItems();

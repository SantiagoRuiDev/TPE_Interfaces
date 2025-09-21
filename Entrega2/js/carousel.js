const buttons = document.querySelectorAll(".carousel-navigation-button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    // saca la clase activa de todos
    buttons.forEach(b => b.classList.remove("active"));
    // agrega la clase al clickeado
    btn.classList.add("active");
  });
});
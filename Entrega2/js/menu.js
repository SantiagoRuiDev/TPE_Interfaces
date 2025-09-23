const action_button = document.querySelector("#hamburguer-menu-button");

action_button.addEventListener("click", () => {
  const menu = document.querySelector(".hamburguer-menu");
  menu.classList.toggle("active");
});
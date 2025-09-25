const action_button = document.querySelector("#hamburguer-menu-button");

action_button.addEventListener("click", () => {
  const menu = document.querySelector(".hamburguer-menu");
  const web_content = document.querySelector(".web-content-blur");
  web_content.classList.toggle("active")
  menu.classList.toggle("active");
});
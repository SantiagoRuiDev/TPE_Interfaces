const cart_action_button = document.querySelector("#cart-menu-button");

cart_action_button.addEventListener("click", () => {
  const menu = document.querySelector(".cart-menu");
  const web_content = document.querySelector(".web-content-blur");
  web_content.classList.toggle("active")
  menu.classList.toggle("active");
});

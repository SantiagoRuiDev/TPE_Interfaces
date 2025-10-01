import { mapOwnedCard } from "./card/owned_card.js";

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const content = document.getElementById("game-content");

  setTimeout(() => {
    loader.style.display = "none";
    content.style.display = "block";
  }, 2000); 
});


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-btn");
  if (btn) {
    e.preventDefault(); 
    const category = btn.dataset.category;
    const name = btn.dataset.name;

    localStorage.setItem("breadcrumbData", JSON.stringify({ category, name }));

  }
});

document.addEventListener("DOMContentLoaded",()=>{
    const breadcrumb = document.getElementById("breadcrumb");
    const data = JSON.parse(localStorange.getItem("breadcrumbdata"));

    if (data){
        breadcrumb.innerHTML = `
      <a href="index.html">Jugar</a> <span>→</span>
      <a href="#">${data.category}</a> <span>→</span>
      <span>${data.name}</span>
    `;
    }
});
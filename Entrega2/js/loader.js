window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  const body = document.querySelector("body");
  const content = document.querySelector(".web-content");

  setTimeout(() => {
    loader.style.display = "none";
    body.style.overflowY = "scroll";
    content.style.display = "block";
  }, 5000); 
});

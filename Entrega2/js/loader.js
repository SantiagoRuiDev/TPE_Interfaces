window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  const body = document.querySelector("body");
  const content = document.querySelector(".web-content");
  const percentage = document.querySelector(".loader-percentage");
  let load_percentage = 0;

  const intervalId = setInterval(() => {
    if (load_percentage < 100) {
      load_percentage++;
      percentage.textContent = load_percentage + "%";
    } else {
      clearInterval(intervalId) // Termina la ejecución
    }
  }, 50);

  setTimeout(() => {
    loader.style.display = "none";
    body.style.overflowY = "scroll";
    content.style.display = "block";
  }, 5500);
});

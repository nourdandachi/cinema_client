document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");

  menuIcon.addEventListener("click", () => {
    navbar.classList.add("active");
    menuIcon.style.display = "none";
    closeIcon.style.display = "inline";
  });

  closeIcon.addEventListener("click", () => {
    navbar.classList.remove("active");
    menuIcon.style.display = "inline";
    closeIcon.style.display = "none";
  });
});

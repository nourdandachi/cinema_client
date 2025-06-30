document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");

  const user_name = localStorage.getItem("full_name");
  const nav_name= document.querySelector(".user-name");
  nav_name.innerHTML = `${user_name}`;

  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");
  

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

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


  const id = localStorage.getItem("selected-movie");

  

  const seats = document.querySelector(".all-seats");
  for(let i=0; i<59; i++){
        const randint = Math.floor(Math.random()*2);
        const booked = randint === 1 ? "booked" : "";

        seats.insertAdjacentHTML(
            "beforeend",
            `<input type="checkbox" name="tickets" id="s${i + 2}" />
            <label for="s${i + 2}" class="seat ${booked}"></label>`
        );

    
    }
  
});

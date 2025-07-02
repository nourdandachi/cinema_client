document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");

  const user_name = localStorage.getItem("full_name");
  const nav_name= document.querySelector(".user-name");
  nav_name.innerHTML = `${user_name}`;

  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");
  localStorage.setItem('selected-auditorium', "-");
  

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

  
  const card_container = document.querySelector(".card-container");

  

  async function fetchHighestMovies() {
    try {
        
      const response = await axios.get(`../../cinema_server/controllers/get_highest_ratings.php`);

        if (response.data.status === 200) {

            if (response.data.status === 200) {

            const movies = response.data.movies;
              movies.forEach(movie => {
                card_container.innerHTML += `
                  <div class="card">
                      <img src=${movie.poster_url}>
                      <div class="card-content">
                          <h3>${movie.title}</h3>
                          <p>${movie.description}</p>
                          <a href="/smart_cinema_booking/pages/movies.html" class="btn">Book</a><div class="rating">
                            <i class='bx  bxs-star'  ></i>
                            <h4>${movie.rating}</h4>
                        </div>
                      </div>
                  </div>
                  `;
              
              });

              

          }
        } else {
            console.error("Error:", response.data.message);
        }

    } catch (error) {
      console.error("Request failed:", error);
    }
  }

 

    

  
  

  fetchHighestMovies();
  
});

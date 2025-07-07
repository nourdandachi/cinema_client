document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");
  const container = document.querySelector(".movie-grid");

  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");
  localStorage.setItem('selected-auditorium', "-");

  const user_name = localStorage.getItem("full_name");
  const nav_name= document.querySelector(".user-name");
  nav_name.innerHTML = `${user_name}`;

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

  async function fetchMovieDetails() {
    try {
        const response = await axios.get(`../../cinema_server/movies`);

        if (response.data.status === 200) {

            const movies = response.data.payload;
            movies.forEach(movie => {
            container.innerHTML += `
                <div class="movie-item">
                    <a href="../pages/movie_details.html" onclick="localStorage.setItem('temp-movie', ${movie.id})">
                        <img src="${movie.poster_url}" alt="${movie.title}">
                    </a>
                    <h4>${movie.title}</h4>
                </div>
            `;
});



        } else {
            console.error("Error:", response.data.message);
        }
    } catch (error) {
            console.error("Request failed:", error);
    }
    }

    fetchMovieDetails();
});
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");
  const container = document.querySelector(".movie-grid");

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
        const response = await axios.get(`../../cinema_server/controllers/get_movies.php`);

        if (response.data.status === 200) {

            const movies = response.data.movies;
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
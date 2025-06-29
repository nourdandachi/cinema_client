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

  
  const result = document.querySelector(".result");
  const movieId = localStorage.getItem("selected-movie");

  const halls= document.querySelector(".audi");

    async function fetchMovieDetails() {
    try {
        const response = await axios.get(`../../cinema_server/controllers/get_movies.php`, {
        params: { id: movieId }
        });

        if (response.data.status === 200) {

            const movie = response.data.movies;
            console.log("Movie found:", movie);

            result.innerHTML = `
                <div class="info">
                    <a href="${movie.trailer_url}" target="_blank">
                        <img src="${movie.poster_url}" class="poster" alt="${movie.title}" />
                    </a>
                    <div>
                        <h2>${movie.title}</h2>
                        <div class="rating">
                            <i class='bx  bxs-star'  ></i>
                            <h4>${movie.rating}</h4>
                        </div>
                        <div class="details">
                            <span>${movie.release_date}</span>
                            <span>${movie.duration_minutes} min</span>
                        </div>
                        <div class="genre">
                            ${movie.genre.split(",").map(g => `<div>${g.trim()}</div>`).join("")}
                        </div>
                    </div>
                </div>
                <h3>Plot: </h3>
                <p>${movie.description}</p>
                <h3>Cast: </h3>
                <p>${movie.actors}</p>
                
            `;

        } else {
            console.error("Error:", response.data.message);
        }
    } catch (error) {
            console.error("Request failed:", error);
    }
    }

    async function fetchAuditoriums() {
        try {
            const response = await axios.get(`../../cinema_server/controllers/get_auditoriums.php`);

            if (response.data.status === 200) {
            const auditoriums = response.data.auditoriums;

            let html = "";

            auditoriums.forEach((auditorium, index) => {
                const inputId = `h${auditorium.id}`;
                const labelFor = inputId;

                html += `
                <input type="radio" name="hall" id="${inputId}" ${index === 0 ? "checked" : ""}>
                <label for="${labelFor}" class="hall">${auditorium.name}</label>
                `;
            });

            document.querySelector(".halls").innerHTML = html;

            } else {
            console.error("Error:", response.data.message);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
}



    fetchAuditoriums()
    fetchMovieDetails();

    const bookBtn = document.querySelector(".book-btn");

    bookBtn.addEventListener("click", () => {
    const selectedHall = document.querySelector('input[name="hall"]:checked');

    if (selectedHall) {
        const auditoriumId = selectedHall.id.replace("h", "");
        localStorage.setItem("selected-movie", movieId);
        localStorage.setItem("selected-auditorium", auditoriumId);
    } else {
        alert("Please select an auditorium before booking.");
    }
    });



  
});
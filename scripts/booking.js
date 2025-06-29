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


  const movie_id = localStorage.getItem("selected-movie");
  
  async function fetchAuditoriumLayout(auditoriumId) {
    try {
      const response = await axios.get("../../cinema_server/controllers/get_auditoriums.php", {
        params: { id: auditoriumId }
      });

      if (response.data.status === 200 && response.data.auditorium) {
        const auditorium = response.data.auditorium;

        const layout = JSON.parse(auditorium.seat_layout);

        console.log("Auditorium layout:", layout);

        return layout;
      } else {
        console.error("Failed to fetch auditorium layout:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Request error:", error);
      return null;
    }
  }

  const auditorium_id = localStorage.getItem("selected-auditorium");

  fetchAuditoriumLayout(auditorium_id).then(layout => {
    if (layout) {
      generateSeatGrid(layout.rows, layout.cols);
    }
  });


  function generateSeatGrid(rows, cols) {
    const seatsContainer = document.querySelector(".all-seats");
    seatsContainer.innerHTML = "";

    let seatId = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const booked = Math.random() < 0.3 ? "booked" : "";

        seatsContainer.insertAdjacentHTML("beforeend", `
          <input type="checkbox" name="tickets" id="s${seatId}" ${booked ? 'disabled' : ''}/>
          <label for="s${seatId}" class="seat ${booked}"></label>
        `);

        seatId++;
      }
      seatsContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }
  }

  

  // const seats = document.querySelector(".all-seats");
  // for(let i=0; i<49; i++){
  //       const randint = Math.floor(Math.random()*2);
  //       const booked = randint === 1 ? "booked" : "";

  //       seats.insertAdjacentHTML(
  //           "beforeend",
  //           `<input type="checkbox" name="tickets" id="s${i + 2}" />
  //           <label for="s${i + 2}" class="seat ${booked}"></label>`
  //       );

    
  //   }
  
});

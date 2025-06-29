document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const navbar = document.querySelector(".navbar");
  const movie_id = localStorage.getItem("selected-movie");
  const auditorium_id = localStorage.getItem("selected-auditorium");

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

  document.querySelector(".price button").addEventListener("click", handleBooking);

  fetchAuditoriumLayout(auditorium_id).then(layout => {
    if (layout) {
      fetchSeatsByAuditoriumId(auditorium_id).then(seats => {
        generateSeatGrid(layout.rows, layout.cols, seats);
      });
    }
  });

  fetchShowtimes(movie_id, auditorium_id);

  async function fetchAuditoriumLayout(auditoriumId) {
    try {
      const response = await axios.get("../../cinema_server/controllers/get_auditoriums.php", {
        params: { id: auditoriumId }
      });

      if (response.data.status === 200 && response.data.auditorium) {
        return JSON.parse(response.data.auditorium.seat_layout);
      }
    } catch {
      return null;
    }
  }

  async function fetchSeatsByAuditoriumId(auditoriumId) {
    try {
      const response = await axios.get("../../cinema_server/controllers/get_seats_by_auditorium_id.php", {
        params: { auditorium_id: auditoriumId }
      });

      return response.data.status === 200 ? response.data.seats : [];
    } catch {
      return [];
    }
  }

  async function fetchShowtimes(movieId, auditoriumId) {
    try {
      const response = await axios.post("../../cinema_server/controllers/get_showtimes_by_movie_and_hall.php", {
        movie_id: movieId,
        auditorium_id: auditoriumId
      });

      if (response.data.status === 200 && response.data.dates.length > 0) {
        displayShowDates(response.data.dates);
      }
    } catch {}
  }

  function displayShowDates(dates) {
    const datesContainer = document.querySelector(".dates");
    const timesContainer = document.querySelector(".times");

    let dateHTML = dates.map((entry, index) => {
      const d = new Date(entry.date);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();

      return `
        <input type="radio" name="date" id="d${index}" data-index="${index}" data-date="${entry.date}">
        <label for="d${index}" class="dates-item">
          <div class="day">${dayName}</div>
          <div class="date">${dayNum}</div>
        </label>
      `;
    }).join("");

    datesContainer.innerHTML = dateHTML;

    function displayTimesForDate(index) {
      const times = dates[index].times;
      const timeHTML = times.map((timeStr, i) => {
        const formatted = timeStr.slice(0, 5);
        return `
          <input type="radio" name="time" id="t${i}" data-time="${timeStr}">
          <label for="t${i}" class="time">${formatted}</label>
        `;
      }).join("");

      timesContainer.innerHTML = timeHTML;
    }

    displayTimesForDate(0);

    datesContainer.addEventListener("change", (e) => {
      const selectedIndex = e.target.dataset.index;
      if (selectedIndex) displayTimesForDate(selectedIndex);
    });

    timesContainer.addEventListener("change", async () => {
      const selectedDateIndex = document.querySelector('input[name="date"]:checked')?.dataset.index;
      const selectedDate = dates[selectedDateIndex]?.date;
      const selectedTime = document.querySelector('input[name="time"]:checked')?.dataset.time;

      if (!selectedDate || !selectedTime) return;

      const layout = await fetchAuditoriumLayout(auditorium_id);
      const seats = await fetchSeatsByAuditoriumId(auditorium_id);
      const showtimeId = await fetchShowtimeId(movie_id, auditorium_id, selectedDate, selectedTime);
      const bookedSeats = showtimeId ? await fetchBookedSeats(showtimeId) : [];

      generateSeatGrid(layout.rows, layout.cols, seats, bookedSeats);
    });
  }

  async function fetchShowtimeId(movieId, auditoriumId, date, time) {
    try {
      const response = await axios.post("../../cinema_server/controllers/get_showtime_by_date_and_time.php", {
        movie_id: movieId,
        auditorium_id: auditoriumId,
        date,
        time
      });

      return response.data.status === 200 ? response.data.showtime_id : null;
    } catch {
      return null;
    }
  }

  async function fetchBookedSeats(showtimeId) {
    try {
      const response = await axios.post("../../cinema_server/controllers/get_booked_seats.php", {
        showtime_id: showtimeId
      });

      return response.data.status === 200 ? response.data.booked_seats : [];
    } catch {
      return [];
    }
  }

  function generateSeatGrid(rows, cols, seats, bookedSeats = []) {
    const seatsContainer = document.querySelector(".all-seats");
    seatsContainer.innerHTML = "";
    seatsContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    seats.forEach(seat => {
      const seatLabel = `${seat.seat_row}${seat.seat_number}`;
      const seatId = Number(seat.id);
      const isBooked = bookedSeats.map(Number).includes(seatId);
      const price = seat.seat_type === "VIP" ? 20 : 10;

      seatsContainer.insertAdjacentHTML("beforeend", `
        <input 
          type="checkbox" 
          name="tickets" 
          id="s${seatId}" 
          data-id="${seatId}" 
          data-label="${seatLabel}" 
          data-price="${price}" 
          ${isBooked ? "disabled" : ""}
        />
        <label 
          for="s${seatId}" 
          class="seat ${isBooked ? "booked" : ""}" 
          title="${seatLabel} - ${seat.seat_type} - $${price}">
        </label>
      `);
    });

    updateSelectedInfo();
    attachSeatListeners();
  }

  function attachSeatListeners() {
    document.querySelectorAll('input[name="tickets"]').forEach(seatInput => {
      seatInput.addEventListener("change", updateSelectedInfo);
    });
  }

  function updateSelectedInfo() {
    const selected = Array.from(document.querySelectorAll('input[name="tickets"]:checked'));
    let total = 0;

    selected.forEach(seat => {
      total += parseFloat(seat.dataset.price || 10);
      document.querySelector(`label[for="${seat.id}"]`).classList.add("selected");
    });

    document.querySelectorAll('input[name="tickets"]').forEach(seat => {
      if (!seat.checked) {
        document.querySelector(`label[for="${seat.id}"]`).classList.remove("selected");
      }
    });

    document.querySelector(".count").textContent = selected.length;
    document.querySelector(".amount").textContent = total;
  }

  async function handleBooking() {
    const selectedDateInput = document.querySelector('input[name="date"]:checked');
    const selectedTimeInput = document.querySelector('input[name="time"]:checked');
    const selectedSeats = Array.from(document.querySelectorAll('input[name="tickets"]:checked'));

    if (!selectedDateInput || !selectedTimeInput || selectedSeats.length === 0) {
      alert("Please select a date, time, and at least one seat.");
      return;
    }

    const selectedDate = selectedDateInput.dataset.date;
    const selectedTime = selectedTimeInput.dataset.time;
    const showtimeId = await fetchShowtimeId(movie_id, auditorium_id, selectedDate, selectedTime);

    if (!showtimeId) {
      alert("Showtime not found. Please try again.");
      return;
    }

    let totalPrice = 0;
    selectedSeats.forEach(seat => {
      totalPrice += parseFloat(seat.dataset.price || 10);
    });

    const userId = 12;

    const bookingRes = await axios.post("../../cinema_server/controllers/add_booking.php", {
      user_id: userId,
      showtime_id: showtimeId,
      total_price: totalPrice,
      booking_status: "confirmed"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (bookingRes.data.status !== 200 || !bookingRes.data.booking_id) {
      alert("Booking failed: " + (bookingRes.data?.message || "Unknown error"));
      return;
    }

    const bookingId = bookingRes.data.booking_id;

    for (let seat of selectedSeats) {
      const seatBookingRes = await axios.post("../../cinema_server/controllers/add_booked_seat.php", {
        booking_id: bookingId,
        seat_id: seat.dataset.id,
        price: seat.dataset.price
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (seatBookingRes.data.status !== 200) {
        alert("Booking failed for seat " + (seat.dataset.label || seat.dataset.id));
        return;
      }
    }

    alert("Booking successful!");
    window.location.href = "../index.html";
  }
});

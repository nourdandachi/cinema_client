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


  const user_id = localStorage.getItem("user_id");
  const user_name = localStorage.getItem("full_name");


  const nav_name= document.querySelector(".user-name");
  nav_name.innerHTML = `${user_name}`;

  const title= document.getElementById("title");
  const desc= document.getElementById("desc");
  const genre= document.getElementById("genre");
  const actors= document.getElementById("actors");
  const trailer_url= document.getElementById("trailer-url");
  const poster= document.getElementById("poster");
  const rating= document.getElementById("rating");
  const duration= document.getElementById("duration");
  const release_date= document.getElementById("release-date");

  const base64 = {"string": ''};

  poster.addEventListener('change', () => {
    const image= poster.files[0];

    if(image){
        const reader = new FileReader;
        reader.onload = (e) =>{
            base64.string= e.target.result;
            console.log("success");
        }
            reader.onerror = (error) => {
            alert('Error reading image');
            console.error('Error reading image:', error);
        };

        reader.readAsDataURL(image);

    }

  })
  

  document.querySelector(".btn-save").addEventListener("click", (event) => {
    event.preventDefault();

    if (
        !title.value.trim() ||
        !desc.value.trim() ||
        !genre.value.trim() ||
        !rating.value.trim() ||
        !actors.value.trim() ||
        !trailer_url.value.trim() ||
        !base64.string ||
        !release_date.value.trim() ||
        !duration.value.trim()
        ) {
        alert("Please fill in all fields.");
        return;
    }


    const movieData = {
      title: title.value,
      description: desc.value,
      genre: genre.value,
      rating: rating.value,
      actors: actors.value,
      trailer_url: trailer_url.value,
      poster_url: base64.string,
      release_date: release_date.value,
      duration_minutes: duration.value
    };

    addMovie(movieData);
  });



  async function addMovie(data) {

    try {
      const response = await axios.post(
        '../../cinema_server/controllers/add_movie',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data); 
      if (response.data.status === 200) {
        alert("Movie added successfully!");
      } else {
        alert(response.data.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Operation error:", error);
      alert("Something went wrong. Try again later.");
    }
  }


});

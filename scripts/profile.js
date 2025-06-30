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
  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");


  const nav_name= document.querySelector(".user-name");
  nav_name.innerHTML = `${user_name}`;

  const first_name= document.getElementById("first-name");
  const last_name= document.getElementById("last-name");
  const email= document.getElementById("email");
  const number= document.getElementById("number");
  const birthdate= document.getElementById("birthdate");
  const genres= document.getElementById("genres");
  

  
  
  async function fetchUserDetails() {
    
    try {
        const response = await axios.get(`../../cinema_server/controllers/get_users.php`, {
        params: { id: user_id }
        });

        if (response.data.status === 200) {

            const user = response.data.users;
            console.log("user found:", user);
            first_name.value = response.data.users.full_name.substring(0, user_name.indexOf(' '));
            last_name.value = response.data.users.full_name.substring(user_name.indexOf(' ') + 1);

            email.value = response.data.users.email;
            number.value = response.data.users.phone_number;

            
            birthdate.value = response.data.users.birthdate;
            genres.value = response.data.users.preferred_genres;

            localStorage.setItem('full_name', response.data.users.full_name);
            nav_name.innerHTML = `${response.data.users.full_name}`;
            

            
        } else {
            console.error("Error:", response.data.message);
        }
    } catch (error) {
            console.error("Request failed:", error);
    }
  }

  document.querySelector(".btn-cancel").addEventListener("click", () => {
    fetchUserDetails();
  
  });

  document.querySelector(".btn-save").addEventListener("click", () => {
    const updatedData = {
      id: user_id,
      full_name: `${first_name.value} ${last_name.value}`,
      email: email.value,
      phone_number: number.value,
      birthdate: birthdate.value,
      preferred_genres: genres.value
    };

    updateUser(updatedData);
  });


  async function updateUser(data) {

    try {
      const response = await axios.post(
        '../../cinema_server/controllers/update_user.php',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 200) {

        alert("Update successful!");
        fetchMovieDetails();
      } else {
        alert(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong. Try again later.");
    }
  }
  
    fetchUserDetails();


});

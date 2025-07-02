document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');

  localStorage.setItem('user_id', -1);
  localStorage.setItem('full_name', "-");
  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");
  localStorage.setItem('selected-auditorium', "-");

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.querySelector('input[name="full_name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phoneNumber = document.querySelector('input[name="phone_number"]').value.trim();
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = {
      full_name: fullName,
      email: email,
      phone_number: phoneNumber,
      password_hash: password,
    };

    try {
      const response = await axios.post(
        '../../cinema_server/controllers/register.php',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 200) {
        alert("Registration successful!");
        window.location.href = "../pages/login.html";
      } else {
        alert(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong. Try again later.");
    }
  });
});

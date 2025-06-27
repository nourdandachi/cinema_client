document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('register-form');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (data.password !== data.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone_number: data.phone_number,
      password_hash: data.password, 
    };

    try {
      const response = await axios.post(
        '../../cinema_server/controllers/register.php',
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 200) {
        alert("Registration successful!");
        window.location.href = "../index.html";
      } else {
        alert(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again later.");
    }
  });
});

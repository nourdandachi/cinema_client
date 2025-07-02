document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');
  localStorage.setItem('user_id', -1);
  localStorage.setItem('full_name', "-");
  localStorage.setItem('selected-movie', "-");
  localStorage.setItem('temp-movie', "-");
  localStorage.setItem('selected-auditorium', "-");

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const identifier = document.querySelector('input[type="text"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;

    const data = {
      password: password,
    };

    if (identifier.includes('@')) {
      data.email = identifier;
    } else {
      data.phone_number = identifier;
    }

    try {
      const response = await axios.post(
        '../../cinema_server/controllers/login.php',
        JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 200) {
        localStorage.setItem('user_id', response.data.user.id);
        localStorage.setItem('full_name', response.data.user.full_name);
        if(data.email === "admin@gmail.com"){
          window.location.href = '../pages/dashboard.html';
        }else{
          window.location.href = '../index.html';
        }
        
      } else {
        alert(response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Try again later.');
    }
  });
});

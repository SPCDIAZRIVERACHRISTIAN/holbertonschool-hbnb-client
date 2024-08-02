document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('username-field').value;
      const password = document.getElementById('password-field').value;

      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/;`;
          window.location.href = 'index.html';
        } else {
          const errorData = await response.json();
          alert(`Login failed: ${errorData.msg}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  checkAuthentication();
});

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token) {
    loginLink.style.display = 'block';
  } else {
    loginLink.style.display = 'none';
    fetchPlaces();
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces() {
  try {
    const response = await fetch('http://127.0.0.1:5000/places', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      const places = await response.json();
      displayPlaces(places);
    } else {
      console.error('Failed to get places:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPlaces(places) {
  const placeList = document.getElementById('places-list');
  placeList.innerHTML = '';

  places.forEach(place => {
    const placeElement = document.createElement('div');
    placeElement.innerHTML = `
      <div class="place-card">
        <h2>${place.id}</h2>
        <p>${place.description}</p>
        <p>Price per night: $${place.price_per_night}</p>
        <p>Location: ${place.city_name}, ${place.country_code}</p>
        <a href="place.html?place_id=${place.id}"><button type="button" class="details-button">View Details</button></a>
      </div>
    `;
    placeList.appendChild(placeElement);
  });
}

document.getElementById('country-filter').addEventListener('change', (event) => {
  const selectedCountryCode = event.target.value;
  filterPlaces(selectedCountryCode);
});

function filterPlaces(selectedCountryCode) {
  const placeCards = document.querySelectorAll('.place-card');
  placeCards.forEach(card => {
    const countryCode = card.getAttribute('data-country-code');
    if (countryCode === selectedCountryCode || selectedCountryCode === 'all') {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

async function fetchCountries() {
  try {
      const response = await fetch('/base_files/mock-api/data/countries.json');
      if (response.ok) {
          const countries = await response.json();
          populateCountryFilter(countries);
      } else {
          console.error('Failed to load countries:', response.statusText);
      }
  } catch (error) {
      console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const countryFilter = document.getElementById('country-filter');

  const loadCountries = async () => {
      try {
          const response = await fetch('/base_files/mock-api/data/countries.json');
          const countries = await response.json();
          populateCountryFilter(countries);
      } catch (error) {
          console.error('Error :', error);
      }
  };

  const populateCountryFilter = (countries) => {
      const allOption = document.createElement('option');
      allOption.value = 'all';
      allOption.textContent = 'All';
      countryFilter.appendChild(allOption);

      countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.code; // Ensure the value is the country code
          option.textContent = country.name;
          countryFilter.appendChild(option);
      });
  };

  loadCountries();
  fetchPlaces(); // Ensure places are fetched and displayed on page load
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();

    // Only fetch and display place details if on place.html
    if (document.getElementById('place-details')) {
      const placeId = getPlaceIdFromURL();
      const token = getCookie('token');
      fetchPlaceDetails(token, placeId);
    }
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

  function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id');
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
        <div class="place-loaded">
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

  async function fetchPlaceDetails(token, placeId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const placeDetails = await response.json();
        displayPlaceDetails(placeDetails);
      } else {
        console.error('Failed to get place details:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    placeDetails.innerHTML = `
      <div class="loaded-details">
        <h2>${place.id}</h2>
        <img src="" alt="" class="place-large-image">
        <div class="place-info">
          <p><h5>Host: </h5>${place.host_name}</p>
          <p><h5>Price per night: </h5>${place.price_per_night}</p>
          <p><h5>Location:</h5> ${place.city_name}, ${place.country_code}</p>
          <p><h5>Description:</h5> ${place.description}</p>
          <p><h5>Amenities:</h5> ${place.amenities.join(', ')}</p>
        </div>
      </div>
    `;
  }

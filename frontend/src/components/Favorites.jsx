import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Favorites({ onCityClick }) {
  const [favorites, setFavorites] = useState([]);
  const [newCity, setNewCity] = useState('');

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const removeFavorite = async (id, event) => {
    event.stopPropagation(); // Prevent city click when removing
    try {
      await axios.delete(`/api/favorites/${id}`);
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const addFavorite = async () => {
    if (!newCity.trim()) return;
    
    try {
      const response = await axios.post('/api/favorites', { name: newCity });
      setFavorites([...favorites, response.data]);
      setNewCity('');
    } catch (error) {
      console.error('Error adding favorite:', error);
      alert('Failed to add city to favorites.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addFavorite();
    }
  };

  const handleCityClick = (cityName) => {
    onCityClick(cityName);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="favorites">
      <h3>Favorites</h3>
      
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorite cities yet. Add some!</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.id} onClick={() => handleCityClick(fav.name)}>
              <span className="city-name">{fav.name}</span>
              <button className="remove-btn" onClick={(e) => removeFavorite(fav.id, e)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <div className="add-favorite">
        <input
          type="text"
          placeholder="Add a city"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={addFavorite}>Add</button>
      </div>
    </div>
  );
}

export default Favorites;
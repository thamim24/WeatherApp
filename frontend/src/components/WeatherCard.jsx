import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from './MapView';

function WeatherCard({ unit, onAddToFavorites, selectedCity, onCitySearched }) {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [lastSearchedCity, setLastSearchedCity] = useState('');

  const fetchWeather = async (cityToFetch) => {
    const searchCity = cityToFetch || city;
    if (!searchCity.trim()) return;
    
    setError('');
    try {
      const response = await axios.get(`/api/weather/${searchCity}`, {
        params: { units: unit },
      });
      setWeather(response.data);
      setLastSearchedCity(searchCity);
      setCity(searchCity);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  // Re-fetch weather when unit changes
  useEffect(() => {
    if (lastSearchedCity) {
      fetchWeather(lastSearchedCity);
    }
  }, [unit]);

  // Fetch weather when a favorite city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
      onCitySearched();
    }
  }, [selectedCity]);

  const addToFavorites = async () => {
    if (!weather || !weather.city) return;
    
    try {
      await axios.post('/api/favorites', { name: weather.city });
      alert(`${weather.city} added to favorites!`);
      onAddToFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites. It might already exist.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const getUnitSymbol = () => unit === 'metric' ? '°C' : '°F';
  const getWindUnit = () => unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="weather-card">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => fetchWeather()}>Get Weather</button>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      {weather && (
        <div className="weather-info">
          <div className="city-header">
            <h2>{weather.city}, {weather.country}</h2>
            <p className="description">{weather.description}</p>
          </div>

          <div className="temperature-main">
            <span className="temp-value">{weather.temperature.toFixed(1)}{getUnitSymbol()}</span>
          </div>

          {/* Side-by-side layout: Map on left, Details on right */}
          <div className="map-details-container">
            <div className="map-section">
              <MapView 
                latitude={weather.latitude} 
                longitude={weather.longitude}
                cityName={weather.city}
              />
            </div>

            <div className="details-section">
              <div className="weather-details">
                <div className="detail-row">
                  <span className="detail-label">Temperature range:</span>
                  <span className="detail-value">
                    {weather.tempMin.toFixed(1)} to {weather.tempMax.toFixed(1)} {getUnitSymbol()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Feels like:</span>
                  <span className="detail-value">{weather.feelsLike.toFixed(1)}{getUnitSymbol()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Wind:</span>
                  <span className="detail-value">{weather.windSpeed.toFixed(2)} {getWindUnit()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Clouds:</span>
                  <span className="detail-value">{weather.clouds}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Humidity:</span>
                  <span className="detail-value">{weather.humidity}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Pressure:</span>
                  <span className="detail-value">{weather.pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="geo-coords">
            <span>Geo coords [{weather.latitude.toFixed(2)}, {weather.longitude.toFixed(2)}]</span>
          </div>

          <div className="ai-summary">
            <strong>AI Summary:</strong> {weather.aiSummary}
          </div>

          <button className="add-favorite-btn" onClick={addToFavorites}>
            Add to Favorites
          </button>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
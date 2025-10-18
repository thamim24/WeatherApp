import React, { useState } from 'react';
import WeatherCard from './components/WeatherCard';
import Favorites from './components/Favorites';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';

function App() {
  const [unit, setUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
  const [refreshFavorites, setRefreshFavorites] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'metric' ? 'imperial' : 'metric'));
  };

  const triggerFavoritesRefresh = () => {
    setRefreshFavorites(prev => prev + 1);
  };

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName);
  };

  return (
    <div className="app">
      <h1>🌤️ AI Weather App</h1>
      <UnitToggle unit={unit} toggleUnit={toggleUnit} />
      <WeatherCard 
        unit={unit} 
        onAddToFavorites={triggerFavoritesRefresh}
        selectedCity={selectedCity}
        onCitySearched={() => setSelectedCity('')}
      />
      <Favorites 
        key={refreshFavorites} 
        onCityClick={handleCityClick}
      />
      <Footer />
    </div>
  );
}

export default App;
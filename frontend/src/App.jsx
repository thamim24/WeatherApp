import React, { useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import Favorites from './components/Favorites';
import UnitToggle from './components/UnitToggle';
import Footer from './components/Footer';

function App() {
  const [unit, setUnit] = React.useState('metric');
  const [refreshFavorites, setRefreshFavorites] = React.useState(0);
  const [selectedCity, setSelectedCity] = React.useState('');

  // Debug: Log the API base URL
  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    console.log('🔍 DEBUG: API Base URL =', apiBaseUrl || '(empty - using proxy)');
    console.log('🔍 DEBUG: All env vars =', import.meta.env);
  }, []);

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

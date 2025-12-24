import axios from 'axios';

// Get API base URL from environment variable
// In development: uses Vite proxy (localhost:8080)
// In production: uses Railway backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Weather API endpoints
export const weatherAPI = {
  getWeather: (city, units) => 
    api.get(`/api/weather/${city}`, { params: { units } }),
};

// Favorites API endpoints
export const favoritesAPI = {
  getAll: () => api.get('/api/favorites'),
  add: (cityName) => api.post('/api/favorites', { name: cityName }),
  remove: (id) => api.delete(`/api/favorites/${id}`),
};

export default api;

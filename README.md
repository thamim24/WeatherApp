# 🌤️ AI Weather App

A modern, responsive web application that provides comprehensive weather information with AI-powered summaries and interactive location mapping.

## 🎯 Project Overview

The **AI Weather App** is a full-stack application that delivers real-time weather data with an intuitive user interface. Users can search for any city worldwide and receive detailed weather information including:

- 🌡️ **Current weather conditions** with temperature, humidity, wind speed, and more
- 🤖 **AI-generated summaries** for human-friendly weather descriptions
- 🗺️ **Interactive maps** showing the exact location of searched cities
- ⭐ **Favorites management** with persistent storage
- 🔄 **Temperature unit conversion** (Celsius ↔ Fahrenheit)
- 📍 **Geographic coordinates** for precise location data

---

## 🛠️ Tech Stack

| Layer        | Technology                    |
| ------------ | ----------------------------- |
| Frontend     | React 18 + Vite               |
| Backend      | Spring Boot 3.5.6             |
| Mapping      | Leaflet + React-Leaflet       |
| Weather API  | OpenWeatherMap                |
| Data Storage | H2 Database (Dev) / MySQL     |
| Styling      | Modern CSS with Flexbox       |

---

## ✨ Features

### 1. **Weather Search**
- Search any city worldwide
- Real-time weather data fetching
- Enter key support for quick searches

### 2. **Comprehensive Weather Details**
- Current temperature with feels-like temperature
- Temperature range (min/max)
- Wind speed
- Cloud coverage percentage
- Humidity levels
- Atmospheric pressure
- Weather description

### 3. **Interactive Map**
- OpenStreetMap integration
- Pinpoint city location
- Smooth transitions between cities
- Click markers for location details

### 4. **Temperature Unit Toggle**
- Switch between Celsius and Fahrenheit
- Automatic data refresh with new units
- Updates all temperature values instantly

### 5. **AI-Powered Summaries**
- Human-readable weather descriptions
- Comprehensive overview of conditions
- Contextual information synthesis

### 6. **Favorites Management**
- Save favorite cities
- One-click weather retrieval
- Add new cities directly from search results
- Remove cities from favorites
- Persistent storage across sessions

### 7. **Modern UI/UX**
- Side-by-side layout (Map | Details)
- Responsive design for all devices
- Card-based interface
- Gradient backgrounds
- Smooth animations and transitions

---

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- npm or yarn
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

### Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend/weatherapp
   ```

2. Configure your API key in `src/main/resources/application.properties`:
   ```properties
   weather.api.key=your_openweathermap_api_key_here
   ```

3. (Optional) For MySQL instead of H2, update:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/weatherapp
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Backend will start at `http://localhost:8080`

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   Frontend will start at `http://localhost:5173`

4. Open your browser and visit `http://localhost:5173`

---

## 📁 Project Structure

### Backend Architecture
```
backend/weatherapp/
├── src/main/java/com/thamimul/weatherapp/
│   ├── WeatherappApplication.java          # Main application entry
│   ├── config/
│   │   └── CorsConfig.java                 # CORS configuration
│   ├── controller/
│   │   ├── WeatherController.java          # Weather API endpoints
│   │   └── FavoriteController.java         # Favorites CRUD endpoints
│   ├── service/
│   │   ├── WeatherService.java             # Weather data & AI logic
│   │   └── FavoriteService.java            # Favorites business logic
│   ├── repository/
│   │   └── FavoriteCityRepository.java     # JPA repository
│   ├── model/
│   │   └── FavoriteCity.java               # Entity class
│   └── dto/
│       └── WeatherResponse.java            # Response DTO
├── src/main/resources/
│   └── application.properties              # App configuration
└── pom.xml                                  # Maven dependencies
```

### Frontend Architecture
```
frontend/
├── public/
│   ├── index.html                           # Root HTML
│   └── favicon.ico                          # App icon
├── src/
│   ├── components/
│   │   ├── WeatherCard.jsx                  # Main weather display
│   │   ├── MapView.jsx                      # Interactive map
│   │   ├── Favorites.jsx                    # Favorites management
│   │   ├── UnitToggle.jsx                   # Temperature toggle
│   │   └── Footer.jsx                       # App footer
│   ├── App.jsx                              # Root component
│   ├── main.jsx                             # Entry point
│   └── style.css                            # Global styles
├── package.json                             # Dependencies
└── vite.config.js                           # Vite configuration
```

---

## 🔌 API Endpoints

### Weather Endpoints
- **GET** `/api/weather/{city}?units={metric|imperial}`
  - Fetches current weather data for specified city
  - Returns: City name, country, temperature, weather details, coordinates, AI summary

### Favorites Endpoints
- **GET** `/api/favorites`
  - Retrieves all saved favorite cities
  
- **POST** `/api/favorites`
  - Adds a new city to favorites
  - Body: `{ "name": "CityName" }`
  
- **DELETE** `/api/favorites/{id}`
  - Removes a city from favorites

---

## 🎨 UI Layout

```
┌─────────────────────────────────────────┐
│     🌤️ AI Weather App                   │
│     [Switch to °C] [Switch to °F]      │
├─────────────────────────────────────────┤
│  [Search Bar] [Get Weather Button]     │
│                                         │
│  Chennai, IN                            │
│  mist                                   │
│  26.4°C                                 │
│                                         │
│  ┌─────────────┬──────────────────┐   │
│  │             │ Temperature: 26.4│   │
│  │   🗺️ Map    │ Feels like: 28.2 │   │
│  │             │ Wind: 3.5 m/s    │   │
│  │             │ Clouds: 75%      │   │
│  │             │ Humidity: 80%    │   │
│  │             │ Pressure: 1012   │   │
│  └─────────────┴──────────────────┘   │
│                                         │
│  📍 Geo coords [13.08, 80.27]          │
│  🤖 AI Summary: In Chennai...          │
│  [Add to Favorites]                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  ⭐ Favorites                            │
│  • Chennai [Remove]                     │
│  • Mumbai [Remove]                      │
│  [Add a city] [Add]                    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Made with ❤️ by Thamimul Andari M     │
│  © 2025 AI Weather App                 │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing

1. **Backend Testing**
   - Start the backend server
   - Test endpoints using Postman or cURL:
     ```bash
     curl http://localhost:8080/api/weather/London?units=metric
     curl http://localhost:8080/api/favorites
     ```

2. **Frontend Testing**
   - Search for different cities
   - Toggle between temperature units
   - Add/remove favorite cities
   - Click on map markers
   - Test responsive design on different screen sizes

3. **Integration Testing**
   - Verify weather data updates correctly
   - Ensure favorites persist across page refreshes
   - Test map animations and transitions

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory (optional):
```properties
WEATHER_API_KEY=your_api_key
DATABASE_URL=jdbc:mysql://localhost:3306/weatherapp
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
```

### Database Options
- **Development**: H2 in-memory database (default)
- **Production**: MySQL or PostgreSQL

---

## 🚨 Troubleshooting

### Backend Issues
- **Port 8080 already in use**: Change `server.port` in `application.properties`
- **API key errors**: Verify your OpenWeatherMap API key is valid
- **Database connection**: Check database credentials and ensure service is running

### Frontend Issues
- **Port 5173 in use**: Vite will automatically use next available port
- **API calls failing**: Ensure backend is running on port 8080
- **Map not loading**: Check internet connection for OpenStreetMap tiles

---

## 🎯 Future Enhancements

- [ ] 5-day weather forecast
- [ ] Hourly weather predictions
- [ ] Weather alerts and notifications
- [ ] Multiple location comparison
- [ ] Dark mode support
- [ ] Weather history tracking
- [ ] Social sharing features
- [ ] PWA support for offline access

---

## 👨‍💻 Developer

**Thamimul Andari M**

Built with ❤️ using React, Spring Boot, and OpenWeatherMap API

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Leaflet](https://leafletjs.com/) for mapping functionality
- [React-Leaflet](https://react-leaflet.js.org/) for React integration
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles

---

## 📞 Support

For issues, questions, or contributions, please create an issue in the repository.

**Happy Weather Tracking! 🌤️**
package com.thamimul.weatherapp.service;

import com.thamimul.weatherapp.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WeatherService {

    @Value("${weather.api.key:demo_key}")
    private String apiKey;

    private final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    public WeatherResponse getWeather(String city, String units) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = WEATHER_API_URL + "?q=" + city + "&appid=" + apiKey + "&units=" + units;
            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            WeatherResponse weatherResponse = new WeatherResponse();
            
            // City and country
            weatherResponse.setCity(root.path("name").asText());
            weatherResponse.setCountry(root.path("sys").path("country").asText());
            
            // Weather description
            weatherResponse.setDescription(root.path("weather").get(0).path("description").asText());
            
            // Temperature data
            JsonNode main = root.path("main");
            weatherResponse.setTemperature(main.path("temp").asDouble());
            weatherResponse.setTempMin(main.path("temp_min").asDouble());
            weatherResponse.setTempMax(main.path("temp_max").asDouble());
            weatherResponse.setFeelsLike(main.path("feels_like").asDouble());
            weatherResponse.setHumidity(main.path("humidity").asInt());
            weatherResponse.setPressure(main.path("pressure").asInt());
            
            // Wind data
            weatherResponse.setWindSpeed(root.path("wind").path("speed").asDouble());
            
            // Clouds
            weatherResponse.setClouds(root.path("clouds").path("all").asInt());
            
            // Coordinates
            JsonNode coord = root.path("coord");
            weatherResponse.setLatitude(coord.path("lat").asDouble());
            weatherResponse.setLongitude(coord.path("lon").asDouble());
            
            // AI Summary
            String aiSummary = generateAISummary(weatherResponse, units);
            weatherResponse.setAiSummary(aiSummary);

            return weatherResponse;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching weather data: " + e.getMessage());
        }
    }

    private String generateAISummary(WeatherResponse weather, String units) {
        String unit = units.equals("metric") ? "°C" : "°F";
        String windUnit = units.equals("metric") ? "m/s" : "mph";
        
        return String.format("In %s, %s, it's about %.1f%s outside with %s. " +
                           "Temperature ranges from %.1f to %.1f%s, wind speed is %.1f %s, " +
                           "clouds %d%%, humidity %d%%, pressure %d hPa.", 
                           weather.getCity(), 
                           weather.getCountry(),
                           weather.getTemperature(), 
                           unit, 
                           weather.getDescription(),
                           weather.getTempMin(),
                           weather.getTempMax(),
                           unit,
                           weather.getWindSpeed(),
                           windUnit,
                           weather.getClouds(),
                           weather.getHumidity(),
                           weather.getPressure());
    }
}

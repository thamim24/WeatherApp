package com.thamimul.weatherapp.service;

import com.thamimul.weatherapp.dto.WeatherResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Autowired
    private AIService aiService;

    private final String WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

    @PostConstruct
    public void validateApiKey() {
        if (apiKey == null || apiKey.isBlank() || apiKey.length() < 10) {
            throw new IllegalStateException("WEATHER_API_KEY is not configured");
        }
    }

    public WeatherResponse getWeather(String city, String units) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String encodedCity = URLEncoder.encode(city, StandardCharsets.UTF_8);
            String url = WEATHER_API_URL + "?q=" + encodedCity + "&appid=" + apiKey + "&units=" + units;

            String response = restTemplate.getForObject(url, String.class);

            if (response == null) {
                throw new RuntimeException("Empty response from weather API");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            if (root.has("cod") && !root.get("cod").asText().equals("200")) {
                throw new RuntimeException("Weather API error: " + root.path("message").asText());
            }

            JsonNode weatherArray = root.path("weather");
            if (!weatherArray.isArray() || weatherArray.isEmpty()) {
                throw new RuntimeException("Invalid weather data received");
            }

            WeatherResponse weatherResponse = new WeatherResponse();

            weatherResponse.setCity(root.path("name").asText());
            weatherResponse.setCountry(root.path("sys").path("country").asText());

            weatherResponse.setDescription(weatherArray.get(0).path("description").asText());

            JsonNode main = root.path("main");
            weatherResponse.setTemperature(main.path("temp").asDouble());
            weatherResponse.setTempMin(main.path("temp_min").asDouble());
            weatherResponse.setTempMax(main.path("temp_max").asDouble());
            weatherResponse.setFeelsLike(main.path("feels_like").asDouble());
            weatherResponse.setHumidity(main.path("humidity").asInt());
            weatherResponse.setPressure(main.path("pressure").asInt());

            weatherResponse.setWindSpeed(root.path("wind").path("speed").asDouble());

            weatherResponse.setClouds(root.path("clouds").path("all").asInt());

            JsonNode coord = root.path("coord");
            weatherResponse.setLatitude(coord.path("lat").asDouble());
            weatherResponse.setLongitude(coord.path("lon").asDouble());

            String unit = units.equals("metric") ? "°C" : "°F";
            String windUnit = units.equals("metric") ? "m/s" : "mph";

            String aiSummary;
            try {
                aiSummary = aiService.generateWeatherSummary(
                        weatherResponse.getCity(),
                        weatherResponse.getCountry(),
                        weatherResponse.getTemperature(),
                        weatherResponse.getDescription(),
                        weatherResponse.getTempMin(),
                        weatherResponse.getTempMax(),
                        weatherResponse.getWindSpeed(),
                        weatherResponse.getClouds(),
                        weatherResponse.getHumidity(),
                        weatherResponse.getPressure(),
                        unit,
                        windUnit
                );
            } catch (Exception e) {
                aiSummary = "AI summary unavailable";
            }

            weatherResponse.setAiSummary(aiSummary);

            return weatherResponse;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching weather data", e);
        }
    }
}
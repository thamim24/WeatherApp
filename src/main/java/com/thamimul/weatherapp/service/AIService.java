package com.thamimul.weatherapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String MODEL = "llama-3.3-70b-versatile";

    public String generateWeatherSummary(String city, String country, double temperature, 
                                        String description, double tempMin, double tempMax,
                                        double windSpeed, int clouds, int humidity, 
                                        int pressure, String unit, String windUnit) {
        
        // Fallback if no API key
        if (groqApiKey == null || groqApiKey.isEmpty() || groqApiKey.equals("your_groq_api_key")) {
            return generateFallbackSummary(city, country, temperature, description, tempMin, 
                                         tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            // Create request body
            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", MODEL);

            // Create messages array
            ArrayNode messages = mapper.createArrayNode();
            
            // System message
            ObjectNode systemMessage = mapper.createObjectNode();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a friendly weather assistant. Provide concise, engaging weather summaries in 1-2 sentences. Be conversational and helpful.");
            messages.add(systemMessage);

            // User message
            ObjectNode userMessage = mapper.createObjectNode();
            userMessage.put("role", "user");
            
            String prompt = String.format(
                "Generate a brief, friendly weather summary for %s, %s. " +
                "Current conditions: %s, temperature %.1f%s (feels like temperature range %.1f to %.1f%s), " +
                "wind speed %.1f %s, clouds %d%%, humidity %d%%, pressure %d hPa. " +
                "Keep it conversational and under 50 words.",
                city, country, description, temperature, unit, tempMin, tempMax, unit,
                windSpeed, windUnit, clouds, humidity, pressure
            );
            
            userMessage.put("content", prompt);
            messages.add(userMessage);

            requestBody.set("messages", messages);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 150);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            // Make API call
            String response = restTemplate.postForObject(GROQ_API_URL, entity, String.class);

            // Parse response
            JsonNode root = mapper.readTree(response);
            String aiSummary = root.path("choices")
                                  .get(0)
                                  .path("message")
                                  .path("content")
                                  .asText();

            return aiSummary.trim();

        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
            // Fallback to static summary
            return generateFallbackSummary(city, country, temperature, description, tempMin, 
                                         tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
        }
    }

    private String generateFallbackSummary(String city, String country, double temperature, 
                                          String description, double tempMin, double tempMax,
                                          String unit, double windSpeed, String windUnit,
                                          int clouds, int humidity, int pressure) {
        return String.format("In %s, %s, it's about %.1f%s outside with %s. " +
                           "Temperature ranges from %.1f to %.1f%s, wind speed is %.1f %s, " +
                           "clouds %d%%, humidity %d%%, pressure %d hPa.", 
                           city, country, temperature, unit, description,
                           tempMin, tempMax, unit, windSpeed, windUnit,
                           clouds, humidity, pressure);
    }
}
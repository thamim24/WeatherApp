package com.thamimul.weatherapp.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    private final String MODEL = "llama-3.3-70b-versatile";

    public String generateWeatherSummary(String city, String country, double temperature,
                                         String description, double tempMin, double tempMax,
                                         double windSpeed, int clouds, int humidity,
                                         int pressure, String unit, String windUnit) {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            return generateFallbackSummary(city, country, temperature, description, tempMin,
                    tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            ObjectMapper mapper = new ObjectMapper();

            ObjectNode requestBody = mapper.createObjectNode();
            requestBody.put("model", MODEL);

            ArrayNode messages = mapper.createArrayNode();

            ObjectNode systemMessage = mapper.createObjectNode();
            systemMessage.put("role", "system");
            systemMessage.put("content", "You are a friendly weather assistant. Provide concise, engaging weather summaries in 1-2 sentences. Be conversational and helpful.");
            messages.add(systemMessage);

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

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            HttpEntity<String> entity = new HttpEntity<>(requestBody.toString(), headers);

            ResponseEntity<String> responseEntity = restTemplate.postForEntity(GROQ_API_URL, entity, String.class);

            if (!responseEntity.getStatusCode().is2xxSuccessful() || responseEntity.getBody() == null) {
                return generateFallbackSummary(city, country, temperature, description, tempMin,
                        tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
            }

            JsonNode root = mapper.readTree(responseEntity.getBody());

            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return generateFallbackSummary(city, country, temperature, description, tempMin,
                        tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
            }

            String aiSummary = choices.get(0)
                    .path("message")
                    .path("content")
                    .asText();

            if (aiSummary == null || aiSummary.isBlank()) {
                return generateFallbackSummary(city, country, temperature, description, tempMin,
                        tempMax, unit, windSpeed, windUnit, clouds, humidity, pressure);
            }

            return aiSummary.trim();

        } catch (Exception e) {
            System.err.println("Error calling Groq API: " + e.getMessage());
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
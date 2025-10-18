package com.thamimul.weatherapp.controller;

import com.thamimul.weatherapp.dto.WeatherResponse;
import com.thamimul.weatherapp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/{city}")
    public WeatherResponse getWeather(
            @PathVariable String city,
            @RequestParam(defaultValue = "metric") String units) {
        return weatherService.getWeather(city, units);
    }
}
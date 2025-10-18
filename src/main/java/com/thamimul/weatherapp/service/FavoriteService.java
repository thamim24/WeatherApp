package com.thamimul.weatherapp.service;

import com.thamimul.weatherapp.model.FavoriteCity;
import com.thamimul.weatherapp.repository.FavoriteCityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteCityRepository favoriteCityRepository;

    public List<FavoriteCity> getAllFavorites() {
        return favoriteCityRepository.findAll();
    }

    public FavoriteCity addFavorite(FavoriteCity favoriteCity) {
        return favoriteCityRepository.save(favoriteCity);
    }

    public void deleteFavorite(Long id) {
        favoriteCityRepository.deleteById(id);
    }
}
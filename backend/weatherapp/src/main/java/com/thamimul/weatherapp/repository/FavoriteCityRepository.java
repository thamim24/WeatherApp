package com.thamimul.weatherapp.repository;

import com.thamimul.weatherapp.model.FavoriteCity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteCityRepository extends JpaRepository<FavoriteCity, Long> {
}
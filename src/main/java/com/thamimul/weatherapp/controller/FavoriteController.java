package com.thamimul.weatherapp.controller;

import com.thamimul.weatherapp.model.FavoriteCity;
import com.thamimul.weatherapp.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<FavoriteCity>> getFavorites() {
        return ResponseEntity.ok(favoriteService.getAllFavorites());
    }

    @PostMapping
    public ResponseEntity<FavoriteCity> addFavorite(@RequestBody FavoriteCity favoriteCity) {
        return ResponseEntity.ok(favoriteService.addFavorite(favoriteCity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFavorite(@PathVariable Long id) {
        favoriteService.deleteFavorite(id);
        return ResponseEntity.noContent().build();
    }
}
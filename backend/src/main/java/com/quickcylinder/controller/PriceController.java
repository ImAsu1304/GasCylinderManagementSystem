package com.quickcylinder.controller;

import com.quickcylinder.entity.CylinderPrice;
import com.quickcylinder.repository.CylinderPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceController {

    private final CylinderPriceRepository priceRepository;

    @GetMapping
    public ResponseEntity<?> getPrice(@RequestParam String provider,
                                      @RequestParam String type,
                                      @RequestParam String city) {
        var opt = priceRepository.findByProviderAndCylinderTypeAndCity(provider, type, city);
        if (opt.isPresent()) {
            return ResponseEntity.ok(Map.of("price", opt.get().getPrice(), "gstRate", opt.get().getGstRate()));
        }
        return ResponseEntity.ok(Map.of("price", 0, "gstRate", 0));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CylinderPrice>> getAllPrices() {
        return ResponseEntity.ok(priceRepository.findAll());
    }
}

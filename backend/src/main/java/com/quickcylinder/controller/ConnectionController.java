package com.quickcylinder.controller;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final com.quickcylinder.repository.ValidConsumerRepository validConsumerRepository;

    public ConnectionController(com.quickcylinder.repository.ValidConsumerRepository validConsumerRepository) {
        this.validConsumerRepository = validConsumerRepository;
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyConsumer(@RequestBody Map<String, String> request) {
        String consumerNumber = request.get("consumerNumber");
        if (consumerNumber == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Consumer number is required"));
        }

        return validConsumerRepository.findById(consumerNumber)
            .map(consumer -> {
                Map<String, Object> result = new HashMap<>();
                result.put("consumerName", consumer.getConsumerName());
                result.put("distributorName", consumer.getDistributorName());
                result.put("lastBookingDate", "2025-06-15");
                result.put("connectionStatus", "Active");
                result.put("verified", true);
                return ResponseEntity.ok(result);
            })
            .orElseGet(() -> ResponseEntity.status(404).body((Map) Map.of("message", "Invalid Consumer Number. Please enter one of the 10 registered test numbers.")));
    }
}

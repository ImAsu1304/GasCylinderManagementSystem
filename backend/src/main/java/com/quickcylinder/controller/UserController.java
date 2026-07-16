package com.quickcylinder.controller;

import com.quickcylinder.entity.DeliveryAddress;
import com.quickcylinder.entity.LpgConnection;
import com.quickcylinder.entity.User;
import com.quickcylinder.repository.DeliveryAddressRepository;
import com.quickcylinder.repository.LpgConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final LpgConnectionRepository connectionRepository;
    private final DeliveryAddressRepository addressRepository;

    @GetMapping("/connections")
    public ResponseEntity<List<LpgConnection>> getConnections(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(connectionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<DeliveryAddress>> getAddresses(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(addressRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }
}

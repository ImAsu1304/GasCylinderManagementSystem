package com.quickcylinder.config;

import com.quickcylinder.entity.CylinderPrice;
import com.quickcylinder.entity.User;
import com.quickcylinder.repository.CylinderPriceRepository;
import com.quickcylinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CylinderPriceRepository priceRepository;
    private final PasswordEncoder passwordEncoder;

    private static final String[] PROVIDERS = {"INDANE", "HP", "BHARAT"};
    private static final String[] CITIES = {
        "Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore",
        "Hyderabad", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
        "Patna", "Chandigarh", "Bhopal", "Guwahati"
    };

    // Base prices per type (vary slightly by city)
    private static final Map<String, Double> DOMESTIC_PRICES = Map.ofEntries(
        Map.entry("Delhi", 803.0), Map.entry("Mumbai", 802.5), Map.entry("Kolkata", 829.0),
        Map.entry("Chennai", 818.5), Map.entry("Bangalore", 819.0), Map.entry("Hyderabad", 845.5),
        Map.entry("Pune", 802.5), Map.entry("Ahmedabad", 803.0), Map.entry("Jaipur", 803.0),
        Map.entry("Lucknow", 803.0), Map.entry("Patna", 829.5), Map.entry("Chandigarh", 803.0),
        Map.entry("Bhopal", 810.0), Map.entry("Guwahati", 852.0)
    );

    private static final Map<String, Double> COMMERCIAL_PRICES = Map.ofEntries(
        Map.entry("Delhi", 1802.0), Map.entry("Mumbai", 1750.5), Map.entry("Kolkata", 1907.0),
        Map.entry("Chennai", 1964.5), Map.entry("Bangalore", 1908.5), Map.entry("Hyderabad", 1956.0),
        Map.entry("Pune", 1750.5), Map.entry("Ahmedabad", 1795.0), Map.entry("Jaipur", 1802.0),
        Map.entry("Lucknow", 1802.0), Map.entry("Patna", 1907.5), Map.entry("Chandigarh", 1802.0),
        Map.entry("Bhopal", 1836.0), Map.entry("Guwahati", 1942.0)
    );

    private static final Map<String, Double> FIVEKG_PRICES = Map.ofEntries(
        Map.entry("Delhi", 339.0), Map.entry("Mumbai", 336.5), Map.entry("Kolkata", 348.0),
        Map.entry("Chennai", 343.0), Map.entry("Bangalore", 343.5), Map.entry("Hyderabad", 355.0),
        Map.entry("Pune", 336.5), Map.entry("Ahmedabad", 338.0), Map.entry("Jaipur", 339.0),
        Map.entry("Lucknow", 339.0), Map.entry("Patna", 348.5), Map.entry("Chandigarh", 339.0),
        Map.entry("Bhopal", 342.0), Map.entry("Guwahati", 358.0)
    );

    @Override
    public void run(String... args) {
        // Create default admin
        if (!userRepository.existsByEmail("admin@quickcylinder.com")) {
            userRepository.save(User.builder()
                    .email("admin@quickcylinder.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("QuickCylinder Admin")
                    .phone("9999999999")
                    .role(User.Role.ADMIN)
                    .build());
            log.info("Default admin user created: admin@quickcylinder.com / Admin@123");
        }

        // Seed cylinder prices if empty
        if (priceRepository.count() == 0) {
            int count = 0;
            for (String provider : PROVIDERS) {
                for (String city : CITIES) {
                    // Domestic
                    priceRepository.save(CylinderPrice.builder()
                            .provider(provider).cylinderType("DOMESTIC").city(city)
                            .price(BigDecimal.valueOf(DOMESTIC_PRICES.get(city)))
                            .gstRate(BigDecimal.ZERO).build());
                    // Commercial
                    priceRepository.save(CylinderPrice.builder()
                            .provider(provider).cylinderType("COMMERCIAL").city(city)
                            .price(BigDecimal.valueOf(COMMERCIAL_PRICES.get(city)))
                            .gstRate(BigDecimal.valueOf(5)).build());
                    // 5 KG
                    priceRepository.save(CylinderPrice.builder()
                            .provider(provider).cylinderType("FIVEKG").city(city)
                            .price(BigDecimal.valueOf(FIVEKG_PRICES.get(city)))
                            .gstRate(BigDecimal.valueOf(5)).build());
                    count += 3;
                }
            }
            log.info("Seeded {} cylinder prices across {} cities for {} providers", count, CITIES.length, PROVIDERS.length);
        }
    }
}

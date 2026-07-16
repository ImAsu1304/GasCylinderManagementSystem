package com.quickcylinder.repository;

import com.quickcylinder.entity.CylinderPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CylinderPriceRepository extends JpaRepository<CylinderPrice, Long> {
    Optional<CylinderPrice> findByProviderAndCylinderTypeAndCity(String provider, String cylinderType, String city);
}

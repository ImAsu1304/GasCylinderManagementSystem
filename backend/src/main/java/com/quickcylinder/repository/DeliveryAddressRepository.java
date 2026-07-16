package com.quickcylinder.repository;

import com.quickcylinder.entity.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {
    List<DeliveryAddress> findByUserIdOrderByCreatedAtDesc(Long userId);
}

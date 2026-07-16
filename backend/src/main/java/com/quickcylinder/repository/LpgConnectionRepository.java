package com.quickcylinder.repository;

import com.quickcylinder.entity.LpgConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LpgConnectionRepository extends JpaRepository<LpgConnection, Long> {
    List<LpgConnection> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<LpgConnection> findByConsumerNumberAndProvider(String consumerNumber, String provider);
}

package com.quickcylinder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lpg_connections")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LpgConnection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String provider; // INDANE, HP, BHARAT

    @Column(nullable = false)
    private String consumerNumber;

    private String consumerName;
    private String distributorName;
    private String mobileNumber;
    
    @Builder.Default
    private String connectionStatus = "ACTIVE";
    
    private LocalDate lastBookingDate;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

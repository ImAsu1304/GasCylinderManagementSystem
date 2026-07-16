package com.quickcylinder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cylinder_prices")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CylinderPrice {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private String cylinderType;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    private BigDecimal gstRate = BigDecimal.ZERO;

    @Builder.Default
    private LocalDate effectiveDate = LocalDate.now();
}

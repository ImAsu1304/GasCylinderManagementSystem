package com.quickcylinder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String provider; // INDANE, HP, BHARAT

    @Column(nullable = false)
    private String cylinderType; // DOMESTIC, COMMERCIAL, FIVEKG

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "connection_id")
    private LpgConnection connection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private DeliveryAddress address;

    @Builder.Default
    private Integer quantity = 1;

    private LocalDate preferredDeliveryDate;
    private String timeSlot;
    private String specialInstructions;

    // Pricing
    @Column(precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // Payment
    private String paymentMethod;
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime statusUpdatedAt;

    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum BookingStatus {
        PENDING, ACCEPTED, DISPATCHED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, DECLINED
    }

    @PreUpdate
    protected void onUpdate() { this.statusUpdatedAt = LocalDateTime.now(); }
}

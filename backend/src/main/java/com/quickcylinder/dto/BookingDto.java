package com.quickcylinder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

public class BookingDto {

    @Data
    public static class CreateRequest {
        @NotBlank private String provider;
        @NotBlank private String cylinderType;
        @NotBlank private String consumerNumber;
        private String consumerName;
        private String distributorName;
        private String mobileNumber;
        @NotBlank private String address;
        @NotBlank private String area;
        @NotBlank private String city;
        @NotBlank private String state;
        @NotBlank private String pinCode;
        private String landmark;
        private String preferredDeliveryDate;
        private String timeSlot;
        private String specialInstructions;
        private BigDecimal basePrice;
        private BigDecimal gstAmount;
        private BigDecimal totalAmount;
        private String paymentMethod;
    }

    @Data
    public static class BookingResponse {
        private Long id;
        private String bookingId;
        private String provider;
        private String cylinderType;
        private String consumerNumber;
        private String consumerName;
        private String city;
        private BigDecimal amount;
        private String status;
        private String date;
        private String deliveryDate;
        private String transactionId;
        private String paymentMethod;

        public static BookingResponse from(com.quickcylinder.entity.Booking b) {
            BookingResponse r = new BookingResponse();
            r.setId(b.getId());
            r.setBookingId(b.getBookingId());
            r.setProvider(b.getProvider());
            r.setCylinderType(b.getCylinderType());
            if (b.getConnection() != null) {
                r.setConsumerNumber(b.getConnection().getConsumerNumber());
                r.setConsumerName(b.getConnection().getConsumerName());
            }
            if (b.getAddress() != null) {
                r.setCity(b.getAddress().getCity());
            }
            r.setAmount(b.getTotalAmount());
            r.setStatus(b.getStatus().name());
            r.setDate(b.getCreatedAt() != null ? b.getCreatedAt().toLocalDate().toString() : null);
            r.setDeliveryDate(b.getPreferredDeliveryDate() != null ? b.getPreferredDeliveryDate().toString() : null);
            r.setTransactionId(b.getTransactionId());
            r.setPaymentMethod(b.getPaymentMethod());
            return r;
        }
    }
}

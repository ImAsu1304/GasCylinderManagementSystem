package com.quickcylinder.service;

import com.quickcylinder.dto.BookingDto;
import com.quickcylinder.entity.*;
import com.quickcylinder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final LpgConnectionRepository connectionRepository;
    private final DeliveryAddressRepository addressRepository;
    private final BookingStatusHistoryRepository historyRepository;
    private final ValidConsumerRepository validConsumerRepository;

    public BookingDto.BookingResponse createBooking(BookingDto.CreateRequest request, User user) {
        String cleanConsumerNumber = request.getConsumerNumber() != null ? request.getConsumerNumber().replaceAll("\\s+", "") : "";
        
        if (!validConsumerRepository.existsById(cleanConsumerNumber)) {
            throw new RuntimeException("Invalid Consumer Number. Please enter a valid 17-digit consumer number.");
        }

        String bookingId = "QC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String transactionId = "TXN" + System.currentTimeMillis() + (int)(Math.random() * 10000);

        // Find or create connection
        LpgConnection connection = connectionRepository.findByConsumerNumberAndProvider(request.getConsumerNumber(), request.getProvider())
                .orElseGet(() -> connectionRepository.save(LpgConnection.builder()
                        .user(user)
                        .provider(request.getProvider())
                        .consumerNumber(request.getConsumerNumber())
                        .consumerName(request.getConsumerName())
                        .distributorName(request.getDistributorName())
                        .mobileNumber(request.getMobileNumber())
                        .build()));

        // Create address
        DeliveryAddress address = addressRepository.save(DeliveryAddress.builder()
                .user(user)
                .addressLine(request.getAddress())
                .area(request.getArea())
                .city(request.getCity())
                .state(request.getState())
                .pinCode(request.getPinCode())
                .landmark(request.getLandmark())
                .build());

        Booking booking = Booking.builder()
                .bookingId(bookingId)
                .user(user)
                .provider(request.getProvider())
                .cylinderType(request.getCylinderType())
                .connection(connection)
                .address(address)
                .preferredDeliveryDate(request.getPreferredDeliveryDate() != null ?
                        LocalDate.parse(request.getPreferredDeliveryDate()) : null)
                .timeSlot(request.getTimeSlot())
                .specialInstructions(request.getSpecialInstructions())
                .basePrice(request.getBasePrice())
                .gstAmount(request.getGstAmount())
                .totalAmount(request.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(transactionId)
                .status(Booking.BookingStatus.PENDING)
                .statusUpdatedAt(LocalDateTime.now())
                .build();

        booking = bookingRepository.save(booking);
        
        // Save history
        historyRepository.save(BookingStatusHistory.builder()
                .booking(booking)
                .status(Booking.BookingStatus.PENDING)
                .description("Booking confirmed successfully")
                .build());

        return BookingDto.BookingResponse.from(booking);
    }

    public List<BookingDto.BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(BookingDto.BookingResponse::from)
                .collect(Collectors.toList());
    }

    public BookingDto.BookingResponse cancelBooking(String bookingId, Long userId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        if (booking.getStatus() == Booking.BookingStatus.DELIVERED ||
            booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel this booking");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        
        historyRepository.save(BookingStatusHistory.builder()
                .booking(booking)
                .status(Booking.BookingStatus.CANCELLED)
                .description("Booking cancelled by user")
                .build());
                
        return BookingDto.BookingResponse.from(booking);
    }

    public byte[] getReceipt(String bookingId, Long userId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return com.quickcylinder.util.PdfGenerator.generateReceipt(booking);
    }
}

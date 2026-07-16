package com.quickcylinder.controller;

import com.quickcylinder.entity.Booking;
import com.quickcylinder.entity.SupportTicket;
import com.quickcylinder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CylinderPriceRepository priceRepository;
    private final SupportTicketRepository ticketRepository;
    private final BookingStatusHistoryRepository historyRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalBookings", bookingRepository.count());
        data.put("totalRevenue", bookingRepository.getTotalRevenue());
        data.put("openTickets", ticketRepository.countByStatus(SupportTicket.TicketStatus.OPEN));
        return ResponseEntity.ok(data);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .map(u -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", u.getId());
                    m.put("name", u.getFullName());
                    m.put("email", u.getEmail());
                    m.put("role", u.getRole().name());
                    m.put("joined", u.getCreatedAt().toLocalDate().toString());
                    return m;
                }).toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings() {
        return ResponseEntity.ok(bookingRepository.findAll().stream()
                .map(com.quickcylinder.dto.BookingDto.BookingResponse::from).toList());
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(body.get("status"));
        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        
        historyRepository.save(com.quickcylinder.entity.BookingStatusHistory.builder()
                .booking(booking)
                .status(newStatus)
                .description("Status updated by Admin")
                .build());

        notificationRepository.save(com.quickcylinder.entity.Notification.builder()
                .user(booking.getUser())
                .title("Booking Status Updated")
                .message("Your booking " + booking.getBookingId() + " is now " + newStatus.name())
                .type("INFO")
                .build());

        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @PutMapping("/prices")
    public ResponseEntity<?> updatePrice(@RequestBody Map<String, Object> body) {
        var price = priceRepository.findByProviderAndCylinderTypeAndCity(
                (String) body.get("provider"),
                (String) body.get("cylinderType"),
                (String) body.get("city"));
        if (price.isPresent()) {
            var p = price.get();
            p.setPrice(new java.math.BigDecimal(body.get("price").toString()));
            priceRepository.save(p);
            return ResponseEntity.ok(Map.of("message", "Price updated"));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @PutMapping("/tickets/{id}")
    public ResponseEntity<?> respondToTicket(@PathVariable Long id, @RequestBody Map<String, String> body) {
        SupportTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setAdminResponse(body.get("response"));
        ticket.setStatus(SupportTicket.TicketStatus.valueOf(body.getOrDefault("status", "RESOLVED")));
        ticketRepository.save(ticket);
        return ResponseEntity.ok(Map.of("message", "Ticket updated"));
    }
}

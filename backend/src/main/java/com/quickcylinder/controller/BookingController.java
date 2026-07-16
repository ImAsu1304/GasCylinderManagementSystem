package com.quickcylinder.controller;

import com.quickcylinder.dto.BookingDto;
import com.quickcylinder.entity.User;
import com.quickcylinder.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDto.BookingResponse> createBooking(
            @Valid @RequestBody BookingDto.CreateRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.createBooking(request, user));
    }

    @GetMapping
    public ResponseEntity<List<BookingDto.BookingResponse>> getBookings(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingDto.BookingResponse> cancelBooking(
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId, user.getId()));
    }

    @GetMapping(value = "/{bookingId}/receipt", produces = org.springframework.http.MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<byte[]> getReceipt(
            @PathVariable String bookingId,
            @AuthenticationPrincipal User user) {
        byte[] receipt = bookingService.getReceipt(bookingId, user.getId());
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentDispositionFormData("attachment", "Receipt_" + bookingId + ".txt");
        return new ResponseEntity<>(receipt, headers, org.springframework.http.HttpStatus.OK);
    }
}

package com.quickcylinder.controller;

import com.quickcylinder.entity.SupportTicket;
import com.quickcylinder.entity.User;
import com.quickcylinder.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportTicketRepository ticketRepository;

    @GetMapping("/tickets")
    public ResponseEntity<List<SupportTicket>> getTickets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @PostMapping("/tickets")
    public ResponseEntity<SupportTicket> createTicket(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        SupportTicket ticket = SupportTicket.builder()
                .user(user)
                .subject(body.get("subject"))
                .description(body.get("description"))
                .bookingEntityId(body.containsKey("bookingId") ? Long.parseLong(body.get("bookingId")) : null)
                .build();
        return ResponseEntity.ok(ticketRepository.save(ticket));
    }
}

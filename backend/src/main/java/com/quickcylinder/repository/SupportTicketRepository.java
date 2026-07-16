package com.quickcylinder.repository;

import com.quickcylinder.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByStatus(SupportTicket.TicketStatus status);
}

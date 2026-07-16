package com.quickcylinder.repository;

import com.quickcylinder.entity.BookingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingStatusHistoryRepository extends JpaRepository<BookingStatusHistory, Long> {
    List<BookingStatusHistory> findByBookingIdOrderByTimestampDesc(Long bookingId);
}

package com.quickcylinder.util;

import java.util.UUID;

public class BookingIdGenerator {
    public static String generateId() {
        return "QC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}

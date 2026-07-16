package com.quickcylinder.util;

import com.quickcylinder.entity.Booking;

public class PdfGenerator {
    // Generates a text-based receipt instead of a PDF to avoid heavy iText dependencies for now
    public static byte[] generateReceipt(Booking booking) {
        StringBuilder sb = new StringBuilder();
        sb.append("==================================================\n");
        sb.append("              QUICKCYLINDER RECEIPT               \n");
        sb.append("==================================================\n\n");
        sb.append("Booking ID     : ").append(booking.getBookingId()).append("\n");
        sb.append("Transaction ID : ").append(booking.getTransactionId() != null ? booking.getTransactionId() : "N/A").append("\n");
        sb.append("Date           : ").append(booking.getCreatedAt().toLocalDate().toString()).append("\n");
        sb.append("Status         : ").append(booking.getStatus().name()).append("\n\n");
        
        sb.append("--- CUSTOMER DETAILS ---\n");
        if (booking.getConnection() != null) {
            sb.append("Name           : ").append(booking.getConnection().getConsumerName()).append("\n");
            sb.append("Consumer No    : ").append(booking.getConnection().getConsumerNumber()).append("\n");
        }
        sb.append("Provider       : ").append(booking.getProvider()).append("\n");
        sb.append("Cylinder Type  : ").append(booking.getCylinderType()).append("\n\n");
        
        sb.append("--- PAYMENT DETAILS ---\n");
        sb.append("Payment Method : ").append(booking.getPaymentMethod()).append("\n");
        sb.append("Base Price     : INR ").append(booking.getBasePrice()).append("\n");
        sb.append("GST            : INR ").append(booking.getGstAmount()).append("\n");
        sb.append("--------------------------------------------------\n");
        sb.append("TOTAL AMOUNT   : INR ").append(booking.getTotalAmount()).append("\n");
        sb.append("==================================================\n");
        sb.append("Thank you for using QuickCylinder! Your Gas, Your Way.\n");
        
        return sb.toString().getBytes();
    }
}

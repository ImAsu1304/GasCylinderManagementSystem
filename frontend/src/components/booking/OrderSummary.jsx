import { useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { cylinderTypes } from '../../data/providers';
import { getPrice, getGST } from '../../data/cities';
import { HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import './Booking.css';

export default function OrderSummary() {
  const { booking, updateBooking, nextStep, prevStep } = useBooking();
  const ct = cylinderTypes[booking.cylinderType];
  const basePrice = getPrice(booking.cylinderType, booking.city);
  const gstAmount = getGST(booking.cylinderType, basePrice);
  const total = basePrice + gstAmount;

  useEffect(() => {
    updateBooking({ price: basePrice, gst: gstAmount, total });
  }, [basePrice, gstAmount, total]); // eslint-disable-line

  const maskConsumer = (num) => {
    const clean = num.replace(/\s/g, '');
    return 'XXXX XXXX XXXX ' + clean.slice(-5);
  };

  return (
    <div>
      <div className="booking-header">
        <h2 className="heading-3">Order Summary</h2>
        <p className="booking-subtitle">Review your booking details before payment</p>
      </div>
      <div className="neo-card summary-card">
        {/* Provider & Cylinder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: booking.provider?.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {booking.provider?.logo}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{booking.provider?.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{ct?.name}</p>
          </div>
        </div>
        <hr className="neo-divider" />

        {/* Consumer */}
        <div className="summary-row">
          <span className="summary-label">Consumer Number</span>
          <span className="summary-value">{maskConsumer(booking.consumerNumber)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Consumer Name</span>
          <span className="summary-value">{booking.verifiedDetails?.consumerName}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Distributor</span>
          <span className="summary-value">{booking.verifiedDetails?.distributorName}</span>
        </div>
        <hr className="neo-divider" />

        {/* Delivery */}
        <div style={{ margin: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <HiOutlineLocationMarker size={16} style={{ marginTop: 2, flexShrink: 0, color: 'var(--accent-light)' }} />
            <span>{booking.address}, {booking.area}, {booking.city}, {booking.state} - {booking.pinCode}</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)' }}>
              <HiOutlineCalendar size={14} /> {booking.preferredDate}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-tertiary)' }}>
              <HiOutlineClock size={14} /> {booking.timeSlot}
            </div>
          </div>
        </div>
        <hr className="neo-divider" />

        {/* Price Breakdown */}
        <div className="summary-row">
          <span className="summary-label">Cylinder Price ({booking.city})</span>
          <span className="summary-value">₹{basePrice.toFixed(2)}</span>
        </div>
        {gstAmount > 0 && (
          <div className="summary-row">
            <span className="summary-label">GST (5%)</span>
            <span className="summary-value">₹{gstAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row">
          <span className="summary-label">Delivery Charges</span>
          <span className="summary-value" style={{ color: 'var(--success)' }}>FREE</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-tertiary)' }}>
          Estimated delivery: 2-3 business days from the preferred date
        </div>
      </div>
      <div className="booking-actions">
        <button className="neo-btn neo-btn-secondary" onClick={prevStep}>Back</button>
        <button className="neo-btn neo-btn-primary" onClick={nextStep}>Proceed to Payment</button>
      </div>
    </div>
  );
}

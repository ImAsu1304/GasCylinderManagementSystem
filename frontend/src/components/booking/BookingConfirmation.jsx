import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { HiCheck, HiOutlineDownload, HiOutlineLocationMarker, HiOutlineRefresh, HiOutlineShare } from 'react-icons/hi';
import { bookingAPI } from '../../api/axios';
import toast from 'react-hot-toast';
import './Booking.css';

export default function BookingConfirmation() {
  const { booking, resetBooking } = useBooking();
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Intentionally left empty to allow viewing confirmation
    };
  }, []);

  const result = booking.bookingResult;

  if (!result) return <div className="booking-header"><h2 className="heading-3">No booking found</h2></div>;

  const handleDownload = async () => {
    try {
      const toastId = toast.loading('Downloading receipt...');
      const res = await bookingAPI.getReceipt(result.bookingId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Receipt_${result.bookingId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Receipt downloaded!', { id: toastId });
    } catch (e) {
      toast.error('Failed to download receipt');
    }
  };

  return (
    <div>
      <div className="neo-card confirmation-card">
        {/* Success Checkmark */}
        <motion.div className="success-check"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}>
          <HiCheck size={40} color="var(--success)" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="heading-2" style={{ marginBottom: 8 }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Your cylinder has been booked successfully</p>
        </motion.div>

        <motion.div className="conf-details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="conf-row"><span className="conf-label">Booking ID</span><span className="conf-value" style={{ color: 'var(--accent-light)', fontFamily: 'monospace' }}>{result.bookingId}</span></div>
          <div className="conf-row"><span className="conf-label">Transaction ID</span><span className="conf-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>{result.transactionId}</span></div>
          <div className="conf-row"><span className="conf-label">Payment Method</span><span className="conf-value">{result.paymentMethod}</span></div>
          <div className="conf-row"><span className="conf-label">Amount Paid</span><span className="conf-value" style={{ color: 'var(--success)', fontSize: 18, fontWeight: 700 }}>₹{result.amountPaid?.toFixed(2)}</span></div>
          <div className="conf-row"><span className="conf-label">Status</span><span className="neo-badge neo-badge-green">{result.status}</span></div>
          <hr className="neo-divider" />
          <div className="conf-row"><span className="conf-label">Provider</span><span className="conf-value">{booking.provider?.name}</span></div>
          <div className="conf-row"><span className="conf-label">Consumer</span><span className="conf-value">{booking.verifiedDetails?.consumerName}</span></div>
          <div className="conf-row"><span className="conf-label">Distributor</span><span className="conf-value">{booking.verifiedDetails?.distributorName}</span></div>
          <div className="conf-row">
            <span className="conf-label">Delivery</span>
            <span className="conf-value" style={{ textAlign: 'right', maxWidth: '60%', fontSize: 13 }}>
              {booking.address}, {booking.city} - {booking.pinCode}
            </span>
          </div>
          <div className="conf-row"><span className="conf-label">Delivery Date</span><span className="conf-value">{booking.preferredDate}</span></div>
          <div className="conf-row"><span className="conf-label">Time Slot</span><span className="conf-value">{booking.timeSlot}</span></div>
        </motion.div>

        <div className="conf-actions">
          <button className="neo-btn neo-btn-secondary neo-btn-sm" onClick={handleDownload}>
            <HiOutlineDownload size={16} /> Download Receipt
          </button>
          <Link to="/dashboard" className="neo-btn neo-btn-secondary neo-btn-sm">
            <HiOutlineLocationMarker size={16} /> Track Booking
          </Link>
          <Link to="/book" className="neo-btn neo-btn-primary neo-btn-sm" onClick={resetBooking}>
            <HiOutlineRefresh size={16} /> Book Another
          </Link>
          <button className="neo-btn neo-btn-secondary neo-btn-sm" onClick={() => {
            navigator.clipboard?.writeText(`QuickCylinder Booking ${result.bookingId} - ₹${result.amountPaid?.toFixed(2)} - ${result.status}`);
            toast.success('Booking details copied!');
          }}>
            <HiOutlineShare size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

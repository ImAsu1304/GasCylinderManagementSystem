import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../api/axios';
import { HiOutlineShoppingCart, HiOutlineTruck, HiOutlineCurrencyRupee, HiOutlineCalendar, HiOutlineEye, HiOutlineXCircle, HiOutlineTicket, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './Dashboard.css';

const statusColors = {
  PENDING: 'neo-badge-blue',
  ACCEPTED: 'neo-badge-blue',
  DISPATCHED: 'neo-badge-yellow',
  OUT_FOR_DELIVERY: 'neo-badge-yellow',
  DELIVERED: 'neo-badge-green',
  CANCELLED: 'neo-badge-red',
  DECLINED: 'neo-badge-red',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await bookingAPI.getAll();
        if (res.data) setBookings(res.data);
      } catch {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const toastId = toast.loading('Cancelling booking...');
      await bookingAPI.cancel(bookingId);
      setBookings(prev => prev.map(b => b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b));
      toast.success('Booking cancelled successfully', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const totalBookings = bookings.length;
  const activeOrders = bookings.filter(b => !['DELIVERED', 'CANCELLED'].includes(b.status)).length;
  const totalSpent = bookings.filter(b => b.status !== 'CANCELLED').reduce((a, b) => a + (b.amount || 0), 0);

  const stats = [
    { icon: <HiOutlineShoppingCart size={24} />, label: 'Total Bookings', value: totalBookings, color: 'var(--accent)' },
    { icon: <HiOutlineTruck size={24} />, label: 'Active Orders', value: activeOrders, color: 'var(--warning)' },
    { icon: <HiOutlineCurrencyRupee size={24} />, label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, color: 'var(--success)' },
  ];

  return (
    <div className="page-wrapper" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 60 }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="heading-2" style={{ marginBottom: 8 }}>Welcome, {user?.fullName?.split(' ')[0] || 'User'}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Manage your LPG bookings and connections</p>
        </motion.div>

        {/* Stats */}
        <div className="dash-stats">
          {stats.map((s, i) => (
            <motion.div key={i} className="neo-card dash-stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="dash-stat-icon" style={{ color: s.color, background: `${s.color}15` }}>{s.icon}</div>
              <div>
                <div className="dash-stat-value">{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          <Link to="/book" className="neo-btn neo-btn-primary neo-btn-sm">Book New Cylinder</Link>
          <Link to="/dashboard/support" className="neo-btn neo-btn-secondary neo-btn-sm"><HiOutlineTicket size={16} /> Support</Link>
        </div>

        {/* Bookings Table */}
        <div className="neo-card-static">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="heading-4">Booking History</h3>
          </div>
          {loading ? (
            <div className="flex-center" style={{ padding: 40 }}><span className="spinner spinner-lg" /></div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-tertiary)' }}>
              <p>No bookings yet</p>
              <Link to="/book" className="neo-btn neo-btn-primary neo-btn-sm" style={{ marginTop: 16 }}>Book Your First Cylinder</Link>
            </div>
          ) : (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Provider</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td><span style={{ fontFamily: 'monospace', color: 'var(--accent-light)' }}>{b.bookingId}</span></td>
                      <td>{b.provider}</td>
                      <td style={{ fontSize: 13 }}>{b.cylinderType}</td>
                      <td style={{ fontWeight: 600 }}>₹{b.amount?.toFixed(2)}</td>
                      <td style={{ fontSize: 13 }}>{b.date}</td>
                      <td><span className={`neo-badge ${statusColors[b.status] || 'neo-badge-blue'}`}>{b.status.replace(/_/g, ' ')}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="neo-btn neo-btn-secondary neo-btn-sm" style={{ padding: '4px 8px' }}
                            onClick={() => setSelectedBooking(b)}>
                            <HiOutlineEye size={14} />
                          </button>
                          {!['DELIVERED', 'CANCELLED'].includes(b.status) && (
                            <button className="neo-btn neo-btn-danger neo-btn-sm" style={{ padding: '4px 8px' }}
                              onClick={() => handleCancel(b.bookingId)}>
                              <HiOutlineXCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="modal-backdrop" onClick={() => setSelectedBooking(null)}>
            <motion.div className="neo-card modal-content" onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 className="heading-3">Booking Details</h3>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}><HiX size={24} /></button>
              </div>

              {/* Tracking Bar */}
              <div style={{ marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                <h4 className="heading-4" style={{ marginBottom: 12 }}>Order Status</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, left: '10%', right: '10%', height: 2, background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                  
                  {/* Step 1: Ordered */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 8, width: '33%' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', 
                      background: selectedBooking.status === 'DECLINED' ? 'var(--error)' : 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-secondary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', color: selectedBooking.status === 'DECLINED' ? 'var(--error)' : 'var(--text-primary)' }}>
                      {selectedBooking.status === 'DECLINED' ? 'Declined by Admin' : selectedBooking.status === 'PENDING' ? 'Waiting for Admin' : 'Ordered'}
                    </span>
                  </div>

                  {/* Step 2: Out for Delivery */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 8, width: '33%' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', 
                      background: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedBooking.status) ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-secondary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', color: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(selectedBooking.status) ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      Out for Delivery
                    </span>
                  </div>

                  {/* Step 3: Delivered */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, gap: 8, width: '33%' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', 
                      background: selectedBooking.status === 'DELIVERED' ? 'var(--success)' : 'rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-secondary)' }} />
                    <span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', color: selectedBooking.status === 'DELIVERED' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Booking ID:</span> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedBooking.bookingId}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Transaction ID:</span> <span style={{ fontFamily: 'monospace' }}>{selectedBooking.transactionId}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Provider:</span> <span>{selectedBooking.provider}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Cylinder Type:</span> <span>{selectedBooking.cylinderType}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Amount:</span> <span style={{ color: 'var(--success)', fontWeight: 600 }}>₹{selectedBooking.amount?.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Payment Method:</span> <span>{selectedBooking.paymentMethod}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Booking Date:</span> <span>{selectedBooking.date}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Delivery Date:</span> <span>{selectedBooking.deliveryDate || 'Not assigned'}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-secondary">Status:</span> <span className={`neo-badge ${statusColors[selectedBooking.status] || 'neo-badge-blue'}`}>{selectedBooking.status}</span></div>
              </div>
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="neo-btn neo-btn-secondary" onClick={() => setSelectedBooking(null)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

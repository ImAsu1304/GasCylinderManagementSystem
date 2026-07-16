import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { HiOutlineUsers, HiOutlineShoppingCart, HiOutlineCurrencyRupee, HiOutlineTicket, HiOutlineChartBar, HiOutlineAdjustments } from 'react-icons/hi';
import './Dashboard.css';

import { useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  PENDING: 'neo-badge-blue', ACCEPTED: 'neo-badge-blue', DISPATCHED: 'neo-badge-yellow',
  OUT_FOR_DELIVERY: 'neo-badge-yellow', DELIVERED: 'neo-badge-green', CANCELLED: 'neo-badge-red', DECLINED: 'neo-badge-red'
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: <HiOutlineChartBar size={18} /> },
  { id: 'users', label: 'Users', icon: <HiOutlineUsers size={18} /> },
  { id: 'bookings', label: 'Bookings', icon: <HiOutlineShoppingCart size={18} /> },
  { id: 'prices', label: 'Prices', icon: <HiOutlineCurrencyRupee size={18} /> },
  { id: 'tickets', label: 'Support', icon: <HiOutlineTicket size={18} /> },
];

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {linder 
        const [usersRes, bookingsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/bookings')
        ]);
        setUsers(usersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User removed successfully');
    } catch (err) {
      toast.error('Failed to remove user');
    }
  };

  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}><div className="spinner spinner-lg" /></div>;

  const totalRevenue = bookings.filter(b => b.status !== 'CANCELLED' && b.status !== 'DECLINED').reduce((a, b) => a + (b.amount || 0), 0);

  const stats = [
    { icon: <HiOutlineUsers size={22} />, label: 'Total Users', value: users.length.toLocaleString(), color: 'var(--accent)' },
    { icon: <HiOutlineShoppingCart size={22} />, label: 'Total Bookings', value: bookings.length.toLocaleString(), color: 'var(--success)' },
    { icon: <HiOutlineCurrencyRupee size={22} />, label: 'Revenue', value: `₹${(totalRevenue).toFixed(0)}`, color: 'var(--warning)' },
    { icon: <HiOutlineTicket size={22} />, label: 'Open Tickets', value: 0, color: 'var(--error)' },
  ];

  return (
    <div className="page-wrapper" style={{ paddingTop: 'calc(var(--navbar-height) + 32px)', paddingBottom: 60 }}>
      <div className="container">
        <h1 className="heading-2" style={{ marginBottom: 24 }}>
          <HiOutlineAdjustments size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Admin Panel
        </h1>

        <div className="admin-grid">
          {/* Sidebar */}
          <div className="neo-card-static" style={{ padding: 12, height: 'fit-content' }}>
            <div className="admin-sidebar">
              {tabs.map(t => (
                <button key={t.id} className={`admin-sidebar-link ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="admin-content">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="admin-stat-grid">
                  {stats.map((s, i) => (
                    <div key={i} className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${s.color}15`, color: s.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="neo-card-static">
                  <h3 className="heading-4" style={{ marginBottom: 16 }}>Recent Bookings</h3>
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead><tr><th>Booking ID / Consumer</th><th>Provider</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {bookings.slice(0, 10).map(b => (
                          <tr key={b.id}>
                            <td>
                              <div style={{ fontFamily: 'monospace', color: 'var(--accent-light)', fontWeight: 600 }}>{b.bookingId}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No: {b.consumerNumber}</div>
                            </td>
                            <td>{b.provider}</td>
                            <td style={{ fontWeight: 600 }}>₹{b.amount}</td>
                            <td><span className={`neo-badge ${statusColors[b.status]}`}>{b.status}</span></td>
                            <td style={{ fontSize: 13 }}>{b.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="neo-card-static">
                  <h3 className="heading-4" style={{ marginBottom: 16 }}>Registered Users</h3>
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id}>
                            <td style={{ fontWeight: 500 }}>{u.fullName || u.name}</td>
                            <td>{u.email}</td>
                            <td><span className="neo-badge neo-badge-blue">{u.role}</span></td>
                            <td style={{ fontSize: 13 }}>{new Date(u.createdAt || u.joined).toLocaleDateString()}</td>
                            <td>
                              <button className="neo-btn neo-btn-danger neo-btn-sm" onClick={() => handleDeleteUser(u.id)}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="neo-card-static">
                  <h3 className="heading-4" style={{ marginBottom: 16 }}>All Bookings</h3>
                  <div className="dash-table-wrap">
                    <table className="dash-table">
                      <thead><tr><th>Booking ID / Consumer</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id}>
                            <td>
                              <div style={{ fontFamily: 'monospace', color: 'var(--accent-light)', fontWeight: 600 }}>{b.bookingId}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>No: {b.consumerNumber}</div>
                            </td>
                            <td style={{ fontWeight: 600 }}>₹{b.amount}</td>
                            <td><span className={`neo-badge ${statusColors[b.status]}`}>{b.status}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 8 }}>
                                {b.status === 'PENDING' && (
                                  <>
                                    <button className="neo-btn neo-btn-success neo-btn-sm" onClick={() => handleUpdateStatus(b.id, 'ACCEPTED')}>Accept</button>
                                    <button className="neo-btn neo-btn-danger neo-btn-sm" onClick={() => handleUpdateStatus(b.id, 'DECLINED')}>Decline</button>
                                  </>
                                )}
                                {b.status === 'ACCEPTED' && (
                                  <button className="neo-btn neo-btn-primary neo-btn-sm" onClick={() => handleUpdateStatus(b.id, 'OUT_FOR_DELIVERY')}>Dispatch</button>
                                )}
                                {b.status === 'OUT_FOR_DELIVERY' && (
                                  <button className="neo-btn neo-btn-success neo-btn-sm" onClick={() => handleUpdateStatus(b.id, 'DELIVERED')}>Mark Delivered</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'prices' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="neo-card-static">
                  <h3 className="heading-4" style={{ marginBottom: 16 }}>Cylinder Price Management</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 14, marginBottom: 16 }}>Update prices by city and provider — connects to backend API when available.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'tickets' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="neo-card-static">
                  <h3 className="heading-4" style={{ marginBottom: 16 }}>Support Tickets (0 Open)</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Support ticket management — connects to backend API when available.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

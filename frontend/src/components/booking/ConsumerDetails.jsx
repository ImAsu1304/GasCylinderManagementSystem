import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { cylinderTypes } from '../../data/providers';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './Booking.css';

import api from '../../api/axios';

export default function ConsumerDetails() {
  const { booking, updateBooking, nextStep, prevStep } = useBooking();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(!!booking.verifiedDetails);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    consumerNumber: booking.consumerNumber || '',
    mobileNumber: booking.mobileNumber || '',
    cylinderType: booking.cylinderType || '',
  });

  const validate = () => {
    const e = {};
    if (!form.consumerNumber) e.consumerNumber = 'Consumer number is required';
    else if (form.consumerNumber.replace(/\s/g, '').length !== 17) e.consumerNumber = 'Must be exactly 17 digits';
    if (!form.mobileNumber) e.mobileNumber = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.mobileNumber)) e.mobileNumber = 'Invalid mobile number';
    if (!form.cylinderType) e.cylinderType = 'Select a cylinder type';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVerify = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await api.post('/connections/verify', { consumerNumber: form.consumerNumber.replace(/\s/g, '') });
      updateBooking({ ...form, verifiedDetails: response.data });
      setVerified(true);
      toast.success('Consumer verified successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Invalid consumer number.');
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const formatConsumer = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 17);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleContinue = () => {
    if (!verified) { toast.error('Please verify your consumer details first'); return; }
    nextStep();
  };

  return (
    <div>
      <div className="booking-header">
        <h2 className="heading-3">Consumer Details</h2>
        <p className="booking-subtitle">Enter your LPG consumer information for {booking.provider?.name}</p>
      </div>
      <div className="neo-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <div className="form-group">
          <label className="form-label">17-Digit LPG Consumer Number</label>
          <input className={`neo-input ${errors.consumerNumber ? 'error' : ''}`} placeholder="XXXX XXXX XXXX XXXX X"
            value={form.consumerNumber} onChange={e => { setForm({ ...form, consumerNumber: formatConsumer(e.target.value) }); setVerified(false); }} />
          {errors.consumerNumber && <span className="form-error">{errors.consumerNumber}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Registered Mobile Number</label>
          <input className={`neo-input ${errors.mobileNumber ? 'error' : ''}`} placeholder="10-digit mobile number"
            maxLength={10} value={form.mobileNumber}
            onChange={e => { setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) }); setVerified(false); }} />
          {errors.mobileNumber && <span className="form-error">{errors.mobileNumber}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Cylinder Type</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.values(cylinderTypes).map(ct => (
              <motion.div key={ct.id} whileTap={{ scale: 0.97 }}
                className={`neo-card ${form.cylinderType === ct.id ? 'selected' : ''}`}
                style={{ flex: 1, minWidth: 140, cursor: 'pointer', padding: 14, border: form.cylinderType === ct.id ? '2px solid var(--accent)' : undefined }}
                onClick={() => { setForm({ ...form, cylinderType: ct.id }); setVerified(false); }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{ct.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{ct.shortName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{ct.description}</div>
              </motion.div>
            ))}
          </div>
          {errors.cylinderType && <span className="form-error">{errors.cylinderType}</span>}
        </div>
        {!verified && (
          <button className="neo-btn neo-btn-primary neo-btn-full" onClick={handleVerify} disabled={loading} style={{ height: 48 }}>
            {loading ? <><span className="spinner" /> Verifying...</> : 'Verify Consumer'}
          </button>
        )}
        {verified && booking.verifiedDetails && (
          <motion.div className="verify-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <HiOutlineCheckCircle size={20} color="var(--success)" />
              <span style={{ fontWeight: 600, color: 'var(--success)' }}>Verified Successfully</span>
            </div>
            <div className="verify-item"><span className="verify-label">Consumer Name</span><span className="verify-value">{booking.verifiedDetails.consumerName}</span></div>
            <div className="verify-item"><span className="verify-label">Distributor</span><span className="verify-value">{booking.verifiedDetails.distributorName}</span></div>
            <div className="verify-item"><span className="verify-label">Last Booking</span><span className="verify-value">{booking.verifiedDetails.lastBookingDate}</span></div>
            <div className="verify-item"><span className="verify-label">Status</span><span className="neo-badge neo-badge-green">{booking.verifiedDetails.connectionStatus}</span></div>
          </motion.div>
        )}
      </div>
      <div className="booking-actions">
        <button className="neo-btn neo-btn-secondary" onClick={prevStep}>Back</button>
        <button className="neo-btn neo-btn-primary" onClick={handleContinue} disabled={!verified}>Continue</button>
      </div>
    </div>
  );
}

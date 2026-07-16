import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { cities, states, cityStateMap } from '../../data/cities';
import toast from 'react-hot-toast';
import './Booking.css';

export default function DeliveryDetails() {
  const { booking, updateBooking, nextStep, prevStep } = useBooking();
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    address: booking.address || '',
    area: booking.area || '',
    city: booking.city || '',
    state: booking.state || '',
    pinCode: booking.pinCode || '',
    landmark: booking.landmark || '',
    preferredDate: booking.preferredDate || '',
    timeSlot: booking.timeSlot || '',
    specialInstructions: booking.specialInstructions || '',
  });

  const validate = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.area.trim()) e.area = 'Area is required';
    if (!form.city) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!form.pinCode) e.pinCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(form.pinCode)) e.pinCode = 'Must be 6 digits';
    if (!form.preferredDate) e.preferredDate = 'Select a delivery date';
    if (!form.timeSlot) e.timeSlot = 'Select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCityChange = (city) => {
    const state = cityStateMap[city] || '';
    setForm({ ...form, city, state });
  };

  const handleSubmit = () => {
    if (!validate()) { toast.error('Please fill all required fields'); return; }
    updateBooking(form);
    nextStep();
  };

  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div>
      <div className="booking-header">
        <h2 className="heading-3">Delivery Details</h2>
        <p className="booking-subtitle">Where should we deliver your cylinder?</p>
      </div>
      <div className="neo-card delivery-form">
        <div className="form-group">
          <label className="form-label">Delivery Address *</label>
          <textarea className={`neo-input ${errors.address ? 'error' : ''}`} rows={3} placeholder="House/Flat No., Building, Street"
            value={form.address} onChange={e => update('address', e.target.value)} style={{ resize: 'vertical' }} />
          {errors.address && <span className="form-error">{errors.address}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Area / Locality *</label>
            <input className={`neo-input ${errors.area ? 'error' : ''}`} placeholder="Area name"
              value={form.area} onChange={e => update('area', e.target.value)} />
            {errors.area && <span className="form-error">{errors.area}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">City *</label>
            <select className={`neo-select ${errors.city ? 'error' : ''}`} value={form.city} onChange={e => handleCityChange(e.target.value)}>
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <span className="form-error">{errors.city}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">State *</label>
            <select className={`neo-select ${errors.state ? 'error' : ''}`} value={form.state} onChange={e => update('state', e.target.value)}>
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <span className="form-error">{errors.state}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">PIN Code *</label>
            <input className={`neo-input ${errors.pinCode ? 'error' : ''}`} placeholder="6-digit PIN code" maxLength={6}
              value={form.pinCode} onChange={e => update('pinCode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
            {errors.pinCode && <span className="form-error">{errors.pinCode}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Landmark (Optional)</label>
          <input className="neo-input" placeholder="Near temple, school, etc." value={form.landmark} onChange={e => update('landmark', e.target.value)} />
        </div>
        <hr className="neo-divider" />
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Preferred Delivery Date *</label>
            <input type="date" className={`neo-input ${errors.preferredDate ? 'error' : ''}`}
              min={minDate} max={maxDate} value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} />
            {errors.preferredDate && <span className="form-error">{errors.preferredDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Time Slot *</label>
            <select className={`neo-select ${errors.timeSlot ? 'error' : ''}`} value={form.timeSlot} onChange={e => update('timeSlot', e.target.value)}>
              <option value="">Select Slot</option>
              <option value="Morning (8 AM - 12 PM)">Morning (8 AM - 12 PM)</option>
              <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
              <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
            </select>
            {errors.timeSlot && <span className="form-error">{errors.timeSlot}</span>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Special Instructions (Optional)</label>
          <textarea className="neo-input" rows={2} placeholder="Any special delivery instructions"
            value={form.specialInstructions} onChange={e => update('specialInstructions', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
      </div>
      <div className="booking-actions">
        <button className="neo-btn neo-btn-secondary" onClick={prevStep}>Back</button>
        <button className="neo-btn neo-btn-primary" onClick={handleSubmit}>Continue</button>
      </div>
    </div>
  );
}

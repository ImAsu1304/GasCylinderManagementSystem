import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { providers } from '../../data/providers';
import { HiOutlinePhone, HiOutlineGlobe, HiCheck } from 'react-icons/hi';
import './Booking.css';

export default function ProviderSelection() {
  const { booking, updateBooking, nextStep } = useBooking();

  const handleSelect = (provider) => {
    updateBooking({ provider });
  };

  return (
    <div>
      <div className="booking-header">
        <h2 className="heading-3">Select Gas Provider</h2>
        <p className="booking-subtitle">Choose your LPG gas company to get started</p>
      </div>

      <div className="provider-select-grid">
        {providers.map((p, i) => (
          <motion.div
            key={p.id}
            className={`neo-card provider-select-card ${booking.provider?.id === p.id ? 'selected' : ''}`}
            onClick={() => handleSelect(p)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ '--pcolor': p.color, '--pglow': p.colorLight, cursor: 'pointer' }}
          >
            {booking.provider?.id === p.id && (
              <motion.div className="provider-check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <HiCheck size={16} />
              </motion.div>
            )}
            <div className="provider-select-logo" style={{ background: p.gradient }}>
              <span style={{ fontSize: 36 }}>{p.logo}</span>
            </div>
            <h3 className="provider-select-name">{p.name}</h3>
            <p className="provider-select-parent">{p.parentCompany}</p>
            <p className="provider-select-desc">{p.description}</p>
            <hr className="neo-divider" />
            <div className="provider-select-info">
              <div className="provider-info-item">
                <HiOutlinePhone size={14} />
                <span>{p.customerCare}</span>
              </div>
              <div className="provider-info-item">
                <HiOutlineGlobe size={14} />
                <span>{p.website.replace('https://', '')}</span>
              </div>
            </div>
            <div className="provider-cylinders">
              <span className="neo-badge neo-badge-blue">14.2 kg</span>
              <span className="neo-badge neo-badge-blue">19 kg</span>
              <span className="neo-badge neo-badge-blue">5 kg</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="booking-actions">
        <button
          className="neo-btn neo-btn-primary neo-btn-lg"
          disabled={!booking.provider}
          onClick={nextStep}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

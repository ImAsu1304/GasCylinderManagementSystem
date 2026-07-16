import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';
import { bookingAPI } from '../../api/axios';
import { popularBanks, upiApps, wallets, detectCardBrand, formatCardNumber, formatExpiry } from '../../data/banks';
import { QRCodeSVG } from 'qrcode.react';
import { HiOutlineCreditCard, HiOutlineDeviceMobile, HiOutlineLibrary, HiOutlineCash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import './Booking.css';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: <HiOutlineDeviceMobile size={16} /> },
  { id: 'card', label: 'Card', icon: <HiOutlineCreditCard size={16} /> },
  { id: 'netbanking', label: 'Net Banking', icon: <HiOutlineLibrary size={16} /> },
  { id: 'wallet', label: 'Wallets', icon: <HiOutlineCash size={16} /> },
];

const processingSteps = [
  'Connecting to payment gateway...',
  'Verifying payment details...',
  'Processing transaction...',
  'Confirming with gas provider...',
];

export default function PaymentPage() {
  const { booking, updateBooking, nextStep, prevStep } = useBooking();
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // UPI state
  const [upiId, setUpiId] = useState('');
  const [selectedUpi, setSelectedUpi] = useState('');

  // Card state
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState('');

  const cardBrand = detectCardBrand(cardNum);

  const canPay = () => {
    switch (method) {
      case 'upi': return upiId.includes('@') || selectedUpi;
      case 'card': return cardNum.replace(/\s/g, '').length === 16 && cardName && cardExpiry.length === 5 && cardCvv.length >= 3;
      case 'netbanking': return !!selectedBank;
      case 'wallet': return !!selectedWallet;
      default: return false;
    }
  };

  const handlePay = async () => {
    if (!canPay()) { toast.error('Please fill in all payment details'); return; }
    setProcessing(true);
    setProcessStep(0);
    setProgress(0);

    for (let i = 0; i < processingSteps.length; i++) {
      setProcessStep(i);
      setProgress(((i + 1) / processingSteps.length) * 100);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400));
    }

    // Generate booking payload
    const methodLabel = method === 'upi' ? `UPI (${selectedUpi || upiId})` :
      method === 'card' ? `${cardBrand.brand} Card ****${cardNum.slice(-4)}` :
      method === 'netbanking' ? `Net Banking - ${popularBanks.find(b => b.id === selectedBank)?.name || selectedBank}` :
      `Wallet - ${wallets.find(w => w.id === selectedWallet)?.name}`;

    try {
      const payload = {
        provider: booking.provider?.name || '',
        cylinderType: booking.cylinderType || '',
        consumerNumber: (booking.consumerNumber || '').replace(/\s/g, ''),
        consumerName: booking.verifiedDetails?.consumerName || '',
        distributorName: booking.verifiedDetails?.distributorName || '',
        mobileNumber: booking.mobileNumber || '',
        address: booking.address || '',
        area: booking.area || '',
        city: booking.city || '',
        state: booking.state || '',
        pinCode: booking.pinCode || '',
        landmark: booking.landmark || '',
        preferredDeliveryDate: booking.preferredDate || '',
        timeSlot: booking.timeSlot || '',
        specialInstructions: booking.specialInstructions || '',
        basePrice: booking.basePrice || 0,
        gstAmount: booking.gst || 0,
        totalAmount: booking.total || 0,
        paymentMethod: methodLabel
      };

      const res = await bookingAPI.create(payload);

      updateBooking({
        paymentMethod: methodLabel,
        bookingResult: res.data // Use real response from backend
      });

      setProcessing(false);
      nextStep();
    } catch (err) {
      setProcessing(false);
      toast.error(err.response?.data?.message || 'Failed to process booking. Please try again.');
    }
  };

  return (
    <div>
      <div className="booking-header">
        <h2 className="heading-3">Payment</h2>
        <p className="booking-subtitle">Pay ₹{booking.total?.toFixed(2)} securely</p>
      </div>

      {/* Method Tabs */}
      <div className="payment-tabs">
        {paymentMethods.map(m => (
          <button key={m.id} className={`payment-tab ${method === m.id ? 'active' : ''}`} onClick={() => setMethod(m.id)}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <div className="neo-card" style={{ maxWidth: 560, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>

            {/* UPI */}
            {method === 'upi' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Enter UPI ID</label>
                  <input className="neo-input" placeholder="yourname@upi" value={upiId} onChange={e => { setUpiId(e.target.value); setSelectedUpi(''); }} />
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13, margin: '16px 0 12px' }}>Or pay using</p>
                <div className="upi-apps">
                  {upiApps.map(app => (
                    <motion.div key={app.id} className={`upi-app ${selectedUpi === app.id ? 'selected' : ''}`}
                      style={{ background: app.color }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedUpi(app.id); setUpiId(''); }}>
                      {app.name.charAt(0)}
                    </motion.div>
                  ))}
                </div>
                {(upiId || selectedUpi) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', marginTop: 20 }}>
                     <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 12 }}>Scan QR to pay</p>
                    <div style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block' }}>
                      <QRCodeSVG value={`upi://pay?pa=quickcylinder@upi&pn=QuickCylinder&am=${booking.total}&cu=INR`} size={140} />
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Card */}
            {method === 'card' && (
              <div>
                <div className="credit-card-3d">
                  <div className={`card-inner ${cardFlipped ? 'flipped' : ''}`}>
                    <div className="card-face card-front">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>CREDIT/DEBIT</span>
                        <span className="card-brand" style={{ color: cardBrand.color || '#fff' }}>{cardBrand.brand || '••••'}</span>
                      </div>
                      <div className="card-number">{cardNum || '•••• •••• •••• ••••'}</div>
                      <div className="card-bottom">
                        <div className="card-holder">CARD HOLDER<span>{cardName || 'YOUR NAME'}</span></div>
                        <div className="card-expiry">EXPIRES<span>{cardExpiry || 'MM/YY'}</span></div>
                      </div>
                    </div>
                    <div className="card-face card-back">
                      <div className="card-stripe" />
                      <div className="card-cvv-strip">{cardCvv || '•••'}</div>
                      <div style={{ textAlign: 'right', fontSize: 14, color: 'var(--text-tertiary)' }}>{cardBrand.brand}</div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input className="neo-input" placeholder="1234 5678 9012 3456" value={cardNum}
                    onChange={e => setCardNum(formatCardNumber(e.target.value))} onFocus={() => setCardFlipped(false)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Holder Name</label>
                  <input className="neo-input" placeholder="Name on card" value={cardName}
                    onChange={e => setCardName(e.target.value.toUpperCase())} onFocus={() => setCardFlipped(false)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input className="neo-input" placeholder="MM/YY" value={cardExpiry}
                      onChange={e => setCardExpiry(formatExpiry(e.target.value))} onFocus={() => setCardFlipped(false)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="neo-input" placeholder="•••" type="password" maxLength={4} value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'netbanking' && (
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Select your bank</p>
                <div className="bank-grid">
                  {popularBanks.map(bank => (
                    <motion.div key={bank.id} className={`bank-card ${selectedBank === bank.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBank(bank.id)} whileTap={{ scale: 0.95 }}>
                      <span className="bank-icon" style={{ background: bank.color, width: 24, height: 24, borderRadius: '50%', display: 'inline-block' }}></span>
                      {bank.shortName}
                    </motion.div>
                  ))}
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Other Banks</label>
                  <select className="neo-select" value={selectedBank} onChange={e => setSelectedBank(e.target.value)}>
                    <option value="">Select Bank</option>
                    {popularBanks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Wallets */}
            {method === 'wallet' && (
              <div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>Select wallet</p>
                <div className="wallet-grid">
                  {wallets.map(w => (
                    <motion.div key={w.id} className={`wallet-card ${selectedWallet === w.id ? 'selected' : ''}`}
                      onClick={() => setSelectedWallet(w.id)} whileTap={{ scale: 0.97 }}>
                      <div style={{ background: w.color, width: 40, height: 40, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', color: '#fff', fontSize: 20, fontWeight: 700 }}>{w.name.charAt(0)}</div>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{w.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button className="neo-btn neo-btn-success neo-btn-full" onClick={handlePay}
          disabled={!canPay()} style={{ marginTop: 24, height: 52, fontSize: 16 }}>
          Pay ₹{booking.total?.toFixed(2)}
        </button>
      </div>

      <div className="booking-actions">
        <button className="neo-btn neo-btn-secondary" onClick={prevStep}>Back</button>
      </div>

      {/* Processing Overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div className="payment-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
              <div className="spinner spinner-lg" style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: 20, fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>Processing Payment</h3>
              <div className="progress-bar-bg">
                <motion.div className="progress-bar-fill" animate={{ width: `${progress}%` }} />
              </div>
              <div className="processing-steps" style={{ marginTop: 24 }}>
                {processingSteps.map((s, i) => (
                  <div key={i} className={`processing-step ${i === processStep ? 'active' : ''} ${i < processStep ? 'done' : ''}`}>
                    {i < processStep ? '✓' : i === processStep ? '⟳' : '○'} {s}
                  </div>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                Do not close this window
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

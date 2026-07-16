import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Invalid Indian mobile number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);
    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const iconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '100px 16px 40px' }}>
      <motion.div className="neo-card" style={{ width: '100%', maxWidth: 480, padding: 40 }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="heading-3">Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>Join QuickCylinder today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineUser size={18} style={iconStyle} />
              <input className={`neo-input ${errors.fullName ? 'error' : ''}`} type="text" placeholder="Enter your full name"
                style={{ paddingLeft: 42 }} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
            </div>
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineMail size={18} style={iconStyle} />
              <input className={`neo-input ${errors.email ? 'error' : ''}`} type="email" placeholder="you@example.com"
                style={{ paddingLeft: 42 }} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <HiOutlinePhone size={18} style={iconStyle} />
              <input className={`neo-input ${errors.phone ? 'error' : ''}`} type="text" placeholder="10-digit mobile number"
                style={{ paddingLeft: 42 }} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineLockClosed size={18} style={iconStyle} />
              <input className={`neo-input ${errors.password ? 'error' : ''}`} type={showPw ? 'text' : 'password'}
                placeholder="Min 6 characters" style={{ paddingLeft: 42, paddingRight: 42 }}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--text-tertiary)', padding: 0 }}>
                {showPw ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineLockClosed size={18} style={iconStyle} />
              <input className={`neo-input ${errors.confirmPassword ? 'error' : ''}`} type="password" placeholder="Re-enter password"
                style={{ paddingLeft: 42 }} value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="neo-btn neo-btn-primary neo-btn-full" disabled={loading} style={{ marginTop: 8, height: 50 }}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}

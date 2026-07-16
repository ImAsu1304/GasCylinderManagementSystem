import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import { MdOutlineLocalGasStation } from 'react-icons/md';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/book', label: 'Book Cylinder' },
    ...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
    ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel' }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <div className="navbar-logo-icon">
            <MdOutlineLocalGasStation size={24} />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-brand">QuickCylinder</span>
            <span className="navbar-tagline">Booked in a Flash ⚡</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div
                  className="navbar-link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="navbar-user-menu">
              <div className="navbar-user-info">
                <div className="navbar-avatar">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="navbar-username">{user?.fullName?.split(' ')[0]}</span>
              </div>
              <div className="navbar-dropdown">
                <Link to="/dashboard" className="navbar-dropdown-item">
                  <HiOutlineUser size={16} />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="navbar-dropdown-item">
                    <HiOutlineCog size={16} />
                    Admin Panel
                  </Link>
                )}
                <hr className="neo-divider" style={{ margin: '4px 0' }} />
                <button onClick={handleLogout} className="navbar-dropdown-item logout">
                  <HiOutlineLogout size={16} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="neo-btn neo-btn-secondary neo-btn-sm">
                Login
              </Link>
              <Link to="/register" className="neo-btn neo-btn-primary neo-btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="navbar-mobile glass"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="neo-divider" />
            {isAuthenticated ? (
              <button onClick={handleLogout} className="navbar-mobile-link logout">
                <HiOutlineLogout size={18} />
                Logout
              </button>
            ) : (
              <div className="navbar-mobile-auth">
                <Link to="/login" className="neo-btn neo-btn-secondary neo-btn-full" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="neo-btn neo-btn-primary neo-btn-full" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

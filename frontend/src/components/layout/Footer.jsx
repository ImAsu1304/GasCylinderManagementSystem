import { Link } from 'react-router-dom';
import { MdOutlineLocalGasStation } from 'react-icons/md';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer neo-card-static" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="navbar-logo-icon" style={{ width: 36, height: 36 }}>
                <MdOutlineLocalGasStation size={20} />
              </div>
              <div>
                <h3 className="footer-brand-name">QuickCylinder</h3>
                <p className="footer-tagline">Your Gas, Your Way ⚡</p>
              </div>
            </div>
            <p className="footer-desc">India's trusted LPG gas cylinder booking platform.</p>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/book" className="footer-link">Book Cylinder</Link>
              <Link to="/dashboard" className="footer-link">Dashboard</Link>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Providers</h4>
            <div className="footer-links">
              <span className="footer-link-static">🔥 Indane Gas (IOCL)</span>
              <span className="footer-link-static">⛽ HP Gas (HPCL)</span>
              <span className="footer-link-static">🛢️ Bharat Gas (BPCL)</span>
            </div>
          </div>
          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-links">
              <a href="mailto:support@quickcylinder.com" className="footer-link">
                <HiOutlineMail size={14} /> support@quickcylinder.com
              </a>
              <a href="tel:1800-XXX-XXXX" className="footer-link">
                <HiOutlinePhone size={14} /> 1800-XXX-XXXX
              </a>
            </div>
          </div>
        </div>
        <hr className="neo-divider" />
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} QuickCylinder. All rights reserved.</p>
          <p className="footer-note">Demonstration platform — no real payments processed.</p>
        </div>
      </div>
    </footer>
  );
}

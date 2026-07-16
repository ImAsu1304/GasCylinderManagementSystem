import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { providers } from '../data/providers';
import { HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineClock, HiOutlineDeviceMobile } from 'react-icons/hi';
import './Home.css';

const features = [
  { icon: <HiOutlineLightningBolt size={28} />, title: 'Instant Booking', desc: 'Book your LPG cylinder in under 2 minutes with our streamlined process.' },
  { icon: <HiOutlineShieldCheck size={28} />, title: 'Secure Payments', desc: 'Multiple payment options with bank-grade security for every transaction.' },
  { icon: <HiOutlineClock size={28} />, title: 'Real-time Tracking', desc: 'Track your cylinder delivery status from confirmation to doorstep.' },
  { icon: <HiOutlineDeviceMobile size={28} />, title: 'Mobile Friendly', desc: 'Seamless experience across all devices — desktop, tablet, and mobile.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero-section" id="hero">
        <div className="container hero-container">
          <motion.div className="hero-content" initial="hidden" animate="visible" variants={containerVariants}>
            <motion.div variants={itemVariants} className="hero-badge glass">
              <span className="hero-badge-dot" />
              Trusted by millions across India
            </motion.div>
            <motion.h1 variants={itemVariants} className="heading-1 hero-title">
              Your Gas, Your Way —<br />
              <span className="text-gradient">Booked in a Flash</span> ⚡
            </motion.h1>
            <motion.p variants={itemVariants} className="hero-subtitle">
              Book Indane, HP Gas & Bharat Gas cylinders online. Fast, secure, and hassle-free LPG booking for all of India.
            </motion.p>
            <motion.div variants={itemVariants} className="hero-actions">
              <Link to="/book" className="neo-btn neo-btn-primary neo-btn-lg">
                Book Now
                <HiOutlineLightningBolt />
              </Link>
              <Link to="/register" className="neo-btn neo-btn-outline neo-btn-lg">
                Create Account
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} className="hero-stats">
              <div className="hero-stat"><span className="hero-stat-num">10L+</span><span className="hero-stat-label">Bookings</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-num">14+</span><span className="hero-stat-label">Cities</span></div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><span className="hero-stat-num">3</span><span className="hero-stat-label">Providers</span></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Providers */}
      <section className="section" id="providers">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="heading-2">Official Gas Providers</h2>
            <p className="section-subtitle">Book from India's top 3 government-authorized LPG distributors</p>
          </motion.div>
          <div className="providers-grid">
            {providers.map((p, i) => (
              <motion.div key={p.id} className="neo-card provider-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="provider-logo" style={{ background: p.gradient }}>{p.logo}</div>
                <h3 className="provider-name">{p.name}</h3>
                <p className="provider-parent">{p.parentCompany}</p>
                <p className="provider-desc">{p.description}</p>
                <div className="provider-info">
                  <span>📞 {p.customerCare}</span>
                  <span>🌐 {p.website.replace('https://', '')}</span>
                </div>
                <Link to="/book" className="neo-btn neo-btn-primary neo-btn-sm neo-btn-full" style={{ marginTop: 'auto' }}>
                  Book Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="heading-2">Why QuickCylinder?</h2>
            <p className="section-subtitle">Experience the future of LPG booking</p>
          </motion.div>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} className="neo-card feature-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="feature-icon">{f.icon}</div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" id="cta">
        <div className="container">
          <motion.div className="cta-card neo-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="heading-2">Ready to Book Your Cylinder?</h2>
            <p className="cta-subtitle">Join millions of Indians who trust QuickCylinder for hassle-free LPG booking.</p>
            <Link to="/book" className="neo-btn neo-btn-primary neo-btn-lg">
              Get Started <HiOutlineLightningBolt />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

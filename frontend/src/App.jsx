import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Map, PhoneCall, CarFront, RadioTower, AlertTriangle } from 'lucide-react';

// Components
import RouteMap from './components/RouteMap';
import SOSButton from './components/SOSButton';
import TravelMonitor from './components/TravelMonitor';
import KeychainTracker from './components/KeychainTracker';
import Login from './components/Login';

const Home = () => {
  const quotes = [
    { text: "A woman is the full circle. Within her is the power to create, nurture and transform.", author: "Diane Mariechild" },
    { text: "There is no limit to what we, as women, can accomplish.", author: "Michelle Obama" },
    { text: "She remembered who she was and the game changed.", author: "Lalah Delia" }
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="home-content" style={{ width: '100%' }}>
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', margin: 0, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '50%',
            boxShadow: '0 10px 30px rgba(216, 27, 96, 0.2)',
            marginBottom: '1rem'
          }}>
            <img src="/login-logo.png" alt="She Shield Logo" style={{ height: '80px', width: 'auto' }} />
          </div>
          <h2 style={{ color: 'var(--primary-dark)', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>SheShield</h2>
          <div style={{ width: '40px', height: '4px', background: 'var(--primary)', margin: '0.5rem auto' }}></div>
        </div>

        <h1 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '2.2rem' }}>Empower. Protect. Thrive.</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2.5rem' }}>
          Welcome to She Shield. Your ultimate personal safety companion.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <Link to="/sos" className="btn btn-primary"><AlertTriangle size={20} /> SOS Alert</Link>
          <Link to="/map" className="btn btn-outline"><Map size={20} /> Smart Routes</Link>
          <Link to="/travel" className="btn btn-outline"><CarFront size={20} /> Geo Tag Capturing Image</Link>
        </div>

        <div className="quotes-section">
          <p className="quote-text">"{randomQuote.text}"</p>
          <p className="quote-author">— {randomQuote.author}</p>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
        <img src="/logo.png" alt="She Shield Logo" onError={(e) => { e.target.style.display = 'none'; }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="logo-text">SheShield</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary-dark)', letterSpacing: '1px' }}>SAFETY FIRST</span>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/map" className={`nav-link ${isActive('/map')}`}><Map size={18} /> Route Intelligence</Link>
        <Link to="/sos" className={`nav-link ${isActive('/sos')}`} style={{ color: 'var(--danger)', fontWeight: 'bold' }}><AlertTriangle size={18} /> SOS</Link>
        <Link to="/travel" className={`nav-link ${isActive('/travel')}`}><CarFront size={18} /> Geo Tag Capturing Image</Link>
        <Link to="/tracker" className={`nav-link ${isActive('/tracker')}`}><RadioTower size={18} /> Keychain</Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container" style={{ flex: 1, minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/map" element={<RouteMap />} />
            <Route path="/sos" element={<SOSButton />} />
            <Route path="/travel" element={<TravelMonitor />} />
            <Route path="/tracker" element={<KeychainTracker />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

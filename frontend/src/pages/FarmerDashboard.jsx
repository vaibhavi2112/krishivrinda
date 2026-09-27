import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJarvis } from '../jarvis/JarvisContext';
import FarmerHome from './farmer/FarmerHome';
import MyCrops from './farmer/MyCrops';
import MyNotifications from './farmer/MyNotifications';
import FarmerProfile from './farmer/FarmerProfile';
import MarketPrices from './farmer/MarketPrices';
import PostJob from './farmer/PostJob';
import BrowseWorkers from './farmer/BrowseWorkers';

export default function FarmerDashboard() {
  const nav = useNavigate();
  const [tab, setTab] = useState('home');
  const { registerHandlers } = useJarvis();

  const logout = () => {
    localStorage.removeItem('kv_token');
    localStorage.removeItem('kv_user');
    nav('/');
  };

  useEffect(() => {
    registerHandlers({ goTo: setTab, logout });
    // eslint-disable-next-line
  }, []);

  const showTab = () => {
    if (tab === 'home') return <FarmerHome goTo={setTab} />;
    if (tab === 'crops') return <MyCrops />;
    if (tab === 'market') return <MarketPrices onBack={() => setTab('home')} />;
    if (tab === 'jobs') return <PostJob onBack={() => setTab('home')} />;
    if (tab === 'findworkers') return <BrowseWorkers onBack={() => setTab('home')} />;
    if (tab === 'notif') return <MyNotifications />;
    if (tab === 'me') return <FarmerProfile onLogout={logout} />;
  };

  const tabs = [
    { id: 'home', icon: '🏠', label: 'घर' },
    { id: 'crops', icon: '🌾', label: 'पिके' },
    { id: 'market', icon: '💰', label: 'बाजार' },
    { id: 'jobs', icon: '👷', label: 'कामगार' },
    { id: 'notif', icon: '🔔', label: 'बातमी' },
    { id: 'me', icon: '👤', label: 'मी' }
  ];

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>🌾 कृषीवृंदा</h1>
          <p style={s.headerSub}>शेतकरी</p>
        </div>
      </header>

      <main style={s.main}>{showTab()}</main>

      <nav style={s.nav}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={tab === t.id ? { ...s.navBtn, ...s.navBtnActive } : s.navBtn}
            aria-label={t.label}
          >
            <span style={s.navIcon}>{t.icon}</span>
            <span style={s.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const s = {
  app: {
    minHeight: '100vh',
    minHeight: '100dvh',
    background: '#f4f6f8',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 'calc(64px + env(safe-area-inset-bottom))'
  },
  header: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
    color: '#fff',
    padding: '14px 16px',
    paddingTop: 'calc(14px + env(safe-area-inset-top))',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  headerTitle: {
    margin: 0,
    fontSize: 'clamp(17px, 4.5vw, 20px)',
    fontWeight: 800
  },
  headerSub: {
    margin: '2px 0 0',
    fontSize: 'clamp(11px, 3vw, 13px)',
    opacity: 0.9
  },
  main: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    margin: '0 auto',
    WebkitOverflowScrolling: 'touch'
  },
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #e0e0e0',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
    maxWidth: 600,
    margin: '0 auto',
    paddingBottom: 'env(safe-area-inset-bottom)',
    zIndex: 100
  },
  navBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '8px 2px',
    minHeight: 56,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
    gap: 2
  },
  navBtnActive: {
    color: '#2e7d32',
    background: '#f1f8e9'
  },
  navIcon: {
    fontSize: 'clamp(17px, 5vw, 20px)',
    lineHeight: 1
  },
  navLabel: {
    fontSize: 'clamp(9px, 2.5vw, 11px)',
    marginTop: 2,
    fontWeight: 600,
    lineHeight: 1
  }
};
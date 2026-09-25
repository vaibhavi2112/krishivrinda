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

  // Jarvis ला handlers register करा
  useEffect(() => {
    registerHandlers({
      goTo: setTab,
      logout
    });
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
        <NavBtn active={tab === 'home'} onClick={() => setTab('home')} icon="🏠" label="घर" />
        <NavBtn active={tab === 'crops'} onClick={() => setTab('crops')} icon="🌾" label="पिके" />
        <NavBtn active={tab === 'market'} onClick={() => setTab('market')} icon="💰" label="बाजार" />
        <NavBtn active={tab === 'jobs'} onClick={() => setTab('jobs')} icon="👷" label="कामगार" />
        <NavBtn active={tab === 'notif'} onClick={() => setTab('notif')} icon="🔔" label="बातमी" />
        <NavBtn active={tab === 'me'} onClick={() => setTab('me')} icon="👤" label="मी" />
      </nav>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={active ? { ...s.navBtn, ...s.navBtnActive } : s.navBtn}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 9, marginTop: 2, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

const s = {
  app: {
    minHeight: '100vh',
    background: '#f4f6f8',
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    display: 'flex', flexDirection: 'column',
    paddingBottom: 76
  },
  header: {
    background: 'linear-gradient(135deg, #2e7d32 0%, #43a047 100%)',
    color: '#fff', padding: '16px 20px',
    position: 'sticky', top: 0, zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 800 },
  headerSub: { margin: '2px 0 0', fontSize: 13, opacity: 0.9 },
  main: { flex: 1, maxWidth: 600, width: '100%', margin: '0 auto' },
  nav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#fff', display: 'flex',
    borderTop: '1px solid #e0e0e0',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
    maxWidth: 600, margin: '0 auto'
  },
  navBtn: {
    flex: 1, background: 'none', border: 'none',
    padding: '8px 0', cursor: 'pointer',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    color: '#999', fontFamily: 'inherit'
  },
  navBtnActive: { color: '#2e7d32', background: '#f1f8e9' }
};
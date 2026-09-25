import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJarvis } from '../jarvis/JarvisContext';import DealerHome from './dealer/DealerHome';
import BrowseCrops from './dealer/BrowseCrops';
import MyCart from './dealer/MyCart';
import DealerNotifications from './dealer/DealerNotifications';
import DealerProfile from './dealer/DealerProfile';
import DealerMarketPrices from './dealer/DealerMarketPrices';
import BrowseWorkers from './farmer/BrowseWorkers';

export default function DealerDashboard() {
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
    registerHandlers({ goTo: setTab, logout });
    // eslint-disable-next-line
  }, []);
  const showTab = () => {
    if (tab === 'home') return <DealerHome goTo={setTab} />;
    if (tab === 'browse') return <BrowseCrops />;
    if (tab === 'cart') return <MyCart goTo={setTab} />;
    if (tab === 'market') return <DealerMarketPrices onBack={() => setTab('home')} />;
    if (tab === 'notif') return <DealerNotifications />;
    if (tab === 'workers') return <BrowseWorkers onBack={() => setTab('home')} />;
    if (tab === 'me') return <DealerProfile onLogout={logout} />;
  };

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>🌾 कृषीवृंद</h1>
          <p style={s.headerSub}>व्यापारी</p>
        </div>
      </header>

      <main style={s.main}>{showTab()}</main>

      <nav style={s.nav}>
        <NavBtn active={tab === 'home'} onClick={() => setTab('home')} icon="🏠" label="घर" />
        <NavBtn active={tab === 'browse'} onClick={() => setTab('browse')} icon="🛒" label="पिके" />
        <NavBtn active={tab === 'cart'} onClick={() => setTab('cart')} icon="🛍️" label="कार्ट" />
         <NavBtn active={tab === 'market'} onClick={() => setTab('market')} icon="💰" label="बाजार" />
        <NavBtn active={tab === 'notif'} onClick={() => setTab('notif')} icon="🔔" label="बातमी" />
        <NavBtn active={tab === 'workers'} onClick={() => setTab('workers')} icon="🔍" label="कामगार" />
        <NavBtn active={tab === 'me'} onClick={() => setTab('me')} icon="👤" label="मी" />
      </nav>
    </div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={active ? { ...s.navBtn, ...s.navBtnActive } : s.navBtn}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontSize: 10, marginTop: 2, fontWeight: 600 }}>{label}</span>
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
    background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)',
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
  navBtnActive: { color: '#1565c0', background: '#e3f2fd' }
};
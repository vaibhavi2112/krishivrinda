import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJarvis } from '../jarvis/JarvisContext';
import WorkerHome from './worker/WorkerHome';
import BrowseJobs from './worker/BrowseJobs';
import MyApplications from './worker/MyApplications';
import WagesInfo from './worker/WagesInfo';
import WorkerProfile from './worker/WorkerProfile';
import WorkerNotifications from './worker/WorkerNotifications';
import MyWorkerProfile from './worker/MyWorkerProfile';

export default function WorkerDashboard() {
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
    if (tab === 'home') return <WorkerHome goTo={setTab} />;
    if (tab === 'browse') return <BrowseJobs />;
    if (tab === 'applications') return <MyApplications />;
    if (tab === 'myprofile') return <MyWorkerProfile />;
    if (tab === 'wages') return <WagesInfo onBack={() => setTab('home')} />;
    if (tab === 'notif') return <WorkerNotifications />;
    if (tab === 'me') return <WorkerProfile onLogout={logout} />;
  };

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div>
          <h1 style={s.headerTitle}>🌾 कृषीवृंदा</h1>
          <p style={s.headerSub}>कामगार</p>
        </div>
      </header>

      <main style={s.main}>{showTab()}</main>

      <nav style={s.nav}>
        <NavBtn active={tab === 'home'} onClick={() => setTab('home')} icon="🏠" label="घर" />
        <NavBtn active={tab === 'browse'} onClick={() => setTab('browse')} icon="👷" label="नोकऱ्या" />
        <NavBtn active={tab === 'applications'} onClick={() => setTab('applications')} icon="📋" label="अर्ज" />
        <NavBtn active={tab === 'myprofile'} onClick={() => setTab('myprofile')} icon="📄" label="माझा अर्ज" />
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
    background: 'linear-gradient(135deg, #e65100 0%, #ff9800 100%)',
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
  navBtnActive: { color: '#e65100', background: '#fff3e0' }
};
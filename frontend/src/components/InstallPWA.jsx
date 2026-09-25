import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // आधीच installed आहे का?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Install prompt पकडा
    const handlePrompt = (e) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };

    // Installed झाल्यावर
    const handleInstalled = () => {
      setInstalled(true);
      setShow(false);
      console.log('✅ ॲप install झाले!');
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ User ने install स्वीकारले');
      setShow(false);
    } else {
      console.log('❌ User ने install नाकारले');
    }
    setPrompt(null);
  };

  const handleClose = () => {
    setShow(false);
    // 3 दिवसांसाठी पुन्हा दाखवू नका
    localStorage.setItem('kv_pwa_dismissed', Date.now().toString());
  };

  // 3 दिवसांत dismissed असेल तर दाखवू नका
  useEffect(() => {
    const dismissed = localStorage.getItem('kv_pwa_dismissed');
    if (dismissed) {
      const days = (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
      if (days < 3) setShow(false);
    }
  }, []);

  if (installed || !show || !prompt) return null;

  return (
    <div style={s.banner}>
      <div style={s.bannerInner}>
        <div style={s.icon}>🌾</div>
        <div style={s.text}>
          <div style={s.title}>कृषीवृंदा install करा</div>
          <div style={s.sub}>होम स्क्रीनवर ॲप म्हणून जोडा</div>
        </div>
        <button style={s.installBtn} onClick={handleInstall}>
          📲 Install
        </button>
        <button style={s.closeBtn} onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

const s = {
  banner: {
    position: 'fixed',
    bottom: 90,
    left: 16,
    right: 16,
    maxWidth: 400,
    margin: '0 auto',
    zIndex: 8000,
    animation: 'slideUp 0.4s ease-out',
    fontFamily: "'Noto Sans Devanagari', sans-serif"
  },
  bannerInner: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
    color: '#fff',
    borderRadius: 16,
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 12px 32px rgba(46,125,50,0.35)'
  },
  icon: {
    fontSize: 32,
    background: 'rgba(255,255,255,0.2)',
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: { flex: 1 },
  title: { fontSize: 14, fontWeight: 800 },
  sub: { fontSize: 11, opacity: 0.9, marginTop: 2 },
  installBtn: {
    padding: '10px 14px',
    borderRadius: 10,
    border: 'none',
    background: '#fff',
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: 28,
    height: 28,
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
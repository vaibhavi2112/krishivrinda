import { useState } from 'react';

export default function ShareCard({ data, type = 'crop' }) {
  const [showMenu, setShowMenu] = useState(false);

  // WhatsApp message तयार करा
  const buildMessage = () => {
    if (type === 'crop') {
      return `🌾 *कृषीवृंदा* — पीक माहिती

📦 *${data.name}*
📊 प्रमाण: ${data.quantity} ${data.unit}
💰 किंमत: ₹${data.price_per_unit} / ${data.unit}
📍 जिल्हा: ${data.district || '—'}
👤 शेतकरी: ${data.farmer_name || '—'}
📱 संपर्क: ${data.farmer_mobile || '—'}

कृषीवृंदा ॲपवर अजून पहा!`;
    }
    if (type === 'job') {
      return `👷 *कृषीवृंदा* — नोकरी

💼 ${data.job_type}
👥 किती मजूर: ${data.workers_required}
💰 रोजंदारी: ₹${data.wage_per_day}
📅 तारीख: ${data.start_date ? new Date(data.start_date).toLocaleDateString('mr-IN') : '—'}
📍 ${data.district || '—'}
📱 ${data.poster_mobile || '—'}

कृषीवृंदा ॲपवर अजून पहा!`;
    }
    return 'कृषीवृंदा — शेतकरी, व्यापारी, कामगार यांचे व्यासपीठ';
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowMenu(false);
  };

  const shareNative = async () => {
    const text = buildMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'कृषीवृंदा',
          text: text
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback — copy to clipboard
      navigator.clipboard.writeText(text);
      alert('✅ माहिती कॉपी झाली! WhatsApp वर paste करा.');
    }
    setShowMenu(false);
  };

  const copyText = () => {
    navigator.clipboard.writeText(buildMessage());
    alert('✅ माहिती कॉपी झाली!');
    setShowMenu(false);
  };

  return (
    <div style={s.wrap}>
      <button style={s.shareBtn} onClick={() => setShowMenu(!showMenu)}>
        📤 शेअर
      </button>

      {showMenu && (
        <>
          <div style={s.overlay} onClick={() => setShowMenu(false)} />
          <div style={s.menu}>
            <button style={s.menuItem} onClick={shareWhatsApp}>
              <span style={s.menuIcon}>💬</span>
              <span>WhatsApp</span>
            </button>
            <button style={s.menuItem} onClick={shareNative}>
              <span style={s.menuIcon}>📱</span>
              <span>इतर ॲप</span>
            </button>
            <button style={s.menuItem} onClick={copyText}>
              <span style={s.menuIcon}>📋</span>
              <span>कॉपी करा</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { position: 'relative', flex: 1 },
  shareBtn: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '2px solid #25D366',
    background: '#fff',
    color: '#25D366',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 998
  },
  menu: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 999,
    overflow: 'hidden'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'inherit',
    color: '#333',
    textAlign: 'left',
    borderBottom: '1px solid #f5f5f5'
  },
  menuIcon: { fontSize: 20 }
};
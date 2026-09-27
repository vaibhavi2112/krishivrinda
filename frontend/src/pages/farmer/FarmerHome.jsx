import { useEffect, useState } from 'react';
import API from '../../api';

export default function FarmerHome({ goTo }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [counts, setCounts] = useState({ crops: 0, notif: 0 });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [c, n] = await Promise.all([
        API.get('/commodities/my'),
        API.get('/notifications')
      ]);
      setCounts({
        crops: c.data.length,
        notif: n.data.filter((x) => !x.is_read).length
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.helloCard}>
        <h2 style={s.hello}>नमस्कार, {user.name || 'शेतकरी मित्र'} 🌾</h2>
        <p style={s.helloSub}>तुमच्या शेतीचा डिजिटल साथीदार</p>
      </div>

      <div style={s.bigGrid}>
        <BigBtn
          icon="🌾"
          label="माझी पिके"
          sub={`${counts.crops} पिके`}
          onClick={() => goTo('crops')}
        />
        <BigBtn
          icon="💰"
          label="बाजार भाव"
          sub="मंडी दर"
          onClick={() => goTo('market')}
        />
        <BigBtn
          icon="👷"
          label="कामगार"
          sub="मजूर शोधा"
          onClick={() => goTo('jobs')}
        />
        <BigBtn
          icon="🔔"
          label="बातमी"
          sub={counts.notif > 0 ? `${counts.notif} नवीन` : 'काही नाही'}
          onClick={() => goTo('notif')}
          badge={counts.notif}
        />
      </div>

      <div style={s.helpCard}>
        <h3 style={s.helpTitle}>💡 मदत</h3>
        <p style={s.helpText}>
          • पीक विकायचे? <b>"माझी पिके"</b> मध्ये जा.<br />
          • व्यापारी इच्छुक? <b>"बातमी"</b> मध्ये कळेल.<br />
          • मजूर हवा? <b>"कामगार"</b> वापरा.<br />
          • बाजार भाव? <b>"बाजार"</b> पहा.
        </p>
      </div>
    </div>
  );
}

function BigBtn({ icon, label, sub, onClick, badge }) {
  return (
    <button onClick={onClick} style={s.bigBtn}>
      <div style={s.bigIcon}>{icon}</div>
      <div style={s.bigLabel}>{label}</div>
      <div style={s.bigSub}>{sub}</div>
      {badge > 0 && <span style={s.bigBadge}>{badge}</span>}
    </button>
  );
}

const s = {
  container: {
    padding: 'clamp(12px, 3vw, 16px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 3vw, 16px)'
  },
  helloCard: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: 'clamp(16px, 4vw, 20px)',
    borderRadius: 16
  },
  hello: {
    margin: 0,
    fontSize: 'clamp(17px, 4.5vw, 20px)',
    color: '#1b5e20',
    fontWeight: 800
  },
  helloSub: {
    margin: '6px 0 0',
    fontSize: 'clamp(13px, 3.5vw, 14px)',
    color: '#555'
  },
  bigGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'clamp(10px, 2.5vw, 12px)'
  },
  bigBtn: {
    position: 'relative',
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e0e0e0',
    padding: 'clamp(16px, 4vw, 20px) clamp(8px, 2vw, 12px)',
    minHeight: 120,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 0.15s'
  },
  bigIcon: {
    fontSize: 'clamp(32px, 8vw, 40px)',
    marginBottom: 6
  },
  bigLabel: {
    fontSize: 'clamp(14px, 3.8vw, 16px)',
    fontWeight: 800,
    color: '#1b5e20',
    textAlign: 'center',
    lineHeight: 1.2
  },
  bigSub: {
    fontSize: 'clamp(11px, 2.8vw, 12px)',
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 1.3
  },
  bigBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: '#e53935',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    minWidth: 24,
    textAlign: 'center'
  },
  helpCard: {
    background: '#fff8e1',
    borderRadius: 12,
    padding: 'clamp(14px, 3.5vw, 16px)',
    border: '1px solid #ffe082'
  },
  helpTitle: {
    margin: '0 0 8px',
    fontSize: 'clamp(14px, 3.8vw, 16px)',
    color: '#ef6c00'
  },
  helpText: {
    margin: 0,
    fontSize: 'clamp(12px, 3.2vw, 14px)',
    color: '#555',
    lineHeight: 1.9
  }
};
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
      {/* नमस्कार */}
      <div style={s.helloCard}>
        <h2 style={s.hello}>नमस्कार, {user.name || 'शेतकरी मित्र'} 🌾</h2>
        <p style={s.helloSub}>तुमच्या शेतीचा डिजिटल साथीदार</p>
      </div>

      {/* मोठी बटणे — शेतकऱ्यांना सोपी */}
      <div style={s.bigGrid}>
        <BigBtn
          icon="🌾"
          label="माझी पिके"
          sub={`${counts.crops} पिके नोंदवली`}
          onClick={() => goTo('crops')}
        />
        <BigBtn
          icon="💰"
          label="बाजार भाव"
          sub="मंडीतील ताजे दर"
          onClick={() => goTo('market')}
        />
        <BigBtn
          icon="👷"
          label="कामगार"
          sub="मजूर हवा आहे?"
          onClick={() => goTo('jobs')}
        />
        <BigBtn
          icon="🔔"
          label="बातमी"
          sub={counts.notif > 0 ? `${counts.notif} नवीन` : 'काही नवीन नाही'}
          onClick={() => goTo('notif')}
          badge={counts.notif}
        />
      </div>

      {/* मदत */}
      <div style={s.helpCard}>
        <h3 style={s.helpTitle}>💡 मदत</h3>
        <p style={s.helpText}>
          • तुमचे पीक विकायचे असेल तर <b>"माझी पिके"</b> मध्ये जा आणि <b>"नवीन पीक"</b> भरा.<br />
          • कोणी व्यापारी तुमचे पीक घ्यायला तयार असेल तर <b>"बातमी"</b> मध्ये कळेल.<br />
          • मजूर हवा असेल तर <b>"कामगार"</b> मध्ये नोकरी पोस्ट करा.<br />
          • बाजारात काय भाव चालू आहे ते <b>"बाजार भाव"</b> मध्ये पहा.
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
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 16 },

  helloCard: {
    background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    padding: 20,
    borderRadius: 16
  },
  hello: { margin: 0, fontSize: 20, color: '#1b5e20' },
  helloSub: { margin: '6px 0 0', fontSize: 14, color: '#555' },

  bigGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  bigBtn: {
    position: 'relative',
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e0e0e0',
    padding: '20px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  bigIcon: { fontSize: 40, marginBottom: 6 },
  bigLabel: { fontSize: 16, fontWeight: 800, color: '#1b5e20', textAlign: 'center' },
  bigSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textAlign: 'center'
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
    fontWeight: 700
  },

  helpCard: {
    background: '#fff8e1',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #ffe082'
  },
  helpTitle: { margin: '0 0 8px', fontSize: 16, color: '#ef6c00' },
  helpText: {
    margin: 0,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.9
  }
};
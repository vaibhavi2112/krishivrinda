import { useEffect, useState } from 'react';
import API from '../../api';

export default function DealerHome({ goTo }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [counts, setCounts] = useState({ cart: 0, notif: 0 });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [c, n] = await Promise.all([
        API.get('/cart/my'),
        API.get('/notifications')
      ]);
      setCounts({
        cart: c.data.length,
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
        <h2 style={s.hello}>नमस्कार, {user.name || 'व्यापारी मित्र'} 🛒</h2>
        <p style={s.helloSub}>शेतकऱ्यांकडून थेट खरेदी करा</p>
      </div>

      {/* मोठी बटणे */}
      <div style={s.bigGrid}>
        <BigBtn
          icon="🛒"
          label="पिके शोधा"
          sub="जवळच्या शेतकऱ्यांची पिके"
          onClick={() => goTo('browse')}
        />
        <BigBtn
          icon="🛍️"
          label="माझे कार्ट"
          sub={counts.cart > 0 ? `${counts.cart} पिके` : 'कार्ट रिकामे'}
          onClick={() => goTo('cart')}
          badge={counts.cart}
        />
        <BigBtn
          icon="🔔"
          label="बातमी"
          sub={counts.notif > 0 ? `${counts.notif} नवीन` : 'काही नवीन नाही'}
          onClick={() => goTo('notif')}
          badge={counts.notif}
        />
        <BigBtn
  icon="📊"
  label="बाजार भाव"
  sub="मंडीतील ताजे दर"
  onClick={() => goTo('market')}
/>

<BigBtn
  icon="📊"
  label="बाजार भाव"
  sub="मंडीतील ताजे दर"
  onClick={() => goTo('market')}
/>
<BigBtn
  icon="🔍"
  label="कामगार शोधा"
  sub="अर्ज पहा + संपर्क करा"
  onClick={() => goTo('workers')}
/>
      </div>

      {/* मदत */}
      <div style={s.helpCard}>
        <h3 style={s.helpTitle}>💡 मदत</h3>
        <p style={s.helpText}>
          • शेतकऱ्यांची पिके पाहण्यासाठी <b>"पिके शोधा"</b> वर जा.<br />
          • एखादे पीक आवडले तर <b>"कार्टमध्ये टाका"</b> — शेतकऱ्याला लगेच बातमी जाईल.<br />
          • थेट बोलण्यासाठी <b>💬 WhatsApp</b> किंवा <b>📞 कॉल</b> वापरा.<br />
          • तुमच्या कार्टमधील पिके <b>"माझे कार्ट"</b> मध्ये दिसतील.
        </p>
      </div>
    </div>
  );
}

function BigBtn({ icon, label, sub, onClick, badge, coming }) {
  return (
    <button
      onClick={coming ? () => alert('ही सुविधा लवकरच येईल 🌱') : onClick}
      style={coming ? { ...s.bigBtn, opacity: 0.6 } : s.bigBtn}
    >
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
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    padding: 20,
    borderRadius: 16
  },
  hello: { margin: 0, fontSize: 20, color: '#0d47a1' },
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
  bigLabel: { fontSize: 16, fontWeight: 800, color: '#0d47a1' },
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
    background: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #90caf9'
  },
  helpTitle: { margin: '0 0 8px', fontSize: 16, color: '#1565c0' },
  helpText: {
    margin: 0,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.9
  }
};
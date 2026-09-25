import { useEffect, useState } from 'react';
import API from '../../api';

export default function WorkerHome({ goTo }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [counts, setCounts] = useState({ jobs: 0, apps: 0, notif: 0 });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
  try {
    const [jobs, apps, notifs] = await Promise.all([
      API.get('/jobs'),
      API.get('/jobs/my-applications'),
      API.get('/notifications')
    ]);
    setCounts({
      jobs: jobs.data.length,
      apps: apps.data.length,
      notif: notifs.data.filter((x) => !x.is_read).length
    });
  } catch (e) {
    console.error(e);
  }
};

  return (
    <div style={s.container}>
      {/* नमस्कार */}
      <div style={s.helloCard}>
        <h2 style={s.hello}>नमस्कार, {user.name || 'मजूर मित्र'} 👷</h2>
        <p style={s.helloSub}>जवळच्या नोकऱ्या शोधा, काम मिळवा</p>
      </div>

      {/* मोठी बटणे */}
     <div style={s.bigGrid}>
  <BigBtn
    icon="👷"
    label="नोकऱ्या"
    sub={`${counts.jobs} नोकऱ्या उपलब्ध`}
    onClick={() => goTo('browse')}
  />
  <BigBtn
    icon="📋"
    label="माझे अर्ज"
    sub={counts.apps > 0 ? `${counts.apps} अर्ज केले` : 'अजून अर्ज नाही'}
    onClick={() => goTo('applications')}
    badge={counts.apps}
  />
  <BigBtn
    icon="💰"
    label="मजुरी दर"
    sub="जिल्ह्यानुसार सरासरी"
    onClick={() => goTo('wages')}
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
          • नोकरी शोधण्यासाठी <b>"नोकऱ्या"</b> वर जा — जिल्हा/प्रकारानुसार शोधता येते.<br />
          • एखादी नोकरी आवडली तर <b>"अर्ज करा"</b> क्लिक करा.<br />
          • शेतकरी तुम्हाला WhatsApp वर संपर्क करेल.<br />
          • मजुरीचा योग्य दर जाणून घेण्यासाठी <b>"मजुरी दर"</b> पहा.
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
    background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
    padding: 20,
    borderRadius: 16
  },
  hello: { margin: 0, fontSize: 20, color: '#e65100' },
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
  bigLabel: { fontSize: 16, fontWeight: 800, color: '#e65100' },
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
    background: '#fff3e0',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #ffcc80'
  },
  helpTitle: { margin: '0 0 8px', fontSize: 16, color: '#ef6c00' },
  helpText: {
    margin: 0,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.9
  }
};
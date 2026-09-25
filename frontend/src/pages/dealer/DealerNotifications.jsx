import { useEffect, useState } from 'react';
import API from '../../api';

export default function DealerNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/notifications');
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>🔔 बातमी</h2>
      <p style={s.sub}>तुमच्या कार्टमधील पिकांबद्दल सूचना इथे दिसतील</p>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p style={s.emptyText}>अजून कोणतीही बातमी नाही</p>
          <p style={s.emptyHint}>
            जेव्हा शेतकरी तुमचे अभिप्राय पाहील,
            तेव्हा इथे नोटिफिकेशन दिसेल.
          </p>
        </div>
      )}

      {items.map((n) => (
        <div
          key={n.id}
          onClick={() => !n.is_read && markRead(n.id)}
          style={n.is_read ? s.card : s.cardNew}
        >
          <div style={s.cardTop}>
            <h3 style={s.cardTitle}>{n.title}</h3>
            {!n.is_read && <span style={s.newTag}>नवीन</span>}
          </div>
          <p style={s.cardMsg}>{n.message}</p>
          <small style={s.date}>
            {new Date(n.created_at).toLocaleString('mr-IN')}
          </small>
        </div>
      ))}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  title: { margin: 0, fontSize: 20, color: '#1565c0' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyText: { margin: 0, fontSize: 15, fontWeight: 600 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },
  card: {
    background: '#fff', borderRadius: 12, padding: 16,
    borderLeft: '4px solid #e0e0e0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    cursor: 'pointer'
  },
  cardNew: {
    background: '#e3f2fd', borderRadius: 12, padding: 16,
    borderLeft: '4px solid #1565c0',
    boxShadow: '0 2px 8px rgba(21,101,192,0.12)',
    cursor: 'pointer'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 6
  },
  cardTitle: { margin: 0, fontSize: 15, color: '#0d47a1' },
  newTag: {
    background: '#e53935', color: '#fff',
    padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700
  },
  cardMsg: { margin: '4px 0', fontSize: 14, color: '#444', lineHeight: 1.6 },
  date: { color: '#999', fontSize: 12 }
};
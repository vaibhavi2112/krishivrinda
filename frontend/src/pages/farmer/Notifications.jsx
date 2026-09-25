import { useEffect, useState } from 'react';
import API from '../../api';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function Notifications() {
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
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={s.container}>
      <h2 style={s.title}>🔔 नोटिफिकेशन्स</h2>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <p>अजून नोटिफिकेशन नाही.</p>
          <p style={s.emptyHint}>
            जेव्हा व्यापारी तुमची उपज कार्टमध्ये टाकेल, तेव्हा इथे दिसेल.
          </p>
        </div>
      )}

      {items.map((n) => (
        <div
          key={n.id}
          style={n.is_read ? s.card : s.cardUnread}
          onClick={() => !n.is_read && markRead(n.id)}
        >
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>{n.title}</h3>
            {!n.is_read && <span style={s.dot} />}
          </div>
          <p style={s.cardMsg}>{n.message}</p>
          <div style={s.cardFooter}>
            <small style={s.date}>
              {new Date(n.created_at).toLocaleString('mr-IN')}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  title: { margin: '0 0 8px', fontSize: 20, color: '#2e7d32' },
  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 40, background: '#fff',
    borderRadius: 12, color: '#888'
  },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },
  card: {
    background: '#fff', borderRadius: 12, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    borderLeft: '4px solid #e0e0e0', cursor: 'pointer'
  },
  cardUnread: {
    background: '#f1f8e9', borderRadius: 12, padding: 16,
    boxShadow: '0 2px 8px rgba(46,125,50,0.1)',
    borderLeft: '4px solid #2e7d32', cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 6
  },
  cardTitle: { margin: 0, fontSize: 15, color: '#1b5e20' },
  dot: {
    width: 10, height: 10, borderRadius: '50%',
    background: '#e53935', display: 'inline-block'
  },
  cardMsg: { margin: '4px 0', fontSize: 14, color: '#444', lineHeight: 1.5 },
  cardFooter: {
    marginTop: 8, paddingTop: 8, borderTop: '1px solid #eee'
  },
  date: { color: '#999', fontSize: 12 }
};
import { useEffect, useState } from 'react';
import API from '../../api';
import PostCommodityForm from './PostCommodityForm';

export default function MyCommodities() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/commodities/my');
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm('ही उपज हटवायची?')) return;
    try {
      await API.delete(`/commodities/${id}`);
      load();
    } catch (e) {
      alert('हटवता आले नाही');
    }
  };

  if (showForm) {
    return (
      <PostCommodityForm
        onSuccess={() => { setShowForm(false); load(); }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>🌾 माझी उपज</h2>
        <button style={s.addBtn} onClick={() => setShowForm(true)}>
          + नवीन पोस्ट
        </button>
      </div>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <p>अजून उपज पोस्ट केलेली नाही.</p>
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            पहिली उपज पोस्ट करा
          </button>
        </div>
      )}

      {items.map((it) => (
        <div key={it.id} style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>{it.name}</h3>
            {it.is_sold && <span style={s.soldBadge}>विकले</span>}
          </div>
          <div style={s.cardBody}>
            <p style={s.info}>📦 {it.quantity} {it.unit}</p>
            <p style={s.info}>💰 ₹{it.price_per_unit} / {it.unit}</p>
            <p style={s.info}>📍 {it.district || '—'}</p>
            {it.description && <p style={s.desc}>{it.description}</p>}
          </div>
          <div style={s.cardFooter}>
            <small style={s.date}>
              {new Date(it.created_at).toLocaleDateString('mr-IN')}
            </small>
            <button style={s.delBtn} onClick={() => remove(it.id)}>
              🗑️ हटवा
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 4
  },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  addBtn: {
    padding: '10px 16px', borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  },
  empty: {
    textAlign: 'center', padding: 40, background: '#fff',
    borderRadius: 12, color: '#888'
  },
  msg: { textAlign: 'center', color: '#888' },
  card: {
    background: '#fff', borderRadius: 12, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8
  },
  cardTitle: { margin: 0, fontSize: 18, color: '#1b5e20' },
  soldBadge: {
    background: '#e53935', color: '#fff',
    padding: '2px 10px', borderRadius: 12, fontSize: 12
  },
  cardBody: { display: 'flex', flexDirection: 'column', gap: 4 },
  info: { margin: 0, fontSize: 14, color: '#444' },
  desc: { margin: '6px 0 0', fontSize: 13, color: '#666', fontStyle: 'italic' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 12,
    paddingTop: 12, borderTop: '1px solid #eee'
  },
  date: { color: '#999', fontSize: 12 },
  delBtn: {
    padding: '6px 12px', borderRadius: 8, border: 'none',
    background: '#ffebee', color: '#c62828',
    cursor: 'pointer', fontSize: 13
  }
};
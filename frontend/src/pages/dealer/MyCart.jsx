import { useEffect, useState } from 'react';
import API from '../../api';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function MyCart({ goTo }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/cart/my');
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (cartId, name) => {
    if (!confirm(`${name} कार्टमधून काढायचे?`)) return;
    try {
      await API.delete(`/cart/${cartId}`);
      alert('कार्टमधून काढले ✅');
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'काढता आले नाही');
    }
  };

  const buildWhatsAppMessage = (c) => {
    return `नमस्कार ${c.farmer_name || ''}, तुमचे "${c.commodity_name}" (${c.cart_quantity} ${c.unit}) मला हवे आहे. कृपया संपर्क करा. - ${user.name || 'व्यापारी'}`;
  };

  // एकूण खर्च
  const totalCost = items.reduce(
    (sum, it) => sum + (Number(it.price_per_unit) * Number(it.cart_quantity)),
    0
  );

  if (loading) {
    return <p style={s.msg}>लोड होत आहे...</p>;
  }

  if (items.length === 0) {
    return (
      <div style={s.container}>
        <h2 style={s.title}>🛍️ माझे कार्ट</h2>
        <div style={s.empty}>
          <div style={s.emptyIcon}>🛒</div>
          <p style={s.emptyText}>कार्ट रिकामे आहे</p>
          <p style={s.emptyHint}>
            शेतकऱ्यांची पिके पाहून कार्टमध्ये टाका.
          </p>
          <button style={s.browseBtn} onClick={() => goTo && goTo('browse')}>
            🛒 पिके शोधा
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <h2 style={s.title}>🛍️ माझे कार्ट</h2>
      <p style={s.sub}>{items.length} पिके कार्टमध्ये</p>

      {items.map((c) => (
        <div key={c.cart_id} style={s.card}>
          <div style={s.cardTop}>
            <h3 style={s.cropName}>🌾 {c.commodity_name}</h3>
            <span style={s.districtTag}>📍 {c.commodity_district || '—'}</span>
          </div>

          <div style={s.infoRow}>
            <div style={s.infoBox}>
              <div style={s.infoLabel}>माझे प्रमाण</div>
              <div style={s.infoValue}>{c.cart_quantity} {c.unit}</div>
            </div>
            <div style={{ ...s.infoBox, background: '#e8f5e9' }}>
              <div style={s.infoLabel}>किंमत</div>
              <div style={{ ...s.infoValue, color: '#2e7d32' }}>
                ₹{c.price_per_unit}
              </div>
            </div>
          </div>

          <div style={s.totalBox}>
            <span>एकूण</span>
            <b>₹{(Number(c.price_per_unit) * Number(c.cart_quantity)).toLocaleString('mr-IN')}</b>
          </div>

          <div style={s.farmerBox}>
            <div style={s.farmerAvatar}>
              {(c.farmer_name || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.farmerName}>{c.farmer_name || 'शेतकरी'}</div>
              <div style={s.farmerMobile}>📱 {c.farmer_mobile}</div>
            </div>
          </div>

          <div style={s.actionRow}>
            <a href={`tel:${c.farmer_mobile}`} style={s.callBtn}>
              📞 कॉल
            </a>
            <WhatsAppButton
              mobile={c.farmer_mobile}
              message={buildWhatsAppMessage(c)}
              label="💬 WhatsApp"
            />
          </div>

          <button style={s.delBtn} onClick={() => remove(c.cart_id, c.commodity_name)}>
            🗑️ कार्टमधून काढा
          </button>
        </div>
      ))}

      {/* एकूण खर्च */}
      <div style={s.grandTotal}>
        <span>एकूण खर्च</span>
        <b>₹{totalCost.toLocaleString('mr-IN')}</b>
      </div>

      <p style={s.note}>
        💡 टिप: WhatsApp वर शेतकऱ्याशी बोलून किंमत आणि वाहतूक ठरवा.
      </p>
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  title: { margin: 0, fontSize: 20, color: '#1565c0' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  msg: { textAlign: 'center', color: '#888', padding: 20 },

  empty: {
    textAlign: 'center', padding: 40, background: '#fff',
    borderRadius: 16, color: '#777',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
  },
  emptyIcon: { fontSize: 60 },
  emptyText: { margin: 0, fontSize: 16, fontWeight: 700 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 4 },
  browseBtn: {
    marginTop: 12, padding: '12px 20px', borderRadius: 10,
    border: 'none', background: '#1565c0', color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer'
  },

  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  cropName: {
    margin: 0, fontSize: 18, color: '#0d47a1', textTransform: 'capitalize'
  },
  districtTag: {
    background: '#e3f2fd', color: '#1565c0',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },

  infoRow: { display: 'flex', gap: 8 },
  infoBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 10, textAlign: 'center'
  },
  infoLabel: { fontSize: 11, color: '#888' },
  infoValue: { fontSize: 16, fontWeight: 800, color: '#333', marginTop: 2 },

  totalBox: {
    display: 'flex', justifyContent: 'space-between',
    background: '#fff8e1', padding: '10px 14px', borderRadius: 10,
    fontSize: 14, color: '#ef6c00', fontWeight: 600
  },

  farmerBox: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#f9fbe7', borderRadius: 10, padding: 10
  },
  farmerAvatar: {
    width: 42, height: 42, borderRadius: '50%',
    background: 'linear-gradient(135deg, #66bb6a, #43a047)',
    color: '#fff', fontSize: 18, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  farmerName: { fontSize: 15, fontWeight: 700, color: '#1b5e20' },
  farmerMobile: { fontSize: 13, color: '#555', marginTop: 2 },

  actionRow: { display: 'flex', gap: 8 },
  callBtn: {
    flex: 1, textAlign: 'center', padding: '10px 14px',
    borderRadius: 10, background: '#e3f2fd', color: '#1976d2',
    textDecoration: 'none', fontWeight: 700, fontSize: 14
  },
  delBtn: {
    padding: 12, borderRadius: 10, border: 'none',
    background: '#ffebee', color: '#c62828',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  },

  grandTotal: {
    display: 'flex', justifyContent: 'space-between',
    background: '#1565c0', color: '#fff',
    padding: 16, borderRadius: 14, fontSize: 16, fontWeight: 700,
    boxShadow: '0 4px 12px rgba(21,101,192,0.3)'
  },
  note: {
    fontSize: 12, color: '#a1887f',
    background: '#fff8e1', padding: 12, borderRadius: 10,
    margin: 0, lineHeight: 1.7
  }
};
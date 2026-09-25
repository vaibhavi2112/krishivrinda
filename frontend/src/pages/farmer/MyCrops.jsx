import { useState, useEffect } from 'react';
import API from '../../api';
import { useJarvis } from '../../jarvis/JarvisContext';
import { useUserLocation, updateUserLocation } from '../../hooks/useUserLocation';

export default function MyCrops() {
  const { registerHandlers } = useJarvis();
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

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    registerHandlers({
      openCropForm: () => setShowForm(true)
    });
    // eslint-disable-next-line
  }, []);

  const remove = async (id) => {
    if (!confirm('हे पीक काढायचे?')) return;
    try {
      await API.delete(`/commodities/${id}`);
      load();
    } catch {
      alert('काढता आले नाही');
    }
  };

  if (showForm) {
    return (
      <NewCropForm
        onDone={() => { setShowForm(false); load(); }}
        onBack={() => setShowForm(false)}
      />
    );
  }

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>🌾 माझी पिके</h2>
        <button style={s.addBtn} onClick={() => setShowForm(true)}>
          ➕ नवीन पीक
        </button>
      </div>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🌱</div>
          <p style={s.emptyText}>अजून एकही पीक नोंदवलेले नाही</p>
          <button style={s.addBtn} onClick={() => setShowForm(true)}>
            पहिले पीक नोंदवा
          </button>
        </div>
      )}

      {items.map((it) => (
        <div key={it.id} style={s.card}>
          <div style={s.cardTop}>
            <h3 style={s.cropName}>{it.name}</h3>
            {it.is_sold && <span style={s.soldTag}>विकले</span>}
          </div>
          <div style={s.cardInfo}>
            <div style={s.infoLine}>
              <span style={s.infoIcon}>📦</span>
              <span>{it.quantity} {it.unit}</span>
            </div>
            <div style={s.infoLine}>
              <span style={s.infoIcon}>💰</span>
              <span>₹{it.price_per_unit} / {it.unit}</span>
            </div>
            <div style={s.infoLine}>
              <span style={s.infoIcon}>📍</span>
              <span>{it.district || '—'}</span>
            </div>
          </div>
          {it.description && <p style={s.desc}>{it.description}</p>}
          <div style={s.cardBottom}>
            <small style={s.date}>
              {new Date(it.created_at).toLocaleDateString('mr-IN')}
            </small>
            <button style={s.delBtn} onClick={() => remove(it.id)}>
              🗑️ काढा
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================
   नवीन पीक भरायचा फॉर्म
   ============================ */
function NewCropForm({ onDone, onBack }) {
  const userLocation = useUserLocation();
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    price_per_unit: '',
    unit: 'क्विंटल',
    description: '',
    district: userLocation.district || ''  // ⚠️ Auto-fill
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.name.trim()) return alert('पिकाचे नाव भरा');
    if (!form.quantity) return alert('किती प्रमाण आहे ते भरा');
    if (!form.price_per_unit) return alert('किंमत भरा');

    setLoading(true);
    try {
      await API.post('/commodities', {
        ...form,
        quantity: Number(form.quantity),
        price_per_unit: Number(form.price_per_unit)
      });

      // ⚠️ जर district बदलला असेल तर localStorage update
      if (form.district && form.district !== userLocation.district) {
        updateUserLocation({ district: form.district });
        try {
          await API.patch('/users/me', { district: form.district });
        } catch (e) {
          console.error('Location update failed:', e);
        }
      }

      alert('पीक नोंदवले गेले ✅');
      onDone && onDone();
    } catch (e) {
      alert(e.response?.data?.error || 'नोंदवता आले नाही');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>🌾 नवीन पीक</h2>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      <div style={s.form}>
        <Field label="पिकाचे नाव *">
          <input
            style={s.input}
            value={form.name}
            placeholder="उदा. कांदा, टोमॅटो, गहू"
            onChange={(e) => set('name', e.target.value)}
          />
        </Field>

        <div style={s.row}>
          <Field label="किती आहे? *" style={{ flex: 1 }}>
            <input
              style={s.input}
              type="number"
              value={form.quantity}
              placeholder="उदा. 50"
              onChange={(e) => set('quantity', e.target.value)}
            />
          </Field>
          <Field label="माप" style={{ flex: 1 }}>
            <select
              style={s.input}
              value={form.unit}
              onChange={(e) => set('unit', e.target.value)}
            >
              <option>क्विंटल</option>
              <option>टन</option>
              <option>किलो</option>
              <option>डझन</option>
              <option>पोती</option>
            </select>
          </Field>
        </div>

        <Field label="किंमत (₹ प्रति एकक) *">
          <input
            style={s.input}
            type="number"
            value={form.price_per_unit}
            placeholder="उदा. 1500"
            onChange={(e) => set('price_per_unit', e.target.value)}
          />
        </Field>

        <Field label="गाव / जिल्हा">
          <input
            style={s.input}
            value={form.district}
            placeholder="उदा. नाशिक"
            onChange={(e) => set('district', e.target.value)}
          />
          {userLocation.district && form.district === userLocation.district && (
            <p style={s.autoHint}>✅ तुमच्या नोंदणीवरून आपोआप भरले</p>
          )}
        </Field>

        <Field label="थोडक्यात माहिती">
          <textarea
            style={{ ...s.input, minHeight: 80 }}
            value={form.description}
            placeholder="उदा. ताजा कांदा, चांगला दर्जा"
            onChange={(e) => set('description', e.target.value)}
          />
        </Field>

        <button style={s.saveBtn} onClick={save} disabled={loading}>
          {loading ? 'जतन होत आहे...' : '✅ जतन करा'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  addBtn: {
    padding: '10px 14px', borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  },
  backBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14
  },
  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12
  },
  emptyIcon: { fontSize: 60 },
  emptyText: { margin: 0, fontSize: 15 },
  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { margin: 0, fontSize: 18, color: '#1b5e20' },
  soldTag: {
    background: '#e53935', color: '#fff',
    padding: '2px 10px', borderRadius: 12, fontSize: 12
  },
  cardInfo: { display: 'flex', flexDirection: 'column', gap: 4 },
  infoLine: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#444' },
  infoIcon: { fontSize: 16 },
  desc: { margin: '4px 0 0', fontSize: 13, color: '#666', fontStyle: 'italic' },
  cardBottom: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 8, paddingTop: 10, borderTop: '1px solid #eee'
  },
  date: { color: '#999', fontSize: 12 },
  delBtn: {
    padding: '6px 12px', borderRadius: 8, border: 'none',
    background: '#ffebee', color: '#c62828', cursor: 'pointer', fontSize: 13
  },
  form: {
    background: '#fff', borderRadius: 14, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 12
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700 },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  row: { display: 'flex', gap: 10 },
  autoHint: {
    fontSize: 11, color: '#2e7d32', margin: '4px 0 0',
    fontWeight: 600, fontStyle: 'italic'
  },
  saveBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 6
  }
};
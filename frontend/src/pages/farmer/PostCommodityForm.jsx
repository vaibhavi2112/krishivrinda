import { useState } from 'react';
import API from '../../api';

export default function PostCommodityForm({ onSuccess, onCancel }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    price_per_unit: '',
    unit: 'क्विंटल',
    description: '',
    district: user.district || ''
  });
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.name || !form.quantity || !form.price_per_unit) {
      alert('नाव, प्रमाण आणि किंमत आवश्यक');
      return;
    }
    setLoading(true);
    try {
      await API.post('/commodities', {
        ...form,
        quantity: Number(form.quantity),
        price_per_unit: Number(form.price_per_unit)
      });
      alert('उपज यशस्वीपणे पोस्ट झाली! ✅');
      onSuccess && onSuccess();
    } catch (e) {
      alert(e.response?.data?.error || 'पोस्ट करता आले नाही');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>🌾 नवीन उपज पोस्ट</h2>
        <button style={s.cancelBtn} onClick={onCancel}>← मागे</button>
      </div>

      <div style={s.card}>
        <label style={s.label}>उपजाचे नाव *</label>
        <input
          style={s.input}
          value={form.name}
          placeholder="उदा. कांदा, टोमॅटो, गहू"
          onChange={(e) => setField('name', e.target.value)}
        />

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>प्रमाण *</label>
            <input
              style={s.input}
              type="number"
              value={form.quantity}
              placeholder="उदा. 50"
              onChange={(e) => setField('quantity', e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>एकक</label>
            <select
              style={s.input}
              value={form.unit}
              onChange={(e) => setField('unit', e.target.value)}
            >
              <option>क्विंटल</option>
              <option>टन</option>
              <option>किलो</option>
              <option>डझन</option>
              <option>पोती</option>
            </select>
          </div>
        </div>

        <label style={s.label}>किंमत (₹ प्रति एकक) *</label>
        <input
          style={s.input}
          type="number"
          value={form.price_per_unit}
          placeholder="उदा. 1500"
          onChange={(e) => setField('price_per_unit', e.target.value)}
        />

        <label style={s.label}>जिल्हा</label>
        <input
          style={s.input}
          value={form.district}
          placeholder="उदा. नाशिक"
          onChange={(e) => setField('district', e.target.value)}
        />

        <label style={s.label}>वर्णन (पर्यायी)</label>
        <textarea
          style={{ ...s.input, minHeight: 80 }}
          value={form.description}
          placeholder="उदा. ताजा कांदा, चांगली गुणवत्ता"
          onChange={(e) => setField('description', e.target.value)}
        />

        <button style={s.submitBtn} onClick={submit} disabled={loading}>
          {loading ? 'पोस्ट होत आहे...' : 'उपज पोस्ट करा'}
        </button>
      </div>
    </div>
  );
}

const s = {
  container: { padding: 16 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16
  },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  cancelBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14
  },
  card: {
    background: '#fff', borderRadius: 12, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  label: { fontSize: 13, color: '#555', fontWeight: 600, marginTop: 8 },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  row: { display: 'flex', gap: 10 },
  submitBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 16
  }
};
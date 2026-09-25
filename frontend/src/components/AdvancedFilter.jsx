import { useState } from 'react';

const CROPS = [
  { mr: 'कांदा', en: 'onion' },
  { mr: 'टोमॅटो', en: 'tomato' },
  { mr: 'गहू', en: 'wheat' },
  { mr: 'कापूस', en: 'cotton' },
  { mr: 'सोयाबीन', en: 'soybean' },
  { mr: 'तूर', en: 'tur' },
  { mr: 'हरभरा', en: 'chana' },
  { mr: 'मका', en: 'maize' },
  { mr: 'द्राक्षे', en: 'grapes' },
  { mr: 'डाळिंब', en: 'pomegranate' },
  { mr: 'केळी', en: 'banana' },
  { mr: 'ऊस', en: 'sugarcane' }
];

const DISTRICTS = [
  'नाशिक', 'पुणे', 'मुंबई', 'नागपूर', 'औरंगाबाद', 'सोलापूर',
  'कोल्हापूर', 'सांगली', 'सातारा', 'अहमदनगर', 'जळगाव', 'लातूर'
];

export default function AdvancedFilter({ onApply, onReset }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    crop: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    unit: ''
  });

  const set = (k, v) => setFilters({ ...filters, [k]: v });

  const apply = () => {
    onApply && onApply(filters);
    setOpen(false);
  };

  const reset = () => {
    setFilters({
      crop: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      unit: ''
    });
    onReset && onReset();
    setOpen(false);
  };

  const activeCount = Object.values(filters).filter((v) => v !== '').length;

  return (
    <div style={s.wrap}>
      <button
        style={activeCount > 0 ? s.filterBtnActive : s.filterBtn}
        onClick={() => setOpen(!open)}
      >
        🔍 Filter {activeCount > 0 && `(${activeCount})`}
      </button>

      {open && (
        <div style={s.panel}>
          <div style={s.panelHeader}>
            <h3 style={s.panelTitle}>🔍 शोध फिल्टर</h3>
            <button style={s.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div style={s.field}>
            <label style={s.label}>पीक</label>
            <select
              style={s.select}
              value={filters.crop}
              onChange={(e) => set('crop', e.target.value)}
            >
              <option value="">-- सर्व पिके --</option>
              {CROPS.map((c) => (
                <option key={c.en} value={c.en}>{c.mr}</option>
              ))}
            </select>
          </div>

          <div style={s.field}>
            <label style={s.label}>जिल्हा</label>
            <select
              style={s.select}
              value={filters.district}
              onChange={(e) => set('district', e.target.value)}
            >
              <option value="">-- सर्व जिल्हे --</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div style={s.row}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>किमान किंमत (₹)</label>
              <input
                style={s.input}
                type="number"
                placeholder="उदा. 500"
                value={filters.minPrice}
                onChange={(e) => set('minPrice', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>कमाल किंमत (₹)</label>
              <input
                style={s.input}
                type="number"
                placeholder="उदा. 2000"
                value={filters.maxPrice}
                onChange={(e) => set('maxPrice', e.target.value)}
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>माप</label>
            <select
              style={s.select}
              value={filters.unit}
              onChange={(e) => set('unit', e.target.value)}
            >
              <option value="">-- सर्व --</option>
              <option>क्विंटल</option>
              <option>टन</option>
              <option>किलो</option>
              <option>पोती</option>
            </select>
          </div>

          <div style={s.actions}>
            <button style={s.resetBtn} onClick={reset}>🔄 रीसेट</button>
            <button style={s.applyBtn} onClick={apply}>✅ लागू करा</button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { position: 'relative' },
  filterBtn: {
    padding: '10px 16px',
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    background: '#fff',
    color: '#555',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  filterBtnActive: {
    padding: '10px 16px',
    borderRadius: 10,
    border: '2px solid #2e7d32',
    background: '#e8f5e9',
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  panel: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    background: '#fff',
    borderRadius: 14,
    padding: 18,
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 300
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  panelTitle: { margin: 0, fontSize: 16, color: '#1b5e20' },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: 20, cursor: 'pointer', color: '#888'
  },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, color: '#666', fontWeight: 700 },
  select: {
    padding: 12,
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#fff',
    cursor: 'pointer',
    color: '#1a1a1a'
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    fontSize: 14,
    fontFamily: 'inherit',
    background: '#fff',
    color: '#1a1a1a',
    boxSizing: 'border-box',
    width: '100%'
  },
  row: { display: 'flex', gap: 8 },
  actions: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTop: '1px solid #f0f0f0'
  },
  resetBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: '2px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  applyBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 10,
    border: 'none',
    background: '#2e7d32',
    color: '#fff',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
};
import { useEffect, useState } from 'react';
import API from '../../api';

const JOB_TYPES = ['कापणी', 'पेरणी', 'लोडिंग', 'निंदणी', 'फवारणी'];

export default function WagesInfo({ onBack }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({
    district: user.district || '',
    job_type: ''
  });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.district) params.district = filter.district.trim();
      if (filter.job_type) params.job_type = filter.job_type.trim();

      const { data } = await API.get('/jobs/wage-benchmark', { params });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter.district, filter.job_type]);

  // जिल्ह्यानुसार गट
  const grouped = items.reduce((acc, w) => {
    if (!acc[w.district]) acc[w.district] = [];
    acc[w.district].push(w);
    return acc;
  }, {});

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>💰 मजुरीचा दर</h2>
        {onBack && <button style={s.backBtn} onClick={onBack}>← मागे</button>}
      </div>

      <p style={s.sub}>
        जिल्ह्यानुसार सरासरी रोजंदारी — योग्य दर ठरवण्यासाठी उपयुक्त
      </p>

      {/* Filter */}
      <div style={s.filterCard}>
        <label style={s.label}>जिल्हा</label>
        <input
          style={s.input}
          value={filter.district}
          onChange={(e) => setFilter({ ...filter, district: e.target.value })}
          placeholder="उदा. नाशिक — रिकामे ठेवल्यास सर्व"
        />

        <label style={s.label}>कामाचा प्रकार</label>
        <div style={s.chipsRow}>
          <button
            style={filter.job_type === '' ? s.chipActive : s.chip}
            onClick={() => setFilter({ ...filter, job_type: '' })}
          >
            सर्व
          </button>
          {JOB_TYPES.map((jt) => (
            <button
              key={jt}
              style={filter.job_type === jt ? s.chipActive : s.chip}
              onClick={() => setFilter({ ...filter, job_type: jt })}
            >
              {jt}
            </button>
          ))}
        </div>
      </div>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p>या जिल्ह्याची माहिती नाही</p>
        </div>
      )}

      {/* जिल्ह्यानुसार गट */}
      {Object.keys(grouped).map((district) => (
        <div key={district} style={s.districtBlock}>
          <h3 style={s.districtTitle}>📍 {district}</h3>
          {grouped[district].map((w) => (
            <div key={w.id} style={s.wageRow}>
              <span style={s.wageJob}>{w.job_type}</span>
              <span style={s.wageValue}>₹{w.avg_wage}/दिवस</span>
            </div>
          ))}
        </div>
      ))}

      {items.length > 0 && (
        <p style={s.tip}>
          💡 टिप: हे सरासरी दर आहेत. तुमच्या अनुभवानुसार थोडे जास्त मागू शकता.
        </p>
      )}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 20, color: '#e65100' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  backBtn: {
    background: 'none', border: 'none',
    color: '#e65100', cursor: 'pointer', fontSize: 14, fontWeight: 600
  },
  msg: { textAlign: 'center', color: '#888' },

  filterCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700, marginTop: 4 },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },

  chipsRow: {
    display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4
  },
  chip: {
    padding: '8px 14px', borderRadius: 20, border: '1.5px solid #e0e0e0',
    background: '#fff', color: '#555', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit'
  },
  chipActive: {
    padding: '8px 14px', borderRadius: 20, border: '1.5px solid #e65100',
    background: '#e65100', color: '#fff', fontSize: 13, fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit'
  },

  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },

  districtBlock: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  districtTitle: {
    margin: 0, fontSize: 16, color: '#e65100',
    borderBottom: '1px solid #ffe0b2', paddingBottom: 8
  },
  wageRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '8px 0',
    borderBottom: '1px dashed #f0f0f0'
  },
  wageJob: { fontSize: 14, color: '#555', fontWeight: 600 },
  wageValue: {
    fontSize: 15, fontWeight: 800, color: '#e65100',
    background: '#fff3e0', padding: '4px 12px', borderRadius: 10
  },
  tip: {
    fontSize: 12, color: '#a1887f',
    background: '#fff8e1', padding: 12, borderRadius: 10,
    margin: 0, lineHeight: 1.7
  }
};
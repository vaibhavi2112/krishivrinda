import { useEffect, useState } from 'react';
import API from '../../api';
import VoiceSearch from '../../components/VoiceSearch';
import WhatsAppButton from '../../components/WhatsAppButton';

// मराठी → इंग्रजी mapping (शोधण्यासाठी)
const JOB_MAP = {
  'कापणी': 'कापणी',
  'पेरणी': 'पेरणी',
  'लोडिंग': 'लोडिंग',
  'निंदणी': 'निंदणी',
  'फवारणी': 'फवारणी',
  'पाणी देणे': 'पाणी',
  'इतर': 'इतर'
};

const DISTRICT_MAP = {
  'नाशिक': 'नाशिक',
  'पुणे': 'पुणे',
  'मुंबई': 'मुंबई',
  'कोल्हापूर': 'कोल्हापूर',
  'सोलापूर': 'सोलापूर',
  'औरंगाबाद': 'औरंगाबाद',
  'नागपूर': 'नागपूर',
  'अमरावती': 'अमरावती',
  'अकोला': 'अकोला',
  'यवतमाळ': 'यवतमाळ',
  'लातूर': 'लातूर',
  'नांदेड': 'नांदेड',
  'परभणी': 'परभणी',
  'सांगली': 'सांगली',
  'सातारा': 'सातारा',
  'अहमदनगर': 'अहमदनगर',
  'जळगाव': 'जळगाव'
};

export default function BrowseJobs() {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState({
    district: '',
    job_type: ''
  });

  // नोकऱ्या लोड करा
  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.district) {
        params.district = DISTRICT_MAP[filter.district.trim()] || filter.district.trim();
      }
      if (filter.job_type) {
        params.job_type = JOB_MAP[filter.job_type.trim()] || filter.job_type.trim();
      }

      const { data } = await API.get('/jobs', { params });
      setJobs(data);

      // आधीच अर्ज केलेल्या नोकऱ्या शोधा
      const appsRes = await API.get('/jobs/my-applications');
      const applied = new Set(appsRes.data.map((a) => a.job_id));
      setAppliedIds(applied);
    } catch (e) {
      console.error('Jobs load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const apply = async (job) => {
    if (appliedIds.has(job.id)) {
      alert('तुम्ही आधीच या नोकरीसाठी अर्ज केला आहे');
      return;
    }

    if (!confirm(`${job.job_type} कामासाठी अर्ज करायचा?`)) return;

    try {
      await API.post(`/jobs/${job.id}/apply`);
      setAppliedIds((prev) => new Set(prev).add(job.id));
      setMsg(`✅ ${job.job_type} नोकरीसाठी अर्ज केला! शेतकरी तुम्हाला संपर्क करेल.`);
      setTimeout(() => setMsg(''), 4000);
    } catch (e) {
      alert(e.response?.data?.error || 'अर्ज करता आला नाही');
    }
  };

  const buildWhatsAppMessage = (j) => {
    return `नमस्कार ${j.poster_name || ''}, मी तुमच्या "${j.job_type}" नोकरीसाठी इच्छुक आहे. काम कधी सुरू होईल? - ${user.name || 'कामगार'}`;
  };

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>👷 जवळच्या नोकऱ्या</h2>
      </div>

      {/* शोध फॉर्म */}
      <form onSubmit={handleSearch} style={s.searchCard}>
        <div style={s.searchRow}>
          <input
            style={s.input}
            value={filter.job_type}
            onChange={(e) => setFilter({ ...filter, job_type: e.target.value })}
            placeholder="कामाचा प्रकार (उदा. कापणी, लोडिंग)"
          />
          <VoiceSearch
            onResult={(text) => setFilter({ ...filter, job_type: text })}
          />
        </div>

        <input
          style={s.input}
          value={filter.district}
          onChange={(e) => setFilter({ ...filter, district: e.target.value })}
          placeholder="जिल्हा (उदा. नाशिक) — रिकामे ठेवल्यास सर्व"
        />

        <button type="submit" style={s.searchBtn}>
          🔍 नोकऱ्या शोधा
        </button>
      </form>

      {/* यश संदेश */}
      {msg && <div style={s.successMsg}>{msg}</div>}

      {/* लोडिंग */}
      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {/* नोकऱ्या नाहीत */}
      {!loading && jobs.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p style={s.emptyText}>कोणतीही नोकरी सापडली नाही</p>
          <p style={s.emptyHint}>
            जिल्हा बदलून पहा किंवा शोध रिकामा ठेवा.
          </p>
        </div>
      )}

      {/* नोकऱ्यांची यादी */}
      {jobs.map((j) => {
        const applied = appliedIds.has(j.id);
        const startDate = j.start_date
          ? new Date(j.start_date).toLocaleDateString('mr-IN')
          : '—';

        return (
          <div key={j.id} style={s.card}>
            {/* शीर्ष — प्रकार + स्थिती */}
            <div style={s.cardTop}>
              <h3 style={s.jobType}>👷 {j.job_type}</h3>
              <span style={s.activeTag}>चालू</span>
            </div>

            {/* मुख्य माहिती */}
            <div style={s.infoRow}>
              <div style={s.infoBox}>
                <div style={s.infoLabel}>किती मजूर</div>
                <div style={s.infoValue}>{j.workers_required}</div>
              </div>
              <div style={{ ...s.infoBox, background: '#fff3e0' }}>
                <div style={s.infoLabel}>रोजची मजुरी</div>
                <div style={{ ...s.infoValue, color: '#e65100' }}>
                  ₹{j.wage_per_day}
                </div>
              </div>
              <div style={s.infoBox}>
                <div style={s.infoLabel}>कधी सुरू</div>
                <div style={{ ...s.infoValue, fontSize: 12 }}>
                  {startDate}
                </div>
              </div>
            </div>

            {/* स्थान */}
            {j.district && (
              <div style={s.locationBox}>
                📍 <b>{j.district}</b>
                {j.taluka && ` • ${j.taluka}`}
              </div>
            )}

            {/* शेतकरी माहिती */}
            <div style={s.posterBox}>
              <div style={s.posterAvatar}>
                {(j.poster_name || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={s.posterName}>{j.poster_name || 'शेतकरी'}</div>
                <div style={s.posterMobile}>📱 {j.poster_mobile}</div>
              </div>
            </div>

            {/* वर्णन */}
            {j.description && (
              <p style={s.desc}>📝 {j.description}</p>
            )}

            {/* कृती बटणे */}
            <div style={s.actionRow}>
              <a href={`tel:${j.poster_mobile}`} style={s.callBtn}>
                📞 कॉल
              </a>
              <WhatsAppButton
                mobile={j.poster_mobile}
                message={buildWhatsAppMessage(j)}
                label="💬 WhatsApp"
              />
            </div>

            {/* अर्ज करा */}
            <button
              style={applied ? s.appliedBtn : s.applyBtn}
              onClick={() => !applied && apply(j)}
              disabled={applied}
            >
              {applied ? '✅ अर्ज केला' : '📝 अर्ज करा'}
            </button>
          </div>
        );
      })}

      {jobs.length > 0 && (
        <p style={s.tip}>
          💡 टिप: अर्ज केल्यावर शेतकरी तुम्हाला WhatsApp वर संपर्क करेल.
          मजुरी आणि काम याबद्दल विचारा.
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

  searchCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  searchRow: { display: 'flex', gap: 8, alignItems: 'center' },
  input: {
    flex: 1, padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  searchBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#e65100', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },

  successMsg: {
    background: '#fff3e0', color: '#e65100',
    padding: 12, borderRadius: 10, fontSize: 14,
    fontWeight: 700, textAlign: 'center',
    border: '1px solid #ffcc80'
  },

  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyText: { margin: 0, fontSize: 16, fontWeight: 700 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },

  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  jobType: { margin: 0, fontSize: 18, color: '#e65100' },
  activeTag: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },

  infoRow: { display: 'flex', gap: 8 },
  infoBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 10, textAlign: 'center'
  },
  infoLabel: { fontSize: 11, color: '#888' },
  infoValue: { fontSize: 16, fontWeight: 800, color: '#333', marginTop: 2 },

  locationBox: {
    background: '#fff8e1', color: '#ef6c00',
    padding: 10, borderRadius: 10, fontSize: 13
  },

  posterBox: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#f9fbe7', borderRadius: 10, padding: 10
  },
  posterAvatar: {
    width: 42, height: 42, borderRadius: '50%',
    background: 'linear-gradient(135deg, #66bb6a, #43a047)',
    color: '#fff', fontSize: 18, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  posterName: { fontSize: 15, fontWeight: 700, color: '#1b5e20' },
  posterMobile: { fontSize: 13, color: '#555', marginTop: 2 },

  desc: {
    margin: 0, fontSize: 13, color: '#666',
    fontStyle: 'italic', background: '#fafafa',
    padding: 10, borderRadius: 8
  },

  actionRow: { display: 'flex', gap: 8 },
  callBtn: {
    flex: 1, textAlign: 'center', padding: '10px 14px',
    borderRadius: 10, background: '#e3f2fd', color: '#1976d2',
    textDecoration: 'none', fontWeight: 700, fontSize: 14
  },

  applyBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#e65100', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },
  appliedBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#e8f5e9', color: '#2e7d32',
    fontSize: 16, fontWeight: 700, cursor: 'default'
  },

  tip: {
    fontSize: 12, color: '#a1887f',
    background: '#fff8e1', padding: 12, borderRadius: 10,
    margin: 0, lineHeight: 1.7
  }
};
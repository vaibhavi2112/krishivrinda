import { useEffect, useState } from 'react';
import API from '../../api';
import WhatsAppButton from '../../components/WhatsAppButton';
import RatingModal from '../../components/RatingModal';
import WorkerRatings from '../../components/WorkerRatings';

export default function BrowseWorkers({ onBack }) {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ district: '', skill: '' });
  const [ratingWorker, setRatingWorker] = useState(null);
  const [viewRatingsWorker, setViewRatingsWorker] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.district) params.district = filter.district.trim();
      if (filter.skill) params.skill = filter.skill.trim();

      const { data } = await API.get('/workers', { params });
      setWorkers(data);
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

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const buildWhatsAppMessage = (w) => {
    return `नमस्कार ${w.name || ''}, मला तुमची सेवा हवी आहे. तुमची कौशल्ये: ${w.worker_skills || ''}. कृपया संपर्क करा. - ${user.name || ''}`;
  };

  const renderStars = (avg, total) => {
    if (!total) {
      return <span style={s.noRating}>अजून रेटिंग नाही</span>;
    }
    const rounded = Math.round(avg);
    return (
      <div style={s.ratingRow}>
        <span style={s.stars}>
          {'★'.repeat(rounded)}
          <span style={{ color: '#ddd' }}>{'★'.repeat(5 - rounded)}</span>
        </span>
        <span style={s.ratingNum}>{Number(avg).toFixed(1)}</span>
        <span style={s.ratingCount}>({total})</span>
      </div>
    );
  };

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>👷 कामगार शोधा</h2>
        {onBack && <button style={s.backBtn} onClick={onBack}>← मागे</button>}
      </div>

      <p style={s.sub}>जवळचे कामगार — रेटिंग पहा आणि थेट संपर्क करा</p>

      <form onSubmit={handleSearch} style={s.searchCard}>
        <input
          style={s.input}
          value={filter.skill}
          onChange={(e) => setFilter({ ...filter, skill: e.target.value })}
          placeholder="कौशल्य (उदा. कापणी, लोडिंग)"
        />
        <input
          style={s.input}
          value={filter.district}
          onChange={(e) => setFilter({ ...filter, district: e.target.value })}
          placeholder="जिल्हा — रिकामे ठेवल्यास सर्व"
        />
        <button type="submit" style={s.searchBtn}>
          🔍 कामगार शोधा
        </button>
      </form>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && workers.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>👷</div>
          <p style={s.emptyText}>कोणताही कामगार सापडला नाही</p>
          <p style={s.emptyHint}>
            कामगारांनी स्वतःचा अर्ज भरल्यावर इथे दिसतील.
          </p>
        </div>
      )}

      {workers.map((w) => (
        <div key={w.id} style={s.card}>
          <div style={s.cardTop}>
            <div style={s.avatar}>
              {(w.name || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={s.name}>{w.name || 'कामगार'}</h3>
              <div style={s.mobile}>📱 {w.mobile}</div>
              {w.district && <div style={s.district}>📍 {w.district}</div>}
            </div>
          </div>

          {/* रेटिंग */}
          <div
            style={s.ratingBox}
            onClick={() => setViewRatingsWorker(w)}
          >
            {renderStars(w.avg_rating, w.total_ratings)}
            <span style={s.tapHint}>सर्व पहा →</span>
          </div>

          {/* कौशल्ये */}
          {w.worker_skills && (
            <div style={s.skillsBox}>
              <div style={s.skillsLabel}>कौशल्ये:</div>
              <div style={s.skillsRow}>
                {w.worker_skills.split(',').map((sk, i) => (
                  <span key={i} style={s.skillChip}>{sk.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {/* माहिती */}
          <div style={s.infoRow}>
            {w.worker_experience && (
              <div style={s.infoBox}>
                <div style={s.infoLabel}>अनुभव</div>
                <div style={s.infoValue}>{w.worker_experience} वर्षे</div>
              </div>
            )}
            {w.worker_daily_wage && (
              <div style={{ ...s.infoBox, background: '#fff3e0' }}>
                <div style={s.infoLabel}>अपेक्षित मजुरी</div>
                <div style={{ ...s.infoValue, color: '#e65100' }}>
                  ₹{w.worker_daily_wage}/दिवस
                </div>
              </div>
            )}
          </div>

          {w.worker_bio && (
            <p style={s.bio}>📝 {w.worker_bio}</p>
          )}

          {/* संपर्क */}
          <div style={s.actionRow}>
            <a href={`tel:${w.mobile}`} style={s.callBtn}>📞 कॉल</a>
            <WhatsAppButton
              mobile={w.mobile}
              message={buildWhatsAppMessage(w)}
              label="💬 WhatsApp"
            />
          </div>

          {/* रेटिंग द्या बटण */}
          <button
            style={s.rateBtn}
            onClick={() => setRatingWorker(w)}
          >
            ⭐ रेटिंग द्या
          </button>
        </div>
      ))}

      {/* Modals */}
      {ratingWorker && (
        <RatingModal
          worker={ratingWorker}
          onClose={() => setRatingWorker(null)}
          onSuccess={load}
        />
      )}

      {viewRatingsWorker && (
        <WorkerRatings
          workerId={viewRatingsWorker.id}
          onClose={() => setViewRatingsWorker(null)}
        />
      )}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  backBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14, fontWeight: 600
  },
  msg: { textAlign: 'center', color: '#888' },

  searchCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  searchBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },

  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyText: { margin: 0, fontSize: 15, fontWeight: 600 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },

  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  cardTop: { display: 'flex', gap: 12, alignItems: 'center' },
  avatar: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'linear-gradient(135deg, #e65100, #ff9800)',
    color: '#fff', fontSize: 22, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  name: { margin: 0, fontSize: 17, color: '#bf360c' },
  mobile: { fontSize: 13, color: '#555', marginTop: 2 },
  district: { fontSize: 12, color: '#888', marginTop: 2 },

  ratingBox: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: '#fff8e1', borderRadius: 10, padding: 10,
    cursor: 'pointer'
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 6 },
  stars: { fontSize: 16, color: '#ffc107', letterSpacing: 1 },
  ratingNum: { fontSize: 15, fontWeight: 800, color: '#f57c00' },
  ratingCount: { fontSize: 12, color: '#888' },
  noRating: { fontSize: 13, color: '#999' },
  tapHint: { fontSize: 11, color: '#1565c0', fontWeight: 600 },

  skillsBox: {
    background: '#fafafa', borderRadius: 10, padding: 10
  },
  skillsLabel: { fontSize: 11, color: '#888', marginBottom: 6 },
  skillsRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  skillChip: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: '4px 10px', borderRadius: 12,
    fontSize: 12, fontWeight: 700
  },

  infoRow: { display: 'flex', gap: 8 },
  infoBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 10, textAlign: 'center'
  },
  infoLabel: { fontSize: 11, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: 800, color: '#333', marginTop: 2 },

  bio: {
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
  rateBtn: {
    padding: 10, borderRadius: 10, border: '2px solid #f57c00',
    background: '#fff', color: '#f57c00',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  }
};
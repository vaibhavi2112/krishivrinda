import { useEffect, useState } from 'react';
import API from '../api';

export default function WorkerRatings({ workerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [workerId]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/ratings/worker/${workerId}`);
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={s.overlay} onClick={onClose}>
        <div style={s.modal} onClick={(e) => e.stopPropagation()}>
          <p style={{ padding: 40, textAlign: 'center' }}>लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { worker, ratings, distribution } = data;

  // स्टार वितरण (5→1)
  const distMap = {};
  distribution.forEach((d) => { distMap[d.stars] = parseInt(d.count); });
  const total = worker.total_ratings || 0;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title}>⭐ रेटिंग आणि प्रतिक्रिया</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          {/* कामगार + सरासरी */}
          <div style={s.topBox}>
            <div style={s.avatar}>
              {(worker.name || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.workerName}>{worker.name || 'कामगार'}</div>
              <div style={s.workerMobile}>📱 {worker.mobile}</div>
            </div>
            <div style={s.ratingBig}>
              <div style={s.ratingNum}>
                {Number(worker.avg_rating || 0).toFixed(1)}
              </div>
              <div style={s.ratingStars}>
                {'★'.repeat(Math.round(worker.avg_rating || 0))}
                {'☆'.repeat(5 - Math.round(worker.avg_rating || 0))}
              </div>
              <div style={s.ratingCount}>({total})</div>
            </div>
          </div>

          {/* स्टार वितरण */}
          {total > 0 && (
            <div style={s.distBox}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distMap[star] || 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={star} style={s.distRow}>
                    <span style={s.distStar}>{star} ★</span>
                    <div style={s.distBar}>
                      <div style={{ ...s.distFill, width: `${pct}%` }} />
                    </div>
                    <span style={s.distCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* रेटिंग यादी */}
          <h4 style={s.sectionTitle}>
            💬 एकूण {ratings.length} प्रतिक्रिया
          </h4>

          {ratings.length === 0 && (
            <div style={s.empty}>
              <p>अजून कोणतीही प्रतिक्रिया नाही</p>
              <p style={s.emptyHint}>पहिला रेटिंग देणारे तुम्ही व्हा!</p>
            </div>
          )}

          {ratings.map((r) => (
            <div key={r.id} style={s.ratingCard}>
              <div style={s.ratingTop}>
                <div style={s.raterAvatar}>
                  {(r.rater_name || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={s.raterName}>{r.rater_name || 'वापरकर्ता'}</div>
                  <div style={s.raterRole}>
                    {r.rater_role === 'farmer' ? '🌾 शेतकरी' : '🛒 व्यापारी'}
                    {r.job_type && ` • ${r.job_type}`}
                  </div>
                </div>
                <div style={s.starsSmall}>
                  {'★'.repeat(r.stars)}
                  <span style={{ color: '#ddd' }}>{'★'.repeat(5 - r.stars)}</span>
                </div>
              </div>
              {r.review && (
                <p style={s.reviewText}>"{r.review}"</p>
              )}
              <div style={s.dateSmall}>
                {new Date(r.created_at).toLocaleDateString('mr-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999, padding: 16,
    fontFamily: "'Noto Sans Devanagari', sans-serif"
  },
  modal: {
    background: '#fff', borderRadius: 16,
    width: '100%', maxWidth: 500,
    maxHeight: '90vh', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    padding: 16, borderBottom: '1px solid #eee',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 17, color: '#f57c00' },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: 22, cursor: 'pointer', color: '#888'
  },
  body: { padding: 20, overflowY: 'auto' },

  topBox: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#fff8e1', borderRadius: 12, padding: 14,
    marginBottom: 16
  },
  avatar: {
    width: 56, height: 56, borderRadius: '50%',
    background: 'linear-gradient(135deg, #43a047, #66bb6a)',
    color: '#fff', fontSize: 24, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  workerName: { fontSize: 16, fontWeight: 700, color: '#1b5e20' },
  workerMobile: { fontSize: 12, color: '#555', marginTop: 2 },
  ratingBig: { textAlign: 'center' },
  ratingNum: { fontSize: 26, fontWeight: 900, color: '#f57c00' },
  ratingStars: { fontSize: 12, color: '#ffc107', letterSpacing: 1 },
  ratingCount: { fontSize: 11, color: '#888' },

  distBox: {
    background: '#fafafa', borderRadius: 10, padding: 12,
    marginBottom: 16
  },
  distRow: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 12, marginBottom: 4
  },
  distStar: { width: 30, color: '#666', fontWeight: 600 },
  distBar: {
    flex: 1, height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden'
  },
  distFill: {
    height: '100%', background: '#ffc107', borderRadius: 4
  },
  distCount: { width: 24, textAlign: 'right', color: '#888' },

  sectionTitle: {
    margin: '12px 0 8px', fontSize: 14, color: '#333'
  },

  empty: {
    textAlign: 'center', padding: 24, background: '#f9f9f9',
    borderRadius: 10, color: '#888'
  },
  emptyHint: { fontSize: 12, color: '#aaa', marginTop: 6 },

  ratingCard: {
    background: '#fafafa', borderRadius: 10, padding: 12,
    marginBottom: 8
  },
  ratingTop: {
    display: 'flex', gap: 10, alignItems: 'center'
  },
  raterAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    color: '#fff', fontSize: 15, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  raterName: { fontSize: 14, fontWeight: 700, color: '#333' },
  raterRole: { fontSize: 11, color: '#888', marginTop: 2 },
  starsSmall: { fontSize: 14, color: '#ffc107', letterSpacing: 1 },
  reviewText: {
    margin: '8px 0 0', fontSize: 13, color: '#555',
    fontStyle: 'italic', lineHeight: 1.5
  },
  dateSmall: { fontSize: 10, color: '#bbb', marginTop: 6 }
};
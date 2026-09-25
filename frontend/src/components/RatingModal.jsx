import { useState } from 'react';
import API from '../api';

export default function RatingModal({ worker, jobId, onClose, onSuccess }) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (stars < 1) return alert('किमान 1 स्टार द्या');
    setSaving(true);
    try {
      await API.post('/ratings', {
        worker_id: worker.id,
        job_id: jobId || null,
        stars,
        review: review.trim() || null
      });
      alert('✅ रेटिंग जतन झाली!');
      onSuccess && onSuccess();
      onClose();
    } catch (e) {
      alert(e.response?.data?.error || 'रेटिंग जतन करता आली नाही');
    } finally {
      setSaving(false);
    }
  };

  const labels = ['', 'वाईट', 'ठीक', 'चांगले', 'खूप चांगले', 'उत्कृष्ट'];

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h3 style={s.title}>⭐ रेटिंग द्या</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          {/* कामगार माहिती */}
          <div style={s.workerBox}>
            <div style={s.avatar}>
              {(worker.name || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={s.workerName}>{worker.name || 'कामगार'}</div>
              <div style={s.workerMobile}>📱 {worker.mobile}</div>
            </div>
          </div>

          {/* स्टार */}
          <div style={s.starSection}>
            <p style={s.starLabel}>काम कसे होते?</p>
            <div style={s.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  style={{
                    ...s.star,
                    color: n <= (hover || stars) ? '#ffc107' : '#e0e0e0'
                  }}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setStars(n)}
                >
                  ★
                </span>
              ))}
            </div>
            {stars > 0 && (
              <p style={s.starText}>{labels[stars]}</p>
            )}
          </div>

          {/* प्रतिक्रिया */}
          <label style={s.label}>प्रतिक्रिया (पर्यायी)</label>
          <textarea
            style={s.textarea}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="उदा. खूप चांगले काम केले, वेळेत आले"
            maxLength={300}
          />
          <p style={s.hint}>{review.length}/300</p>
        </div>

        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose} disabled={saving}>
            रद्द करा
          </button>
          <button style={s.saveBtn} onClick={save} disabled={saving}>
            {saving ? 'जतन होत आहे...' : '⭐ रेटिंग द्या'}
          </button>
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
    width: '100%', maxWidth: 420,
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

  workerBox: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#f9fbe7', borderRadius: 12, padding: 12,
    marginBottom: 20
  },
  avatar: {
    width: 50, height: 50, borderRadius: '50%',
    background: 'linear-gradient(135deg, #43a047, #66bb6a)',
    color: '#fff', fontSize: 22, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  workerName: { fontSize: 16, fontWeight: 700, color: '#1b5e20' },
  workerMobile: { fontSize: 13, color: '#555', marginTop: 2 },

  starSection: { textAlign: 'center', marginBottom: 20 },
  starLabel: { fontSize: 15, color: '#555', marginBottom: 12, fontWeight: 600 },
  stars: {
    display: 'flex', justifyContent: 'center', gap: 8
  },
  star: {
    fontSize: 48, cursor: 'pointer',
    transition: 'color 0.15s, transform 0.15s',
    userSelect: 'none'
  },
  starText: {
    marginTop: 12, fontSize: 16, fontWeight: 700, color: '#f57c00'
  },

  label: { fontSize: 13, color: '#555', fontWeight: 700, display: 'block', marginBottom: 6 },
  textarea: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit', minHeight: 80, resize: 'vertical'
  },
  hint: { fontSize: 11, color: '#999', textAlign: 'right', margin: '4px 0 0' },

  footer: {
    padding: 16, borderTop: '1px solid #eee',
    display: 'flex', gap: 10
  },
  cancelBtn: {
    flex: 1, padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    background: '#fff', color: '#666',
    fontSize: 15, fontWeight: 700, cursor: 'pointer'
  },
  saveBtn: {
    flex: 2, padding: 12, borderRadius: 10, border: 'none',
    background: '#f57c00', color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer'
  }
};
import { useEffect, useState } from 'react';
import API from '../../api';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function MyJobs({ onBack }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apps, setApps] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs/my');
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openJob = async (job) => {
    setSelectedJob(job);
    try {
      const { data } = await API.get(`/jobs/${job.id}/applications`);
      setApps(data.applications || []);
    } catch (e) {
      console.error(e);
      setApps([]);
    }
  };

  const closeJob = async (id) => {
    if (!confirm('ही नोकरी बंद करायची?')) return;
    try {
      await API.patch(`/jobs/${id}/close`);
      alert('नोकरी बंद झाली ✅');
      setSelectedJob(null);
      load();
    } catch (e) {
      alert('बंद करता आले नाही');
    }
  };

  // ============ एका नोकरीचे अर्ज पाहणे ============
  if (selectedJob) {
    return (
      <div style={s.container}>
        <div style={s.headerRow}>
          <h2 style={s.title}>👷 {selectedJob.job_type}</h2>
          <button style={s.backBtn} onClick={() => setSelectedJob(null)}>
            ← मागे
          </button>
        </div>

        <div style={s.jobCard}>
          <div style={s.jobRow}>
            <span style={s.jobLabel}>किती मजूर हवे</span>
            <b>{selectedJob.workers_required}</b>
          </div>
          <div style={s.jobRow}>
            <span style={s.jobLabel}>रोजची मजुरी</span>
            <b>₹{selectedJob.wage_per_day}</b>
          </div>
          <div style={s.jobRow}>
            <span style={s.jobLabel}>कधी सुरू</span>
            <b>{new Date(selectedJob.start_date).toLocaleDateString('mr-IN')}</b>
          </div>
          <div style={s.jobRow}>
            <span style={s.jobLabel}>जिल्हा</span>
            <b>{selectedJob.district || '—'}</b>
          </div>
          <div style={s.jobRow}>
            <span style={s.jobLabel}>स्थिती</span>
            <b style={{ color: selectedJob.is_active ? '#2e7d32' : '#c62828' }}>
              {selectedJob.is_active ? '✅ चालू' : '🔴 बंद'}
            </b>
          </div>
        </div>

        <h3 style={s.sectionTitle}>
          👥 अर्ज केलेले मजूर ({apps.length})
        </h3>

        {apps.length === 0 && (
          <div style={s.empty}>
            <div style={s.emptyIcon}>⏳</div>
            <p>अजून कोणी अर्ज केला नाही</p>
            <p style={s.emptyHint}>
              मजूर शोधत आहेत. थोड्या वेळाने पुन्हा पहा.
            </p>
          </div>
        )}

        {apps.map((a) => (
          <div key={a.id} style={s.appCard}>
            <div style={s.appTop}>
              <div style={s.avatar}>
                {(a.name || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={s.appName}>{a.name || 'नाव नाही'}</div>
                <div style={s.appMobile}>📱 {a.mobile}</div>
                <div style={s.appDistrict}>📍 {a.district || '—'}</div>
              </div>
            </div>
            <div style={s.appActions}>
              <a href={`tel:${a.mobile}`} style={s.callBtn}>
                📞 कॉल
              </a>
              <WhatsAppButton
                mobile={a.mobile}
                message={`नमस्कार ${a.name || ''}, तुम्ही माझ्या "${selectedJob.job_type}" नोकरीसाठी अर्ज केला आहे. कधी येऊ शकता?`}
                label="💬 व्हॉट्सॲप"
              />
            </div>
          </div>
        ))}

        {selectedJob.is_active && (
          <button style={s.closeBtn} onClick={() => closeJob(selectedJob.id)}>
            🔴 नोकरी बंद करा
          </button>
        )}
      </div>
    );
  }

  // ============ नोकऱ्यांची यादी ============
  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>📋 माझ्या नोकऱ्या</h2>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && jobs.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p>अजून एकही नोकरी पोस्ट केलेली नाही</p>
          <p style={s.emptyHint}>
            "मजूर हवा आहे" वर क्लिक करून नोकरी पोस्ट करा.
          </p>
        </div>
      )}

      {jobs.map((j) => (
        <div
          key={j.id}
          style={s.listCard}
          onClick={() => openJob(j)}
        >
          <div style={s.listTop}>
            <h3 style={s.listTitle}>👷 {j.job_type}</h3>
            {j.is_active ? (
              <span style={s.activeTag}>चालू</span>
            ) : (
              <span style={s.closedTag}>बंद</span>
            )}
          </div>
          <div style={s.listInfo}>
            <span>👥 {j.workers_required} मजूर</span>
            <span>💰 ₹{j.wage_per_day}/दिवस</span>
            <span>📍 {j.district || '—'}</span>
          </div>
          <div style={s.listBottom}>
            <span style={s.appCount}>
              {j.applications_count > 0
                ? `✅ ${j.applications_count} अर्ज आले`
                : '⏳ अजून अर्ज नाही'}
            </span>
            <span style={s.date}>
              {new Date(j.created_at).toLocaleDateString('mr-IN')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  backBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14
  },
  msg: { textAlign: 'center', color: '#888' },
  sectionTitle: {
    margin: '12px 0 4px', fontSize: 16, color: '#1b5e20'
  },

  jobCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  jobRow: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 14, borderBottom: '1px solid #f5f5f5',
    paddingBottom: 6
  },
  jobLabel: { color: '#888' },

  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },

  appCard: {
    background: '#fff', borderRadius: 12, padding: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  appTop: { display: 'flex', gap: 12, alignItems: 'center' },
  avatar: {
    width: 46, height: 46, borderRadius: '50%',
    background: 'linear-gradient(135deg, #43a047, #66bb6a)',
    color: '#fff', fontSize: 20, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  appName: { fontSize: 16, fontWeight: 700, color: '#1b5e20' },
  appMobile: { fontSize: 13, color: '#555', marginTop: 2 },
  appDistrict: { fontSize: 12, color: '#888', marginTop: 2 },
  appActions: { display: 'flex', gap: 8 },
  callBtn: {
    flex: 1, textAlign: 'center', padding: '10px 14px',
    borderRadius: 10, background: '#e3f2fd', color: '#1976d2',
    textDecoration: 'none', fontWeight: 700, fontSize: 14
  },

  listCard: {
    background: '#fff', borderRadius: 12, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8
  },
  listTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  listTitle: { margin: 0, fontSize: 16, color: '#1b5e20' },
  activeTag: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },
  closedTag: {
    background: '#ffebee', color: '#c62828',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },
  listInfo: {
    display: 'flex', flexWrap: 'wrap', gap: 12,
    fontSize: 13, color: '#555'
  },
  listBottom: {
    display: 'flex', justifyContent: 'space-between',
    paddingTop: 8, borderTop: '1px solid #f0f0f0',
    fontSize: 13
  },
  appCount: { color: '#2e7d32', fontWeight: 600 },
  date: { color: '#999' },

  closeBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#ffebee', color: '#c62828',
    fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8
  }
};
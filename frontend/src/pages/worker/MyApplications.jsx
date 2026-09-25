import { useEffect, useState } from 'react';
import API from '../../api';
import WhatsAppButton from '../../components/WhatsAppButton';

export default function MyApplications() {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs/my-applications');
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const buildWhatsAppMessage = (j) => {
    return `नमस्कार ${j.poster_name || ''}, मी "${j.job_type}" नोकरीसाठी अर्ज केला आहे. काम कधी सुरू होईल? - ${user.name || 'कामगार'}`;
  };

  if (loading) return <p style={s.msg}>लोड होत आहे...</p>;

  if (items.length === 0) {
    return (
      <div style={s.container}>
        <h2 style={s.title}>📋 माझे अर्ज</h2>
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p style={s.emptyText}>अजून कोणताही अर्ज केलेला नाही</p>
          <p style={s.emptyHint}>
            "नोकऱ्या" tab वर जा आणि अर्ज करा.
          </p>
        </div>
      </div>
    );
  }

  // स्थितीनुसार विभाग
  const pending = items.filter((i) => i.status === 'pending');
  const accepted = items.filter((i) => i.status === 'accepted');
  const rejected = items.filter((i) => i.status === 'rejected');

  return (
    <div style={s.container}>
      <h2 style={s.title}>📋 माझे अर्ज</h2>
      <p style={s.sub}>
        एकूण {items.length} अर्ज • {pending.length} प्रलंबित • {accepted.length} स्वीकारले
      </p>

      {/* स्वीकारलेले अर्ज */}
      {accepted.length > 0 && (
        <>
          <h3 style={s.sectionTitle}>✅ स्वीकारलेले ({accepted.length})</h3>
          {accepted.map((j) => (
            <AppCard key={j.id} j={j} user={user} buildMsg={buildWhatsAppMessage} accent="#2e7d32" />
          ))}
        </>
      )}

      {/* प्रलंबित अर्ज */}
      {pending.length > 0 && (
        <>
          <h3 style={s.sectionTitle}>⏳ प्रलंबित ({pending.length})</h3>
          {pending.map((j) => (
            <AppCard key={j.id} j={j} user={user} buildMsg={buildWhatsAppMessage} accent="#f57c00" />
          ))}
        </>
      )}

      {/* नाकारलेले अर्ज */}
      {rejected.length > 0 && (
        <>
          <h3 style={s.sectionTitle}>❌ नाकारलेले ({rejected.length})</h3>
          {rejected.map((j) => (
            <AppCard key={j.id} j={j} user={user} buildMsg={buildWhatsAppMessage} accent="#c62828" />
          ))}
        </>
      )}
    </div>
  );
}

function AppCard({ j, user, buildMsg, accent }) {
  const startDate = j.start_date
    ? new Date(j.start_date).toLocaleDateString('mr-IN')
    : '—';

  return (
    <div style={{ ...s.card, borderLeft: `4px solid ${accent}` }}>
      <div style={s.cardTop}>
        <h3 style={s.jobType}>👷 {j.job_type}</h3>
        {!j.is_active && <span style={s.closedTag}>बंद</span>}
      </div>

      <div style={s.infoRow}>
        <div style={s.infoBox}>
          <div style={s.infoLabel}>मजुरी</div>
          <div style={{ ...s.infoValue, color: '#e65100' }}>₹{j.wage_per_day}</div>
        </div>
        <div style={s.infoBox}>
          <div style={s.infoLabel}>कधी सुरू</div>
          <div style={{ ...s.infoValue, fontSize: 13 }}>{startDate}</div>
        </div>
      </div>

      {j.district && (
        <div style={s.locationBox}>📍 {j.district}</div>
      )}

      <div style={s.posterBox}>
        <div style={s.posterAvatar}>
          {(j.poster_name || '?').charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={s.posterName}>{j.poster_name || 'शेतकरी'}</div>
          <div style={s.posterMobile}>📱 {j.poster_mobile}</div>
        </div>
      </div>

      <div style={s.actionRow}>
        <a href={`tel:${j.poster_mobile}`} style={s.callBtn}>📞 कॉल</a>
        <WhatsAppButton
          mobile={j.poster_mobile}
          message={buildMsg(j)}
          label="💬 WhatsApp"
        />
      </div>

      <small style={s.date}>
        अर्ज: {new Date(j.created_at).toLocaleDateString('mr-IN')}
      </small>
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  title: { margin: 0, fontSize: 20, color: '#e65100' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  sectionTitle: {
    margin: '12px 0 4px', fontSize: 15, color: '#333'
  },
  msg: { textAlign: 'center', color: '#888', padding: 20 },

  empty: {
    textAlign: 'center', padding: 40, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyText: { margin: 0, fontSize: 15, fontWeight: 600 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },

  card: {
    background: '#fff', borderRadius: 12, padding: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  jobType: { margin: 0, fontSize: 16, color: '#e65100' },
  closedTag: {
    background: '#ffebee', color: '#c62828',
    padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700
  },

  infoRow: { display: 'flex', gap: 8 },
  infoBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 8, textAlign: 'center'
  },
  infoLabel: { fontSize: 11, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: 800, color: '#333', marginTop: 2 },

  locationBox: {
    background: '#fff8e1', color: '#ef6c00',
    padding: 8, borderRadius: 8, fontSize: 12
  },

  posterBox: {
    display: 'flex', gap: 10, alignItems: 'center',
    background: '#f9fbe7', borderRadius: 10, padding: 10
  },
  posterAvatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'linear-gradient(135deg, #66bb6a, #43a047)',
    color: '#fff', fontSize: 16, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  posterName: { fontSize: 14, fontWeight: 700, color: '#1b5e20' },
  posterMobile: { fontSize: 12, color: '#555', marginTop: 2 },

  actionRow: { display: 'flex', gap: 8 },
  callBtn: {
    flex: 1, textAlign: 'center', padding: '9px 12px',
    borderRadius: 10, background: '#e3f2fd', color: '#1976d2',
    textDecoration: 'none', fontWeight: 700, fontSize: 13
  },
  date: { color: '#999', fontSize: 11 }
};
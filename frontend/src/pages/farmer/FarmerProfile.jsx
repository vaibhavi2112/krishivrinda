import { useState } from 'react';
import EditProfileModal from '../../components/EditProfileModal';

export default function FarmerProfile({ onLogout }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('kv_user') || '{}')
  );
  const [showEdit, setShowEdit] = useState(false);

  const handleSaved = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>👤 माझी माहिती</h2>
        <button style={s.editBtn} onClick={() => setShowEdit(true)}>
          ✏️ संपादित करा
        </button>
      </div>

      {/* प्रोफाइल कार्ड */}
      <div style={s.card}>
        <div style={s.avatarWrap}>
          {user.profile_image_url ? (
            <img src={user.profile_image_url} alt="profile" style={s.avatarImg} />
          ) : (
            <div style={s.avatar}>
              {(user.name || user.mobile || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <h3 style={s.name}>{user.name || 'नाव नाही'}</h3>
          <p style={s.role}>🌾 शेतकरी</p>
        </div>

        <div style={s.row}>
          <span style={s.rowLabel}>📱 मोबाइल</span>
          <span style={s.rowVal}>{user.mobile}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>📍 जिल्हा</span>
          <span style={s.rowVal}>{user.district || '—'}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>🏘️ तालुका</span>
          <span style={s.rowVal}>{user.taluka || '—'}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>🏡 गाव</span>
          <span style={s.rowVal}>{user.village || '—'}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>📮 पिनकोड</span>
          <span style={s.rowVal}>{user.pincode || '—'}</span>
        </div>
        <div style={s.row}>
          <span style={s.rowLabel}>📅 सदस्यता</span>
          <span style={s.rowVal}>
            {new Date(user.created_at || Date.now()).toLocaleDateString('mr-IN')}
          </span>
        </div>
      </div>

      {/* मदत */}
      <div style={s.helpCard}>
        <h3 style={s.helpTitle}>💡 मदत</h3>
        <p style={s.helpText}>
          • तुमचे पीक विकायचे असेल तर <b>"पिके"</b> tab वापरा.<br />
          • कोणी व्यापारी तुमचे पीक घ्यायला तयार असेल तर <b>"बातमी"</b> मध्ये कळेल.<br />
          • मजूर हवा असेल तर <b>"कामगार"</b> tab वापरा.<br />
          • बाजारात काय भाव चालू आहे ते <b>"बाजार"</b> मध्ये पहा.
        </p>
      </div>

      {/* बाहेर पडा */}
      <button style={s.logoutBtn} onClick={onLogout}>
        🚪 बाहेर पडा
      </button>

      <p style={s.footer}>कृषीवृंद • महाराष्ट्राचा शेतकरी मित्र</p>

      {/* Edit Modal */}
      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSave={handleSaved}
        />
      )}
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 16 },
  headerRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  editBtn: {
    padding: '8px 14px', borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 13, fontWeight: 700, cursor: 'pointer'
  },

  card: {
    background: '#fff', borderRadius: 16, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  avatarWrap: { textAlign: 'center', marginBottom: 20 },
  avatar: {
    width: 90, height: 90, borderRadius: '50%',
    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
    color: '#fff', fontSize: 36, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 12px'
  },
  avatarImg: {
    width: 90, height: 90, borderRadius: '50%',
    objectFit: 'cover', margin: '0 auto 12px',
    display: 'block', border: '3px solid #2e7d32'
  },
  name: { margin: 0, fontSize: 20, color: '#1b5e20' },
  role: { margin: '4px 0 0', color: '#666', fontSize: 14 },

  row: {
    display: 'flex', justifyContent: 'space-between',
    padding: '14px 0', borderBottom: '1px solid #f0f0f0'
  },
  rowLabel: { color: '#888', fontSize: 14 },
  rowVal: { color: '#333', fontSize: 14, fontWeight: 600 },

  helpCard: {
    background: '#e8f5e9', borderRadius: 12, padding: 16,
    border: '1px solid #a5d6a7'
  },
  helpTitle: { margin: '0 0 8px', fontSize: 16, color: '#1b5e20' },
  helpText: { margin: 0, fontSize: 13, color: '#555', lineHeight: 1.9 },

  logoutBtn: {
    padding: 14, borderRadius: 12, border: 'none',
    background: '#ffebee', color: '#c62828',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },
  footer: {
    textAlign: 'center', color: '#bbb', fontSize: 12, margin: 0
  }
};
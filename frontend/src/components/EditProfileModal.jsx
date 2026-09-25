import { useState } from 'react';
import API from '../api';

export default function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user.name || '',
    district: user.district || '',
    taluka: user.taluka || '',
    village: user.village || '',
    pincode: user.pincode || '',
    profile_image_url: user.profile_image_url || ''
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(user.profile_image_url || '');

  const set = (k, v) => setForm({ ...form, [k]: v });

  // फोटो अपलोड — base64 मध्ये
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('फोटो 2MB पेक्षा लहान असावा');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      set('profile_image_url', ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview('');
    set('profile_image_url', '');
  };

  const save = async () => {
    if (!form.name.trim()) return alert('नाव भरा');
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
      return alert('पिनकोड 6 अंकी असावा');
    }

    setSaving(true);
    try {
      const { data } = await API.patch('/users/me', form);

      // localStorage अपडेट करा
      const currentUser = JSON.parse(localStorage.getItem('kv_user') || '{}');
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('kv_user', JSON.stringify(updatedUser));

      alert('✅ प्रोफाइल अपडेट झाले!');
      onSave && onSave(updatedUser);
      onClose();
    } catch (e) {
      alert(e.response?.data?.error || 'अपडेट करता आले नाही');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <h3 style={s.title}>✏️ प्रोफाइल संपादित करा</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div style={s.body}>
          {/* फोटो */}
          <div style={s.photoSection}>
            <div style={s.photoWrap}>
              {preview ? (
                <img src={preview} alt="profile" style={s.photoImg} />
              ) : (
                <div style={s.photoPlaceholder}>
                  {(form.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={s.photoActions}>
              <label style={s.uploadBtn}>
                📷 फोटो बदला
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  style={{ display: 'none' }}
                />
              </label>
              {preview && (
                <button style={s.removeBtn} onClick={removeImage}>
                  🗑️ काढा
                </button>
              )}
            </div>
            <p style={s.photoHint}>जास्तीत जास्त 2MB • JPG, PNG</p>
          </div>

          {/* नाव */}
          <label style={s.label}>पूर्ण नाव *</label>
          <input
            style={s.input}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="उदा. राम पाटील"
          />

          {/* मोबाइल — readonly */}
          <label style={s.label}>मोबाइल (बदलता येत नाही)</label>
          <input
            style={{ ...s.input, background: '#f5f5f5', color: '#888' }}
            value={user.mobile || ''}
            disabled
          />

          {/* पत्ता */}
          <h4 style={s.sectionTitle}>📍 पत्ता</h4>

          <label style={s.label}>जिल्हा</label>
          <input
            style={s.input}
            value={form.district}
            onChange={(e) => set('district', e.target.value)}
            placeholder="उदा. नाशिक"
          />

          <div style={s.row}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>तालुका</label>
              <input
                style={s.input}
                value={form.taluka}
                onChange={(e) => set('taluka', e.target.value)}
                placeholder="उदा. निफाड"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>गाव</label>
              <input
                style={s.input}
                value={form.village}
                onChange={(e) => set('village', e.target.value)}
                placeholder="उदा. पिंपळगाव"
              />
            </div>
          </div>

          <label style={s.label}>पिनकोड</label>
          <input
            style={s.input}
            value={form.pincode}
            onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder="उदा. 422001"
            maxLength={6}
          />
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <button style={s.cancelBtn} onClick={onClose} disabled={saving}>
            रद्द करा
          </button>
          <button style={s.saveBtn} onClick={save} disabled={saving}>
            {saving ? 'जतन होत आहे...' : '✅ जतन करा'}
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
    width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    padding: 16, borderBottom: '1px solid #eee',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  title: { margin: 0, fontSize: 17, color: '#2e7d32' },
  closeBtn: {
    background: 'none', border: 'none',
    fontSize: 22, cursor: 'pointer', color: '#888'
  },
  body: {
    padding: 16, overflowY: 'auto', flex: 1,
    display: 'flex', flexDirection: 'column', gap: 8
  },

  photoSection: { textAlign: 'center', marginBottom: 12 },
  photoWrap: {
    width: 100, height: 100, borderRadius: '50%',
    margin: '0 auto 12px', overflow: 'hidden',
    border: '3px solid #2e7d32',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f1f8e9'
  },
  photoImg: { width: '100%', height: '100%', objectFit: 'cover' },
  photoPlaceholder: {
    fontSize: 42, fontWeight: 800, color: '#2e7d32'
  },
  photoActions: {
    display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap'
  },
  uploadBtn: {
    padding: '8px 16px', borderRadius: 8,
    background: '#2e7d32', color: '#fff',
    fontSize: 13, fontWeight: 700, cursor: 'pointer',
    display: 'inline-block'
  },
  removeBtn: {
    padding: '8px 16px', borderRadius: 8, border: 'none',
    background: '#ffebee', color: '#c62828',
    fontSize: 13, fontWeight: 700, cursor: 'pointer'
  },
  photoHint: { fontSize: 11, color: '#999', marginTop: 6 },

  sectionTitle: {
    margin: '12px 0 4px', fontSize: 14, color: '#2e7d32',
    borderBottom: '1px solid #e8f5e9', paddingBottom: 6
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700, marginTop: 6 },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  row: { display: 'flex', gap: 10 },

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
    background: '#2e7d32', color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer'
  }
};
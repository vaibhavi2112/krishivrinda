import { useEffect, useState } from 'react';
import API from '../../api';

const SKILLS_LIST = [
  'कापणी', 'पेरणी', 'लोडिंग', 'निंदणी', 'फवारणी',
  'पाणी देणे', 'ट्रॅक्टर चालवणे', 'बैलगाडी', 'दुध काढणे',
  'बांधकाम', 'मासेमारी', 'बागकाम'
];

export default function MyWorkerProfile() {
  const [form, setForm] = useState({
    worker_skills: '',
    worker_experience: '',
    worker_bio: '',
    worker_daily_wage: '',
    worker_available: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/workers/me');
      const skills = data.worker_skills
        ? data.worker_skills.split(',').map((s) => s.trim())
        : [];
      setSelectedSkills(skills);
      setForm({
        worker_skills: data.worker_skills || '',
        worker_experience: data.worker_experience || '',
        worker_bio: data.worker_bio || '',
        worker_daily_wage: data.worker_daily_wage || '',
        worker_available: data.worker_available !== false
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    let updated;
    if (selectedSkills.includes(skill)) {
      updated = selectedSkills.filter((s) => s !== skill);
    } else {
      updated = [...selectedSkills, skill];
    }
    setSelectedSkills(updated);
    setForm({ ...form, worker_skills: updated.join(', ') });
  };

  const save = async () => {
    if (!form.worker_skills.trim()) return alert('किमान एक कौशल्य निवडा');
    if (!form.worker_daily_wage) return alert('अपेक्षित रोजंदारी भरा');

    setSaving(true);
    try {
      await API.patch('/workers/me', {
        ...form,
        worker_experience: form.worker_experience ? Number(form.worker_experience) : null,
        worker_daily_wage: Number(form.worker_daily_wage)
      });
      alert('✅ तुमचा अर्ज जतन झाला! शेतकरी तुम्हाला शोधतील.');
    } catch (e) {
      alert(e.response?.data?.error || 'जतन करता आले नाही');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={s.msg}>लोड होत आहे...</p>;

  return (
    <div style={s.container}>
      <h2 style={s.title}>📄 माझा अर्ज</h2>
      <p style={s.sub}>
        हा अर्ज शेतकरी आणि व्यापारी पाहतील — त्यांना तुमची माहिती मिळेल
      </p>

      {/* उपलब्धता toggle */}
      <div style={s.availableCard}>
        <div style={{ flex: 1 }}>
          <div style={s.availableLabel}>कामासाठी उपलब्ध</div>
          <div style={s.availableSub}>
            {form.worker_available
              ? 'तुम्ही शेतकऱ्यांना दिसत आहात'
              : 'तुम्ही लपलेले आहात'}
          </div>
        </div>
        <button
          style={form.worker_available ? s.toggleOn : s.toggleOff}
          onClick={() => setForm({ ...form, worker_available: !form.worker_available })}
        >
          {form.worker_available ? 'चालू' : 'बंद'}
        </button>
      </div>

      {/* कौशल्ये */}
      <div style={s.card}>
        <label style={s.label}>तुमची कौशल्ये *</label>
        <p style={s.hint}>जे काम तुम्ही करू शकता ते निवडा</p>
        <div style={s.chipsRow}>
          {SKILLS_LIST.map((sk) => (
            <button
              key={sk}
              style={selectedSkills.includes(sk) ? s.chipActive : s.chip}
              onClick={() => toggleSkill(sk)}
            >
              {selectedSkills.includes(sk) ? '✓ ' : '+ '}{sk}
            </button>
          ))}
        </div>
      </div>

      {/* अनुभव + मजुरी */}
      <div style={s.card}>
        <label style={s.label}>अनुभव (वर्षे)</label>
        <input
          style={s.input}
          type="number"
          value={form.worker_experience}
          onChange={(e) => setForm({ ...form, worker_experience: e.target.value })}
          placeholder="उदा. 5"
        />

        <label style={s.label}>अपेक्षित रोजंदारी (₹) *</label>
        <input
          style={s.input}
          type="number"
          value={form.worker_daily_wage}
          onChange={(e) => setForm({ ...form, worker_daily_wage: e.target.value })}
          placeholder="उदा. 450"
        />

        <label style={s.label}>थोडक्यात माहिती</label>
        <textarea
          style={{ ...s.input, minHeight: 90 }}
          value={form.worker_bio}
          onChange={(e) => setForm({ ...form, worker_bio: e.target.value })}
          placeholder="उदा. 5 वर्षांचा अनुभव, कापणी आणि लोडिंगमध्ये तज्ञ"
        />
      </div>

      <button style={s.saveBtn} onClick={save} disabled={saving}>
        {saving ? 'जतन होत आहे...' : '✅ अर्ज जतन करा'}
      </button>

      <p style={s.tip}>
        💡 टिप: तुमचा अर्ज पूर्ण भरल्यावर शेतकरी तुम्हाला थेट WhatsApp वर संपर्क करतील.
      </p>
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  title: { margin: 0, fontSize: 20, color: '#e65100' },
  sub: { margin: 0, fontSize: 13, color: '#777' },
  msg: { textAlign: 'center', color: '#888', padding: 20 },

  availableCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', alignItems: 'center', gap: 12
  },
  availableLabel: { fontSize: 15, fontWeight: 700, color: '#333' },
  availableSub: { fontSize: 12, color: '#888', marginTop: 2 },
  toggleOn: {
    padding: '8px 20px', borderRadius: 20, border: 'none',
    background: '#e8f5e9', color: '#2e7d32',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  },
  toggleOff: {
    padding: '8px 20px', borderRadius: 20, border: 'none',
    background: '#ffebee', color: '#c62828',
    fontSize: 14, fontWeight: 700, cursor: 'pointer'
  },

  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700, marginTop: 4 },
  hint: { fontSize: 12, color: '#999', margin: '-4px 0 4px' },
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

  saveBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#e65100', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },
  tip: {
    fontSize: 12, color: '#a1887f',
    background: '#fff8e1', padding: 12, borderRadius: 10,
    margin: 0, lineHeight: 1.7
  }
};
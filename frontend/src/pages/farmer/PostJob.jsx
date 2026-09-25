import { useState, useEffect } from 'react';
import API from '../../api';
import MyJobs from './MyJobs';
import { useJarvis } from '../../jarvis/JarvisContext';
import { useUserLocation, updateUserLocation } from '../../hooks/useUserLocation';

export default function PostJob({ onBack }) {
  const { registerHandlers } = useJarvis();
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [view, setView] = useState('menu');

  useEffect(() => {
    registerHandlers({
      openJobForm: () => setView('post')
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>👷 कामगार</h2>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      {view === 'menu' && (
        <>
          <button style={s.bigBtn} onClick={() => setView('post')}>
            <div style={s.bigIcon}>📝</div>
            <div style={s.bigText}>
              <b>मजूर हवा आहे</b>
              <span>नवीन नोकरी पोस्ट करा</span>
            </div>
          </button>

          <button style={s.bigBtn} onClick={() => setView('myjobs')}>
            <div style={s.bigIcon}>📋</div>
            <div style={s.bigText}>
              <b>माझ्या नोकऱ्या</b>
              <span>पोस्ट केलेल्या नोकऱ्या + अर्ज पहा</span>
            </div>
          </button>

          <button style={s.bigBtn} onClick={() => setView('wages')}>
            <div style={s.bigIcon}>💰</div>
            <div style={s.bigText}>
              <b>मजुरीचा दर पहा</b>
              <span>जिल्ह्यानुसार सरासरी मजुरी</span>
            </div>
          </button>
        </>
      )}

      {view === 'post' && (
        <JobForm
          district={user.district || ''}
          onDone={() => setView('myjobs')}
          onBack={() => setView('menu')}
        />
      )}

      {view === 'myjobs' && (
        <MyJobs onBack={() => setView('menu')} />
      )}

      {view === 'wages' && (
        <WageBenchmarks
          district={user.district || ''}
          onBack={() => setView('menu')}
        />
      )}
    </div>
  );
}

function JobForm({ district: defaultDistrict, onDone, onBack }) {
  const userLocation = useUserLocation();
  const [form, setForm] = useState({
    job_type: 'कापणी',
    workers_required: '',
    wage_per_day: '',
    start_date: '',
    end_date: '',
    start_time: '08:00',
    description: '',
    district: userLocation.district || defaultDistrict || '',  // ⚠️ Auto-fill
    taluka: userLocation.taluka || ''  // ⚠️ Auto-fill
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.workers_required) return alert('किती मजूर हवे ते भरा');
    if (!form.wage_per_day) return alert('रोजची मजुरी भरा');
    if (!form.start_date) return alert('काम सुरू होण्याची तारीख भरा');

    setLoading(true);
    try {
      await API.post('/jobs', {
        ...form,
        workers_required: Number(form.workers_required),
        wage_per_day: Number(form.wage_per_day)
      });

      // ⚠️ Location update (जर बदलले असेल)
      const newLocation = {};
      if (form.district && form.district !== userLocation.district) {
        newLocation.district = form.district;
      }
      if (form.taluka && form.taluka !== userLocation.taluka) {
        newLocation.taluka = form.taluka;
      }

      if (Object.keys(newLocation).length > 0) {
        updateUserLocation(newLocation);
        try {
          await API.patch('/users/me', newLocation);
        } catch (e) {
          console.error('Location update failed:', e);
        }
      }

      alert('नोकरी पोस्ट झाली ✅ मजूर तुम्हाला शोधतील');
      onDone && onDone();
    } catch (e) {
      alert(e.response?.data?.error || 'पोस्ट करता आले नाही');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const isDistrictAutoFilled =
    userLocation.district && form.district === userLocation.district;
  const isTalukaAutoFilled =
    userLocation.taluka && form.taluka === userLocation.taluka;

  return (
    <div style={s.formWrap}>
      <div style={s.headerRow}>
        <h3 style={s.subTitle}>📝 नवीन नोकरी</h3>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      <div style={s.form}>
        <label style={s.label}>कामाचा प्रकार *</label>
        <select
          style={s.input}
          value={form.job_type}
          onChange={(e) => set('job_type', e.target.value)}
        >
          <option>कापणी</option>
          <option>पेरणी</option>
          <option>लोडिंग</option>
          <option>निंदणी</option>
          <option>फवारणी</option>
          <option>पाणी देणे</option>
          <option>इतर</option>
        </select>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>किती मजूर? *</label>
            <input
              style={s.input}
              type="number"
              value={form.workers_required}
              onChange={(e) => set('workers_required', e.target.value)}
              placeholder="उदा. 5"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>रोजची मजुरी (₹) *</label>
            <input
              style={s.input}
              type="number"
              value={form.wage_per_day}
              onChange={(e) => set('wage_per_day', e.target.value)}
              placeholder="उदा. 400"
            />
          </div>
        </div>

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>कधी सुरू? *</label>
            <input
              style={s.input}
              type="date"
              min={today}
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>कधी संपेल?</label>
            <input
              style={s.input}
              type="date"
              min={form.start_date || today}
              value={form.end_date}
              onChange={(e) => set('end_date', e.target.value)}
            />
          </div>
        </div>

        <label style={s.label}>काम कधी सुरू होईल? (वेळ)</label>
        <input
          style={s.input}
          type="time"
          value={form.start_time}
          onChange={(e) => set('start_time', e.target.value)}
        />

        <div style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>जिल्हा</label>
            <input
              style={s.input}
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
              placeholder="उदा. नाशिक"
            />
            {isDistrictAutoFilled && (
              <p style={s.autoHint}>✅ आपोआप भरले</p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>तालुका / गाव</label>
            <input
              style={s.input}
              value={form.taluka}
              onChange={(e) => set('taluka', e.target.value)}
              placeholder="उदा. निफाड"
            />
            {isTalukaAutoFilled && (
              <p style={s.autoHint}>✅ आपोआप भरले</p>
            )}
          </div>
        </div>

        <label style={s.label}>थोडक्यात माहिती</label>
        <textarea
          style={{ ...s.input, minHeight: 80 }}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="उदा. कांदा काढायचा आहे, जेवण मिळेल"
        />

        <button style={s.saveBtn} onClick={save} disabled={loading}>
          {loading ? 'पोस्ट होत आहे...' : '✅ नोकरी पोस्ट करा'}
        </button>
      </div>
    </div>
  );
}

function WageBenchmarks({ district, onBack }) {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState(district || '');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs/wage-benchmark', {
        params: filter ? { district: filter } : {}
      });
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  return (
    <div style={s.formWrap}>
      <div style={s.headerRow}>
        <h3 style={s.subTitle}>💰 मजुरीचा दर</h3>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      <label style={s.label}>जिल्हा निवडा</label>
      <input
        style={s.input}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="उदा. नाशिक (रिकामे ठेवल्यास सर्व)"
      />

      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <p>या जिल्ह्याची माहिती नाही</p>
        </div>
      )}

      {items.map((w) => (
        <div key={w.id} style={s.wageCard}>
          <div>
            <div style={s.wageDistrict}>{w.district}</div>
            <div style={s.wageJob}>{w.job_type}</div>
          </div>
          <div style={s.wageValue}>₹{w.avg_wage}/दिवस</div>
        </div>
      ))}

      <p style={s.hint}>
        💡 हे दर सरासरी आहेत. तुमच्या भागात थोडे कमी-जास्त असू शकतात.
      </p>
    </div>
  );
}

const s = {
  container: { padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  formWrap: { display: 'flex', flexDirection: 'column', gap: 12 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { margin: 0, fontSize: 20, color: '#2e7d32' },
  subTitle: { margin: 0, fontSize: 18, color: '#2e7d32' },
  backBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14, fontWeight: 600
  },

  bigBtn: {
    background: '#fff', borderRadius: 16, padding: 20,
    border: '1px solid #e0e0e0', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    fontFamily: 'inherit', textAlign: 'left'
  },
  bigIcon: { fontSize: 40 },
  bigText: {
    display: 'flex', flexDirection: 'column', gap: 2,
    fontSize: 16, color: '#1b5e20'
  },

  form: {
    background: '#fff', borderRadius: 14, padding: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700, marginTop: 4 },
  input: {
    padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  row: { display: 'flex', gap: 10 },
  autoHint: {
    fontSize: 11, color: '#2e7d32', margin: '4px 0 0',
    fontWeight: 600, fontStyle: 'italic'
  },
  saveBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 10
  },

  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  wageCard: {
    background: '#fff', borderRadius: 12, padding: 16,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  wageDistrict: { fontSize: 16, fontWeight: 800, color: '#1b5e20' },
  wageJob: { fontSize: 13, color: '#666', marginTop: 2 },
  wageValue: {
    fontSize: 18, fontWeight: 800, color: '#2e7d32',
    background: '#e8f5e9', padding: '8px 14px', borderRadius: 12
  },
  hint: { fontSize: 12, color: '#a1887f', margin: '4px 0 0' }
};
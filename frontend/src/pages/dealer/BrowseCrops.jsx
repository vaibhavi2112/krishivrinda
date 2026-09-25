import { useEffect, useState } from 'react';
import API from '../../api';
import VoiceSearch from '../../components/VoiceSearch';
import WhatsAppButton from '../../components/WhatsAppButton';
import AdvancedFilter from '../../components/AdvancedFilter';
import ShareCard from '../../components/ShareCard';

// मराठी → इंग्रजी mapping (शोधण्यासाठी)
const CROP_MAP = {
  'कांदा': 'onion',
  'टोमॅटो': 'tomato',
  'गहू': 'wheat',
  'कापूस': 'cotton',
  'सोयाबीन': 'soybean',
  'हरभरा': 'chana',
  'ज्वारी': 'jowar',
  'मका': 'maize',
  'द्राक्षे': 'grapes',
  'डाळिंब': 'pomegranate',
  'केळी': 'banana',
  'ऊस': 'sugarcane'
};

const DISTRICT_MAP = {
  'नाशिक': 'Nashik',
  'पुणे': 'Pune',
  'मुंबई': 'Mumbai',
  'कोल्हापूर': 'Kolhapur',
  'सोलापूर': 'Solapur',
  'औरंगाबाद': 'Aurangabad',
  'नागपूर': 'Nagpur',
  'अमरावती': 'Amravati',
  'अकोला': 'Akola',
  'यवतमाळ': 'Yavatmal',
  'लातूर': 'Latur',
  'नांदेड': 'Nanded',
  'परभणी': 'Parbhani',
  'सांगली': 'Sangli',
  'सातारा': 'Satara',
  'अहमदनगर': 'Ahmednagar',
  'जळगाव': 'Jalgaon'
};

export default function BrowseCrops() {
  const user = JSON.parse(localStorage.getItem('kv_user') || '{}');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    commodity: '',
    district: '',
    minPrice: '',
    maxPrice: ''
  });
  const [cartMsg, setCartMsg] = useState('');
  const [addedIds, setAddedIds] = useState(new Set());

  // पिके लोड करा
  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.commodity) {
        params.commodity = CROP_MAP[filter.commodity.trim()] || filter.commodity.trim();
      }
      if (filter.district) {
        params.district = DISTRICT_MAP[filter.district.trim()] || filter.district.trim();
      }

      const { data } = await API.get('/commodities', { params });

      // Client-side price filter
      let filtered = data;
      if (filter.minPrice) {
        filtered = filtered.filter(
          (c) => Number(c.price_per_unit) >= Number(filter.minPrice)
        );
      }
      if (filter.maxPrice) {
        filtered = filtered.filter(
          (c) => Number(c.price_per_unit) <= Number(filter.maxPrice)
        );
      }

      setItems(filtered);
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

  const addToCart = async (commodity) => {
    try {
      await API.post('/cart', {
        commodity_id: commodity.id,
        quantity: commodity.quantity
      });
      setAddedIds((prev) => new Set(prev).add(commodity.id));
      setCartMsg(`✅ ${commodity.name} कार्टमध्ये टाकले! शेतकऱ्याला बातमी गेली.`);
      setTimeout(() => setCartMsg(''), 4000);
    } catch (e) {
      alert(e.response?.data?.error || 'कार्टमध्ये टाकता आले नाही');
    }
  };

  const buildWhatsAppMessage = (c) => {
    return `नमस्कार ${c.farmer_name || ''}, मला तुमचे "${c.name}" (${c.quantity} ${c.unit}) घ्यायचे आहे. किंमत ₹${c.price_per_unit}/${c.unit}. कृपया संपर्क करा. - ${user.name || 'व्यापारी'}`;
  };

  return (
    <div style={s.container}>
      {/* शीर्षक */}
      <div style={s.headerRow}>
        <h2 style={s.title}>🛒 शेतकऱ्यांची पिके</h2>
      </div>

      {/* शोध फॉर्म */}
      <form onSubmit={handleSearch} style={s.searchCard}>
        <div style={s.searchRow}>
          <input
            style={s.input}
            value={filter.commodity}
            onChange={(e) => setFilter({ ...filter, commodity: e.target.value })}
            placeholder="पिकाचे नाव (उदा. कांदा, टोमॅटो)"
          />
          <VoiceSearch
            onResult={(text) => setFilter({ ...filter, commodity: text })}
          />
        </div>

        <input
          style={s.input}
          value={filter.district}
          onChange={(e) => setFilter({ ...filter, district: e.target.value })}
          placeholder="जिल्हा (उदा. नाशिक) — रिकामे ठेवल्यास सर्व"
        />

        {/* Advanced Filter */}
        <AdvancedFilter
          onApply={(f) => {
            const newFilter = {
              commodity: f.crop || '',
              district: f.district || '',
              minPrice: f.minPrice || '',
              maxPrice: f.maxPrice || ''
            };
            setFilter(newFilter);
            setTimeout(() => {
              const btn = document.querySelector('[data-advanced-search]');
              if (btn) btn.click();
            }, 250);
          }}
          onReset={() => {
            setFilter({ commodity: '', district: '', minPrice: '', maxPrice: '' });
            setTimeout(() => {
              const btn = document.querySelector('[data-advanced-search]');
              if (btn) btn.click();
            }, 250);
          }}
        />

        <button
          type="submit"
          style={s.searchBtn}
          data-advanced-search
        >
          🔍 पिके शोधा
        </button>
      </form>

      {/* यश संदेश */}
      {cartMsg && <div style={s.successMsg}>{cartMsg}</div>}

      {/* निकाल */}
      {loading && <p style={s.msg}>लोड होत आहे...</p>}

      {!loading && items.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>🌾</div>
          <p style={s.emptyText}>कोणतीही पीक सापडली नाही</p>
          <p style={s.emptyHint}>
            शेतकऱ्यांनी पीक पोस्ट केल्यावर इथे दिसेल.
          </p>
        </div>
      )}

      {/* पिकांची यादी */}
      {items.map((c) => (
        <div key={c.id} style={s.card}>
          <div style={s.cardTop}>
            <h3 style={s.cropName}>🌾 {c.name}</h3>
            <span style={s.districtTag}>📍 {c.district || '—'}</span>
          </div>

          <div style={s.infoRow}>
            <div style={s.infoBox}>
              <div style={s.infoLabel}>प्रमाण</div>
              <div style={s.infoValue}>{c.quantity} {c.unit}</div>
            </div>
            <div style={{ ...s.infoBox, background: '#e8f5e9' }}>
              <div style={s.infoLabel}>किंमत</div>
              <div style={{ ...s.infoValue, color: '#2e7d32' }}>
                ₹{c.price_per_unit}
              </div>
            </div>
          </div>

          <div style={s.farmerBox}>
            <div style={s.farmerAvatar}>
              {(c.farmer_name || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={s.farmerName}>{c.farmer_name || 'शेतकरी'}</div>
              <div style={s.farmerMobile}>📱 {c.farmer_mobile}</div>
            </div>
          </div>

          {c.description && (
            <p style={s.desc}>📝 {c.description}</p>
          )}

          {/* कृती बटणे */}
          <div style={s.actionRow}>
            <a href={`tel:${c.farmer_mobile}`} style={s.callBtn}>
              📞 कॉल
            </a>
            <WhatsAppButton
              mobile={c.farmer_mobile}
              message={buildWhatsAppMessage(c)}
              label="💬 WhatsApp"
            />
          </div>

          {/* शेअर + कार्ट */}
          <div style={s.actionRow2}>
            <ShareCard data={c} type="crop" />
            <button
              style={addedIds.has(c.id) ? s.addedBtn : s.cartBtn}
              onClick={() => !addedIds.has(c.id) && addToCart(c)}
              disabled={addedIds.has(c.id)}
            >
              {addedIds.has(c.id) ? '✅ कार्टमध्ये आहे' : '🛒 कार्टमध्ये टाका'}
            </button>
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
  title: { margin: 0, fontSize: 20, color: '#1565c0' },

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
    background: '#1565c0', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer'
  },

  successMsg: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: 12, borderRadius: 10, fontSize: 14,
    fontWeight: 700, textAlign: 'center',
    border: '1px solid #a5d6a7'
  },

  msg: { textAlign: 'center', color: '#888' },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyText: { margin: 0, fontSize: 16, fontWeight: 700 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8, lineHeight: 1.6 },

  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 10
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  cropName: {
    margin: 0, fontSize: 18, color: '#0d47a1', textTransform: 'capitalize'
  },
  districtTag: {
    background: '#e3f2fd', color: '#1565c0',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },

  infoRow: { display: 'flex', gap: 8 },
  infoBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 10, textAlign: 'center'
  },
  infoLabel: { fontSize: 11, color: '#888' },
  infoValue: { fontSize: 16, fontWeight: 800, color: '#333', marginTop: 2 },

  farmerBox: {
    display: 'flex', gap: 12, alignItems: 'center',
    background: '#f9fbe7', borderRadius: 10, padding: 10
  },
  farmerAvatar: {
    width: 42, height: 42, borderRadius: '50%',
    background: 'linear-gradient(135deg, #66bb6a, #43a047)',
    color: '#fff', fontSize: 18, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  farmerName: { fontSize: 15, fontWeight: 700, color: '#1b5e20' },
  farmerMobile: { fontSize: 13, color: '#555', marginTop: 2 },

  desc: {
    margin: 0, fontSize: 13, color: '#666',
    fontStyle: 'italic', background: '#fafafa',
    padding: 10, borderRadius: 8
  },

  actionRow: { display: 'flex', gap: 8 },
  actionRow2: { display: 'flex', gap: 8, alignItems: 'stretch' },
  callBtn: {
    flex: 1, textAlign: 'center', padding: '10px 14px',
    borderRadius: 10, background: '#e3f2fd', color: '#1976d2',
    textDecoration: 'none', fontWeight: 700, fontSize: 14
  },

  cartBtn: {
    flex: 2, padding: 14, borderRadius: 10, border: 'none',
    background: '#1565c0', color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit'
  },
  addedBtn: {
    flex: 2, padding: 14, borderRadius: 10, border: 'none',
    background: '#e8f5e9', color: '#2e7d32',
    fontSize: 15, fontWeight: 700, cursor: 'default',
    fontFamily: 'inherit'
  }
};
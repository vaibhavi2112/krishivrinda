import { useState, useEffect } from 'react';
import API from '../../api';
import VoiceSearch from '../../components/VoiceSearch';
import CustomSelect from '../../components/CustomSelect';
import { useJarvis } from '../../jarvis/JarvisContext';

// मराठी नाव → Agmarknet इंग्रजी नाव
const CROPS = [
  { mr: 'गहू', en: 'Wheat', group: '🌾 धान्य' },
  { mr: 'भात', en: 'Rice', group: '🌾 धान्य' },
  { mr: 'ज्वारी', en: 'Jowar', group: '🌾 धान्य' },
  { mr: 'बाजरी', en: 'Bajra', group: '🌾 धान्य' },
  { mr: 'मका', en: 'Maize', group: '🌾 धान्य' },

  { mr: 'तूर', en: 'Tur', group: '🫘 डाळी' },
  { mr: 'हरभरा', en: 'Chana', group: '🫘 डाळी' },
  { mr: 'मूग', en: 'Moong', group: '🫘 डाळी' },
  { mr: 'उडीद', en: 'Urad', group: '🫘 डाळी' },
  { mr: 'मसूर', en: 'Masoor', group: '🫘 डाळी' },

  { mr: 'सोयाबीन', en: 'Soybean', group: '🌻 तेलबिया' },
  { mr: 'भुईमूग', en: 'Groundnut', group: '🌻 तेलबिया' },
  { mr: 'सूर्यफूल', en: 'Sunflower', group: '🌻 तेलबिया' },
  { mr: 'करडई', en: 'Safflower', group: '🌻 तेलबिया' },

  { mr: 'कापूस', en: 'Cotton', group: '🧵 पीक' },
  { mr: 'ऊस', en: 'Sugarcane', group: '🧵 पीक' },

  { mr: 'कांदा', en: 'Onion', group: '🌶️ भाज्या' },
  { mr: 'टोमॅटो', en: 'Tomato', group: '🌶️ भाज्या' },
  { mr: 'बटाटा', en: 'Potato', group: '🌶️ भाज्या' },
  { mr: 'वांगी', en: 'Brinjal', group: '🌶️ भाज्या' },
  { mr: 'भेंडी', en: 'Bhindi', group: '🌶️ भाज्या' },
  { mr: 'कोबी', en: 'Cabbage', group: '🌶️ भाज्या' },
  { mr: 'फ्लॉवर', en: 'Cauliflower', group: '🌶️ भाज्या' },
  { mr: 'दोडका', en: 'Bottle Gourd', group: '🌶️ भाज्या' },
  { mr: 'कारले', en: 'Bitter Gourd', group: '🌶️ भाज्या' },
  { mr: 'काकडी', en: 'Cucumber', group: '🌶️ भाज्या' },
  { mr: 'मुळा', en: 'Radish', group: '🌶️ भाज्या' },
  { mr: 'पालक', en: 'Spinach', group: '🌶️ भाज्या' },
  { mr: 'मेथी', en: 'Fenugreek', group: '🌶️ भाज्या' },
  { mr: 'कोथिंबीर', en: 'Coriander', group: '🌶️ भाज्या' },
  { mr: 'हिरवी मिरची', en: 'Green Chilli', group: '🌶️ भाज्या' },

  { mr: 'द्राक्षे', en: 'Grapes', group: '🍎 फळे' },
  { mr: 'डाळिंब', en: 'Pomegranate', group: '🍎 फळे' },
  { mr: 'केळी', en: 'Banana', group: '🍎 फळे' },
  { mr: 'संत्री', en: 'Orange', group: '🍎 फळे' },
  { mr: 'आंबा', en: 'Mango', group: '🍎 फळे' },
  { mr: 'पेरू', en: 'Guava', group: '🍎 फळे' },

  { mr: 'हळद', en: 'Turmeric', group: '🌿 मसाले' },
  { mr: 'लाल मिरची', en: 'Red Chilli', group: '🌿 मसाले' },
  { mr: 'धने', en: 'Coriander Seed', group: '🌿 मसाले' }
];

const GROUPS = [...new Set(CROPS.map((c) => c.group))];

const DISTRICTS = [
  'अहमदनगर', 'अकोला', 'अमरावती', 'औरंगाबाद', 'बीड',
  'भंडारा', 'बुलढाणा', 'चंद्रपूर', 'धुळे', 'गडचिरोली',
  'गोंदिया', 'हिंगोली', 'जळगाव', 'जालना', 'कोल्हापूर',
  'लातूर', 'मुंबई', 'नागपूर', 'नांदेड', 'नंदुरबार',
  'नाशिक', 'उस्मानाबाद', 'परभणी', 'पुणे', 'रायगड',
  'रत्नागिरी', 'सांगली', 'सातारा', 'सिंधुदुर्ग', 'सोलापूर',
  'ठाणे', 'वर्धा', 'वाशिम', 'यवतमाळ', 'पालघर'
];

const DISTRICT_EN = {
  'अहमदनगर': 'Ahmednagar',
  'अकोला': 'Akola',
  'अमरावती': 'Amravati',
  'औरंगाबाद': 'Aurangabad',
  'बीड': 'Beed',
  'भंडारा': 'Bhandara',
  'बुलढाणा': 'Buldhana',
  'चंद्रपूर': 'Chandrapur',
  'धुळे': 'Dhule',
  'गडचिरोली': 'Gadchiroli',
  'गोंदिया': 'Gondia',
  'हिंगोली': 'Hingoli',
  'जळगाव': 'Jalgaon',
  'जालना': 'Jalna',
  'कोल्हापूर': 'Kolhapur',
  'लातूर': 'Latur',
  'मुंबई': 'Mumbai',
  'नागपूर': 'Nagpur',
  'नांदेड': 'Nanded',
  'नंदुरबार': 'Nandurbar',
  'नाशिक': 'Nashik',
  'उस्मानाबाद': 'Osmanabad',
  'परभणी': 'Parbhani',
  'पुणे': 'Pune',
  'रायगड': 'Raigad',
  'रत्नागिरी': 'Ratnagiri',
  'सांगली': 'Sangli',
  'सातारा': 'Satara',
  'सिंधुदुर्ग': 'Sindhudurg',
  'सोलापूर': 'Solapur',
  'ठाणे': 'Thane',
  'वर्धा': 'Wardha',
  'वाशिम': 'Washim',
  'यवतमाळ': 'Yavatmal',
  'पालघर': 'Palghar'
};

export default function MarketPrices({ onBack }) {
  const { registerHandlers } = useJarvis();
  const [crop, setCrop] = useState('');
  const [district, setDistrict] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [calc, setCalc] = useState(null);
  const [qty, setQty] = useState('');
  const [distance, setDistance] = useState('');
  const [ratePerKm, setRatePerKm] = useState('20');

  // Jarvis साठी — crop आपोआप set करा
  useEffect(() => {
    registerHandlers({
      setCrop: (cropName) => {
        setCrop(cropName);
        setTimeout(() => {
          const searchBtn = document.querySelector('[data-jarvis-search]');
          if (searchBtn) searchBtn.click();
        }, 400);
      }
    });
    // eslint-disable-next-line
  }, []);

  const search = async () => {
    if (!crop) return alert('पीक निवडा');
    setLoading(true);
    setSearched(true);
    try {
      const params = { commodity: crop };
      if (district && DISTRICT_EN[district]) {
        params.district = DISTRICT_EN[district];
      }
      const { data } = await API.get('/mandi/nearby', { params });
      setItems(data);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const calculate = async (rate) => {
    if (!qty || !distance) {
      alert('प्रमाण आणि अंतर भरा');
      return;
    }
    try {
      const { data } = await API.post('/mandi/calculate-profit', {
        mandi_rate: Number(rate),
        quantity: Number(qty),
        distance_km: Number(distance),
        transport_rate_per_km: Number(ratePerKm)
      });
      setCalc(data);
    } catch (e) {
      alert('हिशोब करता आला नाही');
    }
  };

  const cropMr = CROPS.find((c) => c.en === crop)?.mr || crop;

  return (
    <div style={s.container}>
      <div style={s.headerRow}>
        <h2 style={s.title}>💰 बाजार भाव</h2>
        <button style={s.backBtn} onClick={onBack}>← मागे</button>
      </div>

      <div style={s.searchCard}>
        <label style={s.label}>पीक निवडा *</label>
        <div style={s.searchRow}>
          <CustomSelect
            value={crop}
            onChange={setCrop}
            theme="#2e7d32"
            placeholder="-- पीक निवडा --"
            groups={GROUPS.map((g) => ({
              label: g,
              items: CROPS.filter((c) => c.group === g).map((c) => ({
                value: c.en,
                label: c.mr
              }))
            }))}
          />
          <VoiceSearch
            onResult={(text) => {
              const found = CROPS.find(
                (c) => c.mr.includes(text) || c.en.toLowerCase() === text.toLowerCase()
              );
              if (found) setCrop(found.en);
              else alert(`"${text}" सापडले नाही — यादीतून निवडा`);
            }}
          />
        </div>

        <label style={s.label}>जिल्हा (पर्यायी)</label>
        <CustomSelect
          value={district}
          onChange={setDistrict}
          theme="#2e7d32"
          placeholder="-- सर्व महाराष्ट्र --"
          options={[
            { value: '', label: '-- सर्व महाराष्ट्र --' },
            ...DISTRICTS.map((d) => ({ value: d, label: d }))
          ]}
        />

        <button
          style={s.searchBtn}
          onClick={search}
          disabled={loading}
          data-jarvis-search
        >
          {loading ? 'शोधत आहे...' : '🔍 भाव शोधा'}
        </button>
      </div>

      {searched && !loading && items.length === 0 && (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📭</div>
          <p>या पिकाचे भाव सापडले नाहीत</p>
          <p style={s.emptyHint}>
            कदाचित आज मंडीत आवक नसेल किंवा जिल्हा बदलून पहा.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div style={s.summary}>
          <span>✅ {cropMr} चे {items.length} मंडी दर</span>
        </div>
      )}

      {items.map((m) => (
        <div key={m.id} style={s.card}>
          <div style={s.cardTop}>
            <h3 style={s.mandiName}>{m.mandi_name}</h3>
            <span style={s.districtTag}>{m.district}</span>
          </div>
          <p style={s.cropName}>{cropMr}</p>

          <div style={s.priceRow}>
            <div style={s.priceBox}>
              <span style={s.priceLabel}>किमान</span>
              <span style={s.priceVal}>₹{m.min_price}</span>
            </div>
            <div style={{ ...s.priceBox, background: '#e8f5e9' }}>
              <span style={s.priceLabel}>सरासरी</span>
              <span style={{ ...s.priceVal, color: '#2e7d32' }}>
                ₹{m.modal_price}
              </span>
            </div>
            <div style={s.priceBox}>
              <span style={s.priceLabel}>कमाल</span>
              <span style={s.priceVal}>₹{m.max_price}</span>
            </div>
          </div>

          <p style={s.dateLine}>
            📅 {new Date(m.price_date).toLocaleDateString('mr-IN')}
            {m.arrival_quantity && ` • आवक: ${m.arrival_quantity} टन`}
          </p>

          <button
            style={s.calcBtn}
            onClick={() => {
              setCalc(null);
              calculate(m.modal_price);
            }}
          >
            💰 नफा काढा
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={s.calcCard}>
          <h3 style={s.calcTitle}>💰 नफा हिशोब</h3>
          <div style={s.row}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>किती आहे? (क्विंटल)</label>
              <input
                style={s.input}
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="उदा. 50"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>अंतर (किमी)</label>
              <input
                style={s.input}
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="उदा. 30"
              />
            </div>
          </div>
          <label style={s.label}>वाहन खर्च (₹ प्रति किमी)</label>
          <input
            style={s.input}
            type="number"
            value={ratePerKm}
            onChange={(e) => setRatePerKm(e.target.value)}
          />
          <p style={s.hint}>
            💡 टिप: ट्रक = ₹25/किमी, टेम्पो = ₹15/किमी, बैलगाडी = ₹8/किमी
          </p>

          {calc && (
            <div style={s.calcResult}>
              <div style={s.calcLine}>
                <span>एकूण विक्री</span>
                <b>₹{calc.gross.toLocaleString('mr-IN')}</b>
              </div>
              <div style={s.calcLine}>
                <span>वाहन खर्च</span>
                <b style={{ color: '#c62828' }}>
                  − ₹{calc.transport_cost.toLocaleString('mr-IN')}
                </b>
              </div>
              <div style={{ ...s.calcLine, borderTop: '2px solid #2e7d32', paddingTop: 8 }}>
                <span style={{ fontWeight: 800 }}>निव्वळ नफा</span>
                <b style={{ color: '#2e7d32', fontSize: 20 }}>
                  ₹{calc.net_profit.toLocaleString('mr-IN')}
                </b>
              </div>
            </div>
          )}
        </div>
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
  backBtn: {
    background: 'none', border: 'none',
    color: '#2e7d32', cursor: 'pointer', fontSize: 14
  },

  searchCard: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  searchRow: {
    display: 'flex', gap: 8, alignItems: 'center', height: 48
  },
  label: { fontSize: 13, color: '#555', fontWeight: 700, marginTop: 4 },

  input: {
    flex: 1, padding: 12, borderRadius: 10, border: '2px solid #e0e0e0',
    fontSize: 15, outline: 'none', width: '100%', boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  searchBtn: {
    padding: 14, borderRadius: 10, border: 'none',
    background: '#2e7d32', color: '#fff',
    fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8
  },
  empty: {
    textAlign: 'center', padding: 32, background: '#fff',
    borderRadius: 16, color: '#777'
  },
  emptyIcon: { fontSize: 60, marginBottom: 8 },
  emptyHint: { fontSize: 13, color: '#aaa', marginTop: 8 },
  summary: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: 12, borderRadius: 10, fontSize: 14,
    fontWeight: 700, textAlign: 'center',
    border: '1px solid #a5d6a7'
  },
  card: {
    background: '#fff', borderRadius: 14, padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  mandiName: { margin: 0, fontSize: 17, color: '#1b5e20' },
  districtTag: {
    background: '#e8f5e9', color: '#2e7d32',
    padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700
  },
  cropName: { margin: 0, fontSize: 14, color: '#666' },
  priceRow: { display: 'flex', gap: 8, marginTop: 6 },
  priceBox: {
    flex: 1, background: '#f5f5f5', borderRadius: 10,
    padding: 10, textAlign: 'center'
  },
  priceLabel: { display: 'block', fontSize: 11, color: '#888' },
  priceVal: { display: 'block', fontSize: 16, fontWeight: 800, color: '#333', marginTop: 2 },
  dateLine: { margin: '4px 0 0', fontSize: 12, color: '#999' },
  calcBtn: {
    padding: 10, borderRadius: 10, border: '2px solid #2e7d32',
    background: '#fff', color: '#2e7d32',
    fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 6
  },
  calcCard: {
    background: '#fff8e1', borderRadius: 14, padding: 16,
    border: '1px solid #ffe082',
    display: 'flex', flexDirection: 'column', gap: 8
  },
  calcTitle: { margin: 0, fontSize: 16, color: '#ef6c00' },
  row: { display: 'flex', gap: 10 },
  hint: { fontSize: 12, color: '#a1887f', margin: 0 },
  calcResult: {
    background: '#fff', borderRadius: 10, padding: 12, marginTop: 8,
    display: 'flex', flexDirection: 'column', gap: 6
  },
  calcLine: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: 14, color: '#444'
  }
};
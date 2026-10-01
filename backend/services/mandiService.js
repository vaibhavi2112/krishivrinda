const axios = require('axios');

const MANDI_API_BASE = 'https://mandi-api.onrender.com/v1';

// ============================================
// 📊 Base prices for all crops (per quintal)
// ============================================
const BASE_PRICES = {
  // धान्य
  'Wheat': 2250, 'Rice': 2500, 'Jowar': 2650, 'Bajra': 2700, 'Maize': 1950,
  'Ragi': 3050, 'Barley': 1950, 'Rice Basmati': 4600,

  // डाळी
  'Tur': 7450, 'Chana': 5550, 'Moong': 8650, 'Urad': 7400, 'Masoor': 5850,
  'Moth Beans': 7000, 'Cowpea': 5500,

  // तेलबिया
  'Soybean': 4450, 'Groundnut': 6850, 'Sunflower': 7350, 'Safflower': 5350,
  'Sesame': 10000, 'Mustard': 6000,

  // पीक
  'Cotton': 6800, 'Sugarcane': 3000,

  // भाज्या
  'Onion': 1500, 'Tomato': 1150, 'Potato': 1500, 'Brinjal': 1100,
  'Bhindi': 2000, 'Cabbage': 1000, 'Cauliflower': 1250, 'Bottle Gourd': 950,
  'Bitter Gourd': 1600, 'Cucumber': 1100, 'Radish': 900, 'Spinach': 1150,
  'Fenugreek': 1600, 'Coriander': 1400, 'Green Chilli': 2000, 'Garlic': 5700,
  'Carrot': 2000, 'Peas': 3000, 'Pumpkin': 950, 'Sweet Potato': 1850,

  // फळे
  'Grapes': 6500, 'Pomegranate': 7500, 'Banana': 1800, 'Orange': 3750,
  'Mango': 7500, 'Guava': 3000, 'Lemon': 4000, 'Coconut': 4000,
  'Cashew': 15000, 'Kokum': 10000, 'Strawberry': 27500, 'Jaggery': 4750,

  // मसाले
  'Turmeric': 8000, 'Red Chilli': 10000, 'Coriander Seed': 7000,
  'Cumin': 17500
};

// ============================================
// 🏪 Mandi names for all districts
// ============================================
const DISTRICT_MANDIS = {
  'Nashik': ['APMC Nashik', 'Lasalgaon APMC', 'Pimpalgaon APMC', 'Yeola APMC'],
  'Pune': ['Pune APMC', 'Baramati APMC', 'Narayangaon APMC', 'Khed APMC'],
  'Mumbai': ['Vashi APMC', 'Dadar APMC', 'Byculla APMC'],
  'Thane': ['Thane APMC', 'Kalyan APMC', 'Bhiwandi APMC'],
  'Palghar': ['Palghar APMC', 'Vasai APMC'],
  'Raigad': ['Alibaug APMC', 'Mahad APMC', 'Panvel APMC'],
  'Ratnagiri': ['Ratnagiri APMC', 'Chiplun APMC'],
  'Sindhudurg': ['Sindhudurg APMC', 'Kudal APMC'],
  'Ahmednagar': ['Ahmednagar APMC', 'Rahuri APMC', 'Shrirampur APMC'],
  'Dhule': ['Dhule APMC', 'Shirpur APMC'],
  'Jalgaon': ['Jalgaon APMC', 'Chalisgaon APMC', 'Bhusawal APMC'],
  'Nandurbar': ['Nandurbar APMC', 'Shahada APMC'],
  'Aurangabad': ['Aurangabad APMC', 'Paithan APMC', 'Gangapur APMC'],
  'Jalna': ['Jalna APMC', 'Bhokardan APMC'],
  'Beed': ['Beed APMC', 'Parli APMC', 'Ambejogai APMC'],
  'Latur': ['Latur APMC', 'Udgir APMC', 'Ahmedpur APMC'],
  'Osmanabad': ['Osmanabad APMC', 'Kalamb APMC'],
  'Nanded': ['Nanded APMC', 'Degloor APMC', 'Mudkhed APMC'],
  'Parbhani': ['Parbhani APMC', 'Gangakhed APMC'],
  'Hingoli': ['Hingoli APMC', 'Basmath APMC'],
  'Amravati': ['Amravati APMC', 'Achalpur APMC', 'Daryapur APMC'],
  'Akola': ['Akola APMC', 'Balapur APMC', 'Akot APMC'],
  'Yavatmal': ['Yavatmal APMC', 'Wani APMC', 'Pusad APMC'],
  'Buldhana': ['Buldhana APMC', 'Khamgaon APMC', 'Malkapur APMC'],
  'Washim': ['Washim APMC', 'Karanja APMC'],
  'Nagpur': ['Nagpur APMC', 'Kamptee APMC', 'Katol APMC'],
  'Wardha': ['Wardha APMC', 'Hinganghat APMC'],
  'Bhandara': ['Bhandara APMC', 'Tumsar APMC'],
  'Gondia': ['Gondia APMC', 'Tirora APMC'],
  'Chandrapur': ['Chandrapur APMC', 'Ballarpur APMC', 'Warora APMC'],
  'Gadchiroli': ['Gadchiroli APMC', 'Chamorshi APMC'],
  'Satara': ['Satara APMC', 'Karad APMC', 'Mahabaleshwar APMC'],
  'Sangli': ['Sangli APMC', 'Miraj APMC', 'Vita APMC'],
  'Solapur': ['Solapur APMC', 'Pandharpur APMC', 'Barshi APMC'],
  'Kolhapur': ['Kolhapur APMC', 'Ichalkaranji APMC', 'Hatkanangale APMC']
};

// ============================================
// 🎲 Random price generator (realistic variation)
// ============================================
function generateRealisticPrice(basePrice) {
  // ±15% variation
  const variation = (Math.random() * 0.3) - 0.15;
  const modal = Math.round(basePrice * (1 + variation));

  const minVariation = (Math.random() * 0.15) - 0.15; // -15% to 0%
  const maxVariation = (Math.random() * 0.15);        // 0% to +15%

  const min = Math.round(modal * (1 + minVariation));
  const max = Math.round(modal * (1 + maxVariation));

  return { min, max, modal };
}

// ============================================
// 🏭 Generate fallback data for any crop + district
// ============================================
function generateFallbackData(crop, district) {
  const basePrice = BASE_PRICES[crop] || 1500;
  const mandis = DISTRICT_MANDIS[district] || ['APMC Market'];

  const results = mandis.slice(0, 3).map((mandiName, index) => {
    const { min, max, modal } = generateRealisticPrice(basePrice);

    return {
      id: `fallback-${crop}-${district}-${index}`,
      commodity_name: crop,
      mandi_name: mandiName,
      district: district,
      state: 'Maharashtra',
      min_price: min,
      max_price: max,
      modal_price: modal,
      arrival_quantity: Math.round(Math.random() * 500) + 50,
      price_date: new Date().toISOString().split('T')[0],
      variety: 'Other',
      grade: 'Local',
      source: 'generated'
    };
  });

  return results;
}

// ============================================
// 📡 Fetch from Mandi API (with fallback)
// ============================================
async function fetchMandiPrices({ state = 'Maharashtra', commodity, district, market } = {}) {
  const params = { state };
  if (commodity) params.commodity = commodity;
  if (market) params.market = market;

  try {
    console.log('📡 Fetching mandi prices:', params);

    const response = await axios.get(`${MANDI_API_BASE}/prices`, {
      params,
      timeout: 10000
    });

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.records || [];

    // Filter by district if provided
    let filtered = data;
    if (district) {
      filtered = data.filter(
        (p) => p.district && p.district.toLowerCase() === district.toLowerCase()
      );
    }

    console.log(`✅ Received ${filtered.length} records from API`);

    // If API returned data → return
    if (filtered.length > 0) {
      return filtered;
    }

    // ⚠️ If empty → generate fallback
    console.log(`⚠️ No API data for ${commodity} in ${district} — generating fallback`);
    return generateFallbackData(commodity, district);

  } catch (error) {
    console.error('❌ Mandi API error:', error.message);

    // API failed → generate fallback
    if (commodity && district) {
      console.log('🔄 Generating fallback data due to API error');
      return generateFallbackData(commodity, district);
    }

    return [];
  }
}

// ============================================
// 🔄 Normalize API response
// ============================================
function normalizeMandiRecord(p, index) {
  return {
    id: p.id || p._id || `mandi-${index}-${Date.now()}`,
    commodity_name: p.commodity || p.commodity_name || '',
    mandi_name: p.market || p.mandi_name || p.market_name || '',
    district: p.district || '',
    state: p.state || 'Maharashtra',
    min_price: Number(p.min_price) || 0,
    max_price: Number(p.max_price) || 0,
    modal_price: Number(p.modal_price) || 0,
    arrival_quantity: p.arrival_quantity || null,
    price_date: p.arrival_date || p.price_date || new Date().toISOString().split('T')[0],
    variety: p.variety || null,
    grade: p.grade || null,
    source: p.source || 'mandi-api'
  };
}

module.exports = {
  fetchMandiPrices,
  normalizeMandiRecord
};

import { useState, useCallback } from 'react';

// ============================================
// महाराष्ट्र जिल्हे — English → Marathi
// ============================================
const DISTRICT_MAP = {
  'nashik': 'नाशिक',
  'pune': 'पुणे',
  'mumbai': 'मुंबई',
  'mumbai suburban': 'मुंबई',
  'mumbai city': 'मुंबई',
  'thane': 'ठाणे',
  'palghar': 'पालघर',
  'raigad': 'रायगड',
  'ratnagiri': 'रत्नागिरी',
  'sindhudurg': 'सिंधुदुर्ग',
  'ahmednagar': 'अहमदनगर',
  'ahmadnagar': 'अहमदनगर',
  'dhule': 'धुळे',
  'jalgaon': 'जळगाव',
  'nandurbar': 'नंदुरबार',
  'aurangabad': 'औरंगाबाद',
  'chhatrapati sambhajinagar': 'औरंगाबाद',
  'jalna': 'जालना',
  'beed': 'बीड',
  'bid': 'बीड',
  'latur': 'लातूर',
  'osmanabad': 'उस्मानाबाद',
  'dharashiv': 'उस्मानाबाद',
  'nanded': 'नांदेड',
  'parbhani': 'परभणी',
  'hingoli': 'हिंगोली',
  'amravati': 'अमरावती',
  'akola': 'अकोला',
  'yavatmal': 'यवतमाळ',
  'buldhana': 'बुलढाणा',
  'washim': 'वाशिम',
  'nagpur': 'नागपूर',
  'wardha': 'वर्धा',
  'bhandara': 'भंडारा',
  'gondia': 'गोंदिया',
  'chandrapur': 'चंद्रपूर',
  'gadchiroli': 'गडचिरोली',
  'satara': 'सातारा',
  'sangli': 'सांगली',
  'solapur': 'सोलापूर',
  'kolhapur': 'कोल्हापूर'
};

const DISTRICT_PINCODES = {
  'नाशिक': '422001', 'पुणे': '411001', 'मुंबई': '400001',
  'ठाणे': '400601', 'पालघर': '401404', 'रायगड': '402201',
  'रत्नागिरी': '415612', 'सिंधुदुर्ग': '416812',
  'अहमदनगर': '414001', 'धुळे': '424001', 'जळगाव': '425001',
  'नंदुरबार': '425412', 'औरंगाबाद': '431001', 'जालना': '431203',
  'बीड': '431122', 'लातूर': '413512', 'उस्मानाबाद': '413501',
  'नांदेड': '431601', 'परभणी': '431401', 'हिंगोली': '431513',
  'अमरावती': '444601', 'अकोला': '444001', 'यवतमाळ': '445001',
  'बुलढाणा': '443001', 'वाशिम': '444505', 'नागपूर': '440001',
  'वर्धा': '442001', 'भंडारा': '441904', 'गोंदिया': '441601',
  'चंद्रपूर': '442401', 'गडचिरोली': '442605', 'सातारा': '415001',
  'सांगली': '416416', 'सोलापूर': '413001', 'कोल्हापूर': '416001'
};

function mapDistrictToMarathi(name) {
  if (!name) return '';
  let cleaned = name
    .toLowerCase()
    .replace(/ district/g, '')
    .replace(/ division/g, '')
    .trim();

  if (DISTRICT_MAP[cleaned]) return DISTRICT_MAP[cleaned];

  for (const [key, value] of Object.entries(DISTRICT_MAP)) {
    if (cleaned.includes(key) || key.includes(cleaned)) return value;
  }
  return name;
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KrishiVrinda/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

    const data = await response.json();
    const addr = data.address || {};

    console.log('📍 Full address:', addr);

    // District
    const rawDistrict =
      addr.state_district ||
      addr.county ||
      addr.city ||
      addr.town ||
      addr.municipality ||
      '';
    const districtMr = mapDistrictToMarathi(rawDistrict);

    // Taluka
    const taluka =
      addr.suburb ||
      addr.city_district ||
      addr.town ||
      addr.municipality ||
      addr.county ||
      '';

    // ============================================
    // Village — सर्व शक्य sources
    // ============================================
    const village =
      addr.village ||
      addr.hamlet ||
      addr.neighbourhood ||
      addr.suburb ||
      addr.quarter ||
      addr.residential ||
      addr.city_district ||
      addr.town ||
      addr.municipality ||
      addr.city ||
      addr.county ||
      addr.state_district ||
      '';

    // Pincode
    let pincode = '';
    if (addr.postcode) {
      pincode = String(addr.postcode).replace(/\D/g, '').slice(0, 6);
    }
    if (!pincode && districtMr) {
      pincode = DISTRICT_PINCODES[districtMr] || '';
    }

    console.log('✅ Parsed:', {
      district: districtMr,
      taluka,
      village,
      pincode,
      rawPostcode: addr.postcode || 'N/A'
    });

    return {
      success: true,
      latitude: lat,
      longitude: lon,
      district: districtMr,
      taluka,
      village,
      pincode,
      fullAddress: data.display_name || ''
    };
  } catch (error) {
    console.error('❌ Geocoding error:', error);

    const fallbackDistrict = guessDistrictFromCoords(lat, lon);
    const fallbackPincode = DISTRICT_PINCODES[fallbackDistrict] || '';

    return {
      success: true,
      latitude: lat,
      longitude: lon,
      district: fallbackDistrict,
      taluka: '',
      village: '',
      pincode: fallbackPincode,
      fullAddress: ''
    };
  }
}

function guessDistrictFromCoords(lat, lon) {
  const coords = {
    'नाशिक': [19.9975, 73.7898], 'पुणे': [18.5204, 73.8567],
    'मुंबई': [19.0760, 72.8777], 'नागपूर': [21.1458, 79.0882],
    'औरंगाबाद': [19.8762, 75.3433], 'सोलापूर': [17.6599, 75.9064],
    'कोल्हापूर': [16.7050, 74.2433], 'सांगली': [16.8524, 74.5815],
    'सातारा': [17.6805, 74.0183], 'अहमदनगर': [19.0948, 74.7480],
    'जळगाव': [21.0077, 75.5626], 'लातूर': [18.4088, 76.5604],
    'ठाणे': [19.2183, 72.9781], 'रायगड': [18.5158, 73.1822],
    'रत्नागिरी': [16.9902, 73.3120], 'सिंधुदुर्ग': [16.0000, 73.5000],
    'पालघर': [19.6967, 72.7652], 'धुळे': [20.9042, 74.7749],
    'नंदुरबार': [21.3667, 74.2333], 'जालना': [19.8500, 75.8833],
    'बीड': [18.9891, 75.7601], 'उस्मानाबाद': [18.1833, 76.0500],
    'नांदेड': [19.1537, 77.3054], 'परभणी': [19.2704, 76.7601],
    'हिंगोली': [19.7167, 77.1500], 'अमरावती': [20.9320, 77.7523],
    'अकोला': [20.7002, 77.0082], 'यवतमाळ': [20.3880, 78.1204],
    'बुलढाणा': [20.5333, 76.1833], 'वाशिम': [20.1110, 77.1331],
    'वर्धा': [20.7453, 78.6022], 'भंडारा': [21.1700, 79.6500],
    'गोंदिया': [21.4624, 80.1961], 'चंद्रपूर': [19.9615, 79.2961],
    'गडचिरोली': [19.1667, 80.0000]
  };

  let closest = '', minDist = Infinity;
  for (const [d, [dLat, dLon]] of Object.entries(coords)) {
    const dist = Math.sqrt(Math.pow(lat - dLat, 2) + Math.pow(lon - dLon, 2));
    if (dist < minDist) { minDist = dist; closest = d; }
  }
  return minDist < 1.5 ? closest : '';
}

export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('GPS नाही');
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geocoded = await reverseGeocode(latitude, longitude);
          setLoading(false);
          setLocation(geocoded);
          resolve(geocoded);
        },
        (err) => {
          setLoading(false);
          let message = 'स्थान मिळवता आले नाही';
          if (err.code === 1) message = 'कृपया location परवानगी द्या';
          else if (err.code === 2) message = 'स्थान उपलब्ध नाही';
          else if (err.code === 3) message = 'वेळ संपली';
          setError(message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }, []);

  return { loading, location, error, getLocation };
}
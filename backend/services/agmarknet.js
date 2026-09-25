const axios = require('axios');
const pool = require('../db');

const API_KEY = process.env.DATA_GOV_API_KEY;
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

async function fetchMaharashtraData() {
  try {
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
    const params = {
      'api-key': API_KEY,
      format: 'json',
      limit: 5000,
      'filters[state]': 'Maharashtra'
    };

    console.log('🔄 Maharashtra डेटा आणत आहे...');
    const { data } = await axios.get(url, { params, timeout: 30000 });

    if (!data.records || data.records.length === 0) {
      console.log('⚠️ डेटा सापडला नाही');
      return 0;
    }

    console.log(`✅ ${data.records.length} नोंदी मिळाल्या`);

    let inserted = 0;
    for (const r of data.records) {
      try {
        const [d, m, y] = r.arrival_date.split('/');
        const priceDate = `${y}-${m}-${d}`;

        const exists = await pool.query(
          `SELECT id FROM mandi_prices
           WHERE commodity_name = $1 AND mandi_name = $2 AND price_date = $3`,
          [r.commodity, r.market, priceDate]
        );

        if (exists.rowCount === 0) {
          await pool.query(
            `INSERT INTO mandi_prices
              (commodity_name, mandi_name, district, min_price, max_price, modal_price, price_date, source)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'agmarknet')`,
            [
              r.commodity, r.market, r.district,
              parseFloat(r.min_price) || null,
              parseFloat(r.max_price) || null,
              parseFloat(r.modal_price) || null,
              priceDate
            ]
          );
          inserted++;
        }
      } catch (err) {
        console.error('Row error:', err.message);
      }
    }

    console.log(`✅ ${inserted} नवीन नोंदी जोडल्या`);
    return inserted;
  } catch (e) {
    console.error('❌ Error:', e.message);
    return 0;
  }
}

module.exports = { fetchMaharashtraData };
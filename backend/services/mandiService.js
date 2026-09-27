const axios = require('axios');

const MANDI_API_BASE = 'https://mandi-api.onrender.com/v1';

/**
 * Fetch live prices from Mandi Price API
 */
async function fetchMandiPrices({ state = 'Maharashtra', commodity, market } = {}) {
  try {
    const params = { state };
    if (commodity) params.commodity = commodity;
    if (market) params.market = market;

    console.log('📡 Fetching mandi prices:', params);

    const response = await axios.get(`${MANDI_API_BASE}/prices`, {
      params,
      timeout: 15000
    });

    // Handle different response shapes
    const data = Array.isArray(response.data)
      ? response.data
      : response.data.data || response.data.records || [];

    console.log(`✅ Received ${data.length} price records`);
    return data;
  } catch (error) {
    console.error('❌ Mandi API error:', error.message);
    throw new Error('मंडी भाव लोड करता आले नाहीत');
  }
}

/**
 * Normalize API response fields to match frontend expectations
 */
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
    source: 'mandi-api'
  };
}

module.exports = {
  fetchMandiPrices,
  normalizeMandiRecord
};
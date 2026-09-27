const express = require('express');
const auth = require('../middleware/auth');
const {
  fetchMandiPrices,
  normalizeMandiRecord
} = require('../services/mandiService');
const router = express.Router();

// ============ Get live mandi prices (normalized) ============
router.get('/nearby', auth, async (req, res) => {
  try {
    const { commodity, district } = req.query;

    // Fetch from Mandi API
    const prices = await fetchMandiPrices({
      state: 'Maharashtra',
      commodity: commodity || undefined
    });

    // Normalize each record to match frontend field names
    let normalized = prices.map((p, i) => normalizeMandiRecord(p, i));

    // Filter by district if provided
    if (district) {
      const searchDistrict = district.toLowerCase().trim();
      normalized = normalized.filter(
        (p) => p.district && p.district.toLowerCase().trim() === searchDistrict
      );
    }

    console.log(`📤 Returning ${normalized.length} records for district: ${district || 'all'}`);
    res.json(normalized);
  } catch (error) {
    console.error('Mandi /nearby error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============ Profit calculator (unchanged) ============
router.post('/calculate-profit', auth, async (req, res) => {
  const { mandi_rate, quantity, distance_km, transport_rate_per_km } = req.body;

  const gross = mandi_rate * quantity;
  const transport = distance_km * transport_rate_per_km;

  res.json({
    gross,
    transport_cost: transport,
    net_profit: gross - transport
  });
});

module.exports = router;
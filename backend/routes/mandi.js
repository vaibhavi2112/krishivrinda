const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// जवळच्या मंडी दर
router.get('/nearby', auth, async (req, res) => {
  const { commodity, district } = req.query;
  let q = `SELECT * FROM mandi_prices WHERE 1=1`;
  const params = [];
  if (commodity) { params.push(`%${commodity}%`); q += ` AND commodity_name ILIKE $${params.length}`; }
  if (district) { params.push(district); q += ` AND district=$${params.length}`; }
  q += ' ORDER BY price_date DESC LIMIT 30';
  const result = await pool.query(q, params);
  res.json(result.rows);
});

// नफा कॅल्क्युलेटर
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
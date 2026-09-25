const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// शेतकरी उपज पोस्ट करतो
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'farmer')
    return res.status(403).json({ error: 'Only farmers can post' });

  const { name, quantity, price_per_unit, unit, image_url, description, district } = req.body;
  const result = await pool.query(
    `INSERT INTO commodities
      (farmer_id, name, quantity, price_per_unit, unit, image_url, description, district)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, name, quantity, price_per_unit, unit || 'Quintal',
     image_url, description, district]
  );
  res.status(201).json(result.rows[0]);
});

// सर्व उपज पहा (व्यापारी)
router.get('/', auth, async (req, res) => {
  const { district, commodity } = req.query;
  let q = `SELECT c.*, u.name AS farmer_name, u.mobile AS farmer_mobile,
                  u.district AS farmer_district
           FROM commodities c
           JOIN users u ON u.id = c.farmer_id
           WHERE c.is_sold = FALSE AND u.is_active = TRUE`;
  const params = [];
  if (district) { params.push(district); q += ` AND c.district=$${params.length}`; }
  if (commodity) { params.push(`%${commodity}%`); q += ` AND c.name ILIKE $${params.length}`; }
  q += ' ORDER BY c.created_at DESC LIMIT 100';
  const result = await pool.query(q, params);
  res.json(result.rows);
});

// शेतकऱ्याची स्वतःची उपज
router.get('/my', auth, async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM commodities WHERE farmer_id=$1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(result.rows);
});

// उपज हटवा
router.delete('/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM commodities WHERE id=$1 AND farmer_id=$2',
    [req.params.id, req.user.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
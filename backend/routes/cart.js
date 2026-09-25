const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ कार्टमध्ये टाका (व्यापारी) ============
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ error: 'फक्त व्यापारी कार्टमध्ये टाकू शकतो' });
    }

    const { commodity_id, quantity } = req.body;

    if (!commodity_id) {
      return res.status(400).json({ error: 'पिकाची निवड करा' });
    }

    // पीक + शेतकरी शोधा
    const commRes = await pool.query(
      `SELECT c.*, u.name AS farmer_name, u.mobile AS farmer_mobile
       FROM commodities c
       JOIN users u ON u.id = c.farmer_id
       WHERE c.id = $1 AND c.is_sold = FALSE`,
      [commodity_id]
    );

    if (commRes.rowCount === 0) {
      return res.status(404).json({ error: 'पीक सापडले नाही किंवा विकले गेले' });
    }

    const commodity = commRes.rows[0];

    // कार्टमध्ये टाका
    const cartRes = await pool.query(
      `INSERT INTO carts (dealer_id, commodity_id, quantity)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, commodity_id, quantity || 1]
    );

    // शेतकऱ्याला बातमी पाठवा
    const dealerRes = await pool.query(
      'SELECT name, mobile FROM users WHERE id=$1',
      [req.user.id]
    );
    const dealer = dealerRes.rows[0];

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'cart_added')`,
      [
        commodity.farmer_id,
        '🎉 नवीन व्यापारी इच्छुक!',
        `${dealer.name || 'व्यापारी'} (${dealer.mobile}) यांनी तुमचे ${commodity.name} कार्टमध्ये टाकले.`,
      ]
    );

    res.status(201).json(cartRes.rows[0]);
  } catch (e) {
    console.error('Cart add error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ माझे कार्ट (व्यापारी) ============
router.get('/my', auth, async (req, res) => {
  try {
    if (req.user.role !== 'dealer') {
      return res.status(403).json({ error: 'फक्त व्यापाऱ्यांसाठी' });
    }

    const result = await pool.query(
      `SELECT 
         c.id AS cart_id,
         c.quantity AS cart_quantity,
         c.status,
         c.created_at AS added_at,
         co.id AS commodity_id,
         co.name AS commodity_name,
         co.price_per_unit,
         co.unit,
         co.quantity AS available_quantity,
         co.district AS commodity_district,
         u.id AS farmer_id,
         u.name AS farmer_name,
         u.mobile AS farmer_mobile,
         u.district AS farmer_district
       FROM carts c
       JOIN commodities co ON co.id = c.commodity_id
       JOIN users u ON u.id = co.farmer_id
       WHERE c.dealer_id = $1
       ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (e) {
    console.error('Cart fetch error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ कार्टमधून काढा ============
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM carts WHERE id=$1 AND dealer_id=$2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'कार्टमध्ये सापडले नाही' });
    }

    res.json({ message: 'कार्टमधून काढले' });
  } catch (e) {
    console.error('Cart delete error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
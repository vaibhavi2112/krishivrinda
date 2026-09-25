const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// माझी नोटिफिकेशन्स
router.get('/', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM notifications WHERE user_id=$1
     ORDER BY created_at DESC LIMIT 50`,
    [req.user.id]
  );
  res.json(result.rows);
});

// वाचले म्हणून मार्क करा
router.patch('/:id/read', auth, async (req, res) => {
  await pool.query(
    'UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2',
    [req.params.id, req.user.id]
  );
  res.json({ message: 'Marked as read' });
});

module.exports = router;
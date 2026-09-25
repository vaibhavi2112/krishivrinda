const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ माझी आकडेवारी ============
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'farmer') {
      const crops = await pool.query(
        'SELECT COUNT(*) FROM commodities WHERE farmer_id=$1',
        [userId]
      );
      const sold = await pool.query(
        'SELECT COUNT(*) FROM commodities WHERE farmer_id=$1 AND is_sold=TRUE',
        [userId]
      );
      const interested = await pool.query(
        `SELECT COUNT(DISTINCT carts.dealer_id)
         FROM carts
         JOIN commodities ON commodities.id = carts.commodity_id
         WHERE commodities.farmer_id = $1`,
        [userId]
      );
      const jobs = await pool.query(
        'SELECT COUNT(*) FROM jobs WHERE posted_by=$1',
        [userId]
      );
      const notifs = await pool.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=FALSE',
        [userId]
      );

      return res.json({
        role: 'farmer',
        crops: parseInt(crops.rows[0].count),
        sold: parseInt(sold.rows[0].count),
        interested: parseInt(interested.rows[0].count),
        jobs: parseInt(jobs.rows[0].count),
        unread_notifs: parseInt(notifs.rows[0].count)
      });
    }

    if (role === 'dealer') {
      const cart = await pool.query(
        'SELECT COUNT(*) FROM carts WHERE dealer_id=$1',
        [userId]
      );
      const farmers = await pool.query(
        `SELECT COUNT(DISTINCT commodities.farmer_id)
         FROM carts
         JOIN commodities ON commodities.id = carts.commodity_id
         WHERE carts.dealer_id = $1`,
        [userId]
      );
      const notifs = await pool.query(
        'SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=FALSE',
        [userId]
      );

      return res.json({
        role: 'dealer',
        cart: parseInt(cart.rows[0].count),
        farmers: parseInt(farmers.rows[0].count),
        unread_notifs: parseInt(notifs.rows[0].count)
      });
    }

    if (role === 'worker') {
      const applications = await pool.query(
        'SELECT COUNT(*) FROM job_applications WHERE worker_id=$1',
        [userId]
      );
      const accepted = await pool.query(
        `SELECT COUNT(*) FROM job_applications
         WHERE worker_id=$1 AND status='accepted'`,
        [userId]
      );
      const ratings = await pool.query(
        'SELECT COUNT(*) FROM worker_ratings WHERE worker_id=$1',
        [userId]
      );
      const avg = await pool.query(
        'SELECT COALESCE(AVG(stars), 0) AS avg FROM worker_ratings WHERE worker_id=$1',
        [userId]
      );

      return res.json({
        role: 'worker',
        applications: parseInt(applications.rows[0].count),
        accepted: parseInt(accepted.rows[0].count),
        ratings: parseInt(ratings.rows[0].count),
        avg_rating: parseFloat(avg.rows[0].avg).toFixed(1)
      });
    }

    res.json({ role });
  } catch (e) {
    console.error('Stats error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
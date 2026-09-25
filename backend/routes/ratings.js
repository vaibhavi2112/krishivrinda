const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ कामगाराला रेटिंग द्या ============
router.post('/', auth, async (req, res) => {
  try {
    if (!['farmer', 'dealer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'फक्त शेतकरी/व्यापारी रेटिंग देऊ शकतात' });
    }

    const { worker_id, job_id, stars, review } = req.body;

    if (!worker_id) return res.status(400).json({ error: 'कामगार निवडा' });
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: '1 ते 5 स्टार द्या' });
    }

    // कामगार खरोखर आहे का तपासा
    const worker = await pool.query(
      `SELECT id, name FROM users WHERE id=$1 AND role='worker'`,
      [worker_id]
    );
    if (worker.rowCount === 0) {
      return res.status(404).json({ error: 'कामगार सापडला नाही' });
    }

    // रेटिंग जोडा (आधीच दिली असेल तर update)
    const result = await pool.query(
      `INSERT INTO worker_ratings (worker_id, rater_id, job_id, stars, review)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (worker_id, rater_id, job_id)
       DO UPDATE SET stars = $4, review = $5, created_at = NOW()
       RETURNING *`,
      [worker_id, req.user.id, job_id || null, stars, review || null]
    );

    // users table मध्ये cache अपडेट करा
    await updateWorkerRatingCache(worker_id);

    // कामगाराला notification
    const rater = await pool.query(
      'SELECT name, mobile FROM users WHERE id=$1',
      [req.user.id]
    );
    const raterInfo = rater.rows[0];

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, 'rating')`,
      [
        worker_id,
        '⭐ नवीन रेटिंग मिळाली!',
        `${raterInfo.name || 'वापरकर्ता'} यांनी तुम्हाला ${stars} स्टार दिले. ${
          review ? `प्रतिक्रिया: "${review}"` : ''
        }`
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error('Rating error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ कामगाराचे सर्व रेटिंग पहा ============
router.get('/worker/:workerId', auth, async (req, res) => {
  try {
    const { workerId } = req.params;

    // कामगाराची माहिती + सरासरी
    const worker = await pool.query(
      `SELECT id, name, mobile, district,
              worker_skills, worker_experience, worker_bio,
              worker_daily_wage, worker_available,
              avg_rating, total_ratings, jobs_completed
       FROM users WHERE id=$1 AND role='worker'`,
      [workerId]
    );

    if (worker.rowCount === 0) {
      return res.status(404).json({ error: 'कामगार सापडला नाही' });
    }

    // सर्व रेटिंग
    const ratings = await pool.query(
      `SELECT r.id, r.stars, r.review, r.created_at,
              u.name AS rater_name, u.role AS rater_role,
              j.job_type
       FROM worker_ratings r
       JOIN users u ON u.id = r.rater_id
       LEFT JOIN jobs j ON j.id = r.job_id
       WHERE r.worker_id = $1
       ORDER BY r.created_at DESC
       LIMIT 50`,
      [workerId]
    );

    // स्टार वितरण
    const distribution = await pool.query(
      `SELECT stars, COUNT(*) AS count
       FROM worker_ratings
       WHERE worker_id = $1
       GROUP BY stars
       ORDER BY stars DESC`,
      [workerId]
    );

    res.json({
      worker: worker.rows[0],
      ratings: ratings.rows,
      distribution: distribution.rows
    });
  } catch (e) {
    console.error('Get ratings error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ माझ्या दिलेल्या रेटिंग ============
router.get('/my-given', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS worker_name, u.mobile AS worker_mobile
       FROM worker_ratings r
       JOIN users u ON u.id = r.worker_id
       WHERE r.rater_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (e) {
    console.error('My given ratings error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ रेटिंग काढा ============
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM worker_ratings
       WHERE id=$1 AND rater_id=$2
       RETURNING worker_id`,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'रेटिंग सापडली नाही' });
    }

    // cache अपडेट
    await updateWorkerRatingCache(result.rows[0].worker_id);

    res.json({ message: 'रेटिंग काढली' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ Helper: cache अपडेट ============
async function updateWorkerRatingCache(workerId) {
  const stats = await pool.query(
    `SELECT 
       COALESCE(AVG(stars), 0) AS avg_rating,
       COUNT(*) AS total_ratings
     FROM worker_ratings
     WHERE worker_id = $1`,
    [workerId]
  );

  await pool.query(
    `UPDATE users
     SET avg_rating = $1, total_ratings = $2
     WHERE id = $3`,
    [
      parseFloat(stats.rows[0].avg_rating).toFixed(2),
      parseInt(stats.rows[0].total_ratings),
      workerId
    ]
  );
}

module.exports = router;
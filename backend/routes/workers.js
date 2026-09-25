const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ कामगार प्रोफाइल अपडेट ============
router.patch('/me', auth, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'फक्त कामगार' });
    }

    const {
      worker_skills,
      worker_experience,
      worker_bio,
      worker_daily_wage,
      worker_available
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET worker_skills = $1,
           worker_experience = $2,
           worker_bio = $3,
           worker_daily_wage = $4,
           worker_available = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, name, mobile, district, role,
                 worker_skills, worker_experience, worker_bio,
                 worker_daily_wage, worker_available`,
      [
        worker_skills || null,
        worker_experience || null,
        worker_bio || null,
        worker_daily_wage || null,
        worker_available !== undefined ? worker_available : true,
        req.user.id
      ]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error('Worker profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ माझे कामगार प्रोफाइल ============
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, mobile, district, role,
              worker_skills, worker_experience, worker_bio,
              worker_daily_wage, worker_available
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============ सर्व उपलब्ध कामगार (शेतकरी/व्यापारी) ============
router.get('/', auth, async (req, res) => {
  try {
    if (!['farmer', 'dealer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'फक्त शेतकरी/व्यापारी' });
    }

    const { district, skill } = req.query;
    let q = `
  SELECT id, name, mobile, district,
         worker_skills, worker_experience, worker_bio,
         worker_daily_wage, worker_available,
         avg_rating, total_ratings, jobs_completed,
         created_at
  FROM users
  WHERE role = 'worker'
    AND is_active = TRUE
    AND worker_available = TRUE
`;
    const params = [];

    if (district) {
      params.push(district);
      q += ` AND district = $${params.length}`;
    }
    if (skill) {
      params.push(`%${skill}%`);
      q += ` AND worker_skills ILIKE $${params.length}`;
    }

    q += ' ORDER BY avg_rating DESC NULLS LAST, worker_experience DESC NULLS LAST, created_at DESC LIMIT 100';
    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error('Workers list error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ एका कामगाराची माहिती ============
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, mobile, district,
              worker_skills, worker_experience, worker_bio,
              worker_daily_wage, worker_available
       FROM users
       WHERE id = $1 AND role = 'worker'`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'कामगार सापडला नाही' });
    }
    res.json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
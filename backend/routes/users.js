const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ Get my profile ============
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mobile, name, role, district, taluka, village, pincode,
              latitude, longitude, profile_image_url, is_active, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'वापरकर्ता सापडला नाही' });
    }
    res.json(result.rows[0]);
  } catch (e) {
    console.error('Get profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ Update my profile ============
router.patch('/me', auth, async (req, res) => {
  try {
    const {
      name,
      district,
      taluka,
      village,
      pincode,
      latitude,
      longitude,
      profile_image_url
    } = req.body;

    // Pincode validation
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: 'पिनकोड 6 अंकी असावा' });
    }

    // Latitude validation
    if (latitude !== undefined && latitude !== null && latitude !== '') {
      const lat = Number(latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({ error: 'अवैध latitude' });
      }
    }

    // Longitude validation
    if (longitude !== undefined && longitude !== null && longitude !== '') {
      const lon = Number(longitude);
      if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({ error: 'अवैध longitude' });
      }
    }

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           district = COALESCE($2, district),
           taluka = COALESCE($3, taluka),
           village = COALESCE($4, village),
           pincode = COALESCE($5, pincode),
           latitude = COALESCE($6, latitude),
           longitude = COALESCE($7, longitude),
           profile_image_url = COALESCE($8, profile_image_url),
           updated_at = NOW()
       WHERE id = $9
       RETURNING id, mobile, name, role, district, taluka, village,
                 pincode, latitude, longitude, profile_image_url,
                 is_active, created_at`,
      [
        name || null,
        district || null,
        taluka || null,
        village || null,
        pincode || null,
        latitude !== undefined && latitude !== '' ? Number(latitude) : null,
        longitude !== undefined && longitude !== '' ? Number(longitude) : null,
        profile_image_url || null,
        req.user.id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'वापरकर्ता सापडला नाही' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error('Update profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ Get all workers (for farmers/dealers) ============
router.get('/workers', auth, async (req, res) => {
  try {
    if (!['farmer', 'dealer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'फक्त शेतकरी/व्यापारी' });
    }

    const { district, skill } = req.query;
    let q = `
      SELECT id, name, mobile, district, taluka, village,
             worker_skills, worker_experience, worker_bio,
             worker_daily_wage, worker_available,
             avg_rating, total_ratings, jobs_completed,
             latitude, longitude,
             created_at
      FROM users
      WHERE role = 'worker' AND is_active = TRUE
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

    q += ' ORDER BY avg_rating DESC NULLS LAST, created_at DESC LIMIT 100';

    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error('Workers list error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
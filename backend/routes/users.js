const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ माझे प्रोफाइल पहा ============
router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mobile, name, role, district, taluka, village, pincode,
              profile_image_url, is_active, created_at
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

// ============ प्रोफाइल अपडेट करा ============
router.patch('/me', auth, async (req, res) => {
  try {
    const {
      name,
      district,
      taluka,
      village,
      pincode,
      profile_image_url
    } = req.body;

    // पिनकोड validation
    if (pincode && !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: 'पिनकोड 6 अंकी असावा' });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           district = COALESCE($2, district),
           taluka = COALESCE($3, taluka),
           village = COALESCE($4, village),
           pincode = COALESCE($5, pincode),
           profile_image_url = COALESCE($6, profile_image_url),
           updated_at = NOW()
       WHERE id = $7
       RETURNING id, mobile, name, role, district, taluka, village,
                 pincode, profile_image_url, is_active, created_at`,
      [
        name || null,
        district || null,
        taluka || null,
        village || null,
        pincode || null,
        profile_image_url || null,
        req.user.id
      ]
    );

    res.json(result.rows[0]);
  } catch (e) {
    console.error('Update profile error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
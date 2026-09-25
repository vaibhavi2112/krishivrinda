const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { generateOTP, saveOTP, verifyOTP, sendSMS } = require('../services/otpService');
const router = express.Router();

// ============ OTP पाठवा ============
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^\+91[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({ error: 'वैध मोबाइल नंबर द्या (+91...)' });
    }

    const otp = generateOTP();
    saveOTP(mobile, otp);
    await sendSMS(mobile, otp);

    // ⚠️ Development mode मध्ये OTP response मध्ये पाठवा
    const isDev = process.env.NODE_ENV !== 'production';

    res.json({
      message: 'OTP पाठवला',
      // फक्त development मध्ये OTP पाठवा
      ...(isDev ? { otp, devMode: true } : {})
    });
  } catch (e) {
    console.error('Send OTP error:', e);
    res.status(500).json({ error: 'OTP पाठवता आला नाही' });
  }
});

// ============ OTP तपासा + लॉगिन ============
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp, role, name } = req.body;

    const check = verifyOTP(mobile, otp);
    if (!check.ok) return res.status(400).json({ error: check.error });

    // वापरकर्ता शोधा
    let result = await pool.query('SELECT * FROM users WHERE mobile=$1', [mobile]);
    let user = result.rows[0];

    // नवीन वापरकर्ता असेल तर तयार करा
    if (!user) {
      if (!role) {
        return res.status(400).json({ error: 'नवीन खात्यासाठी role द्या' });
      }
      result = await pool.query(
        `INSERT INTO users (mobile, role, name)
         VALUES ($1, $2, $3) RETURNING *`,
        [mobile, role, name || null]
      );
      user = result.rows[0];
    }

    // JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, mobile: user.mobile },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (e) {
    console.error('Verify OTP error:', e);
    res.status(500).json({ error: 'OTP तपासता आला नाही' });
  }
});

module.exports = router;
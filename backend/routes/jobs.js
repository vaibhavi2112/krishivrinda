const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// ============ नवीन नोकरी पोस्ट करा (शेतकरी/व्यापारी) ============
router.post('/', auth, async (req, res) => {
  try {
    if (!['farmer', 'dealer'].includes(req.user.role)) {
      return res.status(403).json({ error: 'फक्त शेतकरी किंवा व्यापारी नोकरी पोस्ट करू शकतात' });
    }

    const {
      job_type,
      workers_required,
      wage_per_day,
      start_date,
      end_date,
      start_time,
      description,
      district,
      taluka,
      latitude,
      longitude
    } = req.body;

    if (!job_type || !workers_required || !wage_per_day || !start_date) {
      return res.status(400).json({ error: 'आवश्यक माहिती अपूर्ण' });
    }

    const result = await pool.query(
      `INSERT INTO jobs
        (posted_by, job_type, workers_required, wage_per_day, start_date, end_date,
         start_time, description, district, taluka, latitude, longitude)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        req.user.id,
        job_type,
        workers_required,
        wage_per_day,
        start_date,
        end_date || null,
        start_time || null,
        description || null,
        district || null,
        taluka || null,
        latitude || null,
        longitude || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error('Job post error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ जवळच्या चालू नोकऱ्या पहा (कामगार) ============
router.get('/', auth, async (req, res) => {
  try {
    const { district, job_type } = req.query;
    let q = `
      SELECT j.*, 
             u.name AS poster_name, 
             u.mobile AS poster_mobile,
             u.role AS poster_role
      FROM jobs j
      JOIN users u ON u.id = j.posted_by
      WHERE j.is_active = TRUE
    `;
    const params = [];

    if (district) {
      params.push(district);
      q += ` AND j.district = $${params.length}`;
    }
    if (job_type) {
      params.push(`%${job_type}%`);
      q += ` AND j.job_type ILIKE $${params.length}`;
    }

    q += ' ORDER BY j.start_date ASC, j.created_at DESC LIMIT 100';

    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error('Jobs list error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ माझ्या नोकऱ्या (शेतकरी/व्यापारी — स्वतः पोस्ट केलेल्या) ============
// ⚠️ हे /:id च्या आधी असणे आवश्यक आहे!
router.get('/my', auth, async (req, res) => {
  try {
    const jobs = await pool.query(
      `SELECT j.*,
        (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) AS applications_count
       FROM jobs j
       WHERE j.posted_by = $1
       ORDER BY j.created_at DESC`,
      [req.user.id]
    );
    res.json(jobs.rows);
  } catch (e) {
    console.error('My jobs error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ मजुरी बेंचमार्क (जिल्हानुसार) ============
// ⚠️ हे पण /:id च्या आधी असणे आवश्यक आहे!
router.get('/wage-benchmark', async (req, res) => {
  try {
    const { district, job_type } = req.query;
    let q = 'SELECT * FROM wage_benchmarks WHERE 1=1';
    const params = [];

    if (district) {
      params.push(district);
      q += ` AND district = $${params.length}`;
    }
    if (job_type) {
      params.push(job_type);
      q += ` AND job_type = $${params.length}`;
    }

    q += ' ORDER BY district ASC, job_type ASC';

    const result = await pool.query(q, params);
    res.json(result.rows);
  } catch (e) {
    console.error('Wage benchmark error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ एका नोकरीचे अर्ज पहा (शेतकरी/व्यापारी) ============
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const job = await pool.query(
      'SELECT * FROM jobs WHERE id=$1 AND posted_by=$2',
      [req.params.id, req.user.id]
    );

    if (job.rowCount === 0) {
      return res.status(404).json({ error: 'नोकरी सापडली नाही' });
    }

    const apps = await pool.query(
      `SELECT ja.id, ja.status, ja.created_at,
              u.id AS worker_id, u.name, u.mobile, u.district
       FROM job_applications ja
       JOIN users u ON u.id = ja.worker_id
       WHERE ja.job_id = $1
       ORDER BY ja.created_at DESC`,
      [req.params.id]
    );

    res.json({
      job: job.rows[0],
      applications: apps.rows
    });
  } catch (e) {
    console.error('Job applications error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ नोकरी बंद करा (शेतकरी/व्यापारी) ============
router.patch('/:id/close', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE jobs
       SET is_active = FALSE
       WHERE id=$1 AND posted_by=$2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'नोकरी सापडली नाही' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error('Job close error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ नोकरीला अर्ज करा (कामगार) ============
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'फक्त कामगार अर्ज करू शकतात' });
    }

    // नोकरी चालू आहे का तपासा
    const jobCheck = await pool.query(
      'SELECT id, is_active FROM jobs WHERE id=$1',
      [req.params.id]
    );

    if (jobCheck.rowCount === 0) {
      return res.status(404).json({ error: 'नोकरी सापडली नाही' });
    }
    if (!jobCheck.rows[0].is_active) {
      return res.status(400).json({ error: 'ही नोकरी बंद झाली आहे' });
    }

    // अर्ज करा (आधीच अर्ज केला असेल तर duplicate नको)
    const result = await pool.query(
      `INSERT INTO job_applications (job_id, worker_id)
       VALUES ($1, $2)
       ON CONFLICT (job_id, worker_id) DO NOTHING
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'तुम्ही आधीच अर्ज केला आहे' });
    }

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error('Job apply error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ कामगाराचे अर्ज पहा ============
router.get('/my-applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ error: 'फक्त कामगारांसाठी' });
    }

    const result = await pool.query(
      `SELECT ja.id, ja.status, ja.created_at,
              j.id AS job_id, j.job_type, j.wage_per_day,
              j.start_date, j.district, j.is_active,
              u.name AS poster_name, u.mobile AS poster_mobile
       FROM job_applications ja
       JOIN jobs j ON j.id = ja.job_id
       JOIN users u ON u.id = j.posted_by
       WHERE ja.worker_id = $1
       ORDER BY ja.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (e) {
    console.error('My applications error:', e);
    res.status(500).json({ error: e.message });
  }
});

// ============ एका नोकरीची माहिती ============
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT j.*, 
              u.name AS poster_name, 
              u.mobile AS poster_mobile,
              u.role AS poster_role
       FROM jobs j
       JOIN users u ON u.id = j.posted_by
       WHERE j.id = $1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'नोकरी सापडली नाही' });
    }

    res.json(result.rows[0]);
  } catch (e) {
    console.error('Job fetch error:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
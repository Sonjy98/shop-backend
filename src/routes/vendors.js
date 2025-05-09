// routes/vendors.js
import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching vendors:', err.message);
    res.status(500).json({ error: 'Failed to load vendors' });
  }
});

export default router;

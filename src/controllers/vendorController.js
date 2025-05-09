// controllers/vendorController.js
import { pool } from '../db/index.js';

export async function getAllVendors(req, res) {
  try {
    const result = await pool.query('SELECT * FROM vendors ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching vendors:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

import express from 'express';
import { pool } from '../db/index.js';

const router = express.Router();

router.get('/orders.csv', async (req, res) => {
  const result = await pool.query(`
    SELECT o.id AS order_id, u.email, p.name AS product_name,
           oi.quantity, p.price, o.created_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
  `);

  const header = 'order_id,email,product_name,quantity,price,created_at';
  const rows = result.rows.map(row =>
    `${row.order_id},"${row.email}","${row.product_name}",${row.quantity},${row.price},${row.created_at.toISOString()}`
  );

  res.header('Content-Type', 'text/csv');
  res.attachment('order_data.csv');
  res.send([header, ...rows].join('\n'));
});

export default router;

import express from 'express';
import { pool } from '../db/index.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
    const user_id = req.user.id;
    const { items } = req.body;

    if (!items || items.length === 0)
        return res.status(400).json({ error: 'Invalid order data' });


    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            'INSERT INTO orders (user_id) VALUES ($1) RETURNING id',
            [user_id]
        );
        const orderId = result.rows[0].id;

        for (const item of items) {
            await client.query(
                'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
                [orderId, item.product_id, item.quantity]
            );
        }

        await client.query('COMMIT');
        res.json({ success: true, order_id: orderId });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Order error:', err.message);
        res.status(500).json({ error: 'Could not place order' });
    } finally {
        client.release();
    }
});

router.get('/mine', verifyToken, async (req, res) => {
    const user_id = req.user.id;
  
    try {
      const result = await pool.query(`
        SELECT o.id AS order_id, o.created_at,
               p.name, p.price, oi.quantity
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC
      `, [user_id]);
  
      const grouped = {};
      for (const row of result.rows) {
        if (!grouped[row.order_id]) {
          grouped[row.order_id] = {
            order_id: row.order_id,
            created_at: row.created_at,
            items: [],
            total: 0,
          };
        }
        grouped[row.order_id].items.push({
          name: row.name,
          price: row.price,
          quantity: row.quantity,
        });
        grouped[row.order_id].total += row.price * row.quantity;
      }
  
      res.json(Object.values(grouped));
    } catch (err) {
      console.error('❌ Error fetching orders:', err.message);
      res.status(500).json({ error: 'Could not fetch orders' });
    }
  });
  

export default router;

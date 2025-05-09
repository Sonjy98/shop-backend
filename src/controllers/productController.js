import { pool } from '../db/index.js';

// GET /api/products
export async function getAllProducts(req, res) {
  try {
    const result = await pool.query(`
        SELECT 
          products.*, 
          vendors.name AS vendor_name,
          vendors.avatar_url AS vendor_avatar
        FROM products
        LEFT JOIN vendors ON products.vendor_id = vendors.id
        ORDER BY products.id DESC
      `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error getting products:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /api/products/:id
export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error getting product:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /api/products
export async function createProduct(req, res) {
  const { name, description, price, vendor_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, description, price, vendor_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, vendor_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating product:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3
       WHERE id=$4 RETURNING *`,
      [name, description, price, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error updating product:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error deleting product:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

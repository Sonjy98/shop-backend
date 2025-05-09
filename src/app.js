import express from 'express';
import cors from 'cors';
import { PORT } from './config/env.js';
import productRoutes from './routes/product.js';
import authRoutes from './routes/auth.js';
import ordersRoute from './routes/orders.js';
import vendorRoutes from './routes/vendors.js';
import analyticsRoutes from './routes/analytics.js';





const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoute);
app.use('/api/vendors', vendorRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('🌆 Local MakerHub API is live!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

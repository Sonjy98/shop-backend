backend/README.md

Local MakerHub — Backend
An Express.js + PostgreSQL backend for the Local MakerHub project.

Features:

User authentication with JWT

Product management with tags, images, and vendor info

Vendor profiles

Cart order processing and storage

Order history per user

Secured API with token verification

Setup:

Install dependencies:
npm install

Create a .env file:
PORT=3001
DB_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_key

Create and seed PostgreSQL tables. Tables include:

users

vendors

products

orders

order_items

Run the server:
npm run dev

Make sure your database is running and accessible at DB_URL.

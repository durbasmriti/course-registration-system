//backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = require('./src/app');

const { getPool } = require('./src/db/pool');
const pool = getPool();

// Test DB connection once
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1');
    console.log("DB connected");
  } catch (err) {
    console.error("DB error!!", err);
  }
})();

// REAL DB API
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM courses');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
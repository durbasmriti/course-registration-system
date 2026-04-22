const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = require('./src/app');

app.use(cors());
app.use(express.json());

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

// REMOVE dummy data later (keep for now if needed)
const courses = [
  { id: 'CE371', name: 'DESIGN OF REINFORCED CONCRETE STRUCTURES', instructor: 'VINAY KUMAR GUPTA', credits: 9, status: 'Form Submitted', type: 'DE' },
  { id: 'CE683', name: 'HUMANS, ENVIRONMENT AND SUSTAINABLE DEV', instructor: 'MANOJ TIWARI', credits: 9, status: 'Form Submitted', type: 'DE' },
  { id: 'CS610', name: 'PROGRAMMING FOR PERFORMANCE', instructor: 'SWARNENDU BISWAS', credits: 9, status: 'Form Submitted', type: 'DE' }
];

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
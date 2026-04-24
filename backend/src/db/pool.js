//backend/src/db/pool.js
const mysql = require('mysql2/promise');

function createPool() {
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'course_registration',
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  };
  return mysql.createPool(config);
}

let pool;
function getPool() {
  if (!pool) pool = createPool();
  return pool;
}

module.exports = { getPool, createPool };

//backend/src/db/pool.js
const mysql = require('mysql2/promise');

function createPool() {
  const config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
  };
  console.log("Connecting to DB:", config.host, config.port, config.database);
  return mysql.createPool(config);
}

let pool;
function getPool() {
  if (!pool) pool = createPool();
  return pool;
}

module.exports = { getPool, createPool };

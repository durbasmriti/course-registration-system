//backend/src/db/pool.js
const mysql = require('mysql2/promise');

function createPool() {
  let pool;

  if (process.env.DATABASE_URL) {
    // Use full URL 
    console.log("Connecting via DATABASE_URL");
    pool = mysql.createPool(process.env.DATABASE_URL);
  } else {
    // Fallback
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
    pool = mysql.createPool(config);
  }

  return pool;
}

let pool;
function getPool() {
  if (!pool) pool = createPool();
  return pool;
}

module.exports = { getPool, createPool };
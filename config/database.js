const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit based on your requirements
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  console.log('Connected to database.');
  if (connection) connection.release(); // Release the connection back to the pool
});

pool.query = util.promisify(pool.query);

module.exports = pool;
const pool = require('../config/database');

exports.getRoles = async (filters, sort, page, limit) => {
  let query = `SELECT id, name FROM roles`;
  const [roles] = await pool.query(query);
  return roles;
};

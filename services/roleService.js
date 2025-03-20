const pool = require('../config/database');

exports.getRoles = async (filters, sort, page, limit) => {
  let query = `SELECT id, name FROM Roles`;
  const [roles] = await pool.query(query);
  return roles;
};

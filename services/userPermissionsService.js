const pool = require('../config/database');

exports.getRoleByUserId = async (userId) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.name AS role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [userId]
    );
    if (rows.length === 0) return null;
    return rows[0].role;
  } catch (err) {
    throw err;
  }
};


exports.getPermissionsByRole = async (role) => {
  try {
    const [rows] = await pool.query(
      'SELECT rp.route_path FROM route_permissions rp JOIN roles r ON rp.role_id = r.id WHERE r.name = ?',
      [role]
    );
    return rows.map((item) => item.route_path);
  } catch (err) {
    throw err;
  }
};

const pool = require('../config/database');

exports.getAllActivityTypes = async () => {
  try {
    const activityTypes = await pool.query('SELECT * FROM activity_types');
    return activityTypes;
  } catch (error) {
    throw error;
  }
};

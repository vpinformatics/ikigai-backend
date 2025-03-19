const pool = require('../config/database');

exports.getAllWorkShifts = async (client_id) => {
  const rows = await pool.query('SELECT * FROM work_shift WHERE client_id = ? AND is_deleted = 0', [client_id]);
  return rows;
};

exports.getWorkShiftById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM work_shift WHERE id = ? AND is_deleted = 0', [id]);
  return rows[0];
};

exports.createWorkShift = async (shift, userId) => {
  const { client_id, name, shift_from, shift_to, break_from, break_to } = shift;

  try {
    // Execute query and correctly retrieve the result
    const result = await pool.query(
      'INSERT INTO work_shift (client_id, name, shift_from, shift_to, break_from, break_to, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [client_id, name, shift_from, shift_to, break_from, break_to, userId, userId]
    );

    if (!result || !result.insertId) {
      throw new Error('Insert operation failed');
    }

    return { id: result.insertId, ...shift };

  } catch (error) {
    throw new Error('Database Insert Failed: ' + error.message);
  }
};

exports.updateWorkShift = async (id, shift, userId) => {
  const { name, shift_from, shift_to, break_from, break_to } = shift;
  await pool.query(
    `UPDATE work_shift 
    SET name = ?, shift_from = ?, shift_to = ?, break_from = ?, break_to = ?, updated_on = NOW() , updated_by = ?
    WHERE id = ?`,
    [name, shift_from, shift_to, break_from, break_to, userId, id]
  );
  return { id, ...shift };
};

exports.deleteWorkShift = async (id) => {
  await pool.query('UPDATE work_shift SET is_deleted = 1, deleted_on = NOW() WHERE id = ?', [id]);
};

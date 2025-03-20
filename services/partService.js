const pool = require('../config/database');

exports.getParts = async (client_id) => {
    const rows = await pool.query(
        'SELECT * FROM parts WHERE client_id = ? AND is_deleted = 0', 
        [client_id]
    );
    return rows;
};

exports.addPart = async ({ part_number, part_code, client_id, userId }) => {
    const result = await pool.query(
        'INSERT INTO parts (part_number, part_code, client_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?)', 
        [part_number, part_code, client_id, userId, userId]
    );
    return { id: result.insertId, part_number, part_code, client_id };
};

exports.updatePart = async (id, { part_number, part_code, updated_by }) => {
    await pool.query(
        'UPDATE parts SET part_number = ?, part_code = ?, updated_by = ?, updated_on = CURRENT_TIMESTAMP WHERE id = ?', 
        [part_number, part_code, updated_by, id]
    );
    return { id, part_number, part_code, updated_by };
};

exports.deletePart = async (id, deleted_by) => {
    await pool.query(
        'UPDATE parts SET is_deleted = 1, deleted_on = CURRENT_TIMESTAMP, updated_by = ? WHERE id = ?', 
        [deleted_by, id]
    );
};

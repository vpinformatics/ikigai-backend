const pool = require('../config/database');

exports.getAllWorkPlace = async (client_id) => {
  const [workPlaces] = await pool.query('SELECT * FROM work_place WHERE client_id = ? AND is_deleted = FALSE', [client_id]);
  return workPlaces;
};

exports.getWorkPlaceById = async (id) => {
  const [workPlace] = await pool.query('SELECT * FROM work_place WHERE id = ? AND is_deleted = FALSE', [id]);
  return workPlace;
};

exports.createWorkPlace = async (workPlaceData, userId) => {
  const { name, client_id } = workPlaceData;
  const [result] = await pool.query(
    'INSERT INTO work_place (name, client_Id, created_by, updated_by) VALUES (?, ?, ?, ?)',
    [name, client_id, userId, userId]
  );
  return {
    id: result.insertId,
    name,
    client_id,
  };
};

exports.updateWorkPlace = async (id, workPlaceData, userId) => {
  const { name, client_id } = workPlaceData;

  await pool.query(
    'UPDATE work_place SET name = ?, updated_by = ? WHERE id = ? AND ClientId = ? AND is_deleted = FALSE',
    [name, userId, client_id, id]
  );

  return {
    id,
    name,
    
  };
};

exports.deleteWorkPlace = async (id) => {
  await pool.query('UPDATE work_place SET  is_deleted = TRUE WHERE id = ? AND is_deleted = FALSE', [id]);
};

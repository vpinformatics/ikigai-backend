const pool = require('../config/database');

exports.getAllClients = async () => {
  const clients = await pool.query('SELECT * FROM clients WHERE is_deleted = FALSE');
  return clients;
};

exports.getClientById = async (id) => {
  const clients = await pool.query('SELECT * FROM clients WHERE id = ? AND is_deleted = FALSE', [id]);
  return clients;
};

exports.createClient = async (clientData, userId) => {
  const { name, address, city, state, country, contact_person, contact_email, contact_phone } = clientData;
  const result = await pool.query(
    'INSERT INTO clients (name, address, city, state, country, contact_person, contact_email, contact_phone, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, address, city, state, country, contact_person, contact_email, contact_phone, userId, userId]
  );
  return {
    id: result.insertId,
    name,
    address,
    city,
    state,
    country,
    contact_person,
    contact_email,
    contact_phone,
  };
};

exports.updateClient = async (id, clientData, userId) => {
  const { name, address, city, state, country, contact_person, contact_email, contact_phone } = clientData;

  await pool.query(
    'UPDATE clients SET name = ?, address = ?, city = ?, state = ?, country = ?, contact_person = ?, contact_email = ?, contact_phone = ?, updated_by = ? WHERE id = ?  AND is_deleted = FALSE',
    [name, address, city, state, country, contact_person, contact_email, contact_phone, userId, id]
  );

  return {
    id,
    name,
    address,
    city,
    state,
    country,
    contact_person,
    contact_email,
    contact_phone,
    updated_by: userId
  };
};

exports.deleteClient = async (id) => {
  await pool.query('DELETE FROM clients WHERE id = ? AND is_deleted = FALSE', [id]);
};
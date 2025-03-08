const db = require('../config/database');
const util = require('util');
const query = util.promisify(db.query).bind(db);

exports.getAllClients = async () => {
  return await query('SELECT * FROM clients');
};

exports.getClientById = async (id) => {
  const results = await query('SELECT * FROM clients WHERE id = ?', [id]);
  return results[0];
};

exports.createClient = async (client) => {
  const result = await query('INSERT INTO clients SET ?', client);
  return { id: result.insertId, ...client };
};

exports.updateClient = async (id, client) => {
  await query('UPDATE clients SET ? WHERE id = ?', [client, id]);
  return { id, ...client };
};

exports.deleteClient = async (id) => {
  await query('DELETE FROM clients WHERE id = ?', [id]);
};
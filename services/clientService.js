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

exports.createClient = async (clientData) => {
  await query('INSERT INTO clients SET ?', clientData);
  return clientData;
};

exports.updateClient = async (id, clientData) => {
  await query('UPDATE clients SET ? WHERE id = ?', [clientData, id]);
  return clientData;
};

exports.deleteClient = async (id) => {
  await query('DELETE FROM clients WHERE id = ?', [id]);
};
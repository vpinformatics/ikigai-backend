const pool = require('../config/database');

exports.getAllClients = async (filters, sort, page, limit) => {
  let query = 'SELECT * FROM clients WHERE is_deleted = FALSE';
  let countQuery = 'SELECT COUNT(*) as count FROM clients WHERE is_deleted = FALSE';
  const queryParams = [];
  const countParams = [];

  // Apply filters
  if (filters) {
    Object.keys(filters).forEach((key) => {
      query += ` AND ${key} = ?`;
      countQuery += ` AND ${key} = ?`;
      queryParams.push(filters[key]);
      countParams.push(filters[key]);
    });
  }

  // Apply sorting
  if (sort) {
    const sortField = sort.field || 'id';
    const sortOrder = sort.order || 'ASC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  // Apply pagination
  let totalRecords = 0;
  let totalPages = 0;
  let offset = 0;
  if (page && limit) {
    const countResult = await pool.query(countQuery, countParams);
    totalRecords = countResult[0].count;
    totalPages = Math.ceil(totalRecords / limit);
    offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }

  const clients = await pool.query(query, queryParams);

  return {
    clients,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      hasPrev: page > 1,
      hasNext: page < totalPages
    }
  };
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
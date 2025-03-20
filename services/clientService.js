const pool = require('../config/database');

exports.getAllClients = async (filters, sort, page = 1, limit = 10) => {
  let query = 'SELECT * FROM clients WHERE is_deleted = FALSE';
  let countQuery = 'SELECT COUNT(*) AS count FROM clients WHERE is_deleted = FALSE';
  const queryParams = [];
  const countParams = [];

  // Apply filters
  if (filters) {
      Object.keys(filters).forEach((key) => {
          const value = filters[key];

          // Ignore empty search filter
          if (key === "search" && (!value || !value.trim())) return;

          if (key === "search") {
              const searchFields = [
                  "name", "address", "city", "state", "country",
                  "contact_person", "contact_email", "contact_phone", "gst_number"
              ];

              const tmpQuery = `(${searchFields.map(field => `${field} LIKE ?`).join(" OR ")})`;
              query += ` AND ${tmpQuery}`;
              countQuery += ` AND ${tmpQuery}`;

              // Push search value with wildcards for all fields
              const searchValue = `%${value}%`;
              queryParams.push(...searchFields.map(() => searchValue));
              countParams.push(...searchFields.map(() => searchValue));
          } else {
              query += ` AND ${key} = ?`;
              countQuery += ` AND ${key} = ?`;
              queryParams.push(value);
              countParams.push(value);
          }
      });
  }

  // Apply sorting
  if (sort) {
      const sortField = sort.field || 'id';
      const sortOrder = sort.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  // Get total record count
  const [[{ count: totalRecords }]] = await pool.query(countQuery, countParams);
  if (!totalRecords) {
      return {
          clients: [],
          pagination: {
              currentPage: 1,
              totalPages: 1,
              totalRecords: 0,
              hasPrev: false,
              hasNext: false
          }
      };
  }

  // Apply pagination
  const totalPages = Math.ceil(totalRecords / limit);
  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Fetch paginated clients
  const [clients] = await pool.query(query, queryParams);

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
  const [clients] = await pool.query('SELECT * FROM clients WHERE id = ? AND is_deleted = FALSE', [id]);
  return clients;
};

exports.createClient = async (clientData, userId) => {
  const { name, address, city, state, country, contact_person, contact_email, contact_phone } = clientData;
  const [result] = await pool.query(
    'INSERT INTO clients (name, address, city, state, country, contact_person, contact_email, contact_phone, created_by, updated_by, gst_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, address, city, state, country, contact_person, contact_email, contact_phone, userId, userId, gst_number]
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
    gst_number
  };
};

exports.updateClient = async (id, clientData, userId) => {
  const { name, address, city, state, country, contact_person, contact_email, contact_phone, gst_number } = clientData;

  await pool.query(
    'UPDATE clients SET name = ?, address = ?, city = ?, state = ?, country = ?, contact_person = ?, contact_email = ?, contact_phone = ?, updated_by = ?, gst_number = ? WHERE id = ?  AND is_deleted = FALSE',
    [name, address, city, state, country, contact_person, contact_email, contact_phone, userId, gst_number, id]
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
    updated_by: userId,
    gst_number
  };
};

exports.deleteClient = async (id, userId) => {
  await pool.query(`
    UPDATE clients 
    SET is_deleted = 1, deleted_on = CURRENT_TIMESTAMP, updated_by = ? 
    WHERE id = ? AND is_deleted = FALSE
    `, [userId, id]);
};
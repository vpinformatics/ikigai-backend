const pool = require('../config/database');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (filters, sort, page, limit) => {
  let query = `
  SELECT 
    u.*, r.name as 'roleName' 
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
  WHERE u.is_deleted = FALSE
  `;
  let countQuery = `
  SELECT 
    COUNT(*) as count
  FROM users u
  INNER JOIN roles r ON r.id = u.role_id
  WHERE u.is_deleted = FALSE
  `;
  const queryParams = [];
  const countParams = [];

  // Apply filters
  if (filters) {
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
  
      // Ignore empty search filter
      if (key === "search" && (!value || !value.trim())) {
        return;
      }
  
      if (key === "search") {
        const searchFields = [ "u.name", "u.email", "r.name"];
  
        const tmpQuery = `(${searchFields.map(field => `${field} LIKE ?`).join(" OR ")})`;
  
        query += ` AND ${tmpQuery}`;
        countQuery += ` AND ${tmpQuery}`;
  
        // Push the same search value with wildcards for all fields
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
    if(sort.field == 'statusName'){
      sort.field='u.is_active';
    }
    const sortField = sort.field || 'id';
    const sortOrder = sort.order || 'ASC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;
  }

  // Apply pagination
  let totalRecords = 0;
  let totalPages = 0;
  let offset = 0;
  if (page && limit) {
    const [countResult] = await pool.query(countQuery, countParams);
    totalRecords = countResult[0].count;
    totalPages = Math.ceil(totalRecords / limit);
    offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
  }
  const [users] = await pool.query(query, queryParams);

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords,
      hasPrev: page > 1,
      hasNext: page < totalPages
    }
  };
};


exports.getLoggedInUser = async (id) => {
  const [users] = await pool.query(`
    SELECT 
      u.id AS id,
      u.name AS name,
      u.email AS email,
      r.id AS roleId,
      r.name AS roleName
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ? AND u.is_deleted = 0 AND u.is_active = 1;
  `, [id]);

  const user = users[0];

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: {
      id: user.roleId,
      name: user.roleName
    }
  };
};


exports.getUserById = async (id) => {
  const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND is_deleted = FALSE', [id]);
  return users;
};

exports.getUsersByActivityId = async (activity_id) => {
  const [users] = await pool.query(`
    SELECT 
      u.id as 'user_id', u.name as 'user_name', u.email, 
      u.role_id, r.name as 'role_name'
      ,uc.id as 'user_activity_id'
    FROM user_activities uc
    INNER JOIN users u ON u.id = uc.user_id
    INNER JOIN roles r ON r.id = u.role_id
    WHERE u.is_deleted = 0 AND uc.is_deleted = 0
    AND u.is_active = 1 AND uc.activity_id = ?
    `, [activity_id]);
  return users;
};

exports.getUserById = async (id) => {
  const [users] = await pool.query(
    `SELECT * FROM users WHERE id = ? AND is_deleted = FALSE`,
    [id]
  );

  if (!users.length) return null; // If user not found

  const [assignedActivities] = await pool.query(
    `SELECT activity_id FROM user_activities WHERE user_id = ? AND is_deleted = FALSE`,
    [id]
  );

  // Attach assigned Activities to user
  users[0].assignedActivities = assignedActivities.map(activity => activity.activity_id);

  return users[0];
};

exports.createUser = async (userData, userId) => {
  const { name, email, is_active, password, role_id } = userData;
  const hashedPassword = await bcrypt.hash(password, 12);
  const [result] = await pool.query(
    'INSERT INTO users (name, email, is_active, password, role_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, is_active, hashedPassword, role_id, userId, userId]
  );
  return {
    id: result.insertId,
    name,
    email, 
    is_active, 
    password, 
    role_id
  };
};

exports.updateUser = async (id, userData, userId) => {
  const { name, email, password, role_id, is_active, isUpdatePassword, activityIds } = userData;
  const hashedPassword = isUpdatePassword?await bcrypt.hash(password, 12):'';

  await pool.query(
    'UPDATE users SET name = ?, email = ?, role_id = ?, is_active = ? WHERE id = ?  AND is_deleted = FALSE',
    [name, email, role_id, is_active, id]
  );

  if(isUpdatePassword){
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?  AND is_deleted = FALSE',
      [ hashedPassword, id]
    );
  } 

  return {
    id,
    email,
    name,
    role_id,
    is_active
  };
};

exports.deleteUser = async (id) => {
  await pool.query('UPDATE users SET is_deleted = TRUE WHERE id = ? AND is_deleted = FALSE', [id]);
};
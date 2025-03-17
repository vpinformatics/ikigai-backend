const dotenv = require('dotenv');
dotenv.config();

const db = require('../config/database');

const createRolesTable = `
  CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createUsersTable = `
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    name VARCHAR(100);
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_on TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
  );
`;

db.query(createRolesTable, (err, result) => {
  if (err) {
    console.error('Error creating roles table:', err);
    process.exit(1);
  }
  console.log('Roles table created successfully');

  db.query(createUsersTable, (err, result) => {
    if (err) {
      console.error('Error creating users table:', err);
      process.exit(1);
    }
    console.log('Users table created successfully');
    process.exit(0);
  });
});
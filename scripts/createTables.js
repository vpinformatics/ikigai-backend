const dotenv = require('dotenv');
dotenv.config();

const db = require('../config/database');

const createUsersTable = `
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_by VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_on TIMESTAMP NULL
  );
`;

db.query(createUsersTable, (err, result) => {
  if (err) {
    console.error('Error creating users table:', err);
    process.exit(1);
  }
  console.log('Users table created successfully');
  process.exit(0);
});
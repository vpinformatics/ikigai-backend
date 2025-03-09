const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const db = require('../config/database');

const roles = ['Admin', 'Supervisor', 'Inspector', 'Engineer'];

const createRoles = async () => {
  for (const role of roles) {
    await db.query('INSERT INTO roles (name) VALUES (?)', [role]);
  }
};

const createAdminUser = async () => {
  const hashedPassword = await bcrypt.hash('Admin!@12', 12);
  const roleId = (await db.query('SELECT id FROM roles WHERE name = ?', ['Admin']))[0].id;
  await db.query('INSERT INTO users (email, password, role_id, created_by, updated_by) VALUES (?, ?, ?, ?, ?)', ['admin@gmail.com', hashedPassword, roleId, null, null]);
};

//INSERT INTO users (email, password, role_id, created_by, updated_by) VALUES ('admin@gmail.com', '$2b$12$JFiiXYnMMzXxghf8TtLZHuzlAzy9NUBIKETk0HOkeice1yEIPu4L2', 1, null, null)

const seedDatabase = async () => {
  try {
    await createRoles();
    await createAdminUser();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();

/*

CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(50),
  state VARCHAR(50),
    country  VARCHAR(50) DEFAULT 'India',
  contact_person VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20),

    created_by INT,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_on TIMESTAMP NULL,
  status ENUM('active', 'inactive') DEFAULT 'active'
);

*/
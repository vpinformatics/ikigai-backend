# Node.js Boilerplate with MySQL, JWT, RBAC, and CRUD

This project is a boilerplate for building a Node.js application with MySQL (MariaDB), JWT-based authentication, role-based access control (RBAC), and sample CRUD for a `Client` table. It follows best practices, SOLID principles, and a loosely coupled architecture.

## Features

- User registration and login
- JWT-based authentication
- Role-based access control (RBAC)
- Sample CRUD operations for `Client` table
- Pre-configured controllers, services, middlewares, and error handlers

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Run the application: `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydatabase
JWT_SECRET=your_jwt_secret
PORT=3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
EMAIL_FROM=no-reply@example.com
FRONTEND_URL=http://localhost:3000
```

## Project Structure

- `controllers/`: Contains controllers for handling HTTP requests
- `services/`: Contains services for business logic
- `middlewares/`: Contains middleware for authentication, authorization, and error handling
- `routes/`: Contains route definitions
- `config/`: Contains configuration files
- `utils/`: Contains utility functions

## API Endpoints

### Authentication
- `POST /v1/auth/register`: Register a new user.
- `POST /v1/auth/login`: Login a user.
- `POST /v1/auth/refresh-tokens`: Refresh authentication tokens.
- `POST /v1/auth/forgot-password`: Send reset password email.
- `POST /v1/auth/reset-password`: Reset user password.
- `POST /v1/auth/send-verification-email`: Send email verification link.
- `POST /v1/auth/verify-email`: Verify user email.

### Clients
- `GET /v1/clients`: Get all clients (Admin only).
- `GET /v1/clients/:id`: Get a client by ID (Admin only).
- `POST /v1/clients`: Create a new client (Admin only).
- `PUT /v1/clients/:id`: Update a client by ID (Admin only).
- `DELETE /v1/clients/:id`: Delete a client by ID (Admin only).

## License

This project is licensed under the MIT License.
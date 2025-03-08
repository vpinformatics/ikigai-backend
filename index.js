const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file as the very first step
const cors = require('cors');
const db = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/client');
const { errorHandler } = require('./middlewares/errorHandler');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Test DB connection
db.getConnection((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/clients', clientRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
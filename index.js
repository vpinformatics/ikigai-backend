const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file as the very first step
const cors = require('cors');
const db = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerRouter = require('./config/swaggerConfig');
const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const WorkPlaceRoutes = require('./routes/workPlaceRoutes');
const workShiftRoutes = require('./routes/workShiftRoutes');
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
app.use(swaggerRouter);

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/clients', clientRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/workplace', WorkPlaceRoutes);
app.use('/v1/workshift', workShiftRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
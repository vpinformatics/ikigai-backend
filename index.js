const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file as the very first step
dotenv.config({ path: `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}` });
const cors = require('cors');
const swaggerRouter = require('./config/swaggerConfig');
const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const WorkPlaceRoutes = require('./routes/workPlaceRoutes');
const workShiftRoutes = require('./routes/workShiftRoutes');
const partRoutes  = require('./routes/partRoute');
const serviceContractRoutes  = require('./routes/serviceContractRoutes');
const activityTypeRoutes = require('./routes/activityTypeRoutes');
const activityDataRoutes = require("./routes/activityData.routes");
const activityDetailsRoutes = require("./routes/activityDetails.routes");
const userActivitiesRouts = require("./routes/userActivityRoutes");
const activityTimeRoutes = require("./routes/activityTimeRoutes");
const excelRoutes = require('./routes/excelRoutes');
const userPermissionsRoutes = require('./routes/userPermissionsRoutes');
const logger = require('./utils/logger');
const path = require('path');
const morgan = require('morgan');
const { v4: uuidv4 } =  require('uuid');
const { exec } = require('child_process');
const app = express();

// ✅ Uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.stack || err.message}`);
});

// ✅ Unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason?.stack || reason}`);
});

// ✅ Middleware to log requests/responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const requestId = uuidv4().slice(0, 8);
  const start = Date.now();
  const { method, originalUrl, body } = req;

  logger.info(`[${requestId}] 🚀 [REQUEST START] ${method} ${originalUrl}`);
  if (body && Object.keys(body).length > 0) {
    logger.info(`[${requestId}] 📦 Request Body: ${JSON.stringify(body, null, 2)}`);
  }

  const oldSend = res.send;
  res.send = function (bodyData) {
    const duration = Date.now() - start;
    let responseLog = '';

    try {
      responseLog = typeof bodyData === 'object' ? JSON.stringify(bodyData) : bodyData;
      if (responseLog.length > 1000) {
        responseLog = responseLog.substring(0, 1000) + '... (truncated)';
      }
    } catch (e) {
      responseLog = '[Unable to stringify response]';
    }

    logger.info(`[${requestId}] 🎯 Response Status: ${res.statusCode}`);
    logger.info(`[${requestId}] 📤 Response Body: ${responseLog}`);
    logger.info(`[${requestId}] 🏁 [REQUEST END] ${method} ${originalUrl} (${duration}ms)`);

    return oldSend.apply(this, arguments);
  };

  next();
});

// ✅ Morgan for standard request logs (optional)
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// ✅ Enable CORS
app.use(cors());

// ✅ Swagger & Static files
app.use(swaggerRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/clients', clientRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/workplace', WorkPlaceRoutes);
app.use('/v1/workshift', workShiftRoutes);
app.use('/v1/parts', partRoutes);
app.use('/v1/service-contracts', serviceContractRoutes);
app.use('/v1/activity-types', activityTypeRoutes);
app.use("/v1/activity-data", activityDataRoutes);
app.use("/v1/activity-details", activityDetailsRoutes);
app.use('/v1/user-activities', userActivitiesRouts);
app.use('/v1/activity-time', activityTimeRoutes);
app.use('/v1/excel', excelRoutes);
app.use('/v1/user-permissions', userPermissionsRoutes);

// ✅ Centralized error handler with stack trace
app.use((err, req, res, next) => {
  logger.error(`❌ Error: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }
  res.status(err.status || 500).json({
    status: 'error',
    message: 'Something went wrong.',
    error: err.message,
  });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);

  const url = `http://localhost:${PORT}/api-docs`;
  switch (process.platform) {
      case 'darwin': exec(`open ${url}`); break; // macOS
      //case 'win32': exec(`start ${url}`); break; // Windows
      case 'linux': exec(`xdg-open ${url}`); break; // Linux
      default: console.log(`Please open manually: ${url}`);
  }
});
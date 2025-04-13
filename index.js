const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file as the very first step
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
const userClientsRouts = require("./routes/userClientRoutes");
const activityTimeRoutes = require("./routes/activityTimeRoutes");
const excelRoutes = require('./routes/excelRoutes');

const { exec } = require('child_process');

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Swagger UI setup
app.use(swaggerRouter);

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
app.use('/v1/user-clients', userClientsRouts);
app.use('/v1/activity-time', activityTimeRoutes);
app.use('/v1/excel', excelRoutes);

// Error handling middleware
app.use(errorHandler);

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
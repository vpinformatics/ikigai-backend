const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IKIGAI API Documentation',
      version: '1.0.0',
      description: 'API documentation for the IKIGAI',
    },
    servers: [
      {
        url: 'http://localhost:3100/v1',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication and authorization endpoints' },
      { name: 'Users', description: 'API for managing users' },
      { name: 'Roles', description: 'API for role management' },
      { name: 'Activity Types', description: 'API for activity types' },
      { name: 'Clients', description: 'API for managing clients' },
      { name: 'WorkPlace', description: 'API for workplace management' },
      { name: 'Work Shifts', description: 'API for managing work shifts' },
      { name: 'Parts', description: 'API for managing parts' },
      { name: 'Service Contracts', description: 'API endpoints for managing service contracts' },
      { name: 'Activity Details', description:'API for managing activity details'},
      { name: 'Activity Data', description: 'API for managing activity data'}
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;
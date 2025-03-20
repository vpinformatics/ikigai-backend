const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: filters
 *         schema:
 *           type: string
 *         description: JSON string of filters to apply
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: JSON string of sort field and order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page for pagination
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clients:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       country:
 *                         type: string
 *                       contact_person:
 *                         type: string
 *                       contact_email:
 *                         type: string
 *                       contact_phone:
 *                         type: string
 *                       created_by:
 *                         type: integer
 *                       created_on:
 *                         type: string
 *                         format: date-time
 *                       updated_by:
 *                         type: integer
 *                       updated_on:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [active, inactive]
 */
router.get('/', authorize([1, 2]), clientController.getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 contact_person:
 *                   type: string
 *                 contact_email:
 *                   type: string
 *                 contact_phone:
 *                   type: string
 *                 created_by:
 *                   type: integer
 *                 created_on:
 *                   type: string
 *                   format: date-time
 *                 updated_by:
 *                   type: integer
 *                 updated_on:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [active, inactive]
 */
router.get('/:id', authorize([1, 2]), clientController.getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 contact_person:
 *                   type: string
 *                 contact_email:
 *                   type: string
 *                 contact_phone:
 *                   type: string
 *                 created_by:
 *                   type: integer
 *                 created_on:
 *                   type: string
 *                   format: date-time
 *                 updated_by:
 *                   type: integer
 *                 updated_on:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [active, inactive]
 */
router.post('/', authorize([1, 2]), clientController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               contact_person:
 *                 type: string
 *               contact_email:
 *                 type: string
 *               contact_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Client updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 contact_person:
 *                   type: string
 *                 contact_email:
 *                   type: string
 *                 contact_phone:
 *                   type: string
 *                 updated_by:
 *                   type: integer
 *                 updated_on:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [active, inactive]
 */
router.put('/:id', authorize([1,2]), clientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Client deleted
 */
router.delete('/:id', authorize([1,2]), clientController.deleteClient);

module.exports = router;
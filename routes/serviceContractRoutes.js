const express = require('express');
const router = express.Router();
const serviceContractController = require('../controllers/serviceContractController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Service Contracts
 *   description: API endpoints for managing service contracts
 */

/**
 * @swagger
 * /service-contracts/sample:
 *   get:
 *     summary: Delete a service contract by ID (soft delete)
 *     tags: [Service Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Service contract deleted
 */
// router.get('/sample', serviceContractController.sample);

 router.get('/generate/:id', authorize([1, 2]), serviceContractController.generateExcel);

/**
 * @swagger
 * /service-contracts:
 *   get:
 *     summary: Get all service contracts
 *     tags: [Service Contracts]
 *     security:
 *       - bearerAuth: []
  *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of service contracts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   client_id:
 *                     type: integer
 *                   service_contract_reference:
 *                     type: string
 *                   service_contract_date:
 *                     type: string
 *                     format: date
 *                   is_single_part:
 *                     type: boolean
 *                   part_id:
 *                     type: integer
 *                     nullable: true
 *                   activity_type_ids:
 *                     type: array
 *                     items:
 *                       type: integer
 */
router.get('/:client_id', authorize([1, 2]), serviceContractController.getAllServiceContracts);

/**
 * @swagger
 * /service-contracts/{id}:
 *   get:
 *     summary: Get a service contract by ID
 *     tags: [Service Contracts]
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
 *         description: Service contract data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 client_id:
 *                   type: integer
 *                 service_contract_reference:
 *                   type: string
 *                 service_contract_date:
 *                   type: string
 *                   format: date
 *                 is_single_part:
 *                   type: boolean
 *                 part_id:
 *                   type: integer
 *                   nullable: true
 *                 activity_type_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 */
router.get('/:id', authorize([1, 2]), serviceContractController.getServiceContractById);

/**
 * @swagger
 * /service-contracts:
 *   post:
 *     summary: Create a new service contract
 *     tags: [Service Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               service_contract_reference:
 *                 type: string
 *               service_contract_date:
 *                 type: string
 *                 format: date
 *               is_single_part:
 *                 type: boolean
 *               part_id:
 *                 type: integer
 *                 nullable: true
 *               activity_type_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Service contract created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 client_id:
 *                   type: integer
 *                 service_contract_reference:
 *                   type: string
 *                 service_contract_date:
 *                   type: string
 *                   format: date
 *                 is_single_part:
 *                   type: boolean
 *                 part_id:
 *                   type: integer
 *                   nullable: true
 *                 activity_type_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 */
router.post('/:id', authorize([1, 2]), serviceContractController.createServiceContract);

/**
 * @swagger
 * /service-contracts/{id}:
 *   put:
 *     summary: Update a service contract by ID
 *     tags: [Service Contracts]
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
 *               client_id:
 *                 type: integer
 *               service_contract_reference:
 *                 type: string
 *               service_contract_date:
 *                 type: string
 *                 format: date
 *               is_single_part:
 *                 type: boolean
 *               part_id:
 *                 type: integer
 *                 nullable: true
 *               activity_type_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Service contract updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 client_id:
 *                   type: integer
 *                 service_contract_reference:
 *                   type: string
 *                 service_contract_date:
 *                   type: string
 *                   format: date
 *                 is_single_part:
 *                   type: boolean
 *                 part_id:
 *                   type: integer
 *                   nullable: true
 *                 activity_type_ids:
 *                   type: array
 *                   items:
 *                     type: integer
 */
router.put('/:id', authorize([1, 2]), serviceContractController.updateServiceContract);

/**
 * @swagger
 * /service-contracts/{id}:
 *   delete:
 *     summary: Delete a service contract by ID (soft delete)
 *     tags: [Service Contracts]
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
 *         description: Service contract deleted
 */
router.delete('/:id', authorize([1, 2]), serviceContractController.deleteServiceContract);

router.get('/:client_id/:id', authorize([1, 2]), serviceContractController.getServiceContractData);

//router.get('/download/:id', authorize([1, 2]), serviceContractController.downloadExcel);

module.exports = router;

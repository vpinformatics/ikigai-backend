const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Parts
 *   description: API for managing parts
 */

/**
 * @swagger
 * /parts/{client_id}:
 *   get:
 *     summary: Get all parts for a specific client
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: client_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the client
 *     responses:
 *       200:
 *         description: List of parts
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
 *                   part_number:
 *                     type: string
 *                   part_code:
 *                     type: string
 *                   created_by:
 *                     type: integer
 *                   created_on:
 *                     type: string
 *                     format: date-time
 *                   updated_by:
 *                     type: integer
 *                   updated_on:
 *                     type: string
 *                     format: date-time
 *                   is_deleted:
 *                     type: boolean
 *                   deleted_on:
 *                     type: string
 *                     format: date-time
 */
router.get('/:client_id', authorize([1]), partController.getParts);

/**
 * @swagger
 * /parts:
 *   post:
 *     summary: Add a new part
 *     tags: [Parts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               part_number:
 *                 type: string
 *               part_code:
 *                 type: string
 *               created_by:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Part created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 client_id:
 *                   type: integer
 *                 part_number:
 *                   type: string
 *                 part_code:
 *                   type: string
 *                 created_by:
 *                   type: integer
 */
router.post('/', authorize([1]), partController.addPart);

/**
 * @swagger
 * /parts/{id}:
 *   put:
 *     summary: Update an existing part
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the part
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               part_number:
 *                 type: string
 *               part_code:
 *                 type: string
 *               updated_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Part updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 part_number:
 *                   type: string
 *                 part_code:
 *                   type: string
 *                 updated_by:
 *                   type: integer
 */
router.put('/:id', authorize([1]), partController.updatePart);

/**
 * @swagger
 * /parts/{id}:
 *   delete:
 *     summary: Soft delete a part
 *     tags: [Parts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the part
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleted_by:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Part marked as deleted
 */
router.delete('/:id', authorize([1]), partController.deletePart);

module.exports = router;

const express = require('express');
const router = express.Router();
const workPlaceController = require('../controllers/workPlaceController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /workplace/{client_id}:
 *   get:
 *     summary: Get all work places
 *     tags: [WorkPlace]
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
 *         description: A list of work places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   client_id:
 *                     type: integer
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
router.get('/:client_id', authorize([1, 2]), workPlaceController.getAllWorkPlace);

/**
 * @swagger
 * /workplace/{id}:
 *   get:
 *     summary: Get a work place by ID
 *     tags: [WorkPlace]
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
 *         description: Work place details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 client_id:
 *                   type: integer
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
 *                 is_deleted:
 *                   type: boolean
 *                 deleted_on:
 *                   type: string
 *                   format: date-time
 */
router.get('/:id', authorize([1, 2]), workPlaceController.getWorkPlaceById);

/**
 * @swagger
 * /workplace:
 *   post:
 *     summary: Create a new work place
 *     tags: [WorkPlace]
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
 *               client_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Work place created successfully
 */
router.post('/', authorize([1, 2]), workPlaceController.createWorkPlace);

/**
 * @swagger
 * /workplace/{id}:
 *   put:
 *     summary: Update a work place by ID
 *     tags: [WorkPlace]
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
 *               client_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Work place updated successfully
 */
router.put('/:id', authorize([1, 2]), workPlaceController.updateWorkPlace);

/**
 * @swagger
 * /workplace/{id}:
 *   delete:
 *     summary: Delete a work place by ID
 *     tags: [WorkPlace]
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
 *         description: Work place deleted successfully
 */
router.delete('/:id', authorize([1, 2]), workPlaceController.deleteWorkPlace);

module.exports = router;

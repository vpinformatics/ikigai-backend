const express = require('express');
const router = express.Router();
const workShiftController = require('../controllers/workShiftController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /workshift/{client_id}:
 *   get:
 *     summary: Get all work shifts
 *     tags: [Work Shifts]
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
 *         description: List of work shifts
 */
router.get('/:client_id', authorize([1, 2]), workShiftController.getAllWorkShifts);

/**
 * @swagger
 * /workshift/{id}:
 *   get:
 *     summary: Get a work shift by ID
 *     tags: [Work Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Work shift data
 */
router.get('/:id', authorize([1, 2]), workShiftController.getWorkShiftById);

/**
 * @swagger
 * /workshift:
 *   post:
 *     summary: Create a new work shift
 *     tags: [Work Shifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               shift_from:
 *                 type: string
 *               shift_to:
 *                 type: string
 *               break_from:
 *                 type: string
 *               break_to:
 *                 type: string
 *     responses:
 *       201:
 *         description: Work shift created
 */
router.post('/', authorize([1, 2]), workShiftController.createWorkShift);

/**
 * @swagger
 * /workshift/{id}:
 *   put:
 *     summary: Update a work shift by ID
 *     tags: [Work Shifts]
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
 *               shift_from:
 *                 type: string
 *               shift_to:
 *                 type: string
 *               break_from:
 *                 type: string
 *               break_to:
 *                 type: string
 *     responses:
 *       200:
 *         description: Work shift updated
 */
router.put('/:id', authorize([1,2]), workShiftController.updateWorkShift);

/**
 * @swagger
 * /workshift/{id}:
 *   delete:
 *     summary: Delete a work shift by ID
 *     tags: [Work Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Work shift deleted
 */
router.delete('/:id', authorize([1,2]), workShiftController.deleteWorkShift);

module.exports = router;

const express = require('express');
const router = express.Router();
const activityTypeController = require('../controllers/activityTypeController');

/**
 * @swagger
 * /activity-types:
 *   get:
 *     summary: Get all activity types
 *     tags: [Activity Types]
 *     responses:
 *       200:
 *         description: List of activity types
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
 *                   description:
 *                     type: string
 */
router.get('/', activityTypeController.getAllActivityTypes);

module.exports = router;

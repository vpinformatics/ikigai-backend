const express = require("express");
const router = express.Router();
const activityDetailsController = require("../controllers/activityDetails.controller");
const { authorize } = require('../middlewares/authMiddleware');
/**
 * @swagger
 * tags:
 *   name: Activity Details
 *   description: API for managing activity details
 */

/**
 * @swagger
 * /activity-details:
 *   post:
 *     summary: Create a new activity detail
 *     tags: [Activity Details]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activity_id:
 *                 type: integer
 *               part_id:
 *                 type: integer
 *               total_checked_qty:
 *                 type: integer
 *               ok_qty:
 *                 type: integer
 *               rework_qty:
 *                 type: integer
 *               rejection_qty:
 *                 type: integer
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activity detail created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 activity_id:
 *                   type: integer
 *                 part_id:
 *                   type: integer
 *                 total_checked_qty:
 *                   type: integer
 *                 ok_qty:
 *                   type: integer
 *                 rework_qty:
 *                   type: integer
 *                 rejection_qty:
 *                   type: integer
 *                 remarks:
 *                   type: string
 */
router.post("/", authorize([1, 2]), activityDetailsController.createActivityDetail);

/**
 * @swagger
 * /activity-details/{activity_id}:
 *   get:
 *     summary: Get activity details by activity ID
 *     tags: [Activity Details]
 *     parameters:
 *       - in: path
 *         name: activity_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   activity_id:
 *                     type: integer
 *                   part_id:
 *                     type: integer
 *                   total_checked_qty:
 *                     type: integer
 *                   ok_qty:
 *                     type: integer
 *                   rework_qty:
 *                     type: integer
 *                   rejection_qty:
 *                     type: integer
 *                   remarks:
 *                     type: string
 */
router.get("/:activity_id", authorize([1, 2]), activityDetailsController.getActivityDetailsByActivityId);

/**
 * @swagger
 * /activity-details/{id}:
 *   put:
 *     summary: Update an activity detail
 *     tags: [Activity Details]
 */
router.put("/:id", authorize([1, 2]), activityDetailsController.updateActivityDetail);

/**
 * @swagger
 * /activity-details/{id}:
 *   delete:
 *     summary: Delete an activity detail entry
 *     tags: [Activity Details]
 */
router.delete("/:id", authorize([1, 2]), activityDetailsController.deleteActivityDetail);

module.exports = router;

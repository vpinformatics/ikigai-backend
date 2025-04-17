const express = require("express");
const router = express.Router();
const activityDataController = require("../controllers/activityData.controller");
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Activity Data
 *   description: API for managing activity data
 */

router.get('/get-payroll-summary-data/:month/:year', activityDataController.getPayrollSummaryData);

router.get("/get-summary-data/:service_contract_id/:month/:year", activityDataController.getsummaryData);

/**
 * @swagger
 * /activity-data/{service_contract_id}:
 *   get:
 *     summary: Get all activities for a specific service contract
 *     tags: [Activity Data]
 *     parameters:
 *       - in: path
 *         name: service_contract_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service contract
 *     responses:
 *       200:
 *         description: List of activity data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   service_contract_id:
 *                     type: integer
 *                   activity_date:
 *                     type: string
 *                     format: date
 *                   activity_type_id:
 *                     type: integer
 */
router.get("/:service_contract_id?", authorize([1, 2]), activityDataController.getAllActivities);

/**
 * @swagger
 * /activity-data/{id}:
 *   get:
 *     summary: Get activity data by ID
 *     tags: [Activity Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Activity data ID
 *     responses:
 *       200:
 *         description: Activity data details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 service_contract_id:
 *                   type: integer
 *                 activity_date:
 *                   type: string
 *                   format: date
 *                 activity_type_id:
 *                   type: integer
 */
router.get("/:id", authorize([1, 2]), activityDataController.getActivityById);

/**
 * @swagger
 * /activity-data:
 *   post:
 *     summary: Create a new activity
 *     tags: [Activity Data]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_contract_id:
 *                 type: integer
 *               activity_date:
 *                 type: string
 *                 format: date
 *               activity_type_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Activity data created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 service_contract_id:
 *                   type: integer
 *                 activity_date:
 *                   type: string
 *                   format: date
 *                 activity_type_id:
 *                   type: integer
 */
router.post("/", authorize([1, 2]), activityDataController.createActivity);

/**
 * @swagger
 * /activity-data/{id}:
 *   put:
 *     summary: Update an existing activity data
 *     tags: [Activity Data]
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
 *               service_contract_id:
 *                 type: integer
 *               activity_date:
 *                 type: string
 *                 format: date
 *               activity_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Activity data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 service_contract_id:
 *                   type: integer
 *                 activity_date:
 *                   type: string
 *                   format: date
 *                 activity_type_id:
 *                   type: integer
 */
router.put("/:id", authorize([1, 2]), activityDataController.updateActivity);

/**
 * @swagger
 * /activity-data/{id}:
 *   delete:
 *     summary: Delete an activity data entry
 *     tags: [Activity Data]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity data deleted successfully
 */
router.delete("/:id", authorize([1, 2]), activityDataController.deleteActivity);

router.get("/get-all-dates/:service_contract_id", authorize([1, 2]), activityDataController.getAllDates);

module.exports = router;

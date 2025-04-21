const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
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
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   is_active:
 *                     type: boolean
 */
router.get('/', authorize([1, 2]), userController.getAllUsers);

/**
 * @swagger
 * /users/loggedin:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 */
router.get('/loggedin', authorize([1, 2]), userController.getLoggedInUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
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
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 */
router.get('/:id', authorize([1, 2]), userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                    type: string
 *                 role_id:
 *                   type: integer
 *                 is_active:
 *                   type: boolean
 */
router.post('/', authorize([1, 2]), userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *               isUpdatePassword:
 *                 type: boolean
 *               password:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role_id:
 *                   type: integer
 *                 is_active:
 *                   type: boolean
 */
router.put('/:id', authorize([1, 2]), userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
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
 *         description: User deleted
 */
router.delete('/:id', authorize([1, 2]), userController.deleteUser);

router.get('/get-users-by-activityId/:activity_id', authorize([1, 2]), userController.getUsersByActivityId);

module.exports = router;
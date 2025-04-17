const express = require('express');
const router = express.Router();
const userPermissionsController = require('../controllers/userPermissions.controller');
const { authorize } = require('../middlewares/authMiddleware');

router.get('/:userId', authorize([1, 2]), userPermissionsController.getUserPermissionsByUserId);

module.exports = router;

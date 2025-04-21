const express = require('express');
const router = express.Router();
const userActivityController = require('../controllers/userActivityController');
const { authorize } = require('../middlewares/authMiddleware');

router.post('/', authorize([1, 2]), userActivityController.assignActivities);
router.get('/:userId', authorize([1, 2]), userActivityController.getUserActivities);
router.put('/:userId', authorize([1, 2]), userActivityController.updateUserActivities);
router.delete('/:userId/:activityId', authorize([1, 2]), userActivityController.removeUserActivity);

module.exports = router;

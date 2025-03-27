const express = require('express');
const router = express.Router();
const userClientController = require('../controllers/userClientController');
const { authorize } = require('../middlewares/authMiddleware');

router.post('/', authorize([1, 2]), userClientController.assignClients);
router.get('/:userId', authorize([1, 2]), userClientController.getUserClients);
router.put('/:userId', authorize([1, 2]), userClientController.updateUserClients);
router.delete('/:userId/:clientId', authorize([1, 2]), userClientController.removeUserClient);

module.exports = router;

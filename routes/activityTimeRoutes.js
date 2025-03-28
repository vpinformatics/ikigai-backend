const express = require("express");
const router = express.Router();
const ActivityTimeController = require("../controllers/activityTimeController");
const { authorize } = require('../middlewares/authMiddleware');

router.post("/", authorize([1, 2]), ActivityTimeController.createActivityTime);
//router.get("/", ActivityTimeController.getAllActivityTime);
router.get("/:id", authorize([1, 2]), ActivityTimeController.getActivityTimeById);
router.put("/:id", authorize([1, 2]), ActivityTimeController.updateActivityTime);
router.delete("/:id", authorize([1, 2]), ActivityTimeController.deleteActivityTime);

module.exports = router;

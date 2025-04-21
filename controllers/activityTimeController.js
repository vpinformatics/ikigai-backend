const ActivityTimeService = require("../services/activityTimeService");

exports.getAllActivityTimes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { activity_id } = req.params;

    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const activityTimes = await ActivityTimeService.getAllActivityTimes(userId, activity_id, filters, sort, page, limit);
    res.status(200).json({ success: true, data: activityTimes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

exports.getActivityTimeById = async (req, res) => {
  try {
    const activityTime = await ActivityTimeService.getActivityTimeById(req.params.id);
    if (!activityTime) return res.status(404).json({ message: "Activity Time not found" });
    res.json(activityTime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createActivityTime = async (req, res) => {
  try {
    const userId = req.user.id;
    const activityTimeId = await ActivityTimeService.createActivityTime(req.body, userId);
    res.status(201).json({ message: "Activity Time created", id: activityTimeId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateActivityTime = async (req, res) => {
  try {
    const userId = req.user.id;
    await ActivityTimeService.updateActivityTime(req.params.id, req.body, userId);
    res.json({ message: "Activity Time updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteActivityTime = async (req, res) => {
  try {
    await ActivityTimeService.deleteActivityTime(req.params.id);
    res.json({ message: "Activity Time deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

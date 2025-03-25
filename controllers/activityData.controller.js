const ActivityDataService = require("../services/activityData.service");
const ActivityDetailsService = require("../services/activityDetails.service");

exports.getAllActivities = async (req, res) => {
  try {
    const { service_contract_id } = req.params;
    const userId = req.user.id;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const activities = await ActivityDataService.getAllActivities(userId, service_contract_id, filters, sort, page, limit);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await ActivityDataService.getActivityById(req.params.id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const activityId = await ActivityDataService.createActivity(req.body);
    data = {activity_id: activityId , ...req.body}
    const activityDetailId = await ActivityDetailsService.createActivityDetail(data);
    
    res.status(201).json({ message: "Activity created", id: activityId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    await ActivityDataService.updateActivity(req.params.id, req.body);
    res.json({ message: "Activity updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    await ActivityDataService.deleteActivity(req.params.id);
    res.json({ message: "Activity deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const ActivityDataService = require("../services/activityData.service");
const ActivityDetailsService = require("../services/activityDetails.service");

exports.getAllActivities = async (req, res) => {
  try {
    const { activity_id } = req.params;
    const userId = req.user.id;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const activities = await ActivityDataService.getAllActivities(userId, activity_id, filters, sort, page, limit);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

exports.getAllDates = async (req,res) => {
  try {
    const { activity_id } = req.params;
    const data = await ActivityDataService.getAllDates(activity_id);
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

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
    const userId = req.user.id;

    const { activity_id, activity_date, activity_type_id } = req.body;

    var activity_data_id = await ActivityDataService.checkActivityByDateAndType(activity_id, activity_date, activity_type_id);
    if(!activity_data_id){
      activity_data_id = await ActivityDataService.createActivity(req.body);
    }
    data = {activity_id: activity_id, id: req.body.activity_detail_id , ...req.body}
    await ActivityDetailsService.updateActivityDetail(activity_data_id, data, userId);
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

exports.getsummaryData = async (req, res) => {
  try {
    const { activity_id, month, year } = req.params;
    const data = await ActivityDataService.getsummaryData(activity_id, month, year);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getPayrollSummaryData = async (req, res) => {
  try {
    const { month, year } = req.params;
    const result = await ActivityDataService.fetchPayrollSummary( +month, +year);
    res.json({ ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

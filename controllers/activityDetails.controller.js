const ActivityDetailsService = require("../services/activityDetails.service");

exports.createActivityDetail = async (req, res) => {
    try {
        const detailId = await ActivityDetailsService.createActivityDetail(req.body);
        res.status(201).json({ message: "Activity detail created successfully", id: detailId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getActivityDetailsByActivityId = async (req, res) => {
    try {
        const { activity_id } = req.params;
        const details = await ActivityDetailsService.getActivityDetailsByActivityId(activity_id);
        res.json(details);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateActivityDetail = async (req, res) => {
    try {
        const { id } = req.params;
        await ActivityDetailsService.updateActivityDetail(id, req.body);
        res.json({ message: "Activity detail updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteActivityDetail = async (req, res) => {
    try {
        const { id } = req.params;
        await ActivityDetailsService.deleteActivityDetail(id);
        res.json({ message: "Activity detail deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const userActivityService = require('../services/userActivityService');

// ✅ Assign multiple activities to a user (handles reactivation of soft-deleted records)
exports.assignActivities = async (req, res) => {
    try {
        const createdBy = req.user.id;
        const { userId, activityIds } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        await userActivityService.assignActivities(userId, activityIds, createdBy);
        res.status(201).json({ message: 'Activities assigned to user successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Fetch all activities assigned to a user
exports.getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const activities = await userActivityService.getUserActivities(userId);

        res.json(activities);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update assigned activities for a user (Soft delete old, Reactivate if necessary)
exports.updateUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const { activityIds, updatedBy } = req.body;

        if (!activityIds || activityIds.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        await userActivityService.updateUserActivities(userId, activityIds, updatedBy);
        res.json({ message: 'User activities updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Soft delete a activity assignment
exports.removeUserActivity = async (req, res) => {
    try {
        const { userId, activityId, deletedBy } = req.params;
        await userActivityService.removeUserActivity(userId, activityId, deletedBy);
        res.json({ message: 'Activity assignment soft-deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

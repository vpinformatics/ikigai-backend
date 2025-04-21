const db = require('../config/database');

// ✅ Assign multiple activitys to a user (Check existing, Reactivate if soft-deleted)
exports.assignActivities = async (userId, activityIds, createdBy) => {

    // Fetch current activity assignments
    const [currentActivities] = await db.query(
        'SELECT activity_id, is_deleted FROM user_activities WHERE user_id = ?',
        [userId]
    );

    const currentactivityIds = currentActivities.map(c => c.activity_id);

    // Find activities to Add (New Selections)
    const activitiesToAdd = activityIds.filter(c => !currentactivityIds.includes(c));

    // Find activities to Reactivate (Previously Soft Deleted)
    const activitiesToReactivate = currentActivities
        .filter(c => c.is_deleted === 1 && activityIds.includes(c.activity_id))
        .map(c => c.activity_id);

        // Find activities to Soft Delete (Removed Selections)
    const activitiesToDelete = currentActivities
        .filter(c => !activityIds.includes(c.activity_id))
        .map(c => c.activity_id);

        // Insert New activity Assignments
    for (const activityId of activitiesToAdd) {
        await db.query(
            'INSERT INTO user_activities (user_id, activity_id, created_by, is_deleted, created_on) VALUES (?, ?, ?, 0, NOW())',
            [userId, activityId, createdBy]
        );
    }

    // Reactivate Soft-Deleted activities
    for (const activityId of activitiesToReactivate) {
        await db.query(
            'UPDATE user_activities SET is_deleted = 0, updated_by = ?, updated_on = NOW() WHERE user_id = ? AND activity_id = ?',
            [createdBy, userId, activityId]
        );
    }

    // Soft Delete Removed Activities
    for (const activityId of activitiesToDelete) {
        await db.query(
            'UPDATE user_activities SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND activity_id = ?',
            [createdBy, userId, activityId]
        );
    }

};

// ✅ Fetch all active activities assigned to a user
exports.getUserActivities = async (userId) => {
    const [activities] = await db.query(`
        SELECT c.id, c.name, c.contact_person, c.contact_email
        FROM activities c
        JOIN user_activities uc ON c.id = uc.activity_id
        WHERE uc.user_id = ? AND uc.is_deleted = 0
    `, [userId]);

    return activities;
};

// ✅ Update assigned activities for a user (Soft delete old, Reactivate if necessary)
exports.updateUserActivities = async (userId, activityIds, updatedBy) => {
    // Soft delete existing assignments that are not in the new list
    await db.query(
        'UPDATE user_activities SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND activity_id NOT IN (?)',
        [updatedBy, userId, activityIds]
    );

    // Assign new activities (Reactivate if necessary)
    await exports.assignActivities(userId, activityIds, updatedBy);
};

// ✅ Soft delete a activity assignment from a user
exports.removeUserAtivity = async (userId, activityId, deletedBy) => {
    await db.query(
        'UPDATE user_activities SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND activity_id = ?',
        [deletedBy, userId, activityId]
    );
};

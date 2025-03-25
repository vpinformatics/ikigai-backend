const pool = require('../config/database');

    exports.createActivityDetail = async (data) => {
        const { activity_id, part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, created_by } = data;
        const [result] = await pool.query(
            `INSERT INTO activity_details 
            (activity_id, part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [activity_id, part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, created_by]
        );
        return result.insertId;
    }

    // Get Activity Details by Activity ID
    exports.getActivityDetailsByActivityId = async (activity_id) => {
        const [rows] = await pool.query(
            `SELECT ad.*, ws.shift_name, p.part_name 
             FROM activity_details ad
             JOIN work_shifts ws ON ad.work_shift_id = ws.id
             JOIN parts p ON ad.part_id = p.id
             WHERE ad.activity_id = ? AND ad.is_deleted = 0`,
            [activity_id]
        );
        return rows;
    }

    // Update Activity Detail
    exports.updateActivityDetail = async (id, data) => {
        const { part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, updated_by } = data;
        await pool.query(
            `UPDATE activity_details 
            SET part_id=?, work_shift_id=?, total_checked_qty=?, ok_qty=?, rework_qty=?, rejection_qty=?, remarks=?, updated_by=?, updated_on=CURRENT_TIMESTAMP 
            WHERE id=?`,
            [part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, updated_by, id]
        );
    }

    // Delete Activity Detail
    exports.deleteActivityDetail = async (id) => {
        await pool.query(
            `UPDATE activity_details SET is_deleted=1, deleted_on=CURRENT_TIMESTAMP WHERE id=?`,
            [id]
        );
    }


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
    exports.getActivityDetailsByActivityId = async (activity_details_id) => {
        const [rows] = await pool.query(
            `
            SELECT 
                ad.id, adt.activity_id, ad.part_id, ad.work_shift_id, ad.total_checked_qty, ad.ok_qty, ad.rework_qty, ad.rejection_qty, ad.rejection_percent, ad.remarks,
                adt.activity_id, adt.activity_date, adt.activity_type_id,
                ws.name, p.part_number, p.part_code 
            FROM 
                activity_details ad
                INNER JOIN activity_data adt ON adt.id = ad.activity_data_id
                JOIN work_shift ws ON ad.work_shift_id = ws.id
                JOIN parts p ON ad.part_id = p.id
            WHERE 
                ad.id = ? AND ad.is_deleted = 0 AND adt.is_deleted = 0;
            `,
            [activity_details_id]
        );
        return rows[0];
    }

    // Update Activity Detail
    exports.updateActivityDetail = async (activity_data_id, data, userId) => {
        const { activity_id, part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, activity_detail_id } = data;
        
        await pool.query(
            `UPDATE activity_details 
            SET activity_data_id = ?, part_id=?, work_shift_id=?, total_checked_qty=?, ok_qty=?, rework_qty=?, rejection_qty=?, remarks=?, updated_by=?, updated_on=CURRENT_TIMESTAMP 
            WHERE id = ?`,
            [activity_data_id, part_id, work_shift_id, total_checked_qty, ok_qty, rework_qty, rejection_qty, remarks, userId, activity_detail_id]
        );
    }

    // Delete Activity Detail
    exports.deleteActivityDetail = async (id) => {
        await pool.query(
            `UPDATE activity_details SET is_deleted=1, deleted_on=CURRENT_TIMESTAMP WHERE id=?`,
            [id]
        );
    }


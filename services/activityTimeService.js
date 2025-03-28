const pool = require("../config/database");

// Get all activity time records with optional filters, sorting, and pagination
exports.getAllActivityTimes = async (filters, sort, page, limit) => {
    try {
        const queryParams = [];
        let baseQuery = `FROM activity_time at
            INNER JOIN activity_data ad ON ad.id = at.activity_id
            INNER JOIN users u ON u.id = at.user_id
            INNER JOIN work_shift ws ON ws.id = at.work_shift_id
            WHERE at.is_deleted = 0`;

        // Apply Filters
        if (filters) {
            Object.keys(filters).forEach((key) => {
                const value = filters[key];
                if (key === "search" && value.trim()) {
                    const searchFields = ["u.name", "ws.name"];
                    const searchQuery = `(${searchFields.map(field => `${field} LIKE ?`).join(" OR ")})`;
                    baseQuery += ` AND ${searchQuery}`;
                    queryParams.push(...searchFields.map(() => `%${value}%`));
                } else {
                    baseQuery += ` AND ${key} = ?`;
                    queryParams.push(value);
                }
            });
        }

        let query = `
            SELECT at.*, ad.activity_date, u.name AS user_name, ws.name AS work_shift_name
            ${baseQuery}
        `;
        let countQuery = `SELECT COUNT(*) as count ${baseQuery}`;

        // Apply Sorting
        if (sort) {
            query += ` ORDER BY ${sort.field || "at.id"} ${sort.order || "ASC"}`;
        }

        // Apply Pagination
        let totalRecords = 0, totalPages = 0;
        if (page && limit) {
            const [countResult] = await pool.query(countQuery, queryParams);
            totalRecords = countResult[0].count;
            totalPages = Math.ceil(totalRecords / limit);
            query += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, (page - 1) * limit);
        }

        const [activityTimes] = await pool.query(query, queryParams);

        return {
            activityTimes,
            pagination: { currentPage: page, totalPages, totalRecords, hasPrev: page > 1, hasNext: page < totalPages }
        };
    } catch (err) {
        console.error("Error fetching activity times:", err);
        throw new Error("Internal Server Error");
    }
};

// Get a specific activity time record by ID
exports.getActivityTimeById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM activity_time WHERE id = ? AND is_deleted = 0", [id]);
    return rows[0];
};

// Create a new activity time entry
exports.createActivityTime = async (data, userId) => {
    console.log('createActivityTime()');
    const { activity_id, user_id, work_shift_id, work_start_datetime, work_end_datetime, 
        break_start_datetime, break_end_datetime, ot_hours, ot_is_chargable, 
        total_work_hours, total_break_hours, total_hours, ot_remarks } = data;

    const [result] = await pool.query(
        `INSERT INTO activity_time (activity_id, user_id, work_shift_id, work_start_datetime, work_end_datetime, 
            break_start_datetime, break_end_datetime, ot_hours, ot_is_chargable, ot_remarks,
            total_work_hours, total_break_hours, total_hours, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [activity_id, user_id, work_shift_id, work_start_datetime, work_end_datetime, 
            break_start_datetime, break_end_datetime, ot_hours, ot_is_chargable, ot_remarks,
            total_work_hours, total_break_hours, total_hours, userId]
    );

    return result.insertId;
};

// Update an existing activity time record
exports.updateActivityTime = async (id, data, userId) => {
    const { activity_id, user_id, work_shift_id, work_start_datetime, work_end_datetime, break_start_datetime, break_end_datetime, ot_hours, 
        ot_is_chargable, ot_remarks, updated_by } = data;

    await pool.query(
        `UPDATE activity_time 
        SET activity_id = ?, user_id = ?, work_shift_id = ?,  work_start_datetime = ?, work_end_datetime = ?, break_start_datetime = ?, break_end_datetime = ?, 
            ot_hours = ?, ot_is_chargable = ?, ot_remarks = ?, updated_by = ?, updated_on = NOW() 
        WHERE id = ?`,
        [activity_id, user_id, work_shift_id, 
            work_start_datetime, work_end_datetime, break_start_datetime, break_end_datetime, ot_hours, 
            ot_is_chargable, ot_remarks, userId, id]
    );
};

// Soft delete an activity time record
exports.deleteActivityTime = async (id) => {
    await pool.query("UPDATE activity_time SET is_deleted = 1, deleted_on = NOW() WHERE id = ?", [id]);
};

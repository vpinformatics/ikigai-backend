const pool = require("../config/database");

// Get all activity time records with optional filters, sorting, and pagination
exports.getAllActivityTimes = async (userId, activity_id, filters, sort, page, limit) => {
    try {
      const queryParams = [];
      const countParams = [];
      
      let query = `
          SELECT 
            sc.client_id,
            ad.id AS activity_id,
            ad.activity_id,
            at.id AS activity_time_id,
            ats.name as 'activity_type',
            ad.activity_date,
            ws.name AS work_shift_name,
            u.name as user_name,
            at.user_id,
            at.work_shift_id,
            at.work_start_datetime,
            at.work_end_datetime,
            at.break_start_datetime,
            at.break_end_datetime,
            at.ot_hours,
            at.ot_is_chargable,
            at.ot_remarks,
            at.total_work_hours,
            at.total_break_hours,
            at.total_hours
          FROM activity_data ad
          INNER JOIN activities sc ON sc.id = ad.activity_id
          INNER JOIN activity_types ats on ats.id = ad.activity_type_id
          INNER JOIN activity_time at ON at.activity_id = ad.id
          INNER JOIN work_shift ws ON ws.id = at.work_shift_id
          INNER JOIN users u ON u.id = at.user_id
          WHERE ad.is_deleted = 0 AND sc.is_deleted = 0 AND ats.is_deleted = 0
          AND at.is_deleted = 0 AND ws.is_deleted = 0 AND u.is_deleted = 0
              
      `;

      let countQuery = `
          SELECT COUNT(*) as count
          FROM activity_data ad
          INNER JOIN activities sc ON sc.id = ad.activity_id
          INNER JOIN activity_types ats on ats.id = ad.activity_type_id
          INNER JOIN activity_time at ON at.activity_id = ad.id
          INNER JOIN work_shift ws ON ws.id = at.work_shift_id
          INNER JOIN users u ON u.id = at.user_id
          WHERE ad.is_deleted = 0 AND sc.is_deleted = 0 AND ats.is_deleted = 0
          AND at.is_deleted = 0 AND ws.is_deleted = 0 AND u.is_deleted = 0
      `;

      if(activity_id){
        query += ` AND ad.activity_id = ?`;
        countQuery += ` AND ad.activity_id = ?`;
      }
    
      queryParams.push(activity_id);
      countParams.push(activity_id);
      
      // **Apply Filters**
      if (filters) {
          Object.keys(filters).forEach((key) => {
              const value = filters[key];

              // Ignore empty search filter
              if (key === "search" && (!value || !value.trim())) return;

              if (key === "search") {
                  const searchFields = [
                      "ats.name",
                      "u.email",
                      "u.name",
                      "ws.name",
                      "at.ot_remarks",
                      "ats.name"
                  ];
                  const searchQuery = `(${searchFields.map(field => `${field} LIKE ?`).join(" OR ")})`;

                  query += ` AND ${searchQuery}`;
                  countQuery += ` AND ${searchQuery}`;

                  const searchValue = `%${value}%`;
                  queryParams.push(...searchFields.map(() => searchValue));
                  countParams.push(...searchFields.map(() => searchValue));
              } else {
                  query += ` AND ${key} = ?`;
                  countQuery += ` AND ${key} = ?`;
                  queryParams.push(value);
                  countParams.push(value);
              }
          });
      }
      
      // **Apply Sorting**
      if (sort) {
          const sortField = sort.field || "ad.id";
          const sortOrder = sort.order || "ASC";
          query += ` ORDER BY ${sortField} ${sortOrder}`;
      }
      
      // **Apply Pagination**
      let totalRecords = 0;
      let totalPages = 0;
      let offset = 0;
      if (page && limit) {
          const [countResult] = await pool.query(countQuery, countParams);
          totalRecords = countResult[0].count;
          totalPages = Math.ceil(totalRecords / limit);
          offset = (page - 1) * limit;
          query += ` LIMIT ? OFFSET ?`;
          queryParams.push(limit, offset);
      }
      
      const [activities] = await pool.query(query, queryParams);

      return {
          activities,
          pagination: {
              currentPage: page,
              totalPages,
              totalRecords,
              hasPrev: page > 1,
              hasNext: page < totalPages
          }
      };
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    }
  };

// Get a specific activity time record by ID
exports.getActivityTimeById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM activity_time WHERE id = ? AND is_deleted = 0", [id]);
    return rows[0];
};

// Create a new activity time entry
exports.createActivityTime = async (data, userId) => {
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

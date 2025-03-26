const pool = require('../config/database');
exports.getAllActivities = async (userId, service_contract_id, filters, sort, page, limit) => {
  try {
    const queryParams = [];
    const countParams = [];
    
    let query = `
        SELECT 
            sc.client_id,
            ad.id AS activity_id,
            ad.service_contract_id,
            adtl.id AS activity_details_id,
            ats.name as 'activity_type',
            ad.activity_date,
            p.part_number,
            p.part_code,
            ws.name AS work_shift_name,
            total_checked_qty,
            ok_qty,
            rework_qty,
            rejection_qty,
            rejection_percent,
            remarks
        FROM activity_data ad
        INNER JOIN service_contracts sc ON sc.id = ad.service_contract_id
        INNER JOIN activity_types ats on ats.id = ad.activity_type_id
        INNER JOIN activity_details adtl ON adtl.activity_id = ad.id
        INNER JOIN parts p ON p.id = adtl.part_id
        INNER JOIN work_shift ws ON ws.id = adtl.work_shift_id
        WHERE ad.is_deleted = 0 
        AND adtl.is_deleted = 0
    `;

    let countQuery = `
        SELECT COUNT(*) as count
        FROM activity_data ad
        Inner Join activity_types ats on ats.id = ad.activity_type_id
        INNER JOIN activity_details adtl ON adtl.activity_id = ad.id
        INNER JOIN parts p ON p.id = adtl.part_id
        INNER JOIN work_shift ws ON ws.id = adtl.work_shift_id
        WHERE ad.is_deleted = 0 
        AND adtl.is_deleted = 0
    `;

    if(service_contract_id){
      query += ` AND ad.service_contract_id = ?`;
      countQuery += ` AND ad.service_contract_id = ?`;
    }
  
    queryParams.push(service_contract_id);
    countParams.push(service_contract_id);
    
    // **Apply Filters**
    if (filters) {
        Object.keys(filters).forEach((key) => {
            const value = filters[key];

            // Ignore empty search filter
            if (key === "search" && (!value || !value.trim())) return;

            if (key === "search") {
                const searchFields = [
                    "p.part_number",
                    "p.part_code",
                    "ws.name",
                    "remarks",
                    "service_contract_id",
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

  exports.getActivityById = async(id) => {
    const [rows] = await pool.query("SELECT * FROM activity_data WHERE id = ? AND is_deleted = 0", [id]);
    return rows[0];
  }

  exports.createActivity = async (data) => {
    const { service_contract_id, activity_date, activity_type_id, created_by } = data;

    // Check if the record already exists
    const [existing] = await pool.query(
        "SELECT id FROM activity_data WHERE service_contract_id = ? AND activity_date = ? AND activity_type_id = ?",
        [service_contract_id, activity_date, activity_type_id]
    );

    if (existing.length > 0) {
        return existing[0].id; // Return existing record ID
    }

    // Insert new record if not found
    const [result] = await pool.query(
        "INSERT INTO activity_data (service_contract_id, activity_date, activity_type_id, created_by) VALUES (?, ?, ?, ?)",
        [service_contract_id, activity_date, activity_type_id, created_by]
    );

    return result.insertId; // Return new record ID
  };

  exports.updateActivity= async(id, data) => {
    const { service_contract_id, activity_date, activity_type_id, updated_by } = data;
    await pool.query(
      "UPDATE activity_data SET service_contract_id=?, activity_date=?, activity_type_id=?, updated_by=?, updated_on=CURRENT_TIMESTAMP WHERE id=?",
      [service_contract_id, activity_date, activity_type_id, updated_by, id]
    );
  }

  exports.deleteActivity= async(id) => {
    await pool.query("UPDATE activity_data SET is_deleted = 1, deleted_on = NOW() WHERE id = ?", [id]);
  }

  exports.checkActivityByDateAndType = async(service_contract_id, activity_date, activity_type_id) => {
    const [rows] = await pool.query(`
      SELECT id 
      FROM activity_data 
      WHERE service_contract_id = ? 
        AND activity_date=?
        AND activity_type_id = ? 
        AND is_deleted = 0
      `, [service_contract_id, activity_date, activity_type_id]);
    return (rows.length > 0) ? rows[0].id: null; 
  }
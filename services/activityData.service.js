const pool = require('../config/database');
const moment = require('moment');

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

  exports.getAllDates = async(id) => {
    const [rows] = await pool.query(`
      SELECT 
        a.id as activity_id, 
        a.activity_date, 
        a.service_contract_id, 
        a.activity_type_id,
        ats.name as 'activity_name'
      FROM activity_data a
      INNER JOIN activity_details ad ON ad.activity_id = a.id
      INNER JOIN activity_types ats on ats.id = a.activity_type_id
      WHERE a.service_contract_id = ? AND a.is_deleted = 0 AND ad.is_deleted = 0;
      `, [id]);
    return rows;
  }

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

  exports.getsummaryData = async(service_contract_id, month, year) => {
    const [hoursData] = await pool.query(`
      select 
            a.activity_date, sum(at.total_hours) as hours 
      from activity_data a 
      INNER JOIN activity_time at on at.activity_id = a.id
      where a.is_deleted = 0 and at.is_deleted = 0
            and service_contract_id = ?
            AND YEAR(a.activity_date) = ?
            AND MONTH(a.activity_date) = ?
      group by a.activity_date 
      order by a.activity_date desc;
    `, [service_contract_id, year, month]);

    const [qtyData] = await pool.query(`
      select 
        a.activity_type_id, at.name as 'activity_type',
          sum(adt.total_checked_qty) as total_checked_qty, sum(adt.ok_qty) as ok_qty, 
          sum(adt.rework_qty) as rework_qty, sum(adt.rejection_qty) as rejection_qty 
      from activity_data a 
      INNER JOIN activity_details adt on adt.activity_id = a.id
      inner join activity_types at on at.id = a.activity_type_id
      where a.is_deleted = 0 and adt.is_deleted = 0
      and service_contract_id = ?
            AND YEAR(a.activity_date) = ?
            AND MONTH(a.activity_date) = ?
       group by a.activity_type_id, at.name;
    `, [service_contract_id, year, month]);

    const [activityData] = await pool.query(`
      select 
        ad.activity_type_id , at.name as activity_type, ad.activity_date, ws.name as shift,
        p.part_code, p.part_number, ads.total_checked_qty, ads.ok_qty, ads.rework_qty, ads.rejection_qty, ads.rejection_percent, ads.remarks
      from activity_data ad
        INNER JOIN activity_types at on at.id = ad.activity_type_id
        INNER JOIN activity_details ads on ads.activity_id = ad.id
        INNER JOIN parts p on p.id = ads.part_id
        INNER JOIN work_shift ws on ws.id = ads.work_shift_id
      where ad.is_deleted = 0 AND ads.is_deleted = 0 
        AND ad.service_contract_id = ?
        AND YEAR(ad.activity_date) = ?
        AND MONTH(ad.activity_date) = ?;
    `, [service_contract_id, year, month]);
   console.log(hoursData, qtyData, activityData);
    return {hoursData, qtyData, activityData};
  }

  exports.fetchPayrollSummary = async (month, year) => {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');
  
    const query = `
      WITH activity_minutes AS (
        SELECT
          u.id AS user_id,
          u.name AS user_name,
          DAY(ad.activity_date) AS day_of_month,
          TIMESTAMPDIFF(MINUTE, at.work_start_datetime, at.work_end_datetime)
            - TIMESTAMPDIFF(MINUTE, at.break_start_datetime, at.break_end_datetime) AS work_minutes,
          at.ot_hours * 60 AS ot_minutes
        FROM ikigai.users u
        LEFT JOIN ikigai.activity_time at ON u.id = at.user_id AND at.is_deleted = 0
        LEFT JOIN ikigai.activity_data ad ON ad.id = at.activity_id
          AND ad.activity_date BETWEEN '${startDate}' AND '${endDate}'
        WHERE u.is_deleted = 0 AND u.is_active = 1
      )
  
      SELECT
        user_id,
        user_name,
        ${Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          return `
            SUM(CASE WHEN day_of_month = ${day} THEN work_minutes ELSE 0 END) AS \`${day}DT\`,
            SUM(CASE WHEN day_of_month = ${day} THEN ot_minutes ELSE 0 END) AS \`${day}OT\`
          `;
        }).join(',')}
      FROM activity_minutes
      GROUP BY user_id, user_name
      ORDER BY user_id;
    `;
  
    const [rows] = await pool.query(query);
  
    const dailyTotals = {};
  
    for (const row of rows) {
      const userId = row.user_id;
      dailyTotals[userId] = {};
  
      for (let day = 1; day <= 31; day++) {
        const dtKey = `${day}DT`;
        const otKey = `${day}OT`;
        const totalDT = Number(row[dtKey] || 0);
        const totalOT = Number(row[otKey] || 0);
  
        dailyTotals[userId][day] = {
          totalDT,
          totalOT
        };
      }
    }
  
    return {
      data: rows,
      dailyTotals
    };
  };
  
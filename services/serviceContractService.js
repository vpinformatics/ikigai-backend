const pool = require('../config/database');
const { executeTransaction } = require('../utils/dbHelper');

exports.getAllServiceContracts = async (client_id) => {
    try {
        const [serviceContracts] = await pool.query(`
          SELECT 
              sc.id, 
              sc.client_id, 
              sc.activity_number,
              sc.service_contract_reference, 
              sc.service_contract_date, 
              sc.is_single_part, 
              sc.part_id, 
              sc.work_place_id, 
              wp.name AS work_place_name,
              p.part_number,
              p.part_code, 
              GROUP_CONCAT(sca.activity_type_id) AS activity_type_ids
          FROM activities sc
          LEFT JOIN activity_with_types sca ON sc.id = sca.activity_id
          LEFT JOIN work_place wp ON sc.work_place_id = wp.id
          LEFT JOIN parts p ON sc.part_id = p.id
          WHERE sc.is_deleted = 0 AND sc.client_id = ?
          GROUP BY sc.id, wp.id, wp.name;
      `, [client_id]);
        return serviceContracts;
    } catch (error) {
        throw error;
    }
};

exports.createServiceContract = async (serviceContractData, userId) => {
    //console.log('🚀 Creating Service Contract with Transaction');

    return executeTransaction(async (connection) => {
        const { client_id, service_contract_date, isSinglePart, partId, activityTypes, work_place_id, service_contract_reference } = serviceContractData;

        // Step 1️⃣: Get the current sequence for this month & year
        const [last_activity_number] = await connection.query(
            `SELECT 
                    CONCAT('IKIGAI-', LPAD(
                        IFNULL(
                        MAX(CAST(SUBSTRING_INDEX(activity_number, '-', -1) AS UNSIGNED)) + 1,
                        1
                        ),
                        4, '0'
                    )) AS new_activity_number
            FROM activities;`,
        );

        let nextSequence = 1;
        if (last_activity_number.length > 0) {
            nextSequence = last_activity_number[0].new_activity_number;
        }

        // Step 4️⃣: Insert service contract
        const contractInsertQuery = `
            INSERT INTO activities (client_id, activity_number, service_contract_reference, service_contract_date, is_single_part, part_id, created_by, updated_by, work_place_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.query(contractInsertQuery, [
            client_id,
            nextSequence,
            service_contract_reference,
            service_contract_date,
            isSinglePart,
            partId,
            userId,
            userId,
            work_place_id
        ]);

        const contractId = result.insertId;

        // Step 5️⃣: Insert activity types (if any)
        if (Array.isArray(activityTypes) && activityTypes.length > 0) {
            const activityInsertQuery = 'INSERT INTO activity_with_types (activity_id, activity_type_id) VALUES ?';
            const activityValues = activityTypes.map(id => [contractId, id]);
            await connection.query(activityInsertQuery, [activityValues]);
        }

        //console.log('✅ Service Contract Created:', contractId);
        return { id: contractId, service_contract_reference };
    });
};

exports.getServiceContractById = async (id) => {
    const contract = await pool.query(
        `SELECT * FROM activities WHERE id = ? AND is_deleted = 0`,
        [id]
    );

    const activities = await pool.query(
        `SELECT activity_type_id FROM activity_with_types WHERE activity_id = ?`,
        [id]
    );

    return { ...contract[0], activity_type_ids: activities.map(a => a.activity_type_id) };
};

exports.updateServiceContract = async (id, data, userId) => {
    // console.log('🚀 Updating Service Contract with Transaction', id);

    return executeTransaction(async (connection) => {
        const { service_contract_reference, service_contract_date, isSinglePart, partId, activityTypes, work_place_id } = data;

        // console.log('Step 1️⃣: Update the service contract');
        await connection.query(
            `UPDATE activities SET service_contract_reference = ?, service_contract_date = ?,  updated_by = ?, work_place_id = ? WHERE id = ?`,
            [service_contract_reference, service_contract_date, userId, work_place_id, id]
        );
        // console.log('Step 2️⃣: Delete existing activity types');
        await connection.query(`DELETE FROM activity_with_types WHERE activity_id = ?`, [id]);
        // Step 3️⃣: Insert new activity types (if any)
        if (Array.isArray(activityTypes) && activityTypes.length > 0) {
            const activityInsertQuery = 'INSERT INTO activity_with_types (activity_id, activity_type_id) VALUES ?';
            const activityValues = activityTypes.map(aid => [id, aid]);
            await connection.query(activityInsertQuery, [activityValues]);
        }
        // console.log('✅ Service Contract Updated:', id);
        return { id };
    });
};

exports.deleteServiceContract = async (id) => {
    await pool.query(`UPDATE activities SET is_deleted = 1, deleted_on = NOW() WHERE id = ?`, [id]);
};

exports.getServiceContractData = async (client_id, id) => {
    try {
        const [serviceContracts] = await pool.query(`
        SELECT 
            c.name as clientName,
            c.contact_person,
            c.contact_phone,
            c.contact_email,
            c.gst_number,
            sc.activity_number,
            sc.service_contract_reference, 
            sc.service_contract_date, 
            wp.name AS work_place_name
        FROM activities sc
        INNER JOIN clients c ON c.id = sc.client_id
        LEFT JOIN activity_with_types sca ON sc.id = sca.activity_id
        LEFT JOIN work_place wp ON sc.work_place_id = wp.id
        WHERE sc.is_deleted = 0 AND sc.client_id = ? AND sc.id = ?
          `, [client_id, id]);
        return serviceContracts;
    } catch (error) {
        throw error;
    }
};

exports.getAll = async () => {
    try {
        const [serviceContracts] = await pool.query(`
                SELECT 
                    sc.id,
                    c.name as clientName,
                    sc.activity_number,
                    sc.service_contract_reference 
                FROM activities sc
                INNER JOIN clients c ON c.id = sc.client_id
                LEFT JOIN work_place wp ON sc.work_place_id = wp.id
                WHERE sc.is_deleted = 0
                order by sc.id DESC
                `);
        return serviceContracts;
    } catch (error) {
        throw error;
    }
};

exports.getAllByUser = async (userId, filters, sort, page, limit) => {
    let query = `
    select 
        a.client_id,
        a.id as 'activity_id', 
        a.activity_number,
        c.name as 'company_name',
        ua.user_id,
        wp.name as 'work_place'
    from activities a
        inner join clients c on a.client_id = c.id
        inner join user_activities ua on ua.activity_id = a.id
        INNER JOIN work_place wp on wp.id = a.work_place_id
    WHERE c.status = 'active' AND ua.user_id = ${userId}
    `;
    let countQuery = `
    select 
        count(1) as count
    from activities a
    inner join clients c on a.client_id = c.id
    inner join user_activities ua on ua.activity_id = a.id
    INNER JOIN work_place wp on wp.id = a.work_place_id
    WHERE c.status = 'active' AND ua.user_id = ${userId} 
    `;
    const queryParams = [];
    const countParams = [];

    // Apply filters
    if (filters) {
        Object.keys(filters).forEach((key) => {
            const value = filters[key];

            // Ignore empty search filter
            if (key === "search" && (!value || !value.trim())) {
                return;
            }

            if (key === "search") {
                const searchFields = ["a.activity_number", "c.name", 'wp.name'];

                const tmpQuery = `(${searchFields.map(field => `${field} LIKE ?`).join(" OR ")})`;

                query += ` AND ${tmpQuery}`;
                countQuery += ` AND ${tmpQuery}`;

                // Push the same search value with wildcards for all fields
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

    // Apply sorting
    if (sort) {
        // if (sort.field == 'statusName') {
        //     sort.field = 'u.is_active';
        // }
        const sortField = sort.field || 'id';
        const sortOrder = sort.order || 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // Apply pagination
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
};

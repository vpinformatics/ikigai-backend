const pool = require('../config/database');
const { executeTransaction } = require('../utils/dbHelper');

exports.getAllServiceContracts = async (client_id) => {
  try {
    console.log(client_id);
      const [serviceContracts] = await pool.query(`
          SELECT 
              sc.id, 
              sc.client_id, 
              sc.service_contract_reference, 
              sc.service_contract_date, 
              sc.is_single_part, 
              sc.part_id, 
              GROUP_CONCAT(sca.activity_type_id) AS activity_type_ids
          FROM service_contracts sc
          LEFT JOIN service_contract_activity sca ON sc.id = sca.service_contract_id
          WHERE sc.is_deleted = 0 AND sc.client_id = ?
          GROUP BY sc.id
      `,[client_id]);
      return serviceContracts;
  } catch (error) {
      throw error;
  }
};

exports.createServiceContract = async (serviceContractData, userId) => {
    //console.log('🚀 Creating Service Contract with Transaction');

    return executeTransaction(async (connection) => {
        const { client_id, service_contract_date, isSinglePart, partId, activityTypes } = serviceContractData;

        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Step 1️⃣: Get the current sequence for this month & year
        const [sequenceResult] = await connection.query(
            "SELECT sequence FROM service_contract_sequence WHERE year = ? AND month = ? ORDER BY id DESC LIMIT 1",
            [currentYear, currentMonth]
        );

        let nextSequence = 1;
        if (sequenceResult.length > 0) {
            nextSequence = sequenceResult[0].sequence + 1;
        }

        // Step 2️⃣: Insert the new sequence
        await connection.query(
            "INSERT INTO service_contract_sequence (year, month, sequence) VALUES (?, ?, ?)",
            [currentYear, currentMonth, nextSequence]
        );

        // Step 3️⃣: Generate service contract reference
        const service_contract_reference = `IKI/IN/${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(nextSequence).padStart(2, '0')}`;

        // Step 4️⃣: Insert service contract
        const contractInsertQuery = `
            INSERT INTO service_contracts (client_id, service_contract_reference, service_contract_date, is_single_part, part_id, created_by, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await connection.query(contractInsertQuery, [
            client_id,
            service_contract_reference,
            service_contract_date,
            isSinglePart,
            partId,
            userId,
            userId
        ]);

        const contractId = result.insertId;

        // Step 5️⃣: Insert activity types (if any)
        if (Array.isArray(activityTypes) && activityTypes.length > 0) {
            const activityInsertQuery = 'INSERT INTO service_contract_activity (service_contract_id, activity_type_id) VALUES ?';
            const activityValues = activityTypes.map(id => [contractId, id]);
            await connection.query(activityInsertQuery, [activityValues]);
        }

        //console.log('✅ Service Contract Created:', contractId);
        return { id: contractId, service_contract_reference };
    });
};

exports.getServiceContractById = async (id) => {
    const contract = await pool.query(
        `SELECT * FROM service_contracts WHERE id = ? AND is_deleted = 0`, 
        [id]
    );

    const activities = await pool.query(
        `SELECT activity_type_id FROM service_contract_activity WHERE service_contract_id = ?`, 
        [id]
    );

    return { ...contract[0], activity_type_ids: activities.map(a => a.activity_type_id) };
};

exports.updateServiceContract = async (id, data, userId) => {
    //console.log('🚀 Updating Service Contract with Transaction');

    return executeTransaction(async (connection) => {
        const { service_contract_date, isSinglePart, partId, activityTypes } = data;

        // Step 1️⃣: Update the service contract
        await connection.query(
            `UPDATE service_contracts SET service_contract_date = ?, is_single_part = ?, part_id = ?, updated_by = ? WHERE id = ?`,
            [service_contract_date, isSinglePart, partId, userId, id]
        );

        // Step 2️⃣: Delete existing activity types
        await connection.query(`DELETE FROM service_contract_activity WHERE service_contract_id = ?`, [id]);

        // Step 3️⃣: Insert new activity types (if any)
        if (Array.isArray(activityTypes) && activityTypes.length > 0) {
            const activityInsertQuery = 'INSERT INTO service_contract_activity (service_contract_id, activity_type_id) VALUES ?';
            const activityValues = activityTypes.map(aid => [id, aid]);
            await connection.query(activityInsertQuery, [activityValues]);
        }

        //console.log('✅ Service Contract Updated:', id);
        return { id };
    });
};

exports.deleteServiceContract = async (id) => {
    await pool.query(`UPDATE service_contracts SET is_deleted = 1, deleted_on = NOW() WHERE id = ?`, [id]);
};

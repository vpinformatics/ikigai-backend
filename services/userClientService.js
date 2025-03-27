const db = require('../config/database');

// ✅ Assign multiple clients to a user (Check existing, Reactivate if soft-deleted)
exports.assignClients = async (userId, clientIds, createdBy) => {
    console.log('assignClients()');
    console.log('User ID:', userId);
    console.log('Assigned Clients:', clientIds);
    console.log('Created By:', createdBy);

    // Fetch current client assignments
    const [currentClients] = await db.query(
        'SELECT client_id, is_deleted FROM user_clients WHERE user_id = ?',
        [userId]
    );

    const currentClientIds = currentClients.map(c => c.client_id);
    console.log('Current Assigned Clients:', currentClientIds);

    // Find Clients to Add (New Selections)
    const clientsToAdd = clientIds.filter(c => !currentClientIds.includes(c));

    // Find Clients to Reactivate (Previously Soft Deleted)
    const clientsToReactivate = currentClients
        .filter(c => c.is_deleted === 1 && clientIds.includes(c.client_id))
        .map(c => c.client_id);

    // Find Clients to Soft Delete (Removed Selections)
    const clientsToDelete = currentClients
        .filter(c => !clientIds.includes(c.client_id))
        .map(c => c.client_id);

    console.log('Clients to Add:', clientsToAdd);
    console.log('Clients to Reactivate:', clientsToReactivate);
    console.log('Clients to Soft Delete:', clientsToDelete);

    // Insert New Client Assignments
    for (const clientId of clientsToAdd) {
        await db.query(
            'INSERT INTO user_clients (user_id, client_id, created_by, is_deleted, created_on) VALUES (?, ?, ?, 0, NOW())',
            [userId, clientId, createdBy]
        );
        console.log(`Inserted new client assignment: ${clientId}`);
    }

    // Reactivate Soft-Deleted Clients
    for (const clientId of clientsToReactivate) {
        await db.query(
            'UPDATE user_clients SET is_deleted = 0, updated_by = ?, updated_on = NOW() WHERE user_id = ? AND client_id = ?',
            [createdBy, userId, clientId]
        );
        console.log(`Reactivated client: ${clientId}`);
    }

    // Soft Delete Removed Clients
    for (const clientId of clientsToDelete) {
        await db.query(
            'UPDATE user_clients SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND client_id = ?',
            [createdBy, userId, clientId]
        );
        console.log(`Soft deleted client: ${clientId}`);
    }

    console.log('Client assignment process completed.');
};

// ✅ Fetch all active clients assigned to a user
exports.getUserClients = async (userId) => {
    const [clients] = await db.query(`
        SELECT c.id, c.name, c.contact_person, c.contact_email
        FROM clients c
        JOIN user_clients uc ON c.id = uc.client_id
        WHERE uc.user_id = ? AND uc.is_deleted = 0
    `, [userId]);

    return clients;
};

// ✅ Update assigned clients for a user (Soft delete old, Reactivate if necessary)
exports.updateUserClients = async (userId, clientIds, updatedBy) => {
    // Soft delete existing assignments that are not in the new list
    await db.query(
        'UPDATE user_clients SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND client_id NOT IN (?)',
        [updatedBy, userId, clientIds]
    );

    // Assign new clients (Reactivate if necessary)
    await exports.assignClients(userId, clientIds, updatedBy);
};

// ✅ Soft delete a client assignment from a user
exports.removeUserClient = async (userId, clientId, deletedBy) => {
    await db.query(
        'UPDATE user_clients SET is_deleted = 1, deleted_on = NOW(), updated_by = ? WHERE user_id = ? AND client_id = ?',
        [deletedBy, userId, clientId]
    );
};

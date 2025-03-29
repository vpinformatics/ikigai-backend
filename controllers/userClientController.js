const userClientService = require('../services/userClientService');

// ✅ Assign multiple clients to a user (handles reactivation of soft-deleted records)
exports.assignClients = async (req, res) => {
    try {
        const createdBy = req.user.id;
        const { userId, clientIds } = req.body;

        if (!userId || !clientIds || clientIds.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        await userClientService.assignClients(userId, clientIds, createdBy);
        res.status(201).json({ message: 'Clients assigned to user successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Fetch all clients assigned to a user
exports.getUserClients = async (req, res) => {
    try {
        const { userId } = req.params;
        const clients = await userClientService.getUserClients(userId);

        res.json(clients);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update assigned clients for a user (Soft delete old, Reactivate if necessary)
exports.updateUserClients = async (req, res) => {
    try {
        const { userId } = req.params;
        const { clientIds, updatedBy } = req.body;

        if (!clientIds || clientIds.length === 0) {
            return res.status(400).json({ message: 'Invalid request data' });
        }

        await userClientService.updateUserClients(userId, clientIds, updatedBy);
        res.json({ message: 'User clients updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Soft delete a client assignment
exports.removeUserClient = async (req, res) => {
    try {
        const { userId, clientId, deletedBy } = req.params;
        await userClientService.removeUserClient(userId, clientId, deletedBy);
        res.json({ message: 'Client assignment soft-deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

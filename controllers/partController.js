const partService = require('../services/partService');

exports.getParts = async (req, res) => {
    try {
        const { client_id } = req.params;
        const parts = await partService.getParts(client_id);
        res.status(200).json(parts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addPart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { part_number, part_code, client_id } = req.body;
        const newPart = await partService.addPart({ part_number, part_code, client_id, userId });
        res.status(201).json(newPart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePart = async (req, res) => {
    try {
        const { id } = req.params;
        const { part_number, part_code, updated_by } = req.body;
        const updatedPart = await partService.updatePart(id, { part_number, part_code, updated_by });
        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePart = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleted_by } = req.body;
        await partService.deletePart(id, deleted_by);
        res.status(200).json({ message: 'Part marked as deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

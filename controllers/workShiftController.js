const workShiftService = require('../services/workShiftService');

exports.getAllWorkShifts = async (req, res) => {
  try {
    const WorkShifts = await workShiftService.getAllWorkShifts(req.params.client_id);
    res.status(200).json(WorkShifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWorkShiftById = async (req, res) => {
  try {
    const WorkShift = await workShiftService.getWorkShiftById(req.params.id);
    if (!WorkShift) return res.status(404).json({ error: 'Work shift not found' });
    res.status(200).json(WorkShift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createWorkShift = async (req, res) => {
  try {
    const userId = req.user.id;
    const newShift = await workShiftService.createWorkShift(req.body, userId);
    res.status(201).json(newShift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateWorkShift = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedShift = await workShiftService.updateWorkShift(req.params.id, req.body, userId);
    res.status(200).json(updatedShift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteWorkShift = async (req, res) => {
  try {
    await workShiftService.deleteWorkShift(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const activityTypeService = require('../services/activityTypeService');

exports.getAllActivityTypes = async (req, res) => {
  try {
    const activityTypes = await activityTypeService.getAllActivityTypes();
    res.status(200).json(activityTypes);
  } catch (error) {
    console.error('Error fetching activity types:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const roleService = require('../services/roleService');


exports.getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

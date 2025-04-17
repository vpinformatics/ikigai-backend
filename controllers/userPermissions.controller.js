const userPermissionsService = require('../services/userPermissionsService');

exports.getUserPermissionsByUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
      const role = await userPermissionsService.getRoleByUserId(userId);
      if (!role) {
        return res.status(404).json({ message: 'User not found or role not assigned.' });
      }
  
      const allowedRoutes = await userPermissionsService.getPermissionsByRole(role);
      return res.json({ role, allowedRoutes });
  
    } catch (err) {
      console.error('Error fetching user permissions:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
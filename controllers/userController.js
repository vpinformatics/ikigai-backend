const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const users = await userService.getAllUsers(filters, sort, page, limit);
    res.status(200).json({ ...users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.createUser(req.body, userId);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.updateUser(req.params.id, req.body, userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).json({});
  } catch (error) {
    next(error);
  } 
};

exports.getUsersByClinetId = async (req, res, next) => {
  try{
      const data = await userService.getUsersByClinetId(req.params.client_id);
      res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
}
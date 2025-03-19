const workPlaceService = require('../services/workPlaceService');

exports.getAllWorkPlace = async (req, res, next) => {
  try {
    const workPlaces = await workPlaceService.getAllWorkPlace(req.params.client_id);
    res.status(200).json({ workPlaces });
  } catch (error) {
    next(error);
  }
};

exports.getWorkPlaceById = async (req, res, next) => {
  try {
    const workPlace = await workPlaceService.getWorkPlaceById(req.params.id);
    if (workPlace) {
      res.status(200).json(workPlace);
    } else {
      res.status(404).json({ message: 'Work Place not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.createWorkPlace = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const workPlace = await workPlaceService.createWorkPlace(req.body, userId);
    res.status(201).json({ workPlace });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkPlace = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const workPlace = await workPlaceService.updateWorkPlace(req.params.id, req.body, userId);
    res.status(200).json({ workPlace });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkPlace = async (req, res, next) => {
  try {
    await workPlaceService.deleteWorkPlace(req.params.id);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};
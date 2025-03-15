const clientService = require('../services/clientService');

exports.getAllClients = async (req, res, next) => {
  try {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const clients = await clientService.getAllClients(filters, sort, page, limit);
    res.status(200).json({ ...clients });
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = await clientService.createClient(req.body, userId);
    res.status(201).json({ client });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const client = await clientService.updateClient(req.params.id, req.body, userId);
    res.status(200).json({ client });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    await clientService.deleteClient(req.params.id);
    res.status(204).json({});
  } catch (error) {
    next(error);
  }
};
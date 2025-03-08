const clientService = require('../services/clientService');

exports.getAllClients = async (req, res, next) => {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json({ clients });
  } catch (error) {
    next(error);
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    res.status(200).json({ client });
  } catch (error) {
    next(error);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    const client = await clientService.createClient(req.body);
    res.status(201).json({ client });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
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
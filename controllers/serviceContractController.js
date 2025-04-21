const serviceContractService = require('../services/serviceContractService');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');
const { createExcelFile } = require('../services/excelService');

exports.getAllServiceContracts = async (req, res) => {
    try {
        const serviceContracts = await serviceContractService.getAllServiceContracts(req.params.client_id);
        res.status(200).json(serviceContracts);
    } catch (error) {
        console.error("Error fetching service contracts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createServiceContract = async (req, res) => {
    try {
        const userId = req.user.id;
        //console.log('📥 Received Request:', req.body);
        const { client_id, service_contract_reference, service_contract_date, isSinglePart, partId, activityTypes } = req.body;

        if (!client_id || !service_contract_reference || !service_contract_date || !activityTypes) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        //console.log("Activity Types:", activityTypes); // Log the activityTypes array

        if (!Array.isArray(activityTypes)) {
            return res.status(400).json({ error: "activityTypes must be an array" });
        }

        // Process activities (Ensuring activityTypes is not undefined)
        const activityIds = activityTypes.map((activity) => parseInt(activity)); // Potential crash point

        const contract = await serviceContractService.createServiceContract(req.body, userId);
        res.status(201).json(contract);
    } catch (error) {
        console.error('❌ Error Creating Service Contract:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getServiceContractById = async (req, res) => {
    try {
        const contract = await serviceContractService.getServiceContractById(req.params.id);
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateServiceContract = async (req, res) => {
    try {
        const contract = await serviceContractService.updateServiceContract(req.params.id, req.body);
        res.status(200).json(contract);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteServiceContract = async (req, res) => {
    try {
        await serviceContractService.deleteServiceContract(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getServiceContractData = async (req, res) => {
    try {
        const serviceContracts = await serviceContractService.getServiceContractData(req.params.client_id, req.params.id);
        res.status(200).json(serviceContracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const serviceContracts = await serviceContractService.getAll();
        // if (!serviceContracts || serviceContracts.length === 0) {
        //     return res.status(404).json({ message: "No service contracts found" });
        // }
        res.status(200).json(serviceContracts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

    const activities = await serviceContractService.getAllByUser(userId, filters, sort, page, limit);
    res.status(200).json({ ...activities });
  } catch (error) {
    next(error);
  }
};

exports.generateExcel = async (req, res) => {
    try {
        console.log('%cThis is a styled log message', 'background: #ffcccc; color: white; padding: 4px; border-radius: 4px;');

        const filePath = await createExcelFile(req.params.id);
        res.download(filePath, 'service contract report.xlsx', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('Error generating Excel file');
    }
};
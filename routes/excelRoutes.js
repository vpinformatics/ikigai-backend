const express = require('express');
const { generateExcel } = require('../controllers/excelController');

const router = express.Router();

// Route to generate Excel file
router.get('/generate', generateExcel);

module.exports = router;

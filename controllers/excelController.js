const { createExcelFile } = require('../services/excelService');

const generateExcel = async (req, res) => {
  try {
    console.log('Generating Excel file...');
    const filePath = await createExcelFile();
    res.download(filePath, 'Activity_Report.xlsx', (err) => {
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

module.exports = { generateExcel };

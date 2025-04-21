const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const createExcelFile = async (activity_id) => {
  const workbook = new ExcelJS.Workbook();
  
  // Sheet 1: Summary Report
  const summarySheet = workbook.addWorksheet('ACTIVITY SUMMARY');

  // Load logo image
  //const logoPath = path.join(__dirname, 'logo.png'); // Place your logo in the same directory
  const logoPath = path.join(__dirname, '..', 'assets', 'logo-ikigai.jpg'); 

  console.log('Logo Path:', logoPath); // Log the logo path for debugging
  if (fs.existsSync(logoPath)) {
      const logoImageId = workbook.addImage({
          filename: logoPath,
          extension: 'png',
      });

      // Add Image to the worksheet
      summarySheet.addImage(logoImageId, {
          tl: { col: 1.3, row: 1.3 }, // Adjust column & row for proper positioning
          ext: { width: 150, height: 40 }, // Set image size
      });
  }

  summarySheet.getRow(2).height = 35;

  summarySheet.mergeCells('B2:D3');

   // Merge Cells for Header
   summarySheet.mergeCells('E2:K3');
   summarySheet.getCell('E2').value = 'IKIGAI TECHNICAL SOLUTIONS PVT LTD';
   summarySheet.getCell('E2').alignment = { horizontal: 'center', vertical: 'middle' };
   summarySheet.getCell('E2').font = { name: 'Verdana', bold: true, size: 14 };

   summarySheet.mergeCells('B4:K4');
   summarySheet.getCell('B4').value = 'ACTIVITY SUMMARY REPORT';
   summarySheet.getCell('B4').alignment = { horizontal: 'center', vertical: 'middle' };
   summarySheet.getCell('B4').font = { name: 'Verdana', bold: true, size: 12 };
   summarySheet.getRow(4).height = 25;

   // Merge "MONTH" and "YEAR" in Center
   summarySheet.mergeCells('B5:C5');
   summarySheet.getCell('B5').value = 'MONTH: DECEMBER';
   summarySheet.getCell('B5').font = { bold: true };
   summarySheet.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };

   summarySheet.mergeCells('H5:I5');
   summarySheet.getCell('H5').value = 'YEAR: 2024';
   summarySheet.getCell('H5').font = { bold: true };
   summarySheet.getCell('H5').alignment = { horizontal: 'center', vertical: 'middle' };


   // Add Borders to All Cells
   summarySheet.eachRow((row) => {
       row.eachCell((cell) => {
           cell.border = {
               top: { style: 'thick' },
               bottom: { style: 'thick' },
               left: { style: 'thick' },
               right: { style: 'thick' }
           };
           //cell.font = { name: 'Verdana' };

       });
   });

   // Set file path
  const filePath = path.join(__dirname, '../exports/Activity_Report.xlsx');

  // Ensure directory exists
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // Write file
  await workbook.xlsx.writeFile(filePath);
  console.log('Excel file created successfully:', filePath);

  return filePath;
};

module.exports = { createExcelFile };

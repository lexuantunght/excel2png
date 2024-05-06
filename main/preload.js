const { contextBridge } = require('electron');
const ExcelJS = require('exceljs');
const fs = require('fs');

contextBridge.exposeInMainWorld('hehe', {
    excelToPng: async (inputFilePath) => {
        const workbook = new ExcelJS.Workbook();

        // Load the workbook
        await workbook.xlsx.readFile(inputFilePath);

        // Assuming the sheet you want to print is the first sheet, you can adjust accordingly
        const worksheet = workbook.getWorksheet(1);

        // Get the dimensions of the sheet
        const rowCount = worksheet.rowCount;
        const columnCount = worksheet.columnCount;
        const data = Array(rowCount).fill([]);

        // Loop through each cell and draw it on the canvas
        worksheet.eachRow((row, rowNumber) => {
            data[rowNumber - 1] = row.values;
        });

        return { rowCount, columnCount, data };
    },
});

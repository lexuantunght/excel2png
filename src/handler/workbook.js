import ExcelJS from 'exceljs';

class WorkbookJS {
    async getAllSheetNames(file) {
        const workbook = new ExcelJS.Workbook();
        const fileArrBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(fileArrBuffer);
        return workbook.worksheets.map((s) => ({ name: s.name, id: s.id }));
    }

    async process(file, sheetId) {
        const workbook = new ExcelJS.Workbook();
        const fileArrBuffer = await file.arrayBuffer();
        await workbook.xlsx.load(fileArrBuffer);

        // Assuming the sheet you want to print is the first sheet, you can adjust accordingly
        const worksheet = workbook.getWorksheet(sheetId);

        // Get the dimensions of the sheet
        const rowCount = worksheet.rowCount;
        const columnCount = worksheet.columnCount;

        let html =
            '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Excel Sheet</title></head><body>';
        html += '<table id="data-view" border="1">';

        // Iterate over all rows and cells
        worksheet.eachRow((row, rowNumber) => {
            html += '<tr>';
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                // Get the cell value and style
                const value = cell.value;
                const cellValue =
                    typeof value === 'object' && value !== null && value.richText
                        ? value.richText.map((part) => part.text).join('')
                        : value;

                // You can add more style processing here based on cell.style
                html += `<td>${cellValue || ''}</td>`;
            });
            html += '</tr>';
        });

        return { rowCount, columnCount, html };
    }
}

const Workbook = new WorkbookJS();
export default Workbook;

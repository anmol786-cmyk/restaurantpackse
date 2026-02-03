import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param filename Filename without extension
 * @param sheetName Name of the worksheet
 */
export function exportToExcel(data: any[], filename: string, sheetName: string = 'Sheet1') {
    // Convert JSON to Worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Create Workbook and append Worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Flatten nested object for Excel export
 * Useful for filtering specific fields
 */
export function flattenData(data: any[], mapFunction: (item: any) => any) {
    return data.map(mapFunction);
}

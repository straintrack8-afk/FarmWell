import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');

console.log('Reading Excel file:', excelPath);

const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('\n=== WORKBOOK INFO ===');
console.log('Sheet names:', wb.SheetNames);

wb.SheetNames.forEach((sheetName, idx) => {
    console.log(`\n=== SHEET ${idx + 1}: ${sheetName} ===`);
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws);

    console.log('Total rows:', data.length);

    if (data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
        console.log('\nFirst row sample:');
        console.log(JSON.stringify(data[0], null, 2));

        if (data.length > 1) {
            console.log('\nSecond row sample:');
            console.log(JSON.stringify(data[1], null, 2));
        }
    }
});

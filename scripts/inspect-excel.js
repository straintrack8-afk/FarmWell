import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');

console.log('Reading:', excelPath);

const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('\nSheets:', wb.SheetNames);

// Read first sheet
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws);

console.log('\nTotal rows:', data.length);
console.log('\nColumn names:');
if (data.length > 0) {
    Object.keys(data[0]).forEach((col, idx) => {
        console.log(`  ${idx + 1}. "${col}"`);
    });

    console.log('\n=== FIRST 3 ROWS (full data) ===');
    data.slice(0, 3).forEach((row, idx) => {
        console.log(`\nRow ${idx + 1}:`);
        console.log(JSON.stringify(row, null, 2));
    });
}

// Save to file for inspection
fs.writeFileSync(
    path.join(__dirname, 'excel-structure.json'),
    JSON.stringify({
        sheets: wb.SheetNames,
        totalRows: data.length,
        columns: data.length > 0 ? Object.keys(data[0]) : [],
        sampleData: data.slice(0, 5)
    }, null, 2)
);

console.log('\n✅ Saved structure to scripts/excel-structure.json');

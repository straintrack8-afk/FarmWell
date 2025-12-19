import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');
const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('=== COMPREHENSIVE EXCEL ANALYSIS ===\n');

const sheetsData = {};

wb.SheetNames.forEach((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws);

    sheetsData[sheetName] = {
        rowCount: data.length,
        columns: data.length > 0 ? Object.keys(data[0]) : [],
        sampleData: data.slice(0, 3)
    };

    console.log(`\n${'='.repeat(70)}`);
    console.log(`SHEET: ${sheetName}`);
    console.log('='.repeat(70));
    console.log(`Rows: ${data.length}`);

    if (data.length > 0) {
        console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
        console.log('\nSample data (first row):');
        console.log(JSON.stringify(data[0], null, 2));
    }
});

// Save comprehensive analysis
fs.writeFileSync(
    path.join(__dirname, 'excel-full-analysis.json'),
    JSON.stringify(sheetsData, null, 2)
);

console.log('\n\n=== SUMMARY ===');
Object.entries(sheetsData).forEach(([name, info]) => {
    console.log(`${name}: ${info.rowCount} rows, ${info.columns.length} columns`);
});

console.log('\n✅ Full analysis saved to scripts/excel-full-analysis.json');

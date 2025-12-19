import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');
const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('Available sheets:', wb.SheetNames);

// Try Disease_Details_Complete first
let sheetToUse = 'Disease_Details_Complete';
let ws = wb.Sheets[sheetToUse];

if (!ws) {
    // Try other possible sheet names
    const possibleNames = ['Diseases_Master_List', 'Disease_Summary_All104', 'Diseases'];
    for (const name of possibleNames) {
        if (wb.Sheets[name]) {
            sheetToUse = name;
            ws = wb.Sheets[name];
            break;
        }
    }
}

if (!ws) {
    console.error('Could not find disease data sheet!');
    process.exit(1);
}

console.log(`\nUsing sheet: ${sheetToUse}`);

const rawData = XLSX.utils.sheet_to_json(ws);
console.log(`Total rows: ${rawData.length}`);

if (rawData.length > 0) {
    console.log('\nColumns found:');
    Object.keys(rawData[0]).forEach((col, i) => {
        console.log(`  ${i + 1}. "${col}"`);
    });

    console.log('\nFirst 2 rows:');
    console.log(JSON.stringify(rawData.slice(0, 2), null, 2));
}

import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');
const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('=== EXAMINING ALL SHEETS ===\n');

wb.SheetNames.forEach((sheetName, idx) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`SHEET ${idx + 1}: ${sheetName}`);
    console.log('='.repeat(60));

    const ws = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws);

    console.log(`Total rows: ${data.length}`);

    if (data.length > 0) {
        console.log(`\nColumns (${Object.keys(data[0]).length}):`);
        Object.keys(data[0]).forEach((col, i) => {
            console.log(`  ${i + 1}. ${col}`);
        });

        console.log('\nFirst row sample:');
        const firstRow = data[0];
        Object.entries(firstRow).slice(0, 5).forEach(([key, value]) => {
            const displayValue = String(value).length > 50 ? String(value).substring(0, 50) + '...' : value;
            console.log(`  ${key}: ${displayValue}`);
        });

        if (data.length > 1) {
            console.log('\nSecond row sample:');
            const secondRow = data[1];
            Object.entries(secondRow).slice(0, 5).forEach(([key, value]) => {
                const displayValue = String(value).length > 50 ? String(value).substring(0, 50) + '...' : value;
                console.log(`  ${key}: ${displayValue}`);
            });
        }
    } else {
        console.log('(Empty sheet)');
    }
});

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
wb.SheetNames.forEach((name, idx) => {
    const ws = wb.Sheets[name];
    const data = XLSX.utils.sheet_to_json(ws);
    console.log(`${idx + 1}. ${name}: ${data.length} rows`);
});

import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXCEL_PATH = path.join(__dirname, '..', '..', 'Poultry_E_Diagnostic.xlsx');

console.log('Reading:', EXCEL_PATH);
const workbook = XLSX.readFile(EXCEL_PATH);

console.log('Sheet Names:', workbook.SheetNames);

const sheetName = 'Vaccine_recommendation';
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
    console.log(`❌ Sheet "${sheetName}" not found!`);
} else {
    console.log(`✅ Sheet "${sheetName}" found.`);
    console.log('Range (!ref):', sheet['!ref']);

    // Dump first few keys
    console.log('Keys:', Object.keys(sheet).slice(0, 10));
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../../Pig_commercial_final.json');

console.log('Testing file read...');
console.log('Input file path:', INPUT_FILE);
console.log('File exists:', fs.existsSync(INPUT_FILE));

try {
    const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
    const data = JSON.parse(rawData);
    console.log('✅ File loaded successfully');
    console.log('Categories:', data.categories?.length);
    console.log('Total questions:', data.total_questions);
} catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
}

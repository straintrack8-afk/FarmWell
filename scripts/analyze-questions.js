import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the complete questions file
const completeData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/data/swine/swine_questions_complete.json'), 'utf8')
);

console.log('=== ANALYZING SOURCE DATA ===\n');
console.log(`Total questions in source: ${completeData.total_questions}\n`);

let totalQuestions = 0;
completeData.categories.forEach((cat, idx) => {
    console.log(`${idx + 1}. ${cat.name} (${cat.id})`);
    console.log(`   Questions: ${cat.questions.length}`);
    console.log(`   Weight: ${cat.weight}`);
    totalQuestions += cat.questions.length;
    console.log('');
});

console.log(`Total counted: ${totalQuestions}`);
console.log(`Expected: ${completeData.total_questions}`);
console.log(`Difference: ${completeData.total_questions - totalQuestions}`);

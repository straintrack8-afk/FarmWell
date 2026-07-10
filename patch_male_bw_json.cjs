/**
 * patch_male_bw_json.js
 * Adds `male_bw_rearing` field to all 5 Layer PS breed JSON files.
 * Run from anywhere: node patch_male_bw_json.js
 * Safe: skips files that already have the field.
 * CRLF-safe: output uses \r\n line endings.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(
  'A:', 'Projects', 'FarmWell', 'FarmWell',
  'public', 'data', 'farmguide_data', 'breeds'
);

// Midpoint values (g) per breed, W1 onward
const MALE_BW = {
  'ps_layer_lohmann_brown.json': [
    65, 145, 245, 345, 445, 555, 675, 795, 915,
    1035, 1155, 1275, 1395, 1515, 1635, 1755, 1870, 1985
  ],
  'ps_layer_isa_brown.json': [
    85, 125, 220, 325, 440, 565, 700, 850, 1000,
    1160, 1320, 1480, 1610, 1720, 1820, 1920, 2015, 2100
  ],
  'ps_layer_hyline_brown.json': [
    79, 146, 235, 346, 478, 626, 784, 949, 1116,
    1278, 1434, 1582, 1718, 1843, 1956, 2057, 2147, 2228
  ],
  'ps_layer_hyline_w36.json': [
    // W-36 only has W1–W17 male data in PDF
    70, 134, 207, 292, 391, 501, 617, 732, 843,
    946, 1041, 1130, 1215, 1295, 1370, 1440, 1502
  ],
  'ps_layer_novogen_brown.json': [
    80, 150, 225, 330, 460, 600, 740, 880, 1020,
    1160, 1300, 1440, 1570, 1700, 1820, 1940, 2060, 2180
  ]
};

let allOk = true;

for (const [filename, bwValues] of Object.entries(MALE_BW)) {
  const filePath = path.join(BASE_DIR, filename);

  // --- Guard: file must exist ---
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File not found: ${filePath}`);
    allOk = false;
    continue;
  }

  // --- Read & parse ---
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`[ERROR] Cannot read ${filename}: ${e.message}`);
    allOk = false;
    continue;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`[ERROR] Invalid JSON in ${filename}: ${e.message}`);
    allOk = false;
    continue;
  }

  // --- Guard: skip if already patched ---
  if (Array.isArray(data.male_bw_rearing)) {
    console.log(`[SKIP]  ${filename} — male_bw_rearing already present (${data.male_bw_rearing.length} entries)`);
    continue;
  }

  // --- Build array ---
  data.male_bw_rearing = bwValues.map((bw_g, i) => ({ week: i + 1, bw_g }));

  // --- Write back with CRLF ---
  const output = JSON.stringify(data, null, 2).replace(/\n/g, '\r\n');
  try {
    fs.writeFileSync(filePath, output, 'utf8');
    console.log(`[DONE]  ${filename} — added male_bw_rearing (${bwValues.length} weeks)`);
  } catch (e) {
    console.error(`[ERROR] Cannot write ${filename}: ${e.message}`);
    allOk = false;
  }
}

console.log('\n' + (allOk ? '✅ All files processed successfully.' : '⚠️  Some files had errors — check output above.'));

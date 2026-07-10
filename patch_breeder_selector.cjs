// Simpan sebagai patch_breeder_selector.cjs di root project, lalu node patch_breeder_selector.cjs
const fs = require('fs');
const path = require('path');

const FILE = 'A:/Projects/FarmWell/FarmWell/src/modules/farmguide/pages/BreedSelector.jsx';
const raw = fs.readFileSync(FILE, 'utf8').replace(/^\uFEFF/, '');
const lines = raw.split('\n');

const CONSTANT = `
const LAYER_COMMERCIAL_BREEDS = [
  {
    id: 'hisex_brown',
    label: 'Hisex Brown',
    badge: 'Hendrix Genetics',
    jsonFile: '/data/farmguide_data/breeds/layer_commercial_hisex_brown.json',
    stats: [
      { label: 'Peak prod.', value: '97.0%' },
      { label: 'Avg egg wt', value: '61.5g' },
    ],
  },
  {
    id: 'hyline_brown',
    label: 'Hy-Line Brown',
    badge: 'Hy-Line International',
    jsonFile: '/data/farmguide_data/breeds/layer_commercial_hyline_brown.json',
    stats: [
      { label: 'Peak prod.', value: '93.6–98.5%' },
      { label: 'Avg egg wt', value: '61.2–65.0g' },
    ],
  },
  {
    id: 'isa_brown',
    label: 'ISA Brown',
    badge: 'Hendrix Genetics',
    jsonFile: '/data/farmguide_data/breeds/layer_commercial_isa_brown.json',
    stats: [
      { label: 'Peak prod.', value: '96.5%' },
      { label: 'Avg egg wt', value: '62.6g' },
    ],
  },
  {
    id: 'shaver_brown',
    label: 'Shaver Brown',
    badge: 'Hendrix Genetics',
    jsonFile: '/data/farmguide_data/breeds/layer_commercial_shaver_brown.json',
    stats: [
      { label: 'Peak prod.', value: '96.0%' },
      { label: 'Avg egg wt', value: '61.6g' },
    ],
  },
];`;

// Find function BreedSelector line index
const fnIdx = lines.findIndex(l => l.trim().startsWith('function BreedSelector'));
if (fnIdx === -1) { console.error('ERROR: function BreedSelector not found'); process.exit(1); }

// Insert constant before function
lines.splice(fnIdx, 0, ...CONSTANT.split('\n'));

// Update the ternary: add layer commercial branch
const ternaryIdx = lines.findIndex(l => l.includes("(moduleSlug === 'broiler') ? BROILER_BREEDS : []"));
if (ternaryIdx === -1) { console.error('ERROR: ternary not found'); process.exit(1); }
lines[ternaryIdx] = lines[ternaryIdx].replace(
  "(moduleSlug === 'broiler') ? BROILER_BREEDS : []",
  "(moduleSlug === 'broiler') ? BROILER_BREEDS\n    : (moduleSlug === 'layer') ? LAYER_COMMERCIAL_BREEDS : []"
);

const out = lines.join('\n').replace(/\n/g, '\r\n');
fs.writeFileSync(FILE, out, 'utf8');
console.log('DONE — BreedSelector.jsx patched');
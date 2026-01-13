// Script to convert Poultry Excel to JSON for the FarmWell Portal
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const EXCEL_PATH = path.join(__dirname, '..', '..', 'PoultryQuickDiagnosis.xlsx');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'poultry', 'diseases.json');

console.log('Reading Poultry Excel file:', EXCEL_PATH);

if (!fs.existsSync(EXCEL_PATH)) {
    console.error('❌ Excel file not found at:', EXCEL_PATH);
    process.exit(1);
}

// Read Excel file
const workbook = XLSX.readFile(EXCEL_PATH);

console.log('Sheet names:', workbook.SheetNames);

// Read Sheet 1 (diseases)
const sheet1Path = workbook.SheetNames[0];
const sheet1 = workbook.Sheets[sheet1Path];
const rawDiseases = XLSX.utils.sheet_to_json(sheet1);

// Read Sheet 2 (vaccines with photos)
let vaccineData = [];
if (workbook.SheetNames.length > 1) {
    const sheet2Path = workbook.SheetNames[1];
    const sheet2 = workbook.Sheets[sheet2Path];
    const rawVaccines = XLSX.utils.sheet_to_json(sheet2);

    console.log('\n=== VACCINE DATA (Sheet 2) ===');
    console.log('Total vaccine entries:', rawVaccines.length);

    if (rawVaccines.length > 0) {
        rawVaccines.forEach((v, i) => {
            const diseaseNosRaw = v['No Penyakit'] || v['Disease Number'] || v['No'] || '';
            const vaccineName = v['Nama Penyakit'] || v['Vaccine Name'] || v['Name'] || '';

            let diseaseNos = [];
            if (typeof diseaseNosRaw === 'number') {
                diseaseNos = [diseaseNosRaw];
            } else if (typeof diseaseNosRaw === 'string') {
                diseaseNos = diseaseNosRaw.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            }

            const photoFilename = vaccineName ?
                vaccineName.toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '') + '.png' : null;

            if (vaccineName && diseaseNos.length > 0) {
                vaccineData.push({
                    diseaseNos,
                    vaccineName,
                    photo: photoFilename
                });
            }
        });
    }
}

// Create vaccine lookup by disease ID
function getVaccinesForDisease(diseaseId) {
    return vaccineData
        .filter(v => v.diseaseNos.includes(diseaseId))
        .map(v => ({
            name: v.vaccineName,
            photo: v.photo
        }));
}

// Parse symptoms string into array
function parseSymptoms(symptomsStr) {
    if (!symptomsStr) return [];
    return symptomsStr
        .toString()
        .split(/[,;\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
}

// Parse age groups
function parseAgeGroups(ageStr) {
    if (!ageStr) return ['All ages'];
    const normalized = ageStr.toString().toLowerCase();

    const ageGroups = [];

    if (normalized.includes('day-old') || normalized.includes('day old')) {
        ageGroups.push('Day-old chicks (0-1 days)');
    }
    if (normalized.includes('chick') && (normalized.includes('1-7') || normalized.includes('1–7') || normalized.includes('0–14') || normalized.includes('1–14') || normalized.includes('1-14'))) {
        ageGroups.push('Chicks (1-7 days)');
    }
    if (normalized.includes('chick') && (normalized.includes('7-14') || normalized.includes('7–14') || normalized.includes('1–21') || normalized.includes('1-21'))) {
        ageGroups.push('Young chicks (7-14 days)');
    }
    if (normalized.includes('grower') || normalized.includes('2-8 week') || normalized.includes('2–8 week') || normalized.includes('2-5 week') || normalized.includes('3-6 week') || normalized.includes('4-12 week')) {
        ageGroups.push('Growers (2-8 weeks)');
    }
    if (normalized.includes('layer') || normalized.includes('adult') || normalized.includes('peak lay')) {
        ageGroups.push('Layers');
    }
    if (normalized.includes('broiler') || normalized.includes('meat')) {
        ageGroups.push('Broilers');
    }
    if (normalized.includes('breeder')) {
        ageGroups.push('Breeders');
    }
    if (normalized.includes('duckling') || normalized.includes('duck')) {
        ageGroups.push('Ducks');
    }
    if (normalized.includes('all age') || ageGroups.length === 0) {
        ageGroups.push('All ages');
    }

    return ageGroups;
}

// Check if zoonotic
function isZoonotic(zoonoticStr) {
    if (!zoonoticStr) return false;
    const lower = zoonoticStr.toString().toLowerCase();
    return lower.includes('yes');
}

// Parse vaccines from string
function parseVaccinesFromColumn(vaccineStr) {
    if (!vaccineStr) return [];
    return vaccineStr
        .toString()
        .split(/[\n,]+/)
        .map(v => v.trim().replace(/\r/g, ''))
        .filter(v => v.length > 0);
}

// Transform diseases
const diseases = rawDiseases.map((d, index) => {
    const id = d['No'] || index + 1;

    // Get vaccines from Sheet 2
    const vaccinesFromSheet2 = getVaccinesForDisease(id);

    // Also get vaccines from Sheet 1 column
    const vaccinesFromSheet1 = parseVaccinesFromColumn(d['Vaccine Recommendation']).map(name => ({
        name,
        photo: null
    }));

    // Merge vaccines
    const allVaccines = [...vaccinesFromSheet2];
    vaccinesFromSheet1.forEach(v1 => {
        if (!allVaccines.find(v2 => v2.name === v1.name)) {
            allVaccines.push(v1);
        }
    });

    return {
        id: id,
        name: d['Disease Name'] || 'Unknown',
        latinName: d['Latin/Scientific Name'] || '',
        category: d['Category'] || 'Other',
        ageGroups: parseAgeGroups(d['Age Groups Affected']),
        symptoms: parseSymptoms(d['Key Symptoms']),
        mortality: d['Mortality Impact'] || 'Variable',
        transmission: d['Transmission Route'] || 'Unknown',
        zoonotic: isZoonotic(d['Zoonotic Risk']),
        zoonoticNote: isZoonotic(d['Zoonotic Risk']) ? d['Zoonotic Risk'].toString().replace(/\*\*/g, '').replace(/^Yes – /, '').replace(/^Yes/, 'Can affect humans') : '',
        description: d['Description (Summary)'] || '',
        diagnosis: d['Diagnosis Method'] || '',
        controlPrevention: d['Control & Prevention'] || '',
        treatment: d['Treatment Options'] || '',
        vaccines: allVaccines,
        url: ''
    };
});

// Build symptom categories (Poultry specific)
const symptomCategories = {
    mortality: {
        label: "Mortality",
        symptoms: [
            "Sudden death",
            "High mortality",
            "Up to 100% mortality"
        ]
    },
    fever: {
        label: "Fever/Body Temperature",
        symptoms: [
            "Fever",
            "No fever"
        ]
    },
    locomotion: {
        label: "Locomotion/Nervous Signs",
        symptoms: [
            "Paralysis",
            "Leg weakness",
            "Leg paralysis",
            "Torticollis",
            "Ataxia",
            "Tremors",
            "Nervous signs",
            "Lameness",
            "Opisthotonos"
        ]
    },
    excretion: {
        label: "Excretion/Discharge Signs",
        symptoms: [
            "Diarrhea",
            "Green diarrhea",
            "White diarrhea",
            "Bloody diarrhea",
            "Sulfur-yellow diarrhea",
            "Nasal discharge",
            "Mucoid discharge",
            "Conjunctivitis"
        ]
    },
    respiratory: {
        label: "Respiratory Signs",
        symptoms: [
            "Gasping",
            "Coughing",
            "Respiratory distress",
            "Wheezing",
            "Coughing up bloody mucus",
            "Cyanosis",
            "Foamy eyes"
        ]
    },
    skin: {
        label: "Skin/Bodily Signs",
        symptoms: [
            "Swollen sinuses",
            "Facial swelling",
            "Swollen abdomen",
            "Swollen joints",
            "Ruffled feathers",
            "Pale comb",
            "Weight loss",
            "Poor growth",
            "Bruising",
            "Wart-like lesions",
            "Blue beak",
            "Gray iris"
        ]
    },
    production: {
        label: "Production Signs",
        symptoms: [
            "Drop in egg production",
            "Soft-shelled eggs",
            "Shell-less eggs",
            "Misshapen eggs"
        ]
    },
    general: {
        label: "General Signs",
        symptoms: [
            "Lethargy",
            "Depression",
            "Listlessness",
            "Dehydration",
            "Immunosuppression",
            "Death"
        ]
    }
};

// Age groups
const ageGroups = [
    { id: "day-old", label: "Day-old chicks (0-1 days)", shortLabel: "Day-old", icon: "🐣" },
    { id: "chicks", label: "Chicks (1-7 days)", shortLabel: "Chicks 1-7d", icon: "🐤" },
    { id: "young-chicks", label: "Young chicks (7-14 days)", shortLabel: "Young 7-14d", icon: "🐥" },
    { id: "growers", label: "Growers (2-8 weeks)", shortLabel: "Growers", icon: "🐔" },
    { id: "layers", label: "Layers", shortLabel: "Layers", icon: "🥚" },
    { id: "broilers", label: "Broilers", shortLabel: "Broilers", icon: "🍗" },
    { id: "breeders", label: "Breeders", shortLabel: "Breeders", icon: "🐓" },
    { id: "ducks", label: "Ducks", shortLabel: "Ducks", icon: "🦆" },
    { id: "all", label: "All ages", shortLabel: "All ages", icon: "✨" }
];

// Final output
const output = {
    diseases,
    symptomCategories,
    ageGroups,
    vaccines: vaccineData
};

// Ensure directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log('\n=== PROCESSED POULTRY DISEASES ===');
console.log('Total diseases:', diseases.length);
console.log(`✅ Saved to ${OUTPUT_PATH}`);

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const EXCEL_PATH = path.join(__dirname, '..', '..', 'Poultry_E_Diagnostic.xlsx');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'poultry', 'diseases.json');

console.log('Reading NEW Poultry Excel file:', EXCEL_PATH);

if (!fs.existsSync(EXCEL_PATH)) {
    console.error('❌ Excel file not found at:', EXCEL_PATH);
    process.exit(1);
}

// Read Excel file
const workbook = XLSX.readFile(EXCEL_PATH);

// Helper to get worksheet data
function getSheetData(name) {
    const sheet = workbook.Sheets[name];
    if (!sheet) return [];
    return XLSX.utils.sheet_to_json(sheet);
}

// Get all sheets
const ageGroupsRaw = getSheetData('Age_Groups');
const diseasesMaster = getSheetData('Diseases_Master_List');
const symptomCatsRaw = getSheetData('Symptom_Categories');
const symptomsRaw = getSheetData('Symptoms');
const ageMapping = getSheetData('Disease_AgeGroup_Mapping');
const symptomMapping = getSheetData('Disease_Symptom_Mapping');
const diseaseDetails = getSheetData('Disease_Details_Complete');
const vaccineSheetName = workbook.SheetNames.find(n => n.toLowerCase() === 'vaccine_recommendation') || 'Vaccine_recommendation';
const vaccineRaw = getSheetData(vaccineSheetName);

// Validate data loading
console.log('Loaded sheets:', {
    ageGroups: ageGroupsRaw.length,
    diseases: diseasesMaster.length,
    symptoms: symptomsRaw.length,
    details: diseaseDetails.length,
    vaccines: vaccineRaw.length
});

// 1. Process Age Groups
// Map new relational age groups to UI IDs
const ageGroupMap = {
    1: 'day-old',      // Brooding / Starter
    2: 'growers',      // Grower
    3: 'layers',       // Layer
    4: 'broilers',      // Broiler
    5: 'breeders',     // Breeder
    6: 'ducks'         // Duck (adjust as needed)
};

// UI Age Groups format
const ageGroups = [
    { id: "day-old", label: "Day-old chicks (0-1 days)", shortLabel: "Day-old", icon: "🐣" },
    { id: "growers", label: "Growers (2-8 weeks)", shortLabel: "Growers", icon: "🐔" },
    { id: "layers", label: "Layers", shortLabel: "Layers", icon: "🥚" },
    { id: "broilers", label: "Broilers", shortLabel: "Broilers", icon: "🍗" },
    { id: "breeders", label: "Breeders", shortLabel: "Breeders", icon: "🐓" },
    { id: "ducks", label: "Ducks", shortLabel: "Ducks", icon: "🦆" },
    { id: "all", label: "All ages", shortLabel: "All ages", icon: "✨" }
];

// 2. Process Symptom Categories and Symptoms
const symptomCategories = {};
symptomCatsRaw.forEach(cat => {
    // Map category names to UI keys if possible, or use sanitized names
    const key = cat.category_name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
    symptomCategories[key] = {
        label: cat.category_name,
        symptoms: []
    };
});

// Map symptoms to categories
symptomsRaw.forEach(sym => {
    const catKey = sym.category_name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
    if (symptomCategories[catKey]) {
        symptomCategories[catKey].symptoms.push(sym.symptom_name);
    }
});

// Process Vaccines Map
const vaccineMap = {};
vaccineRaw.forEach(v => {
    // Ensure ID is string for lookup
    const id = String(v.Vaccine_id).trim();
    if (id) {
        vaccineMap[id] = {
            id: id,
            name: v.Vaccine_Name,
            photo: v.Vaccine_photo, // Expected to be filename or URL
            details: v.Vaccine_details
        };
    }
});

console.log('Vaccine Map Keys:', Object.keys(vaccineMap));

// 3. Process Diseases
const diseases = diseaseDetails.map((detail, index) => {
    const master = diseasesMaster.find(m => m.disease_id === detail.disease_id) || {};

    // Get Age Groups from mapping
    const diseaseAges = ageMapping
        .filter(m => m.disease_id === detail.disease_id)
        .map(m => ageGroupMap[m.age_group_id])
        .filter(id => id); // Remove undefined

    if (diseaseAges.length === 0 || detail.age_groups_affected?.toLowerCase().includes('all')) {
        diseaseAges.push('day-old', 'growers', 'layers', 'broilers', 'breeders', 'ducks', 'all');
    }

    // Map to UI specific labels used in filterByAge
    const ageGroupLabels = [];
    if (diseaseAges.includes('all')) {
        ageGroupLabels.push('All ages');
    } else {
        if (diseaseAges.includes('day-old')) ageGroupLabels.push('Day-old chicks (0-1 days)');
        if (diseaseAges.includes('growers')) ageGroupLabels.push('Growers (2-8 weeks)');
        if (diseaseAges.includes('layers')) ageGroupLabels.push('Layers');
        if (diseaseAges.includes('broilers')) ageGroupLabels.push('Broilers');
        if (diseaseAges.includes('breeders')) ageGroupLabels.push('Breeders');
        if (diseaseAges.includes('ducks')) ageGroupLabels.push('Ducks');
    }

    // Get Symptoms from mapping
    const diseaseSymptoms = symptomMapping
        .filter(m => m.disease_id === detail.disease_id)
        .map(m => m.symptom_name);

    return {
        id: detail.disease_id,
        name: detail.disease_name,
        latinName: master.alternative_names || '',
        category: detail.category || 'Other',
        ageGroups: [...new Set(ageGroupLabels)],
        symptoms: [...new Set(diseaseSymptoms)],
        mortality: master.importance || 'Variable',
        transmission: detail.causes_transmission || 'Unknown',
        zoonotic: master.zoonotic?.toLowerCase().includes('yes'),
        zoonoticNote: master.zoonotic || '',
        description: detail.detailed_description || '',
        diagnosis: detail.diagnosis_methods || '',
        controlPrevention: detail.control_prevention || '',
        treatment: detail.treatment || '',
        vaccines: (() => {
            const raw = detail.Vaccine_recommendation;
            if (!raw) return [];
            // Assuming comma or semicolon separated IDs
            const ids = String(raw).split(/[;,]/).map(s => s.trim()).filter(s => s);

            // Debug first few lookups
            if (index < 3) {
                console.log(`Debug Lookup [${detail.disease_name}]:`, { raw, ids, found: ids.map(id => !!vaccineMap[id]) });
            }

            return ids.map(id => vaccineMap[id]).filter(v => v);
        })(),
        vaccineRecommendation: detail.vaccineRecommendation || '', // Keep old field just in case
        url: ''
    };
});

const output = {
    diseases,
    symptomCategories,
    ageGroups
};

// Ensure directory exists
const outputDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

console.log('\n=== PROCESSED NEW POULTRY DISEASES ===');
console.log('Total diseases:', diseases.length);
console.log(`✅ Saved to ${OUTPUT_PATH}`);

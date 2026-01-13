import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const EXCEL_PATH = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');

console.log('Reading NEW Swine Excel file:', EXCEL_PATH);

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

// 1. Process Symptom Categories and Symptoms for symptoms.json
const symptomCategoriesList = symptomCatsRaw.map(cat => {
    const categorySymptoms = symptomsRaw
        .filter(s => s.category_id === cat.category_id)
        .map(s => {
            // Count occurrences across all diseases
            const count = symptomMapping.filter(m => m.symptom_id === s.symptom_id).length;
            return {
                id: s.symptom_id.toString().toLowerCase().replace(/\s+/g, '_'),
                label: s.symptom_name,
                count: count
            };
        });

    return {
        id: cat.category_name.toLowerCase().split(' ')[0].replace(/[^a-z]/g, ''),
        name: cat.category_name,
        icon: cat.category_name.toLowerCase().includes('mortality') ? 'skull' :
            cat.category_name.toLowerCase().includes('digestive') ? 'droplet' :
                cat.category_name.toLowerCase().includes('respiratory') ? 'wind' :
                    cat.category_name.toLowerCase().includes('nervous') ? 'brain' :
                        cat.category_name.toLowerCase().includes('reproductive') ? 'heart' :
                            cat.category_name.toLowerCase().includes('skin') ? 'palette' : 'activity',
        symptoms: categorySymptoms
    };
});

const symptomsOutput = {
    categories: symptomCategoriesList,
    totalSymptoms: symptomsRaw.length
};

// 2. Process Diseases for pig-diseases.json
const diseases = diseaseDetails.map(detail => {
    const master = diseasesMaster.find(m => m.disease_id === detail.disease_id) || {};

    // Get Age Groups from mapping
    const diseaseAges = ageMapping
        .filter(m => m.disease_id === detail.disease_id)
        .map(m => {
            const ag = ageGroupsRaw.find(ag => ag.age_group_id === m.age_group_id);
            return ag ? ag.age_group_name : null;
        })
        .filter(name => name);

    if (diseaseAges.length === 0 || detail.age_groups_affected?.toLowerCase().includes('all')) {
        diseaseAges.push('All Ages');
        ageGroupsRaw.forEach(ag => diseaseAges.push(ag.age_group_name));
    }

    // Get Symptoms from mapping
    const diseaseSymptoms = symptomMapping
        .filter(m => m.disease_id === detail.disease_id)
        .map(m => m.symptom_name)
        .filter(s => s && typeof s === 'string');

    return {
        id: detail.disease_id,
        name: detail.disease_name,
        latinName: master.alternative_names || '',
        category: detail.category || 'Other',
        ageGroups: [...new Set(diseaseAges)],
        symptoms: [...new Set(diseaseSymptoms)],
        mortalityLevel: master.importance || 'Variable',
        transmission: detail.causes_transmission || 'Unknown',
        zoonoticRisk: master.zoonotic?.toLowerCase().includes('yes'),
        zoonoticDetails: master.zoonoticNote || master.zoonotic || '',
        description: detail.detailed_description || '',
        diagnosisMethod: detail.diagnosis_methods || '',
        controlPrevention: detail.control_prevention || '',
        treatmentOptions: detail.treatment || '',
        vaccines: [],
        url: ''
    };
});

// Write separate files for Swine
const DATA_DIR = path.join(__dirname, '..', 'public', 'data', 'swine');
const DISEASES_OUTPUT_PATH = path.join(DATA_DIR, 'pig-diseases.json');
const SYMPTOMS_OUTPUT_PATH = path.join(DATA_DIR, 'symptoms.json');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

fs.writeFileSync(DISEASES_OUTPUT_PATH, JSON.stringify(diseases, null, 2));
fs.writeFileSync(SYMPTOMS_OUTPUT_PATH, JSON.stringify(symptomsOutput, null, 2));

console.log('\n=== PROCESSED NEW SWINE DISEASES ===');
console.log('Total diseases:', diseases.length);
console.log(`✅ Saved to ${DISEASES_OUTPUT_PATH}`);
console.log(`✅ Saved to ${SYMPTOMS_OUTPUT_PATH}`);

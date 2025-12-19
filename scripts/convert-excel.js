/**
 * Enhanced Excel to JSON Converter for PigWell
 * Uses Disease_Details_Complete (updated) + Disease_Summary_All104 + relational mappings
 */

import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');
console.log('Reading:', excelPath);

const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

// Read all necessary sheets
const diseaseSummary = XLSX.utils.sheet_to_json(wb.Sheets['Disease_Summary_All104']);
const diseaseDetails = XLSX.utils.sheet_to_json(wb.Sheets['Disease_Details_Complete']);
const ageMapping = XLSX.utils.sheet_to_json(wb.Sheets['Disease_AgeGroup_Mapping']);
const symptomMapping = XLSX.utils.sheet_to_json(wb.Sheets['Disease_Symptom_Mapping']);
const masterSymptoms = XLSX.utils.sheet_to_json(wb.Sheets['Symptoms']);

console.log(`Found ${diseaseSummary.length} diseases in Disease_Summary_All104`);
console.log(`Found ${diseaseDetails.length} detailed descriptions in Disease_Details_Complete`);
console.log(`Found ${ageMapping.length} age group mappings`);
console.log(`Found ${symptomMapping.length} symptom mappings`);

// Helper functions
function cleanMarkdown(text) {
    if (!text) return '';
    return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').trim();
}

function isZoonotic(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return lower.includes('yes') || lower.includes('potential') || lower.includes('possible');
}

function parseMortalityLevel(text) {
    if (!text) return 'Unknown';
    const lower = text.toLowerCase();
    if (lower.includes('very high') || lower.includes('100%')) return 'Very High';
    if (lower.includes('high')) return 'High';
    if (lower.includes('moderate') || lower.includes('medium')) return 'Moderate';
    if (lower.includes('low')) return 'Low';
    if (lower.includes('minimal') || lower.includes('none')) return 'Minimal';
    return 'Variable';
}

// Build lookup maps
const detailsMap = {};
diseaseDetails.forEach(d => {
    detailsMap[d.disease_id] = d;
});

const ageGroupsMap = {};
ageMapping.forEach(m => {
    if (!ageGroupsMap[m.disease_id]) {
        ageGroupsMap[m.disease_id] = [];
    }
    ageGroupsMap[m.disease_id].push(m.age_group_name);
});

const symptomsMap = {};
symptomMapping.forEach(m => {
    if (!symptomsMap[m.disease_id]) {
        symptomsMap[m.disease_id] = [];
    }
    symptomsMap[m.disease_id].push(m.symptom_name);
});

// Convert diseases - prioritize Disease_Details_Complete for detailed info
const diseases = diseaseSummary.map((row) => {
    const diseaseId = row['ID'] || row['id'] || row['disease_id'];
    const details = detailsMap[diseaseId] || {};
    const ageGroups = ageGroupsMap[diseaseId] || ['All Ages'];
    const symptoms = symptomsMap[diseaseId] || [];

    // Get zoonotic info from master list
    const zoonoticText = row['Zoonotic'] || details.zoonotic_risk || '';

    return {
        id: diseaseId,
        name: cleanMarkdown(details.disease_name || row['Disease Name'] || row['disease_name'] || ''),
        latinName: details.latin_name || row['Latin Name'] || row['latin_name'] || '',
        category: details.category || row['Category'] || row['category'] || 'Other',
        ageGroups: ageGroups,
        symptoms: symptoms,
        mortality: cleanMarkdown(details.mortality_impact || row['Mortality Impact'] || ''),
        mortalityLevel: parseMortalityLevel(details.importance || row['Importance'] || ''),
        transmission: details.causes_transmission || details.transmission_route || row['Main Transmission'] || '',
        zoonoticRisk: isZoonotic(zoonoticText),
        zoonoticDetails: cleanMarkdown(zoonoticText),
        description: details.detailed_description || details.description || row['Short Description'] || '',
        diagnosisMethod: details.diagnosis_methods || details.diagnosis_method || '',
        controlPrevention: details.control_prevention || row['Primary Control'] || '',
        treatmentOptions: details.treatment || details.treatment_options || '',
        vaccineRecommendation: details.vaccine_recommendation || details.vaccine || '',
    };
});

// Filter valid diseases
const validDiseases = diseases.filter(d => d.name && d.name.length > 0);
console.log(`Processed ${validDiseases.length} valid diseases`);

// Create output directory
const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Write diseases
const outputPath = path.join(dataDir, 'pig-diseases.json');
fs.writeFileSync(outputPath, JSON.stringify(validDiseases, null, 2));
console.log(`✅ Wrote ${validDiseases.length} diseases to pig-diseases.json`);

// Build symptoms from master list
const symptomCounts = {};
masterSymptoms.forEach(s => {
    const symptomName = s.symptom_name || s.name;
    if (symptomName) {
        // Count how many diseases have this symptom
        const count = validDiseases.filter(d =>
            d.symptoms.some(ds => ds.toLowerCase().includes(symptomName.toLowerCase()))
        ).length;

        if (count > 0) {
            symptomCounts[symptomName] = count;
        }
    }
});

const symptomCategories = [
    { id: 'mortality', name: 'Mortality & Severity', icon: 'skull', symptoms: [] },
    { id: 'prevalence', name: 'Number of Affected Pigs', icon: 'users', symptoms: [] },
    { id: 'fever', name: 'Fever Status', icon: 'thermometer', symptoms: [] },
    { id: 'respiratory', name: 'Respiratory Signs', icon: 'wind', symptoms: [] },
    { id: 'digestive', name: 'Digestive / GI Signs', icon: 'droplet', symptoms: [] },
    { id: 'nervous', name: 'Nervous / Neurological Signs', icon: 'brain', symptoms: [] },
    { id: 'reproductive', name: 'Reproductive Signs', icon: 'heart', symptoms: [] },
    { id: 'skin', name: 'Skin / Dermatological Signs', icon: 'palette', symptoms: [] },
    { id: 'general', name: 'General / Systemic Signs', icon: 'activity', symptoms: [] }
];

const categoryKeywords = {
    mortality: ['mortality', 'death', 'sudden'],
    prevalence: ['affected', 'prevalence', 'number', 'percentage'],
    fever: ['fever', 'temperature', 'pyrexia'],
    respiratory: ['cough', 'sneez', 'breath', 'nasal', 'pneumonia', 'respiratory'],
    digestive: ['diarrhea', 'vomit', 'constipation', 'bloat', 'abdominal', 'feces'],
    nervous: ['tremor', 'seizure', 'paralysis', 'ataxia', 'convulsion', 'nervous'],
    reproductive: ['abortion', 'stillborn', 'mummif', 'litter', 'mastitis', 'farrowing'],
    skin: ['skin', 'jaundice', 'lesion', 'rash', 'discolor', 'vesicle', 'cyanosis'],
    general: ['weakness', 'lethargy', 'anorexia', 'weight', 'growth', 'dehydration']
};

Object.entries(symptomCounts).forEach(([symptom, count]) => {
    const lower = symptom.toLowerCase();
    let categorized = false;

    for (const [catId, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => lower.includes(kw))) {
            symptomCategories.find(c => c.id === catId).symptoms.push({
                id: symptom.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                label: symptom,
                count: count
            });
            categorized = true;
            break;
        }
    }

    if (!categorized) {
        symptomCategories.find(c => c.id === 'general').symptoms.push({
            id: symptom.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            label: symptom,
            count: count
        });
    }
});

symptomCategories.forEach(cat => {
    cat.symptoms.sort((a, b) => b.count - a.count);
});

const symptomsData = {
    categories: symptomCategories,
    totalSymptoms: Object.keys(symptomCounts).length
};

const symptomsOutputPath = path.join(dataDir, 'symptoms.json');
fs.writeFileSync(symptomsOutputPath, JSON.stringify(symptomsData, null, 2));
console.log(`✅ Wrote ${Object.keys(symptomCounts).length} symptoms to symptoms.json`);

console.log('\n=== SUMMARY ===');
console.log(`Diseases: ${validDiseases.length}`);
console.log(`Symptoms: ${Object.keys(symptomCounts).length}`);
console.log(`Zoonotic: ${validDiseases.filter(d => d.zoonoticRisk).length}`);
console.log(`With detailed descriptions: ${validDiseases.filter(d => d.description).length}`);
console.log('\n✅ Database updated with enhanced Disease_Details_Complete data!');

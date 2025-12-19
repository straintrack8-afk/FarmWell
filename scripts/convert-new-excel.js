/**
 * Excel to JSON Converter for NEW Pig E-Diagnostics Database
 * Handles multi-sheet normalized structure
 */

import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the new Excel file
const excelPath = path.join(__dirname, '..', '..', 'Pig_E_Diagnostic.xlsx');
console.log('Reading Excel file:', excelPath);

const fileBuffer = fs.readFileSync(excelPath);
const wb = XLSX.read(fileBuffer, { type: 'buffer' });

console.log('Available sheets:', wb.SheetNames);

// Read the comprehensive disease summary sheet
const diseaseSheet = wb.Sheets['Disease_Summary_All104'];
if (!diseaseSheet) {
    console.error('❌ Disease_Summary_All104 sheet not found!');
    console.log('Available sheets:', wb.SheetNames);
    process.exit(1);
}

const rawDiseases = XLSX.utils.sheet_to_json(diseaseSheet);
console.log(`Found ${rawDiseases.length} diseases in Disease_Summary_All104`);

// Read symptoms sheet
const symptomsSheet = wb.Sheets['Symptoms'];
const rawSymptoms = symptomsSheet ? XLSX.utils.sheet_to_json(symptomsSheet) : [];
console.log(`Found ${rawSymptoms.length} symptoms in Symptoms sheet`);

// Helper functions from original script
function cleanMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .trim();
}

function parseAgeGroups(ageText) {
    if (!ageText) return ['All Ages'];

    const cleaned = cleanMarkdown(ageText.toLowerCase().trim());
    const result = new Set();

    // Age group patterns
    if (cleaned.includes('newborn') || cleaned.includes('neonatal') || cleaned.includes('0-7 days') || cleaned.includes('1-7 days')) {
        result.add('Newborn (0-7 days)');
    }
    if (cleaned.includes('suckling') || cleaned.includes('nursing') || cleaned.includes('0-3 weeks')) {
        result.add('Suckling (0-3 weeks)');
    }
    if (cleaned.includes('weaned') || cleaned.includes('weaners') || cleaned.includes('3-8 weeks')) {
        result.add('Weaned (3-8 weeks)');
    }
    if (cleaned.includes('grower') || cleaned.includes('growing') || cleaned.includes('2-4 months')) {
        result.add('Growers (2-4 months)');
    }
    if (cleaned.includes('finisher') || cleaned.includes('finishing') || cleaned.includes('4-6 months')) {
        result.add('Finishers (4-6 months)');
    }
    if (cleaned.includes('sow') || cleaned.includes('gilt')) {
        result.add('Sows');
    }
    if (cleaned.includes('boar')) {
        result.add('Boars');
    }
    if (cleaned.includes('all ages') || cleaned.includes('any age') || cleaned.includes('all pigs')) {
        result.add('All Ages');
    }
    if (cleaned.includes('piglet') && result.size === 0) {
        result.add('Suckling (0-3 weeks)');
        result.add('Weaned (3-8 weeks)');
    }
    if (cleaned.includes('adult') && !result.has('Sows') && !result.has('Boars')) {
        result.add('Sows');
        result.add('Boars');
    }

    return result.size > 0 ? Array.from(result) : ['All Ages'];
}

function parseSymptoms(symptomText) {
    if (!symptomText) return [];

    const cleaned = cleanMarkdown(symptomText);
    const symptoms = new Set();

    // Split by common delimiters
    const parts = cleaned.split(/[;,]/);

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Handle parenthetical sub-symptoms
        const parenthMatch = trimmed.match(/^([^(]+)\s*\(([^)]+)\)/);

        if (parenthMatch) {
            const mainSymptom = parenthMatch[1].trim();
            const subSymptoms = parenthMatch[2].split(/,|and|or/).map(s => s.trim()).filter(s => s);

            for (const sub of subSymptoms) {
                const cleanSub = sub.replace(/sometimes|occasionally/gi, '').trim();
                if (cleanSub) {
                    symptoms.add(normalizeSymptom(`${mainSymptom} - ${cleanSub}`));
                }
            }

            // Add remaining text after parenthesis
            const afterParen = trimmed.substring(trimmed.indexOf(')') + 1).trim();
            if (afterParen.startsWith(',')) {
                const remaining = afterParen.substring(1).split(',');
                for (const r of remaining) {
                    if (r.trim()) {
                        symptoms.add(normalizeSymptom(r.trim()));
                    }
                }
            }
        } else {
            symptoms.add(normalizeSymptom(trimmed));
        }
    }

    return Array.from(symptoms);
}

function normalizeSymptom(symptom) {
    let normalized = symptom.trim();
    normalized = normalized.replace(/^[-•]\s*/, '');
    normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
    return normalized;
}

function isZoonotic(zoonoticText) {
    if (!zoonoticText) return false;
    const lower = zoonoticText.toLowerCase();
    return lower.includes('yes') || lower.includes('potential') || lower.includes('possible');
}

function parseMortalityLevel(mortalityText) {
    if (!mortalityText) return 'Unknown';
    const lower = mortalityText.toLowerCase();

    if (lower.includes('very high') || lower.includes('100%') || lower.includes('extremely high')) {
        return 'Very High';
    }
    if (lower.includes('high')) {
        return 'High';
    }
    if (lower.includes('moderate') || lower.includes('medium')) {
        return 'Moderate';
    }
    if (lower.includes('low')) {
        return 'Low';
    }
    if (lower.includes('none') || lower.includes('minimal') || lower.includes('negligible')) {
        return 'Minimal';
    }

    return 'Variable';
}

// Inspect first row to understand column names
if (rawDiseases.length > 0) {
    console.log('\nColumn names in Disease_Summary_All104:');
    Object.keys(rawDiseases[0]).forEach((col, idx) => {
        console.log(`  ${idx + 1}. "${col}"`);
    });
}

// Convert diseases
const diseases = rawDiseases.map((row, index) => {
    // Try to find the right column names (they might vary)
    const getId = () => row['ID'] || row['No'] || row['Disease_ID'] || index + 1;
    const getName = () => row['Disease_Name'] || row['Disease Name'] || row['Name'] || '';
    const getLatinName = () => row['Latin_Name'] || row['Latin/Scientific Name'] || row['Scientific_Name'] || '';
    const getCategory = () => row['Category'] || row['Disease_Category'] || 'Other';
    const getAgeGroups = () => row['Age_Groups'] || row['Age Groups Affected'] || row['Age_Groups_Affected'] || '';
    const getSymptoms = () => row['Key_Symptoms'] || row['Key Symptoms'] || row['Symptoms'] || '';
    const getMortality = () => row['Mortality'] || row['Mortality Impact'] || row['Mortality_Impact'] || '';
    const getTransmission = () => row['Transmission'] || row['Transmission Route'] || row['Transmission_Route'] || '';
    const getZoonotic = () => row['Zoonotic'] || row['Zoonotic Risk'] || row['Zoonotic_Risk'] || '';
    const getDescription = () => row['Description'] || row['Description (Summary)'] || row['Summary'] || '';
    const getDiagnosis = () => row['Diagnosis'] || row['Diagnosis Method'] || row['Diagnosis_Method'] || '';
    const getControl = () => row['Control'] || row['Control & Prevention'] || row['Control_Prevention'] || '';
    const getTreatment = () => row['Treatment'] || row['Treatment Options'] || row['Treatment_Options'] || '';
    const getVaccine = () => row['Vaccine'] || row['Vaccine Recommendation'] || row['Vaccine_Recommendation'] || '';

    const symptoms = parseSymptoms(getSymptoms());

    return {
        id: getId(),
        name: cleanMarkdown(getName()),
        latinName: getLatinName(),
        category: getCategory(),
        ageGroups: parseAgeGroups(getAgeGroups()),
        symptoms: symptoms,
        mortality: cleanMarkdown(getMortality()),
        mortalityLevel: parseMortalityLevel(getMortality()),
        transmission: getTransmission(),
        zoonoticRisk: isZoonotic(getZoonotic()),
        zoonoticDetails: cleanMarkdown(getZoonotic()),
        description: getDescription(),
        diagnosisMethod: getDiagnosis(),
        controlPrevention: getControl(),
        treatmentOptions: getTreatment(),
        vaccineRecommendation: getVaccine(),
    };
});

// Filter out empty diseases
const validDiseases = diseases.filter(d => d.name && d.name.length > 0);

console.log(`\nProcessed ${validDiseases.length} valid diseases (filtered from ${diseases.length})`);

// Create output directory
const dataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Write diseases JSON
const outputPath = path.join(dataDir, 'pig-diseases.json');
fs.writeFileSync(outputPath, JSON.stringify(validDiseases, null, 2));
console.log(`✅ Wrote ${validDiseases.length} diseases to ${outputPath}`);

// Build symptom categories
const symptomCounts = {};
validDiseases.forEach(disease => {
    disease.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
});

const symptomCategories = [
    { id: 'mortality', name: 'Mortality & Severity', icon: 'skull', symptoms: [] },
    { id: 'digestive', name: 'Digestive / GI Signs', icon: 'droplet', symptoms: [] },
    { id: 'respiratory', name: 'Respiratory Signs', icon: 'wind', symptoms: [] },
    { id: 'nervous', name: 'Nervous / Neurological Signs', icon: 'brain', symptoms: [] },
    { id: 'reproductive', name: 'Reproductive Signs', icon: 'heart', symptoms: [] },
    { id: 'skin', name: 'Skin / Dermatological Signs', icon: 'palette', symptoms: [] },
    { id: 'general', name: 'General / Systemic Signs', icon: 'thermometer', symptoms: [] },
    { id: 'musculoskeletal', name: 'Musculoskeletal Signs', icon: 'bone', symptoms: [] },
    { id: 'head', name: 'Head / Facial Signs', icon: 'eye', symptoms: [] }
];

const categoryKeywords = {
    mortality: ['death', 'mortality', 'sudden death'],
    digestive: ['diarrhea', 'vomit', 'constipation', 'bloat', 'abdominal', 'feces', 'stool', 'rectal'],
    respiratory: ['cough', 'sneez', 'breath', 'nasal', 'pneumonia', 'respiratory', 'lung'],
    nervous: ['tremor', 'seizure', 'paralysis', 'ataxia', 'incoordination', 'convulsion', 'nervous'],
    reproductive: ['abortion', 'stillborn', 'mummif', 'litter', 'agalact', 'mastitis', 'metritis'],
    skin: ['skin', 'jaundice', 'lesion', 'rash', 'discolor', 'blue', 'purple', 'vesicle', 'ulcer'],
    general: ['fever', 'weakness', 'lethargy', 'depression', 'anorexia', 'weight', 'growth', 'dehydration'],
    musculoskeletal: ['lame', 'joint', 'arthritis', 'stiffness', 'bone', 'fracture', 'hoof'],
    head: ['facial', 'swollen', 'snout', 'throat', 'swallow', 'foam', 'drool'],
};

Object.entries(symptomCounts).forEach(([symptom, count]) => {
    const lowerSymptom = symptom.toLowerCase();
    let categorized = false;

    for (const [catId, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some(kw => lowerSymptom.includes(kw))) {
            const category = symptomCategories.find(c => c.id === catId);
            if (category) {
                category.symptoms.push({
                    id: symptom.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                    label: symptom,
                    count: count
                });
                categorized = true;
                break;
            }
        }
    }

    if (!categorized) {
        const general = symptomCategories.find(c => c.id === 'general');
        general.symptoms.push({
            id: symptom.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            label: symptom,
            count: count
        });
    }
});

// Sort symptoms by count
symptomCategories.forEach(cat => {
    cat.symptoms.sort((a, b) => b.count - a.count);
});

const symptomsData = {
    categories: symptomCategories,
    totalSymptoms: Object.keys(symptomCounts).length
};

const symptomsOutputPath = path.join(dataDir, 'symptoms.json');
fs.writeFileSync(symptomsOutputPath, JSON.stringify(symptomsData, null, 2));
console.log(`✅ Wrote ${Object.keys(symptomCounts).length} symptoms to ${symptomsOutputPath}`);

// Print summary
console.log('\n=== CONVERSION SUMMARY ===');
console.log(`Total diseases: ${validDiseases.length}`);
console.log(`Total unique symptoms: ${Object.keys(symptomCounts).length}`);
console.log(`Zoonotic diseases: ${validDiseases.filter(d => d.zoonoticRisk).length}`);
console.log('\nSymptoms by category:');
symptomCategories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat.symptoms.length} symptoms`);
});

console.log('\n✅ Conversion complete!');

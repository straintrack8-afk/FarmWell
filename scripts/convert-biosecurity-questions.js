import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the complete questions file
const completeData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/data/swine/swine_questions_complete.json'), 'utf8')
);

// Map categories to focus areas
// Focus Area 1: Purchase & Transport (External Biosecurity) - 44 questions
// Focus Area 2: Facilities & People (External Biosecurity) - 31 questions
// Focus Area 3: Production Management (Internal Biosecurity) - 30 questions
// Focus Area 4: Hygiene Protocol (Internal Biosecurity) - 11 questions

const categoryToFocusArea = {
    // External Biosecurity - Focus Area 1
    'purchase_animals': 1,          // 17 questions
    'transport_deadstock': 1,       // 27 questions

    // External Biosecurity - Focus Area 2  
    'feed_water_equipment': 2,      // 10 questions
    'visitors_workers': 2,          // 9 questions
    'vermin_bird_control': 2,       // 5 questions
    'location': 2,                  // 7 questions

    // Internal Biosecurity - Focus Area 3
    'disease_management': 3,        // 5 questions
    'farrowing_suckling': 3,        // 7 questions
    'nursery_unit': 3,              // 5 questions
    'finishing_unit': 3,            // 4 questions
    'measures_between_compartments': 3,  // 9 questions

    // Internal Biosecurity - Focus Area 4
    'cleaning_disinfection': 4      // 11 questions
};

const focusAreaMetadata = {
    1: {
        number: 1,
        name: 'Purchase & Transport',
        description: 'Prevent disease entry through animals and vehicles',
        category: 'external biosecurity',
        sections: ['Purchase of Animals & Semen', 'Transport & Deadstock Removal']
    },
    2: {
        number: 2,
        name: 'Facilities & People',
        description: 'Control access and maintain infrastructure',
        category: 'external biosecurity',
        sections: ['Feed & Water Supply', 'Visitors & Workers', 'Pest Control', 'Farm Location']
    },
    3: {
        number: 3,
        name: 'Production Management',
        description: 'Disease monitoring and production practices',
        category: 'internal biosecurity',
        sections: ['Disease Management', 'Farrowing & Suckling', 'Nursery Management', 'Finishing Management', 'Compartment Measures']
    },
    4: {
        number: 4,
        name: 'Hygiene Protocol',
        description: 'Cleaning and disinfection procedures',
        category: 'internal biosecurity',
        sections: ['Cleaning & Disinfection']
    }
};

// Group questions by focus area
const focusAreas = {};
for (let i = 1; i <= 4; i++) {
    focusAreas[i] = {
        ...focusAreaMetadata[i],
        questions: [],
        total_questions: 0,
        estimated_time_minutes: 0
    };
}

// Add farm characteristics as farm profile
const farmProfileQuestions = [];

completeData.categories.forEach(category => {
    if (category.id === 'farm_characteristics') {
        // Farm characteristics go to farm profile
        farmProfileQuestions.push(...category.questions);
    } else {
        // Other categories go to focus areas
        const focusAreaNum = categoryToFocusArea[category.id];
        if (focusAreaNum) {
            focusAreas[focusAreaNum].questions.push(...category.questions);
        }
    }
});

// Calculate totals and estimated time
Object.values(focusAreas).forEach(fa => {
    fa.total_questions = fa.questions.length;
    fa.estimated_time_minutes = Math.ceil(fa.total_questions * 1.5); // ~1.5 min per question
});

// Create the output structure for English
const outputEN = {
    version: completeData.version,
    source: completeData.source,
    language: 'en',
    language_name: 'English',
    total_questions: completeData.total_questions,
    farm_profile: {
        title: 'Farm Profile',
        description: 'Basic information about your farm',
        questions: farmProfileQuestions
    },
    assessment: {
        title: 'Biosecurity Assessment',
        description: 'Comprehensive evaluation of farm biosecurity measures',
        focus_areas: Object.values(focusAreas)
    },
    scoring: {
        external_weight: 0.5,
        internal_weight: 0.5,
        interpretation: {
            excellent: { min: 80, max: 100, label: 'Excellent', color: '#10B981' },
            good: { min: 60, max: 79, label: 'Good', color: '#3B82F6' },
            moderate: { min: 40, max: 59, label: 'Moderate', color: '#F59E0B' },
            poor: { min: 0, max: 39, label: 'Poor', color: '#EF4444' }
        }
    },
    glossary: {
        'biosecurity': 'Measures taken to prevent the introduction and spread of disease',
        'quarantine': 'Isolation period for new animals before mixing with the herd',
        'all_in_all_out': 'Management system where all animals enter and leave at the same time'
    }
};

// Write English version
fs.writeFileSync(
    path.join(__dirname, '../questions_en.json'),
    JSON.stringify(outputEN, null, 2),
    'utf8'
);

console.log('✅ Created questions_en.json');
console.log(`   - Farm Profile: ${farmProfileQuestions.length} questions`);
console.log(`   - Focus Area 1: ${focusAreas[1].total_questions} questions`);
console.log(`   - Focus Area 2: ${focusAreas[2].total_questions} questions`);
console.log(`   - Focus Area 3: ${focusAreas[3].total_questions} questions`);
console.log(`   - Focus Area 4: ${focusAreas[4].total_questions} questions`);
console.log(`   - Total: ${completeData.total_questions} questions`);

// Create Indonesian version (copy structure, translate later if needed)
const outputID = JSON.parse(JSON.stringify(outputEN));
outputID.language = 'id';
outputID.language_name = 'Bahasa Indonesia';

fs.writeFileSync(
    path.join(__dirname, '../questions_id.json'),
    JSON.stringify(outputID, null, 2),
    'utf8'
);

console.log('✅ Created questions_id.json');

// Create Vietnamese version (copy structure, translate later if needed)
const outputVT = JSON.parse(JSON.stringify(outputEN));
outputVT.language = 'vt';
outputVT.language_name = 'Tiếng Việt';

fs.writeFileSync(
    path.join(__dirname, '../questions_vt.json'),
    JSON.stringify(outputVT, null, 2),
    'utf8'
);

console.log('✅ Created questions_vt.json');
console.log('\n🎉 All question files generated successfully!');

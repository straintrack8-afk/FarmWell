/**
 * Minimal Conversion Script for Pig Commercial Assessment
 * Converts new JSON format to system-compatible format
 */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting conversion...\n');

try {
    // Step 1: Load input file
    const inputPath = join(__dirname, '..', '..', 'Pig_commercial_final.json');
    console.log('📂 Loading:', inputPath);

    if (!existsSync(inputPath)) {
        throw new Error(`File not found: ${inputPath}`);
    }

    const rawData = readFileSync(inputPath, 'utf8');
    const sourceData = JSON.parse(rawData);

    console.log(`✅ Loaded ${sourceData.total_questions} questions from ${sourceData.categories.length} categories\n`);

    // Step 2: Process each language
    const languages = [
        { code: 'en', name: 'English', viKey: 'en' },
        { code: 'id', name: 'Indonesian', viKey: 'id' },
        { code: 'vt', name: 'Vietnamese', viKey: 'vi' }
    ];

    for (const lang of languages) {
        console.log(`🔄 Processing ${lang.name}...`);

        const output = {
            language: lang.code,
            language_name: lang.name,
            version: '4.0-enhanced',
            source: 'Biocheck.Gent BV',
            glossary: {},
            farm_profile: {
                title: '',
                description: '',
                total_questions: 0,
                questions: []
            },
            assessment: {
                total_questions: 0,
                focus_areas: []
            }
        };

        // Convert glossary
        for (const [term, def] of Object.entries(sourceData.glossary)) {
            output.glossary[term] = typeof def === 'string' ? def : (def[lang.viKey] || def.en);
        }

        // Convert farm profile (first category)
        const farmInfoCat = sourceData.categories.find(c => c.id === 'farm_information');
        if (farmInfoCat) {
            output.farm_profile.title = farmInfoCat.name[lang.viKey] || farmInfoCat.name.en;
            output.farm_profile.description = farmInfoCat.description[lang.viKey] || farmInfoCat.description.en;
            output.farm_profile.total_questions = farmInfoCat.questions.length;

            const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

            farmInfoCat.questions.forEach((q, idx) => {
                const converted = {
                    number: romanNumerals[idx] || (idx + 1).toString(),
                    id: `pre_${q.id.toLowerCase()}`,
                    text: q.question[lang.viKey] || q.question.en,
                    type: q.answer_type === 'multi_choice' ? 'multiple_choice' :
                        q.answer_type === 'number_input' ? 'numeric' : q.answer_type,
                    required: q.required || false,
                    farm_type_relevance: ['breeding', 'finishing', 'nursery', 'farrow_to_finish']
                };

                if (q.options) {
                    converted.options = q.options.map(opt => ({
                        value: opt.id,
                        text: opt.label[lang.viKey] || opt.label.en
                    }));
                }

                if (q.validation) {
                    converted.validation = q.validation;
                }

                if (q.conditional_logic) {
                    for (const [answer, action] of Object.entries(q.conditional_logic)) {
                        if (action.startsWith('skip_to_')) {
                            converted.conditional_logic = {
                                if_answer: answer,
                                then: 'skip_to',
                                target: action.replace('skip_to_', '').toLowerCase()
                            };
                            break;
                        }
                    }
                }

                if (q.id === 'Q1') {
                    converted.farm_type_detection = true;
                }

                output.farm_profile.questions.push(converted);
            });
        }

        // Convert assessment - simplified version
        // Focus Area 1: Questions 1-30 (Purchase & Transport)
        // Focus Area 2: Questions 31-60 (Facilities & People)
        // Focus Area 3: Questions 61-90 (Production Management)
        // Focus Area 4: Questions 91-116 (Cleaning & Disinfection)

        const focusAreaMeta = [
            {
                num: 1, name: { en: 'Purchase & Transport', id: 'Pembelian & Transportasi', vi: 'Mua & Vận Chuyển' },
                desc: { en: 'Prevent disease entry through animals and vehicles', id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan', vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện' },
                category: 'external_biosecurity', sections: ['A', 'B']
            },
            {
                num: 2, name: { en: 'Facilities & People', id: 'Fasilitas & Orang', vi: 'Cơ Sở & Con Người' },
                desc: { en: 'Control access and maintain biosecure facilities', id: 'Kontrol akses dan pertahankan fasilitas biosekuriti', vi: 'Kiểm soát truy cập và duy trì cơ sở an toàn sinh học' },
                category: 'external_biosecurity', sections: ['C', 'D', 'E']
            },
            {
                num: 3, name: { en: 'Production Management', id: 'Manajemen Produksi', vi: 'Quản Lý Sản Xuất' },
                desc: { en: 'Manage disease risk and production practices', id: 'Kelola risiko penyakit dan praktik produksi', vi: 'Quản lý rủi ro bệnh và thực hành sản xuất' },
                category: 'internal_biosecurity', sections: ['F', 'G', 'H', 'I']
            },
            {
                num: 4, name: { en: 'Cleaning & Disinfection', id: 'Pembersihan & Disinfeksi', vi: 'Vệ Sinh & Khử Trùng' },
                desc: { en: 'Maintain hygiene through proper cleaning and maintenance', id: 'Pertahankan kebersihan melalui pembersihan dan pemeliharaan yang tepat', vi: 'Duy trì vệ sinh thông qua làm sạch và bảo trì đúng cách' },
                category: 'internal_biosecurity', sections: ['J', 'K']
            }
        ];

        let globalQNum = 1;

        // Collect all questions from all categories (except farm_information)
        const allQuestions = [];
        for (const cat of sourceData.categories) {
            if (cat.id !== 'farm_information') {
                allQuestions.push(...cat.questions);
            }
        }

        // Distribute questions across 4 focus areas
        const questionsPerFA = Math.ceil(allQuestions.length / 4);

        for (let faIdx = 0; faIdx < 4; faIdx++) {
            const faMeta = focusAreaMeta[faIdx];
            const focusArea = {
                number: faMeta.num,
                name: faMeta.name[lang.viKey] || faMeta.name.en,
                description: faMeta.desc[lang.viKey] || faMeta.desc.en,
                category: faMeta.category,
                sections: faMeta.sections,
                questions: [],
                total_questions: 0,
                estimated_time_minutes: 10
            };

            const startIdx = faIdx * questionsPerFA;
            const endIdx = Math.min((faIdx + 1) * questionsPerFA, allQuestions.length);
            const faQuestions = allQuestions.slice(startIdx, endIdx);

            for (const q of faQuestions) {
                const sectionLetter = faMeta.sections[0] || 'A';

                const converted = {
                    number: globalQNum,
                    id: q.id.toLowerCase(),
                    section: sectionLetter,
                    focus_area: faMeta.num,
                    text: q.question[lang.viKey] || q.question.en,
                    type: q.answer_type === 'multi_choice' ? 'multiple_choice' :
                        q.answer_type === 'number_input' ? 'numeric' : q.answer_type,
                    required: q.required || false,
                    farm_type_relevance: ['breeding', 'finishing', 'nursery', 'farrow_to_finish']
                };

                if (q.options) {
                    converted.options = q.options.map(opt => ({
                        value: opt.id,
                        text: opt.label[lang.viKey] || opt.label.en,
                        score: (opt.score || 0) * 10 // Convert 0-10 to 0-100
                    }));
                }

                if (q.validation) {
                    converted.validation = q.validation;
                }

                if (q.conditional_logic) {
                    for (const [answer, action] of Object.entries(q.conditional_logic)) {
                        if (action.startsWith('skip_to_')) {
                            converted.conditional_logic = {
                                if_answer: answer,
                                then: 'skip_to',
                                target: action.replace('skip_to_', '').toLowerCase()
                            };
                            break;
                        }
                    }
                }

                if (q.risk_assessment) {
                    const ra = q.risk_assessment;
                    converted.risk_assessment = {
                        risk_description: ra.risk_description[lang.viKey] || ra.risk_description.en,
                        recommendation: ra.recommendation[lang.viKey] || ra.recommendation.en,
                        priority: ra.priority || 'medium',
                        trigger_score_threshold: (ra.trigger_score || 5) * 10,
                        diseases_affected: ra.diseases_affected || []
                    };
                }

                focusArea.questions.push(converted);
                globalQNum++;
            }

            focusArea.total_questions = focusArea.questions.length;
            focusArea.estimated_time_minutes = Math.max(5, Math.ceil(focusArea.questions.length / 4));

            output.assessment.focus_areas.push(focusArea);
        }

        output.assessment.total_questions = globalQNum - 1;

        // Write output file
        const outputPath = join(__dirname, '..', `questions_${lang.code}.json`);

        // Backup existing file
        if (existsSync(outputPath)) {
            const backupPath = outputPath + '.backup';
            copyFileSync(outputPath, backupPath);
            console.log(`   📋 Backup: ${backupPath}`);
        }

        writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
        console.log(`   ✅ Written: ${outputPath}`);
        console.log(`   📊 ${output.farm_profile.questions.length} farm profile + ${output.assessment.total_questions} assessment questions\n`);
    }

    console.log('✅ Conversion completed successfully!\n');
    console.log('Next steps:');
    console.log('  1. Review generated files');
    console.log('  2. Run: npm run dev');
    console.log('  3. Test assessment flow');

} catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
}

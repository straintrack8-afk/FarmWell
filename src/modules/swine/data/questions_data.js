// Import question data from JSON files
// Using static imports for reliability - Vite will handle code splitting automatically
// Updated: 2026-01-15 22:57 - Using standard filenames with farm_type_relevance field
import questionsEN from '../../../../questions_en.json';
import questionsID from '../../../../questions_id.json';
import questionsVT from '../../../../questions_vt.json';

/**
 * Question data organized by language
 * Supports: English (en), Bahasa Indonesia (id), Tiếng Việt (vt)
 */
const QUESTION_DATA = {
    en: questionsEN,
    id: questionsID,
    vt: questionsVT
};

/**
 * Get question data for a specific language
 * @param {string} language - Language code ('en', 'id', 'vt')
 * @returns {object} Question data for the specified language
 */
export function getQuestionData(language = 'en') {
    return QUESTION_DATA[language] || QUESTION_DATA.en;
}

/**
 * Get farm profile questions for a specific language
 * @param {string} language - Language code
 * @returns {array} Farm profile questions
 */
/**
 * Get merged farm profile data (questions, title, desc)
 * Ensures all questions from EN exist, using translation where available
 * @param {string} language - Language code
 * @returns {object} Merged Farm Profile object
 */
export function getMergedFarmProfile(language = 'en') {
    const masterData = QUESTION_DATA.en.farm_profile;

    if (language === 'en') {
        return masterData;
    }

    const langData = (QUESTION_DATA[language] || QUESTION_DATA.en).farm_profile;

    // Merge metadata (Title, Desc) - prefer Lang
    const mergedProfile = {
        ...masterData,
        title: langData?.title || masterData.title,
        description: langData?.description || masterData.description,
        // Merge questions logic
        questions: masterData.questions.map(masterQ => {
            const translatedQ = langData?.questions?.find(tQ => tQ.id === masterQ.id);
            return translatedQ || masterQ;
        })
    };

    return mergedProfile;
}

/**
 * Get farm profile questions for a specific language
 * DEPRECATED: Use getMergedFarmProfile instead
 * @param {string} language - Language code
 * @returns {array} Farm profile questions
 */
export function getFarmProfileQuestions(language = 'en') {
    return getMergedFarmProfile(language).questions;
}

/**
 * Get assessment questions for a specific focus area and language
 * @param {number} focusAreaNumber - Focus area number (1-4)
 * @param {string} language - Language code
 * @returns {array} Questions for the specified focus area
 */
export function getFocusAreaQuestions(focusAreaNumber, language = 'en') {
    // Always get EN data as the master structure to ensure full question count
    const masterData = QUESTION_DATA.en;
    const masterFocusArea = masterData.assessment.focus_areas.find(fa => fa.number === focusAreaNumber);

    if (!masterFocusArea) return [];

    // If language is EN, return master directly
    if (language === 'en') {
        return masterFocusArea.questions;
    }

    // Get target language data
    const langData = QUESTION_DATA[language] || QUESTION_DATA.en;
    const langFocusArea = langData.assessment.focus_areas.find(fa => fa.number === focusAreaNumber);

    // If target language doesn't have this focus area, return master
    if (!langFocusArea) {
        return masterFocusArea.questions;
    }

    // Map over MASTER questions and try to find translation matching by ID
    // This ensures we keep the correct order and total count (e.g. 44) even if translation only has 3
    return masterFocusArea.questions.map(masterQ => {
        const translatedQ = langFocusArea.questions.find(tQ => tQ.id === masterQ.id);

        // If translation exists, use it. Otherwise fallback to master (English)
        if (translatedQ) {
            return translatedQ;
        }

        return masterQ;
    });
}

/**
 * Get all focus areas metadata
 * @param {string} language - Language code
 * @returns {array} Focus area metadata (name, description, question count, etc.)
 */
export function getAllFocusAreas(language = 'en') {
    const data = getQuestionData(language);
    return data.assessment.focus_areas.map(fa => ({
        number: fa.number,
        name: fa.name,
        description: fa.description,
        category: fa.category,
        total_questions: fa.total_questions,
        estimated_time_minutes: fa.estimated_time_minutes,
        sections: fa.sections
    }));
}

/**
 * Get glossary terms for a specific language
 * @param {string} language - Language code
 * @returns {object} Glossary terms
 */
export function getGlossary(language = 'en') {
    const data = getQuestionData(language);
    return data.glossary;
}

/**
 * Get scoring configuration
 * @param {string} language - Language code
 * @returns {object} Scoring configuration
 */
export function getScoringConfig(language = 'en') {
    const data = getQuestionData(language);
    return data.scoring;
}

/**
 * Get language metadata
 * @returns {array} Available languages with metadata
 */
export function getAvailableLanguages() {
    return [
        {
            code: 'en',
            name: 'English',
            flag: '🇬🇧',
            nativeName: 'English'
        },
        {
            code: 'id',
            name: 'Indonesian',
            flag: '🇮🇩',
            nativeName: 'Bahasa Indonesia'
        },
        {
            code: 'vt',
            name: 'Vietnamese',
            flag: '🇻🇳',
            nativeName: 'Tiếng Việt'
        }
    ];
}

/**
 * Get a specific question by ID
 * @param {string} questionId - Question ID (e.g., 'farm_q1', 'q1')
 * @param {string} language - Language code
 * @returns {object|null} Question object or null if not found
 */
export function getQuestionById(questionId, language = 'en') {
    const data = getQuestionData(language);

    // Check farm profile questions
    if (questionId.startsWith('farm_')) {
        return data.farm_profile.questions.find(q => q.id === questionId);
    }

    // Check assessment questions
    for (const focusArea of data.assessment.focus_areas) {
        const question = focusArea.questions.find(q => q.id === questionId);
        if (question) return question;
    }

    return null;
}

export default QUESTION_DATA;

/**
 * Filter questions based on farm type relevance
 * @param {array} questions - Array of questions to filter
 * @param {string} farmType - Farm type ('breeding', 'finishing', 'nursery', 'farrow_to_finish')
 * @returns {array} Filtered questions relevant to the farm type
 */
export function filterQuestionsByFarmType(questions, farmType) {
    if (!farmType || farmType === 'unknown') {
        // If farm type is unknown, show all questions
        return questions;
    }

    return questions.filter(question => {
        // If question has no farm_type_relevance field, show to all farm types
        if (!question.farm_type_relevance || question.farm_type_relevance.length === 0) {
            return true;
        }

        // Check if user's farm type is in the allowed list
        return question.farm_type_relevance.includes(farmType);
    });
}

/**
 * Get filtered focus area questions based on farm type
 * @param {number} focusAreaNumber - Focus area number (1-4)
 * @param {string} language - Language code
 * @param {string} farmType - Farm type for filtering
 * @returns {array} Filtered questions for the specified focus area and farm type
 */
/**
 * Get filtered focus area questions based on farm type
 * @param {number} focusAreaNumber - Focus area number (1-4)
 * @param {string} language - Language code
 * @param {string} farmType - Farm type for filtering
 * @returns {array} Filtered questions for the specified focus area and farm type
 */
export function getFilteredFocusAreaQuestions(focusAreaNumber, language = 'en', farmType = null) {
    const allQuestions = getFocusAreaQuestions(focusAreaNumber, language);

    if (!farmType) {
        return allQuestions;
    }

    return filterQuestionsByFarmType(allQuestions, farmType);
}

/**
 * Get enhanced risk assessment for a specific question
 * @param {string} questionId - Question ID
 * @param {number} userScore - User's score for this question
 * @param {string} language - Language code
 * @returns {object|null} Enhanced risk assessment or null
 */
export function getEnhancedRiskAssessment(questionId, userScore, language = 'en') {
    const question = getQuestionById(questionId, language);

    if (!question || !question.risk_assessment) {
        return null;
    }

    const ra = question.risk_assessment;
    const triggerThreshold = ra.trigger_score_threshold || 50;

    // Only return risk assessment if score is below threshold
    if (userScore < triggerThreshold) {
        return {
            riskDescription: ra.risk_description,
            recommendation: ra.recommendation,
            priority: ra.priority || 'medium',
            diseasesAffected: ra.diseases_affected || [],
            triggerThreshold
        };
    }

    return null;
}

/**
 * Get all diseases mentioned in the assessment
 * @param {string} language - Language code
 * @returns {array} Array of unique disease names
 */
export function getAllDiseases(language = 'en') {
    const diseases = new Set();
    const data = getQuestionData(language);

    // Collect from all focus areas
    data.assessment.focus_areas.forEach(fa => {
        fa.questions.forEach(q => {
            if (q.risk_assessment && q.risk_assessment.diseases_affected) {
                q.risk_assessment.diseases_affected.forEach(disease => {
                    if (disease && !disease.includes('_Related') && !disease.includes('Multiple')) {
                        diseases.add(disease);
                    }
                });
            }
        });
    });

    return Array.from(diseases).sort();
}

/**
 * Get questions that affect a specific disease
 * @param {string} diseaseName - Disease name
 * @param {string} language - Language code
 * @returns {array} Array of questions affecting this disease
 */
export function getQuestionsByDisease(diseaseName, language = 'en') {
    const questions = [];
    const data = getQuestionData(language);

    data.assessment.focus_areas.forEach(fa => {
        fa.questions.forEach(q => {
            if (q.risk_assessment && q.risk_assessment.diseases_affected) {
                const diseases = q.risk_assessment.diseases_affected;
                if (diseases.includes(diseaseName) || diseases.includes('All_Major_Diseases')) {
                    questions.push({
                        id: q.id,
                        number: q.number,
                        text: q.text,
                        focusArea: fa.number,
                        priority: q.risk_assessment.priority
                    });
                }
            }
        });
    });

    return questions;
}

/**
 * Get priority recommendations grouped by priority level
 * @param {object} assessment - Assessment object
 * @param {string} language - Language code
 * @returns {object} Recommendations grouped by priority
 */
export function getPriorityRecommendations(assessment, language = 'en') {
    const recommendations = {
        critical: [],
        high: [],
        medium: [],
        low: []
    };

    for (let i = 1; i <= 4; i++) {
        const questions = getFocusAreaQuestions(i, language);
        const answers = assessment.focus_areas?.[i]?.answers || {};

        questions.forEach(q => {
            if (q.risk_assessment && answers[q.id] !== undefined) {
                const priority = q.risk_assessment.priority || 'medium';
                const triggerThreshold = q.risk_assessment.trigger_score_threshold || 50;

                // Calculate score for this question
                const score = calculateQuestionScore(q, answers[q.id]);

                if (score < triggerThreshold) {
                    recommendations[priority].push({
                        questionId: q.id,
                        questionNumber: q.number,
                        questionText: q.text,
                        score,
                        riskDescription: q.risk_assessment.risk_description,
                        recommendation: q.risk_assessment.recommendation,
                        diseasesAffected: q.risk_assessment.diseases_affected || []
                    });
                }
            }
        });
    }

    // Sort each priority group by score (lowest first)
    Object.keys(recommendations).forEach(priority => {
        recommendations[priority].sort((a, b) => a.score - b.score);
    });

    return recommendations;
}

// Helper function for score calculation (imported from biosecurityScoring)
function calculateQuestionScore(question, answer) {
    if (!answer) return 0;

    const { type, options } = question;

    if (type === 'single_choice' || type === 'single_select') {
        const selectedOption = options?.find(opt => opt.value === answer);
        return selectedOption?.score || 0;
    }

    if (type === 'multiple_choice' || type === 'multi_select') {
        if (!Array.isArray(answer) || answer.length === 0) return 0;
        const selectedOptions = options?.filter(opt => answer.includes(opt.value)) || [];
        const totalScore = selectedOptions.reduce((sum, opt) => sum + (opt.score || 0), 0);
        return selectedOptions.length > 0 ? totalScore / selectedOptions.length : 0;
    }

    return 0;
}

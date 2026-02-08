/**
 * localStorage utility functions for PigWell Biosecurity Assessment
 * Handles data persistence for farm profiles, assessments, and answers
 */

const STORAGE_KEYS = {
    FARM_PROFILE: 'pigwell_farm_profile',
    CURRENT_ASSESSMENT: 'pigwell_current_assessment',
    ASSESSMENTS_HISTORY: 'pigwell_assessments'
};

/**
 * Generate a unique ID
 * @returns {string} UUID-like string
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get farm profile
 * @returns {object|null} Farm profile data or null if not exists
 */
export function getFarmProfile() {
    const data = localStorage.getItem(STORAGE_KEYS.FARM_PROFILE);
    return data ? JSON.parse(data) : null;
}

/**
 * Save farm profile
 * @param {object} answers - Farm profile answers
 * @returns {object} Saved farm profile
 */
export function saveFarmProfile(answers) {
    const profile = {
        farm_id: generateId(),
        completed_at: new Date().toISOString(),
        answers
    };
    localStorage.setItem(STORAGE_KEYS.FARM_PROFILE, JSON.stringify(profile));
    return profile;
}

/**
 * Update farm profile
 * @param {object} answers - Updated answers
 * @returns {object} Updated farm profile
 */
export function updateFarmProfile(answers) {
    const existing = getFarmProfile();
    const profile = {
        ...existing,
        answers: {
            ...existing?.answers,
            ...answers
        },
        updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.FARM_PROFILE, JSON.stringify(profile));
    return profile;
}

/**
 * Get current assessment
 * @returns {object|null} Current assessment data or null
 */
export function getCurrentAssessment() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ASSESSMENT);
    return data ? JSON.parse(data) : null;
}

/**
 * Start new assessment
 * @param {string} language - Language code
 * @returns {object} New assessment object
 */
export function startNewAssessment(language) {
    const assessment = {
        assessment_id: generateId(),
        started_at: new Date().toISOString(),
        language,
        focus_areas: {
            1: { completed: false, score: null, answers: {} },
            2: { completed: false, score: null, answers: {} },
            3: { completed: false, score: null, answers: {} },
            4: { completed: false, score: null, answers: {} }
        }
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_ASSESSMENT, JSON.stringify(assessment));
    return assessment;
}

/**
 * Save answer to current assessment
 * @param {number} focusArea - Focus area number (1-4)
 * @param {string} questionId - Question ID
 * @param {any} answer - Answer value
 */
export function saveAnswer(focusArea, questionId, answer) {
    const assessment = getCurrentAssessment();
    if (!assessment) return;

    assessment.focus_areas[focusArea].answers[questionId] = answer;
    assessment.updated_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.CURRENT_ASSESSMENT, JSON.stringify(assessment));
}

/**
 * Mark focus area as completed
 * @param {number} focusArea - Focus area number
 * @param {number} score - Focus area score
 */
export function completeFocusArea(focusArea, score) {
    const assessment = getCurrentAssessment();
    if (!assessment) return;

    assessment.focus_areas[focusArea].completed = true;
    assessment.focus_areas[focusArea].score = score;
    assessment.focus_areas[focusArea].completed_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.CURRENT_ASSESSMENT, JSON.stringify(assessment));
}

/**
 * Complete entire assessment
 * @param {number} overallScore - Overall biosecurity score
 * @param {number} externalScore - External biosecurity score
 * @param {number} internalScore - Internal biosecurity score
 */
export function completeAssessment(overallScore, externalScore, internalScore) {
    const assessment = getCurrentAssessment();
    if (!assessment) return;

    // Check for duplicates in history
    const checkHistory = getFullAssessmentHistory();
    const isDuplicate = checkHistory.some(a => a.assessment_id === assessment.assessment_id);

    if (isDuplicate) {
        console.warn('Duplicate assessment submission prevented:', assessment.assessment_id);
        return assessment;
    }

    assessment.completed_at = new Date().toISOString();
    assessment.overall_score = overallScore;
    assessment.external_score = externalScore;
    assessment.internal_score = internalScore;

    // Save to summary history
    const history = getAssessmentsHistory();
    history.unshift({
        assessment_id: assessment.assessment_id,
        completed_at: assessment.completed_at,
        overall_score: overallScore,
        external_score: externalScore,
        internal_score: internalScore
    });

    // Keep only last 10 assessments
    if (history.length > 10) {
        history.length = 10;
    }

    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS_HISTORY, JSON.stringify(history));

    // Save full assessment to separate history for PDF generation
    const fullHistory = getFullAssessmentHistory();
    fullHistory.unshift(assessment);

    // Keep only last 10 full assessments
    if (fullHistory.length > 10) {
        fullHistory.length = 10;
    }

    localStorage.setItem('pigwell_assessments_full', JSON.stringify(fullHistory));
    localStorage.setItem(STORAGE_KEYS.CURRENT_ASSESSMENT, JSON.stringify(assessment));

    return assessment;
}

/**
 * Get assessments history
 * @returns {array} Array of past assessments
 */
export function getAssessmentsHistory() {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS_HISTORY);
    return data ? JSON.parse(data) : [];
}

/**
 * Get full assessment history (with all data for PDF generation)
 * @returns {array} Array of full assessment objects
 */
export function getFullAssessmentHistory() {
    const data = localStorage.getItem('pigwell_assessments_full');
    return data ? JSON.parse(data) : [];
}

/**
 * Clear current assessment (start over)
 */
export function clearCurrentAssessment() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ASSESSMENT);
}

/**
 * Clear all data (reset everything)
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

/**
 * Get answer for a specific question
 * @param {number} focusArea - Focus area number
 * @param {string} questionId - Question ID
 * @returns {any} Answer value or null
 */
export function getAnswer(focusArea, questionId) {
    const assessment = getCurrentAssessment();
    if (!assessment) return null;

    return assessment.focus_areas[focusArea]?.answers[questionId] || null;
}

/**
 * Get all answers for a focus area
 * @param {number} focusArea - Focus area number
 * @returns {object} Answers object
 */
export function getFocusAreaAnswers(focusArea) {
    const assessment = getCurrentAssessment();
    if (!assessment) return {};

    return assessment.focus_areas[focusArea]?.answers || {};
}

/**
 * Check if assessment is complete
 * @returns {boolean} True if all focus areas are completed
 */
export function isAssessmentComplete() {
    const assessment = getCurrentAssessment();
    if (!assessment) return false;

    return Object.values(assessment.focus_areas).every(fa => fa.completed);
}

/**
 * Delete assessment by ID
 * @param {string} assessmentId - Assessment ID to delete
 */
export function deleteAssessment(assessmentId) {
    if (!assessmentId) {
        console.error('Cannot delete assessment: ID is missing');
        return;
    }

    // Remove from summary history
    const history = getAssessmentsHistory();
    const newHistory = history.filter(a => a.assessment_id !== assessmentId);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS_HISTORY, JSON.stringify(newHistory));

    // Remove from full history
    const fullHistory = getFullAssessmentHistory();
    const newFullHistory = fullHistory.filter(a => a.assessment_id !== assessmentId);
    localStorage.setItem('pigwell_assessments_full', JSON.stringify(newFullHistory));
}

/**
 * Reset biosecurity session (clear profile and current assessment)
 * Used for Discard and Start New scenarios
 */
export function resetBiosecuritySession() {
    localStorage.removeItem(STORAGE_KEYS.FARM_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ASSESSMENT);
}

export default {
    getFarmProfile,
    saveFarmProfile,
    updateFarmProfile,
    getCurrentAssessment,
    startNewAssessment,
    saveAnswer,
    completeFocusArea,
    completeAssessment,
    getAssessmentsHistory,
    clearCurrentAssessment,
    clearAllData,
    getAnswer,
    getFocusAreaAnswers,
    isAssessmentComplete,
    deleteAssessment,
    resetBiosecuritySession
};

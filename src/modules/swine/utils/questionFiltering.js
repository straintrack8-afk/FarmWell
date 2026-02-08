/**
 * Question Filtering Utility
 * Filters questions based on farm type relevance
 */

/**
 * Filter questions based on farm type
 * @param {Array} questions - All questions
 * @param {string} farmType - Detected farm type
 * @returns {Array} - Filtered questions relevant to farm type
 */
export function filterQuestionsByFarmType(questions, farmType) {
    if (!farmType) {
        return questions; // No filtering if farm type not detected
    }

    return questions.filter(question => {
        const relevance = question.farm_type_relevance;

        // If no farm_type_relevance field, include by default (backward compatibility)
        if (!relevance) {
            return true;
        }

        // Check if this farm type is in the relevance array
        return relevance.includes(farmType);
    });
}

/**
 * Get question statistics by farm type
 * @param {Array} allQuestions - All questions
 * @param {string} farmType - Farm type
 * @returns {Object} - Statistics
 */
export function getQuestionStats(allQuestions, farmType) {
    const filtered = filterQuestionsByFarmType(allQuestions, farmType);

    return {
        total: allQuestions.length,
        relevant: filtered.length,
        excluded: allQuestions.length - filtered.length,
        percentage: Math.round((filtered.length / allQuestions.length) * 100)
    };
}

/**
 * Check if a question is relevant to a farm type
 * @param {Object} question - Question object
 * @param {string} farmType - Farm type
 * @returns {boolean} - True if relevant
 */
export function isQuestionRelevant(question, farmType) {
    if (!farmType || !question.farm_type_relevance) {
        return true; // Default to relevant
    }

    return question.farm_type_relevance.includes(farmType);
}

/**
 * Get excluded question IDs for a farm type
 * @param {Array} allQuestions - All questions
 * @param {string} farmType - Farm type
 * @returns {Array<string>} - Array of excluded question IDs
 */
export function getExcludedQuestionIds(allQuestions, farmType) {
    if (!farmType) {
        return [];
    }

    return allQuestions
        .filter(q => !isQuestionRelevant(q, farmType))
        .map(q => q.id);
}

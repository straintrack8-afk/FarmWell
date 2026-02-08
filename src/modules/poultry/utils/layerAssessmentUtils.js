/**
 * Utility functions for Layer Farm Biosecurity Assessment
 * Handles conditional logic, scoring, recommendations, and validation
 */

/**
 * Evaluate if a question should be shown based on conditional logic
 * @param {Object} question - Question object with potential conditional_logic
 * @param {Object} userAnswers - Object mapping questionId to answer
 * @returns {boolean} - True if question should be shown
 */
export function shouldShowQuestion(question, userAnswers) {
    // If no conditional logic, always show
    if (!question.conditional_logic?.show_if) {
        return true;
    }

    const { question_id, operator, value } = question.conditional_logic.show_if;
    const previousAnswer = userAnswers[question_id];

    // If previous question hasn't been answered, don't show
    if (previousAnswer === undefined || previousAnswer === null) {
        return false;
    }

    switch (operator) {
        case 'equals':
            return previousAnswer === value;
        case 'not_equals':
            return previousAnswer !== value;
        case 'contains':
            return Array.isArray(previousAnswer) && previousAnswer.includes(value);
        case 'not_contains':
            return Array.isArray(previousAnswer) && !previousAnswer.includes(value);
        case 'greater_than':
            return Number(previousAnswer) > Number(value);
        case 'less_than':
            return Number(previousAnswer) < Number(value);
        case 'greater_than_or_equal':
            return Number(previousAnswer) >= Number(value);
        case 'less_than_or_equal':
            return Number(previousAnswer) <= Number(value);
        default:
            return true;
    }
}

/**
 * Calculate score for a single question
 * @param {Object} question - Question object
 * @param {*} answer - User's answer
 * @returns {number} - Score (0-10)
 */
export function calculateQuestionScore(question, answer) {
    if (answer === undefined || answer === null || answer === '') {
        return 0;
    }

    // Handle number type questions with ranges
    if (question.answer_type === 'number' && question.ranges) {
        const num = Number(answer);
        if (isNaN(num)) return 0;

        // Find matching range
        const matchingRange = question.ranges.find(range =>
            num >= range.min && num <= range.max
        );
        return matchingRange?.score || 0;
    }

    // Handle number input (direct score)
    if (question.answer_type === 'number_input') {
        const num = Number(answer);
        return isNaN(num) ? 0 : Math.min(Math.max(num, 0), 10);
    }

    // Handle single choice
    if (question.answer_type === 'single_choice') {
        const selectedOption = question.options?.find(opt => opt.id === answer);
        return selectedOption?.score || 0;
    }

    // Handle multiple choice
    if (question.answer_type === 'multiple_choice') {
        if (!Array.isArray(answer) || answer.length === 0) {
            return 0;
        }

        // Check if score_calculation is specified
        if (question.score_calculation === 'sum_with_max') {
            const totalScore = answer.reduce((sum, answerId) => {
                const option = question.options?.find(opt => opt.id === answerId);
                return sum + (option?.score || 0);
            }, 0);
            const maxScore = question.max_score || 10;
            return Math.min(Math.max(totalScore, 0), maxScore);
        }

        // Default: average the scores
        const scores = answer.map(answerId => {
            const option = question.options?.find(opt => opt.id === answerId);
            return option?.score || 0;
        });
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    return 0;
}

/**
 * Calculate score for a category
 * @param {Object} category - Category object with questions
 * @param {Object} answers - User answers
 * @returns {Object} - { score, maxScore, percentage, answeredCount, totalCount }
 */
export function calculateCategoryScore(category, answers) {
    if (!category.questions || category.questions.length === 0) {
        return { score: 0, maxScore: 0, percentage: 0, answeredCount: 0, totalCount: 0 };
    }

    let totalScore = 0;
    let maxScore = 0;
    let answeredCount = 0;

    // Filter visible questions based on conditional logic
    const visibleQuestions = category.questions.filter(q => shouldShowQuestion(q, answers));
    const totalCount = visibleQuestions.length;

    visibleQuestions.forEach(question => {
        const answer = answers[question.id];

        if (answer !== undefined && answer !== null && answer !== '') {
            answeredCount++;
            totalScore += calculateQuestionScore(question, answer);
        }

        maxScore += 10; // Max score per question is 10
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
        score: totalScore,
        maxScore,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
        answeredCount,
        totalCount
    };
}

/**
 * Calculate overall assessment score
 * @param {Object} assessment - Full assessment data
 * @param {Object} answers - User answers
 * @returns {Object} - { score, maxScore, percentage, categoryScores }
 */
export function calculateOverallScore(assessment, answers) {
    if (!assessment.categories) {
        return { score: 0, maxScore: 0, percentage: 0, categoryScores: {} };
    }

    const categoryScores = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessment.categories.forEach(category => {
        const categoryResult = calculateCategoryScore(category, answers);
        categoryScores[category.id] = categoryResult;

        const weight = category.weight || 0;
        totalWeightedScore += categoryResult.percentage * weight;
        totalWeight += weight;
    });

    const overallPercentage = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

    return {
        percentage: Math.round(overallPercentage * 10) / 10,
        categoryScores
    };
}

/**
 * Get risk level based on score percentage (using 5-tier risk scale)
 * @param {number} percentage - Score percentage (0-100)
 * @returns {string} - 'critical', 'poor', 'moderate', 'good', or 'excellent'
 */
export function getRiskLevel(percentage) {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 60) return 'moderate';
    if (percentage >= 40) return 'poor';
    return 'critical';
}

/**
 * Get risk level configuration (color, label, etc.)
 * @param {string} riskLevel - Risk level
 * @param {string} language - Language code
 * @returns {Object} - Configuration object
 */
export function getRiskConfig(riskLevel, language = 'en') {
    const configs = {
        excellent: {
            color: '#2E7D32',
            bgColor: '#E8F5E9',
            label: {
                en: 'Excellent',
                vi: 'Xuất sắc',
                id: 'Luar Biasa'
            },
            icon: '🟢'
        },
        good: {
            color: '#4CAF50',
            bgColor: '#C8E6C9',
            label: {
                en: 'Good',
                vi: 'Tốt',
                id: 'Baik'
            },
            icon: '🟢'
        },
        moderate: {
            color: '#FFC107',
            bgColor: '#FFF9C4',
            label: {
                en: 'Moderate',
                vi: 'Trung bình',
                id: 'Sedang'
            },
            icon: '🟡'
        },
        poor: {
            color: '#FF9800',
            bgColor: '#FFE0B2',
            label: {
                en: 'Poor',
                vi: 'Yếu',
                id: 'Buruk'
            },
            icon: '🟠'
        },
        critical: {
            color: '#F44336',
            bgColor: '#FFCDD2',
            label: {
                en: 'Critical',
                vi: 'Nguy kịch',
                id: 'Kritis'
            },
            icon: '🔴'
        }
    };

    const config = configs[riskLevel] || configs.moderate;
    return {
        ...config,
        labelText: config.label[language] || config.label.en
    };
}

/**
 * Generate improvement recommendations based on low scores
 * @param {Object} assessment - Full assessment data
 * @param {Object} answers - User answers
 * @param {string} language - Language code ('en', 'vi', 'id')
 * @returns {Array} - Array of recommendation objects sorted by priority
 */
export function generateImprovementPlan(assessment, answers, language = 'en') {
    const recommendations = [];

    if (!assessment.categories) {
        return recommendations;
    }

    assessment.categories.forEach(category => {
        if (!category.questions) return;

        category.questions.forEach(question => {
            // Skip if not shown due to conditional logic
            if (!shouldShowQuestion(question, answers)) return;

            const answer = answers[question.id];
            const score = calculateQuestionScore(question, answer);

            // Check if score is below trigger threshold
            if (question.risk_assessment && score < (question.risk_assessment.trigger_score || 5)) {
                const riskAssessment = question.risk_assessment;

                recommendations.push({
                    questionId: question.id,
                    categoryId: category.id,
                    categoryName: category.name?.[language] || category.name?.en || '',
                    question: question.question?.[language] || question.question?.en || '',
                    priority: riskAssessment.priority || 'medium',
                    score: score,
                    maxScore: 10,
                    riskDescription: riskAssessment.risk_description?.[language] || '',
                    recommendation: riskAssessment.recommendation?.[language] || '',
                    actions: (riskAssessment.recommendation?.[language] || '')
                        .split('\n')
                        .filter(line => line.trim().length > 0),
                    diseasesAffected: riskAssessment.diseases_affected || []
                });
            }
        });
    });

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // If same priority, sort by score (lowest first)
        return a.score - b.score;
    });

    return recommendations;
}

/**
 * Get diseases at risk based on recommendations
 * @param {Array} recommendations - Array of recommendations
 * @param {Object} diseaseReference - Disease reference from assessment data
 * @param {string} language - Language code
 * @returns {Array} - Array of { diseaseId, name, count, riskLevel }
 */
export function getDiseasesAtRisk(recommendations, diseaseReference, language = 'en') {
    const diseaseCount = {};

    recommendations.forEach(rec => {
        rec.diseasesAffected.forEach(diseaseId => {
            diseaseCount[diseaseId] = (diseaseCount[diseaseId] || 0) + 1;
        });
    });

    // Get poultry-specific diseases from disease_reference
    const poultryDiseases = diseaseReference?.poultry_specific || [];

    return Object.entries(diseaseCount)
        .map(([diseaseId, count]) => {
            // Find disease in poultry_specific array
            const disease = poultryDiseases.find(d =>
                d.disease === diseaseId ||
                d.disease.replace(/\s+/g, '_') === diseaseId
            );

            return {
                diseaseId,
                name: disease?.[language] || disease?.disease || diseaseId,
                count,
                riskLevel: count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low'
            };
        })
        .sort((a, b) => b.count - a.count); // Sort by count descending
}

/**
 * Validate user answer for a question
 * @param {Object} question - Question object
 * @param {*} answer - User's answer
 * @returns {Array} - Array of error messages (empty if valid)
 */
export function validateAnswer(question, answer) {
    const errors = [];

    if (question.required && (answer === undefined || answer === null || answer === '')) {
        errors.push('This question is required');
    }

    if (answer !== undefined && answer !== null && answer !== '') {
        if (question.answer_type === 'number' || question.answer_type === 'number_input') {
            const num = Number(answer);
            if (isNaN(num)) {
                errors.push('Please enter a valid number');
            } else if (num < 0) {
                errors.push('Please enter a positive number');
            }
        }

        if (question.answer_type === 'single_choice') {
            const validOptions = question.options?.map(opt => opt.id) || [];
            if (!validOptions.includes(answer)) {
                errors.push('Please select a valid option');
            }
        }

        if (question.answer_type === 'multiple_choice') {
            if (!Array.isArray(answer)) {
                errors.push('Invalid answer format');
            } else {
                const validOptions = question.options?.map(opt => opt.id) || [];
                const invalidAnswers = answer.filter(a => !validOptions.includes(a));
                if (invalidAnswers.length > 0) {
                    errors.push('Some selected options are invalid');
                }
            }
        }
    }

    return errors;
}

/**
 * Check if assessment is complete
 * @param {Object} assessment - Full assessment data
 * @param {Object} answers - User answers
 * @returns {boolean} - True if all visible questions are answered
 */
export function isAssessmentComplete(assessment, answers) {
    if (!assessment.categories) return false;

    for (const category of assessment.categories) {
        if (!category.questions) continue;

        for (const question of category.questions) {
            // Skip if not shown due to conditional logic
            if (!shouldShowQuestion(question, answers)) continue;

            // Check if question is answered
            const answer = answers[question.id];
            if (answer === undefined || answer === null || answer === '') {
                return false;
            }
        }
    }

    return true;
}

/**
 * Get progress statistics
 * @param {Object} assessment - Full assessment data
 * @param {Object} answers - User answers
 * @returns {Object} - { answeredCount, totalCount, percentage }
 */
export function getProgressStats(assessment, answers) {
    if (!assessment.categories) {
        return { answeredCount: 0, totalCount: 0, percentage: 0 };
    }

    let answeredCount = 0;
    let totalCount = 0;

    assessment.categories.forEach(category => {
        if (!category.questions) return;

        category.questions.forEach(question => {
            // Only count visible questions
            if (!shouldShowQuestion(question, answers)) return;

            totalCount++;
            const answer = answers[question.id];
            if (answer !== undefined && answer !== null && answer !== '') {
                answeredCount++;
            }
        });
    });

    const percentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

    console.log('[DEBUG] getProgressStats:', {
        answeredCount,
        totalCount,
        percentage,
        totalAnswers: Object.keys(answers || {}).length,
        hasCategories: !!(assessment && assessment.categories),
        categoriesCount: assessment?.categories?.length || 0
    });

    return {
        answeredCount,
        totalCount,
        percentage
    };
}

/**
 * Filter questions by priority level
 * @param {Object} assessment - Full assessment data
 * @param {string} priority - Priority level ('critical', 'high', 'medium', 'low')
 * @returns {Array} - Array of questions with that priority
 */
export function filterQuestionsByPriority(assessment, priority) {
    const filtered = [];

    if (!assessment.categories) return filtered;

    assessment.categories.forEach(category => {
        if (!category.questions) return;

        category.questions.forEach(question => {
            if (question.risk_assessment?.priority === priority) {
                filtered.push({
                    ...question,
                    categoryId: category.id,
                    categoryName: category.name
                });
            }
        });
    });

    return filtered;
}

/**
 * LocalStorage keys for layer assessment
 */
const STORAGE_KEY = 'farmwell_layer_assessments';
const CURRENT_ID_KEY = 'farmwell_layer_current_assessment_id';

/**
 * Get current active assessment ID
 */
export function getCurrentAssessmentId() {
    return localStorage.getItem(CURRENT_ID_KEY);
}

/**
 * Set current active assessment ID
 */
export function setCurrentAssessmentId(assessmentId) {
    localStorage.setItem(CURRENT_ID_KEY, assessmentId);
}

/**
 * Get all saved assessments
 */
export function getAllSavedAssessments() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to get all assessments:', error);
    }
    return {};
}

/**
 * Save assessment to localStorage with ID
 * @param {Object} answers - User answers
 * @param {Object} metadata - Additional metadata (position, timestamp, etc.)
 * @param {string} assessmentId - Optional assessment ID
 */
export function saveAssessment(answers, metadata = {}, assessmentId = null) {
    try {
        const allAssessments = getAllSavedAssessments();
        const id = assessmentId || getCurrentAssessmentId() || generateAssessmentId();
        
        const data = {
            id,
            answers,
            metadata: {
                ...metadata,
                assessmentId: id,
                lastUpdated: new Date().toISOString()
            },
            lastModified: new Date().toISOString()
        };
        
        allAssessments[id] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allAssessments));
        
        if (!assessmentId) {
            setCurrentAssessmentId(id);
        }
        
        return id;
    } catch (error) {
        console.error('Failed to save assessment:', error);
        return null;
    }
}

/**
 * Load assessment from localStorage
 * @param {string} assessmentId - Optional assessment ID
 * @returns {Object|null} - Saved assessment data or null
 */
export function loadAssessment(assessmentId = null) {
    try {
        const allAssessments = getAllSavedAssessments();
        const id = assessmentId || getCurrentAssessmentId();
        
        if (id && allAssessments[id]) {
            return allAssessments[id];
        }
        return null;
    } catch (error) {
        console.error('Failed to load assessment:', error);
        return null;
    }
}

/**
 * Clear assessment from localStorage
 * @param {string} assessmentId - Optional assessment ID to clear
 */
export function clearAssessment(assessmentId = null) {
    try {
        if (assessmentId) {
            const allAssessments = getAllSavedAssessments();
            delete allAssessments[assessmentId];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allAssessments));
            
            if (getCurrentAssessmentId() === assessmentId) {
                localStorage.removeItem(CURRENT_ID_KEY);
            }
        } else {
            const currentId = getCurrentAssessmentId();
            if (currentId) {
                const allAssessments = getAllSavedAssessments();
                delete allAssessments[currentId];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(allAssessments));
            }
            localStorage.removeItem(CURRENT_ID_KEY);
        }
    } catch (error) {
        console.error('Failed to clear assessment:', error);
    }
}

/**
 * Generate unique assessment ID with format DDMMYYXXXX
 */
export function generateAssessmentId() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const datePrefix = `${day}${month}${year}`;
    
    const allAssessments = getAllSavedAssessments();
    const assessmentIds = Object.keys(allAssessments);
    const todayAssessments = assessmentIds.filter(id => id.startsWith(datePrefix));
    
    let maxRunningNumber = 0;
    todayAssessments.forEach(id => {
        const runningNumber = parseInt(id.slice(-4), 10);
        if (!isNaN(runningNumber) && runningNumber > maxRunningNumber) {
            maxRunningNumber = runningNumber;
        }
    });
    
    const newRunningNumber = String(maxRunningNumber + 1).padStart(4, '0');
    return `${datePrefix}${newRunningNumber}`;
}

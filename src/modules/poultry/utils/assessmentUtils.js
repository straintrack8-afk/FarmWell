// Broiler Assessment Utility Functions
// Updated for Focus Area structure and Trigger-based Risk Assessment

/**
 * Get localized text from multi-language object
 */
export const getLocalizedText = (textObj, language = 'vi') => {
    if (!textObj) return '';
    if (typeof textObj === 'string') return textObj;
    return textObj[language] || textObj['vi'] || textObj['en'] || '';
};

/**
 * Calculate score for a single category
 */
export const calculateCategoryScore = (category, answers) => {
    console.log(`[DEBUG] calculateCategoryScore called for category: ${category?.id}`);
    
    if (!category || !category.questions || category.questions.length === 0) {
        return { score: 0, maxScore: 0, percentage: 0 };
    }

    let totalScore = 0;
    let maxScore = 0;
    let answeredCount = 0;

    category.questions.forEach((question, idx) => {
        const answer = answers[question.id];
        
        // Log first question in detail
        if (idx === 0) {
            console.log(`[DEBUG] First question ${question.id}:`, {
                answer,
                hasOptions: !!question.options,
                hasScoringLogic: !!question.scoring_logic,
                scoringLogicType: question.scoring_logic?.type
            });
        }
        
        if (answer !== undefined && answer !== null) {
            answeredCount++;
            
            if (question.options) {
                // Multiple choice questions with options
                const selectedOption = question.options.find(opt => opt.id === answer);
                if (selectedOption) {
                    totalScore += selectedOption.score || 0;
                    if (idx === 0) console.log(`[DEBUG] Option score added: ${selectedOption.score}`);
                } else {
                    console.log(`Category ${category.id} - Question ${question.id}: Answer "${answer}" not found in options`);
                }
            } else if (question.scoring_logic) {
                // Questions with scoring_logic (e.g., numeric ranges)
                if (question.scoring_logic.type === 'range' && question.scoring_logic.ranges) {
                    const numericAnswer = typeof answer === 'number' ? answer : parseFloat(answer);
                    if (!isNaN(numericAnswer)) {
                        const matchingRange = question.scoring_logic.ranges.find(
                            range => numericAnswer >= range.min && numericAnswer <= range.max
                        );
                        if (matchingRange) {
                            totalScore += matchingRange.score || 0;
                            if (idx === 0) console.log(`[DEBUG] Range score added: ${matchingRange.score} for answer ${numericAnswer}`);
                        } else {
                            if (idx === 0) console.log(`[DEBUG] No matching range for answer ${numericAnswer}`);
                        }
                    }
                }
            }
        }

        // Calculate max possible score for this question
        let maxQuestionScore = 0;
        if (question.options) {
            maxQuestionScore = Math.max(...(question.options.map(opt => opt.score || 0)));
        } else if (question.scoring_logic?.ranges) {
            maxQuestionScore = Math.max(...(question.scoring_logic.ranges.map(r => r.score || 0)));
        }
        maxScore += maxQuestionScore;
        
        if (idx === 0) console.log(`[DEBUG] Max score for first question: ${maxQuestionScore}`);
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    console.log(`[DEBUG] Category ${category.id} FINAL: totalScore=${totalScore}, maxScore=${maxScore}, percentage=${percentage}, answered=${answeredCount}/${category.questions.length}`);

    if (answeredCount > 0 && totalScore === 0) {
        console.log(`[WARNING] Category ${category.id}: ${answeredCount} answers but score is 0. MaxScore: ${maxScore}`);
    }

    return {
        score: totalScore,
        maxScore,
        percentage
    };
};

/**
 * Calculate score for a focus area
 */
export const calculateFocusAreaScore = (focusArea, categories, answers) => {
    if (!focusArea || !focusArea.categories || !categories) {
        return { score: 0, maxScore: 0, percentage: 0, weightedScore: 0 };
    }

    let totalScore = 0;
    let maxScore = 0;
    let totalWeight = 0;

    // Calculate for each category in this focus area
    focusArea.categories.forEach(categoryId => {
        const category = categories[categoryId];
        if (category) {
            const categoryResult = calculateCategoryScore(category, answers);
            const weight = category.weight || 0;

            totalScore += categoryResult.percentage * weight;
            maxScore += 100 * weight;
            totalWeight += weight;
        }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const weightedScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
        score: totalScore,
        maxScore,
        percentage,
        weightedScore: Math.round(weightedScore)
    };
};

/**
 * Calculate External Biosecurity Score
 */
export const calculateExternalScore = (focusAreas, categories, answers) => {
    console.log('[DEBUG] calculateExternalScore called');
    
    if (!focusAreas || !focusAreas.external_biosecurity) {
        console.log('[DEBUG] No external_biosecurity found');
        return { score: 0, percentage: 0 };
    }

    const externalFocusArea = focusAreas.external_biosecurity;
    const areas = externalFocusArea.areas || [];
    
    console.log(`[DEBUG] External areas count: ${areas.length}`);
    
    if (areas.length === 0) {
        return { score: 0, percentage: 0 };
    }

    let totalScore = 0;
    let areaCount = 0;

    // Calculate for each sub-area in external biosecurity
    areas.forEach(area => {
        const areaResult = calculateFocusAreaScore(area, categories, answers);
        console.log(`[DEBUG] Area ${area.id}: percentage=${areaResult.percentage}`);
        
        totalScore += areaResult.percentage;
        areaCount++;
    });

    const percentage = areaCount > 0 ? Math.round(totalScore / areaCount) : 0;
    
    console.log(`[DEBUG] External FINAL: totalScore=${totalScore}, areaCount=${areaCount}, percentage=${percentage}`);

    return {
        score: totalScore,
        percentage
    };
};

/**
 * Calculate Internal Biosecurity Score
 */
export const calculateInternalScore = (focusAreas, categories, answers) => {
    console.log('[DEBUG] calculateInternalScore called');
    
    if (!focusAreas || !focusAreas.internal_biosecurity) {
        console.log('[DEBUG] No internal_biosecurity found');
        return { score: 0, percentage: 0 };
    }

    const internalFocusArea = focusAreas.internal_biosecurity;
    const areas = internalFocusArea.areas || [];
    
    console.log(`[DEBUG] Internal areas count: ${areas.length}`);
    
    if (areas.length === 0) {
        return { score: 0, percentage: 0 };
    }

    let totalScore = 0;
    let areaCount = 0;

    // Calculate for each sub-area in internal biosecurity
    areas.forEach(area => {
        const areaResult = calculateFocusAreaScore(area, categories, answers);
        console.log(`[DEBUG] Area ${area.id}: percentage=${areaResult.percentage}`);
        
        totalScore += areaResult.percentage;
        areaCount++;
    });

    const percentage = areaCount > 0 ? Math.round(totalScore / areaCount) : 0;
    
    console.log(`[DEBUG] Internal FINAL: totalScore=${totalScore}, areaCount=${areaCount}, percentage=${percentage}`);

    return {
        score: totalScore,
        percentage
    };
};

/**
 * Calculate overall weighted score
 */
export const calculateOverallScore = (focusAreas, categories, answers) => {
    if (!focusAreas || !categories) {
        return 0;
    }

    const externalResult = calculateExternalScore(focusAreas, categories, answers);
    const internalResult = calculateInternalScore(focusAreas, categories, answers);

    // Weight: External 60%, Internal 40% (approximate from focus area weights)
    const externalWeight = 0.61;
    const internalWeight = 0.39;

    const overallScore = (externalResult.percentage * externalWeight) + (internalResult.percentage * internalWeight);

    return Math.round(overallScore);
};

/**
 * Get grade based on score
 */
export const getGrade = (score, gradeLevels) => {
    if (!gradeLevels) {
        // Default grade levels
        if (score >= 85) return 'A';
        if (score >= 70) return 'B';
        if (score >= 50) return 'C';
        if (score >= 30) return 'D';
        return 'F';
    }

    // Use grade levels from config
    for (const [grade, config] of Object.entries(gradeLevels)) {
        if (score >= config.min && score <= config.max) {
            return grade;
        }
    }

    return 'F';
};

/**
 * Get grade configuration
 */
export const getGradeConfig = (grade, gradeLevels, language = 'vi') => {
    if (!gradeLevels || !gradeLevels[grade]) {
        return {
            color: '#6b7280',
            risk: 'unknown',
            description: 'Unknown'
        };
    }

    const config = gradeLevels[grade];
    return {
        color: config.color,
        risk: config.risk,
        description: getLocalizedText(config.description, language)
    };
};

/**
 * Identify triggered disease risks based on answers
 */
export const identifyTriggeredRisks = (answers, diseases) => {
    if (!diseases || !answers) {
        return [];
    }

    const triggeredRisks = [];

    diseases.forEach(disease => {
        if (!disease.triggers || disease.triggers.length === 0) {
            return;
        }

        const triggeredBy = [];
        let totalWeight = 0;
        let maxRiskLevel = null;

        disease.triggers.forEach(trigger => {
            const answer = answers[trigger.question_id];
            if (answer === trigger.trigger_value) {
                triggeredBy.push({
                    questionId: trigger.question_id,
                    riskLevel: trigger.risk_level,
                    weight: trigger.weight
                });
                totalWeight += trigger.weight;

                // Determine max risk level
                if (!maxRiskLevel || getRiskPriority(trigger.risk_level) < getRiskPriority(maxRiskLevel)) {
                    maxRiskLevel = trigger.risk_level;
                }
            }
        });

        if (triggeredBy.length > 0) {
            triggeredRisks.push({
                disease,
                triggeredBy,
                totalWeight,
                riskLevel: maxRiskLevel,
                triggerCount: triggeredBy.length
            });
        }
    });

    // Sort by risk level (critical first) and then by weight
    triggeredRisks.sort((a, b) => {
        const priorityDiff = getRiskPriority(a.riskLevel) - getRiskPriority(b.riskLevel);
        if (priorityDiff !== 0) return priorityDiff;
        return b.totalWeight - a.totalWeight;
    });

    return triggeredRisks;
};

/**
 * Get risk priority (lower number = higher priority)
 */
const getRiskPriority = (riskLevel) => {
    const priorities = {
        'critical': 1,
        'high': 2,
        'medium': 3,
        'low': 4
    };
    return priorities[riskLevel] || 5;
};

/**
 * Get risk level color
 */
export const getRiskColor = (riskLevel) => {
    const colors = {
        'critical': '#dc2626',
        'high': '#ea580c',
        'medium': '#ca8a04',
        'low': '#65a30d'
    };
    return colors[riskLevel] || '#6b7280';
};

/**
 * Get progress statistics
 */
export const getProgressStats = (focusAreas, categories, answers) => {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    if (categories) {
        Object.values(categories).forEach(category => {
            if (category.questions) {
                totalQuestions += category.questions.length;
                category.questions.forEach(question => {
                    if (answers[question.id]) {
                        answeredQuestions++;
                    }
                });
            }
        });
    }

    const percentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return {
        totalQuestions,
        answeredQuestions,
        percentage,
        isComplete: answeredQuestions === totalQuestions
    };
};

/**
 * Get category progress
 */
export const getCategoryProgress = (category, answers) => {
    if (!category || !category.questions) {
        return { total: 0, answered: 0, percentage: 0 };
    }

    const total = category.questions.length;
    const answered = category.questions.filter(q => answers[q.id]).length;
    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    return { total, answered, percentage };
};

/**
 * Get focus area progress
 */
export const getFocusAreaProgress = (focusArea, categories, answers) => {
    if (!focusArea || !focusArea.categories) {
        return { total: 0, answered: 0, percentage: 0 };
    }

    let total = 0;
    let answered = 0;

    focusArea.categories.forEach(categoryId => {
        const category = categories[categoryId];
        if (category) {
            const progress = getCategoryProgress(category, answers);
            total += progress.total;
            answered += progress.answered;
        }
    });

    const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

    return { total, answered, percentage };
};

/**
 * Generate unique assessment ID with format DDMMYYXXXX
 * DD = day, MM = month, YY = year, XXXX = running number (0001-9999)
 */
export const generateAssessmentId = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const datePrefix = `${day}${month}${year}`;
    
    // Get all existing assessments
    const allAssessments = getAllSavedAssessments();
    const assessmentIds = Object.keys(allAssessments);
    
    // Find assessments with same date prefix
    const todayAssessments = assessmentIds.filter(id => id.startsWith(datePrefix));
    
    // Get the highest running number for today
    let maxRunningNumber = 0;
    todayAssessments.forEach(id => {
        const runningNumber = parseInt(id.slice(-4), 10);
        if (!isNaN(runningNumber) && runningNumber > maxRunningNumber) {
            maxRunningNumber = runningNumber;
        }
    });
    
    // Increment and format as 4-digit number
    const newRunningNumber = String(maxRunningNumber + 1).padStart(4, '0');
    
    return `${datePrefix}${newRunningNumber}`;
};

/**
 * Get current active assessment ID
 */
export const getCurrentAssessmentId = () => {
    return localStorage.getItem('broiler_current_assessment_id');
};

/**
 * Set current active assessment ID
 */
export const setCurrentAssessmentId = (assessmentId) => {
    localStorage.setItem('broiler_current_assessment_id', assessmentId);
};

/**
 * Get all saved assessments
 */
export const getAllSavedAssessments = () => {
    try {
        const data = localStorage.getItem('broiler_assessments');
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Failed to get all assessments:', error);
    }
    return {};
};

/**
 * Create new assessment
 */
export const createNewAssessment = () => {
    const newId = generateAssessmentId();
    setCurrentAssessmentId(newId);
    return newId;
};

/**
 * Save assessment to localStorage with ID
 */
export const saveAssessment = (answers, metadata = {}, assessmentId = null) => {
    try {
        // Get all saved assessments
        const allAssessments = getAllSavedAssessments();
        
        // Use provided ID or get current active ID or generate new one
        const id = assessmentId || getCurrentAssessmentId() || generateAssessmentId();
        
        // Check if this is a new assessment (not in allAssessments yet)
        const isNewAssessment = !allAssessments[id];
        
        const data = {
            id,
            answers,
            metadata: {
                ...metadata,
                assessmentId: id,
                createdAt: isNewAssessment ? new Date().toISOString() : (allAssessments[id]?.metadata?.createdAt || new Date().toISOString()),
                assessorName: metadata.assessorName || allAssessments[id]?.metadata?.assessorName || ''
            },
            savedAt: isNewAssessment ? new Date().toISOString() : (allAssessments[id]?.savedAt || new Date().toISOString()),
            lastModified: new Date().toISOString()
        };
        
        // Update or add assessment
        allAssessments[id] = data;
        
        // Save all assessments
        localStorage.setItem('broiler_assessments', JSON.stringify(allAssessments));
        
        // Set as current active assessment
        localStorage.setItem('broiler_current_assessment_id', id);
        
        return id;
    } catch (error) {
        console.error('Failed to save assessment:', error);
        return null;
    }
};

/**
 * Load assessment from localStorage by ID
 */
export const loadAssessment = (assessmentId = null) => {
    try {
        const allAssessments = getAllSavedAssessments();
        const id = assessmentId || getCurrentAssessmentId();
        
        if (id && allAssessments[id]) {
            return allAssessments[id];
        }
        
        // Fallback: return most recent assessment
        const assessmentList = Object.values(allAssessments);
        if (assessmentList.length > 0) {
            assessmentList.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
            return assessmentList[0];
        }
    } catch (error) {
        console.error('Failed to load assessment:', error);
    }
    return null;
};

/**
 * Clear specific assessment or all assessments
 */
export const clearAssessment = (assessmentId = null) => {
    try {
        if (assessmentId) {
            // Clear specific assessment
            const allAssessments = getAllSavedAssessments();
            delete allAssessments[assessmentId];
            localStorage.setItem('broiler_assessments', JSON.stringify(allAssessments));
            
            // If clearing current assessment, clear the current ID
            if (getCurrentAssessmentId() === assessmentId) {
                localStorage.removeItem('broiler_current_assessment_id');
            }
        } else {
            // Clear all assessments
            localStorage.removeItem('broiler_assessments');
            localStorage.removeItem('broiler_current_assessment_id');
        }
        return true;
    } catch (error) {
        console.error('Failed to clear assessment:', error);
        return false;
    }
};


/**
 * Format date based on language
 */
export const formatDate = (date, language = 'vi') => {
    if (!date) return '';

    const d = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    const locales = {
        'vi': 'vi-VN',
        'en': 'en-US',
        'id': 'id-ID'
    };

    return d.toLocaleDateString(locales[language] || 'vi-VN', options);
};

/**
 * Get all categories from focus areas
 */
export const getAllCategoriesFromFocusAreas = (focusAreas) => {
    const allCategories = [];

    if (focusAreas) {
        // External biosecurity
        if (focusAreas.external_biosecurity?.areas) {
            focusAreas.external_biosecurity.areas.forEach(area => {
                if (area.categories) {
                    allCategories.push(...area.categories);
                }
            });
        }

        // Internal biosecurity
        if (focusAreas.internal_biosecurity?.areas) {
            focusAreas.internal_biosecurity.areas.forEach(area => {
                if (area.categories) {
                    allCategories.push(...area.categories);
                }
            });
        }
    }

    return allCategories;
};

/**
 * Get focus area by category ID
 */
export const getFocusAreaByCategory = (categoryId, focusAreas) => {
    if (!focusAreas) return null;

    // Check external biosecurity
    if (focusAreas.external_biosecurity?.areas) {
        for (const area of focusAreas.external_biosecurity.areas) {
            if (area.categories?.includes(categoryId)) {
                return {
                    type: 'external',
                    focusArea: focusAreas.external_biosecurity,
                    subArea: area
                };
            }
        }
    }

    // Check internal biosecurity
    if (focusAreas.internal_biosecurity?.areas) {
        for (const area of focusAreas.internal_biosecurity.areas) {
            if (area.categories?.includes(categoryId)) {
                return {
                    type: 'internal',
                    focusArea: focusAreas.internal_biosecurity,
                    subArea: area
                };
            }
        }
    }

    return null;
};

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
    calculateOverallScore,
    calculateExternalScore,
    calculateInternalScore,
    calculateFocusAreaScore,
    calculateCategoryScore,
    getGrade,
    getGradeConfig,
    identifyTriggeredRisks,
    getProgressStats,
    getFocusAreaProgress,
    getCategoryProgress,
    saveAssessment,
    loadAssessment,
    clearAssessment,
    getAllCategoriesFromFocusAreas,
    getCurrentAssessmentId,
    createNewAssessment
} from '../utils/assessmentUtils';

const BroilerAssessmentContext = createContext();

const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_DATA: 'SET_DATA',
    SET_ERROR: 'SET_ERROR',
    SET_ANSWER: 'SET_ANSWER',
    SET_CURRENT_POSITION: 'SET_CURRENT_POSITION',
    CALCULATE_SCORES: 'CALCULATE_SCORES',
    RESET_ASSESSMENT: 'RESET_ASSESSMENT',
    LOAD_SAVED_ASSESSMENT: 'LOAD_SAVED_ASSESSMENT'
};

const initialState = {
    // Data
    assessmentData: null,
    focusAreas: null,
    categories: null,
    diseases: null,
    scoringConfig: null,
    scoreSystem: null,

    // Navigation
    currentFocusAreaType: 'external', // 'external' or 'internal'
    currentSubAreaIndex: 0,
    currentCategoryId: null,
    currentQuestionIndex: 0,

    // Answers
    answers: {},

    // Scores
    overallScore: 0,
    externalScore: 0,
    internalScore: 0,
    focusAreaScores: {},
    categoryScores: {},
    grade: null,
    gradeConfig: null,

    // Risks
    triggeredRisks: [],

    // Progress
    progressStats: null,

    // State
    isLoading: true,
    error: null
};

function assessmentReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.SET_DATA:
            return {
                ...state,
                assessmentData: action.payload,
                focusAreas: action.payload.focus_areas,
                categories: action.payload.categories,
                diseases: action.payload.diseases,
                scoringConfig: action.payload.score_system || action.payload.scoring_config,
                scoreSystem: action.payload.score_system,
                isLoading: false,
                error: null
            };

        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case ACTIONS.SET_ANSWER:
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionId]: action.payload.answer
                }
            };

        case ACTIONS.SET_CURRENT_POSITION:
            return {
                ...state,
                ...action.payload
            };

        case ACTIONS.CALCULATE_SCORES:
            return {
                ...state,
                ...action.payload
            };

        case ACTIONS.RESET_ASSESSMENT:
            return {
                ...initialState,
                assessmentData: state.assessmentData,
                focusAreas: state.focusAreas,
                categories: state.categories,
                diseases: state.diseases,
                scoringConfig: state.scoringConfig,
                isLoading: false
            };

        case ACTIONS.LOAD_SAVED_ASSESSMENT:
            return {
                ...state,
                answers: action.payload.answers,
                ...action.payload.position
            };

        default:
            return state;
    }
}

export function BroilerAssessmentProvider({ children }) {
    const [state, dispatch] = useReducer(assessmentReducer, initialState);
    const { language } = useLanguage();

    // Load assessment data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            const response = await fetch('/data/poultry/broiler_assessment.json');
            if (!response.ok) throw new Error('Failed to load assessment data');

            const data = await response.json();

            // Normalize categories to object if it's an array for easier lookup
            if (Array.isArray(data.categories)) {
                const categoriesMap = {};
                data.categories.forEach(cat => {
                    categoriesMap[cat.id] = cat;
                });
                data.categories = categoriesMap;
            }

            dispatch({ type: ACTIONS.SET_DATA, payload: data });

            // Calculate initial progress stats
            const initialProgressStats = getProgressStats(data.focus_areas, data.categories, {});
            dispatch({
                type: ACTIONS.CALCULATE_SCORES,
                payload: {
                    progressStats: initialProgressStats
                }
            });

            // Try to load saved progress
            const saved = loadAssessment();
            console.log('Context - Loading saved assessment:', saved);
            console.log('Context - Saved answers count:', saved?.answers ? Object.keys(saved.answers).length : 0);
            
            if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
                dispatch({
                    type: ACTIONS.LOAD_SAVED_ASSESSMENT,
                    payload: {
                        answers: saved.answers,
                        position: saved.metadata?.position || {}
                    }
                });
                
                // Force recalculate scores after loading
                console.log('Context - Triggering score recalculation after load');
            } else {
                // No saved progress - set initial position to first question
                const firstArea = data.focus_areas?.external_biosecurity?.areas?.[0];
                if (firstArea && firstArea.categories && firstArea.categories.length > 0) {
                    dispatch({
                        type: ACTIONS.SET_CURRENT_POSITION,
                        payload: {
                            currentFocusAreaType: 'external',
                            currentSubAreaIndex: 0,
                            currentCategoryId: firstArea.categories[0],
                            currentQuestionIndex: 0
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error loading assessment data:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // Calculate scores whenever answers change
    useEffect(() => {
        if (state.focusAreas && state.categories && state.scoringConfig) {
            calculateAllScores();
        }
    }, [state.answers, state.focusAreas, state.categories, state.scoringConfig]);

    const calculateAllScores = useCallback(() => {
        const { focusAreas, categories, answers, diseases, scoringConfig } = state;

        console.log('Context - calculateAllScores called');
        console.log('Context - Answers:', answers);
        console.log('Context - Answers count:', Object.keys(answers || {}).length);

        // Guard: Don't calculate if data not loaded yet
        if (!focusAreas || !categories || !scoringConfig) {
            console.log('Context - Skipping calculation, data not loaded yet');
            console.log('Context - focusAreas:', !!focusAreas);
            console.log('Context - categories:', !!categories);
            console.log('Context - scoringConfig:', !!scoringConfig);
            return;
        }

        // Calculate overall score
        const overallScore = calculateOverallScore(focusAreas, categories, answers);
        console.log('Context - Overall Score:', overallScore);

        // Calculate external/internal scores
        const externalResult = calculateExternalScore(focusAreas, categories, answers);
        const internalResult = calculateInternalScore(focusAreas, categories, answers);

        // Calculate focus area scores
        const focusAreaScores = {};
        if (focusAreas.external_biosecurity?.areas) {
            focusAreas.external_biosecurity.areas.forEach(area => {
                focusAreaScores[area.id] = calculateFocusAreaScore(area, categories, answers);
            });
        }
        if (focusAreas.internal_biosecurity?.areas) {
            focusAreas.internal_biosecurity.areas.forEach(area => {
                focusAreaScores[area.id] = calculateFocusAreaScore(area, categories, answers);
            });
        }

        // Calculate category scores
        const categoryScores = {};
        Object.entries(categories).forEach(([id, category]) => {
            categoryScores[id] = calculateCategoryScore(category, answers);
        });

        // Get grade
        const grade = getGrade(overallScore, scoringConfig?.grade_levels);
        const gradeConfig = getGradeConfig(grade, scoringConfig?.grade_levels, language);

        // Identify triggered risks
        const triggeredRisks = identifyTriggeredRisks(answers, diseases);

        // Get progress stats
        const progressStats = getProgressStats(focusAreas, categories, answers);

        console.log('Context - Calculated Scores:', {
            overallScore,
            externalScore: externalResult.score,
            internalScore: internalResult.score,
            progressStats,
            grade
        });

        dispatch({
            type: ACTIONS.CALCULATE_SCORES,
            payload: {
                overallScore,
                externalScore: externalResult.score,
                internalScore: internalResult.score,
                focusAreaScores,
                categoryScores,
                grade,
                gradeConfig,
                triggeredRisks,
                progressStats
            }
        });
    }, [state.focusAreas, state.categories, state.answers, state.diseases, state.scoringConfig, language]);

    // Answer a question
    const answerQuestion = useCallback((questionId, answer) => {
        dispatch({
            type: ACTIONS.SET_ANSWER,
            payload: { questionId, answer }
        });

        // Save to localStorage
        const newAnswers = { ...state.answers, [questionId]: answer };
        saveAssessment(newAnswers, {
            position: {
                currentFocusAreaType: state.currentFocusAreaType,
                currentSubAreaIndex: state.currentSubAreaIndex,
                currentCategoryId: state.currentCategoryId,
                currentQuestionIndex: state.currentQuestionIndex
            }
        });
    }, [state.answers, state.currentFocusAreaType, state.currentSubAreaIndex, state.currentCategoryId, state.currentQuestionIndex]);

    // Navigate to specific position
    const navigateTo = useCallback((position) => {
        // Merge with current state to preserve values not being updated
        const newPosition = {
            currentFocusAreaType: position.currentFocusAreaType !== undefined ? position.currentFocusAreaType : state.currentFocusAreaType,
            currentSubAreaIndex: position.currentSubAreaIndex !== undefined ? position.currentSubAreaIndex : state.currentSubAreaIndex,
            currentCategoryId: position.currentCategoryId !== undefined ? position.currentCategoryId : state.currentCategoryId,
            currentQuestionIndex: position.currentQuestionIndex !== undefined ? position.currentQuestionIndex : state.currentQuestionIndex
        };

        dispatch({
            type: ACTIONS.SET_CURRENT_POSITION,
            payload: newPosition
        });

        // Save position
        saveAssessment(state.answers, { position: newPosition });
    }, [state.answers, state.currentFocusAreaType, state.currentSubAreaIndex, state.currentCategoryId, state.currentQuestionIndex]);

    // Get current question
    const getCurrentQuestion = useCallback(() => {
        const { currentCategoryId, currentQuestionIndex, categories } = state;

        if (!currentCategoryId || !categories || !categories[currentCategoryId]) {
            return null;
        }

        const category = categories[currentCategoryId];
        if (!category.questions || category.questions.length === 0) {
            return null;
        }

        return category.questions[currentQuestionIndex] || null;
    }, [state.currentCategoryId, state.currentQuestionIndex, state.categories]);

    // Get current category
    const getCurrentCategory = useCallback(() => {
        const { currentCategoryId, categories } = state;
        return currentCategoryId && categories ? categories[currentCategoryId] : null;
    }, [state.currentCategoryId, state.categories]);

    // Get current focus area
    const getCurrentFocusArea = useCallback(() => {
        const { currentFocusAreaType, currentSubAreaIndex, focusAreas } = state;

        if (!focusAreas) return null;

        const focusArea = currentFocusAreaType === 'external'
            ? focusAreas.external_biosecurity
            : focusAreas.internal_biosecurity;

        return focusArea?.areas?.[currentSubAreaIndex] || null;
    }, [state.currentFocusAreaType, state.currentSubAreaIndex, state.focusAreas]);

    // Get current question number globally (1-based index across all questions)
    const getCurrentQuestionNumber = useCallback(() => {
        const { currentCategoryId, currentQuestionIndex, focusAreas, categories } = state;
        
        if (!focusAreas || !categories || !currentCategoryId) return 1;

        let questionNumber = 0;
        let foundCurrent = false;

        // Helper to process categories in order
        const processFocusArea = (focusAreaData) => {
            if (!focusAreaData?.areas) return;
            
            for (const area of focusAreaData.areas) {
                if (!area.categories) continue;
                
                for (const catId of area.categories) {
                    const category = categories[catId];
                    if (!category?.questions) continue;
                    
                    if (catId === currentCategoryId) {
                        questionNumber += currentQuestionIndex + 1;
                        foundCurrent = true;
                        return;
                    }
                    
                    questionNumber += category.questions.length;
                }
                
                if (foundCurrent) return;
            }
        };

        // Process external first, then internal
        processFocusArea(focusAreas.external_biosecurity);
        if (!foundCurrent) {
            processFocusArea(focusAreas.internal_biosecurity);
        }

        return questionNumber || 1;
    }, [state.currentCategoryId, state.currentQuestionIndex, state.focusAreas, state.categories]);

    // Next question
    const nextQuestion = useCallback(() => {
        const currentCategory = getCurrentCategory();
        const currentFocusArea = getCurrentFocusArea();

        if (!currentCategory || !currentFocusArea) return;

        const { currentQuestionIndex, currentCategoryId, categories, focusAreas } = state;

        // Check if there are more questions in current category
        if (currentQuestionIndex < currentCategory.questions.length - 1) {
            navigateTo({
                currentQuestionIndex: currentQuestionIndex + 1
            });
            return;
        }

        // Move to next category in current focus area
        const categoryIndex = currentFocusArea.categories.indexOf(currentCategoryId);
        if (categoryIndex < currentFocusArea.categories.length - 1) {
            const nextCategoryId = currentFocusArea.categories[categoryIndex + 1];
            navigateTo({
                currentCategoryId: nextCategoryId,
                currentQuestionIndex: 0
            });
            return;
        }

        // Move to next sub-area or focus area
        const { currentFocusAreaType, currentSubAreaIndex } = state;
        const focusArea = currentFocusAreaType === 'external'
            ? focusAreas.external_biosecurity
            : focusAreas.internal_biosecurity;

        if (currentSubAreaIndex < focusArea.areas.length - 1) {
            // Next sub-area in same focus area
            const nextSubArea = focusArea.areas[currentSubAreaIndex + 1];
            navigateTo({
                currentSubAreaIndex: currentSubAreaIndex + 1,
                currentCategoryId: nextSubArea.categories[0],
                currentQuestionIndex: 0
            });
        } else if (currentFocusAreaType === 'external') {
            // Move to internal biosecurity
            const firstInternalArea = focusAreas.internal_biosecurity.areas[0];
            navigateTo({
                currentFocusAreaType: 'internal',
                currentSubAreaIndex: 0,
                currentCategoryId: firstInternalArea.categories[0],
                currentQuestionIndex: 0
            });
        }
        // If we're at the end of internal, we're done
    }, [state, getCurrentCategory, getCurrentFocusArea, navigateTo]);

    // Previous question
    const previousQuestion = useCallback(() => {
        const { currentQuestionIndex, currentCategoryId, currentSubAreaIndex, currentFocusAreaType, categories, focusAreas } = state;
        const currentFocusArea = getCurrentFocusArea();

        if (!currentFocusArea) return;

        // Go to previous question in current category
        if (currentQuestionIndex > 0) {
            navigateTo({
                currentQuestionIndex: currentQuestionIndex - 1
            });
            return;
        }

        // Go to previous category in current focus area
        const categoryIndex = currentFocusArea.categories.indexOf(currentCategoryId);
        if (categoryIndex > 0) {
            const prevCategoryId = currentFocusArea.categories[categoryIndex - 1];
            const prevCategory = categories[prevCategoryId];
            navigateTo({
                currentCategoryId: prevCategoryId,
                currentQuestionIndex: prevCategory.questions.length - 1
            });
            return;
        }

        // Go to previous sub-area or focus area
        if (currentSubAreaIndex > 0) {
            const focusArea = currentFocusAreaType === 'external'
                ? focusAreas.external_biosecurity
                : focusAreas.internal_biosecurity;
            const prevSubArea = focusArea.areas[currentSubAreaIndex - 1];
            const lastCategoryId = prevSubArea.categories[prevSubArea.categories.length - 1];
            const lastCategory = categories[lastCategoryId];

            navigateTo({
                currentSubAreaIndex: currentSubAreaIndex - 1,
                currentCategoryId: lastCategoryId,
                currentQuestionIndex: lastCategory.questions.length - 1
            });
        } else if (currentFocusAreaType === 'internal') {
            // Go back to last sub-area of external
            const lastExternalArea = focusAreas.external_biosecurity.areas[focusAreas.external_biosecurity.areas.length - 1];
            const lastCategoryId = lastExternalArea.categories[lastExternalArea.categories.length - 1];
            const lastCategory = categories[lastCategoryId];

            navigateTo({
                currentFocusAreaType: 'external',
                currentSubAreaIndex: focusAreas.external_biosecurity.areas.length - 1,
                currentCategoryId: lastCategoryId,
                currentQuestionIndex: lastCategory.questions.length - 1
            });
        }
    }, [state, getCurrentFocusArea, navigateTo]);

    // Reset assessment
    const resetAssessment = useCallback(() => {
        clearAssessment();
        dispatch({ type: ACTIONS.RESET_ASSESSMENT });

        // Set to first question
        if (state.focusAreas?.external_biosecurity?.areas?.[0]) {
            const firstArea = state.focusAreas.external_biosecurity.areas[0];
            navigateTo({
                currentFocusAreaType: 'external',
                currentSubAreaIndex: 0,
                currentCategoryId: firstArea.categories[0],
                currentQuestionIndex: 0
            });
        }
    }, [state.focusAreas, navigateTo]);

    const value = {
        // State
        ...state,

        // Actions
        answerQuestion,
        navigateTo,
        nextQuestion,
        previousQuestion,
        resetAssessment,
        calculateAllScores,

        // Getters
        getCurrentQuestion,
        getCurrentCategory,
        getCurrentFocusArea,
        getCurrentQuestionNumber
    };

    return (
        <BroilerAssessmentContext.Provider value={value}>
            {children}
        </BroilerAssessmentContext.Provider>
    );
}

export function useBroilerAssessment() {
    const context = useContext(BroilerAssessmentContext);
    if (!context) {
        throw new Error('useBroilerAssessment must be used within BroilerAssessmentProvider');
    }
    return context;
}

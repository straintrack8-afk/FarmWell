import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
    shouldShowQuestion,
    calculateCategoryScore,
    calculateOverallScore,
    getRiskLevel,
    getRiskConfig,
    generateImprovementPlan,
    getDiseasesAtRisk,
    validateAnswer,
    isAssessmentComplete,
    getProgressStats,
    saveAssessment,
    loadAssessment,
    clearAssessment
} from '../utils/layerAssessmentUtils';

const LayerAssessmentContext = createContext();

const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_DATA: 'SET_DATA',
    SET_ERROR: 'SET_ERROR',
    SET_ANSWER: 'SET_ANSWER',
    SET_CURRENT_CATEGORY: 'SET_CURRENT_CATEGORY',
    SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
    CALCULATE_SCORES: 'CALCULATE_SCORES',
    RESET_ASSESSMENT: 'RESET_ASSESSMENT',
    LOAD_SAVED_ASSESSMENT: 'LOAD_SAVED_ASSESSMENT'
};

const initialState = {
    // Data
    assessmentData: null,
    categories: null,
    diseaseReference: null,
    metadata: null,

    // Navigation
    currentCategoryIndex: 0,
    currentQuestionIndex: 0,

    // Answers
    answers: {},

    // Scores
    overallScore: 0,
    categoryScores: {},
    riskLevel: null,
    riskConfig: null,

    // Recommendations
    recommendations: [],
    diseasesAtRisk: [],

    // Progress
    progressStats: null,
    isComplete: false,

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
                categories: action.payload.categories,
                diseaseReference: action.payload.disease_reference,
                metadata: {
                    assessment_id: action.payload.assessment_id,
                    assessment_name: action.payload.assessment_name,
                    version: action.payload.version,
                    total_categories: action.payload.total_categories,
                    total_questions: action.payload.total_questions
                },
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

        case ACTIONS.SET_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategoryIndex: action.payload,
                currentQuestionIndex: 0
            };

        case ACTIONS.SET_CURRENT_QUESTION:
            return {
                ...state,
                currentQuestionIndex: action.payload
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
                categories: state.categories,
                diseaseReference: state.diseaseReference,
                metadata: state.metadata,
                isLoading: false
            };

        case ACTIONS.LOAD_SAVED_ASSESSMENT:
            return {
                ...state,
                answers: action.payload.answers,
                currentCategoryIndex: action.payload.currentCategoryIndex,
                currentQuestionIndex: action.payload.currentQuestionIndex
            };

        default:
            return state;
    }
}

export function LayerAssessmentProvider({ children }) {
    const [state, dispatch] = useReducer(assessmentReducer, initialState);
    const { language } = useLanguage();

    // Load assessment data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            const response = await fetch('/data/poultry/layer_assessment_complete.json');
            if (!response.ok) throw new Error('Failed to load layer assessment data');

            const data = await response.json();
            dispatch({ type: ACTIONS.SET_DATA, payload: data });

            // Try to load saved progress
            const saved = loadAssessment();
            if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
                dispatch({
                    type: ACTIONS.LOAD_SAVED_ASSESSMENT,
                    payload: {
                        answers: saved.answers,
                        currentCategoryIndex: saved.metadata?.currentCategoryIndex || 0,
                        currentQuestionIndex: saved.metadata?.currentQuestionIndex || 0
                    }
                });
            }
        } catch (error) {
            console.error('Error loading layer assessment data:', error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        }
    };

    // Calculate scores whenever answers change
    useEffect(() => {
        if (state.assessmentData && state.categories) {
            calculateAllScores();
        }
    }, [state.answers, state.assessmentData, state.categories, language]);

    const calculateAllScores = useCallback(() => {
        const { assessmentData, categories, answers, diseaseReference } = state;

        // Calculate overall score
        const overallResult = calculateOverallScore(assessmentData, answers);

        // Get risk level
        const riskLevel = getRiskLevel(overallResult.percentage);
        const riskConfig = getRiskConfig(riskLevel, language);

        // Generate recommendations
        const recommendations = generateImprovementPlan(assessmentData, answers, language);

        // Get diseases at risk
        const diseasesAtRisk = getDiseasesAtRisk(recommendations, diseaseReference, language);

        // Get progress stats
        const progressStats = getProgressStats(assessmentData, answers);

        // Check if complete
        const isComplete = isAssessmentComplete(assessmentData, answers);

        dispatch({
            type: ACTIONS.CALCULATE_SCORES,
            payload: {
                overallScore: overallResult.percentage,
                categoryScores: overallResult.categoryScores,
                riskLevel,
                riskConfig,
                recommendations,
                diseasesAtRisk,
                progressStats,
                isComplete
            }
        });
    }, [state.assessmentData, state.categories, state.answers, state.diseaseReference, language]);

    // Answer a question
    const answerQuestion = useCallback((questionId, answer) => {
        dispatch({
            type: ACTIONS.SET_ANSWER,
            payload: { questionId, answer }
        });

        // Save to localStorage
        const newAnswers = { ...state.answers, [questionId]: answer };
        saveAssessment(newAnswers, {
            currentCategoryIndex: state.currentCategoryIndex,
            currentQuestionIndex: state.currentQuestionIndex
        });
    }, [state.answers, state.currentCategoryIndex, state.currentQuestionIndex]);

    // Navigate to category
    const navigateToCategory = useCallback((categoryIndex) => {
        dispatch({ type: ACTIONS.SET_CURRENT_CATEGORY, payload: categoryIndex });

        // Save position
        saveAssessment(state.answers, {
            currentCategoryIndex: categoryIndex,
            currentQuestionIndex: 0
        });
    }, [state.answers]);

    // Navigate to question index
    const navigateToQuestion = useCallback((questionIndex) => {
        dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: questionIndex });

        // Save position
        saveAssessment(state.answers, {
            currentCategoryIndex: state.currentCategoryIndex,
            currentQuestionIndex: questionIndex
        });
    }, [state.answers, state.currentCategoryIndex]);

    // Get current category
    const getCurrentCategory = useCallback(() => {
        const { currentCategoryIndex, categories } = state;
        return categories && categories[currentCategoryIndex] ? categories[currentCategoryIndex] : null;
    }, [state.currentCategoryIndex, state.categories]);

    // Get current question
    const getCurrentQuestion = useCallback(() => {
        const category = getCurrentCategory();
        if (!category || !category.questions) return null;

        // Filter visible questions based on conditional logic
        const visibleQuestions = category.questions.filter(q =>
            shouldShowQuestion(q, state.answers)
        );

        return visibleQuestions[state.currentQuestionIndex] || null;
    }, [getCurrentCategory, state.currentQuestionIndex, state.answers]);

    // Get visible questions for current category
    const getVisibleQuestions = useCallback(() => {
        const category = getCurrentCategory();
        if (!category || !category.questions) return [];

        return category.questions.filter(q => shouldShowQuestion(q, state.answers));
    }, [getCurrentCategory, state.answers]);

    // Next question
    const nextQuestion = useCallback(() => {
        const visibleQuestions = getVisibleQuestions();
        const { currentQuestionIndex, currentCategoryIndex, categories } = state;

        // Check if there are more questions in current category
        if (currentQuestionIndex < visibleQuestions.length - 1) {
            navigateToQuestion(currentQuestionIndex + 1);
            return true;
        }

        // Move to next category
        if (currentCategoryIndex < categories.length - 1) {
            navigateToCategory(currentCategoryIndex + 1);
            return true;
        }

        // No more questions
        return false;
    }, [state, getVisibleQuestions, navigateToQuestion, navigateToCategory]);

    // Previous question
    const previousQuestion = useCallback(() => {
        const { currentQuestionIndex, currentCategoryIndex, categories } = state;

        // Go to previous question in current category
        if (currentQuestionIndex > 0) {
            navigateToQuestion(currentQuestionIndex - 1);
            return true;
        }

        // Go to previous category
        if (currentCategoryIndex > 0) {
            const prevCategoryIndex = currentCategoryIndex - 1;
            const prevCategory = categories[prevCategoryIndex];

            // Get visible questions for previous category
            const prevVisibleQuestions = prevCategory.questions.filter(q =>
                shouldShowQuestion(q, state.answers)
            );

            dispatch({ type: ACTIONS.SET_CURRENT_CATEGORY, payload: prevCategoryIndex });
            navigateToQuestion(prevVisibleQuestions.length - 1);
            return true;
        }

        // No previous questions
        return false;
    }, [state, navigateToQuestion]);

    // Reset assessment
    const resetAssessment = useCallback(() => {
        clearAssessment();
        dispatch({ type: ACTIONS.RESET_ASSESSMENT });
    }, []);

    // Get category progress
    const getCategoryProgress = useCallback((categoryIndex) => {
        const category = state.categories?.[categoryIndex];
        if (!category) return { answeredCount: 0, totalCount: 0, percentage: 0 };

        const visibleQuestions = category.questions.filter(q =>
            shouldShowQuestion(q, state.answers)
        );

        const answeredCount = visibleQuestions.filter(q => {
            const answer = state.answers[q.id];
            return answer !== undefined && answer !== null && answer !== '';
        }).length;

        const percentage = visibleQuestions.length > 0
            ? (answeredCount / visibleQuestions.length) * 100
            : 0;

        return {
            answeredCount,
            totalCount: visibleQuestions.length,
            percentage: Math.round(percentage * 10) / 10
        };
    }, [state.categories, state.answers]);

    const value = {
        // State
        ...state,

        // Actions
        answerQuestion,
        navigateToCategory,
        navigateToQuestion,
        nextQuestion,
        previousQuestion,
        resetAssessment,

        // Getters
        getCurrentCategory,
        getCurrentQuestion,
        getVisibleQuestions,
        getCategoryProgress
    };

    return (
        <LayerAssessmentContext.Provider value={value}>
            {children}
        </LayerAssessmentContext.Provider>
    );
}

export function useLayerAssessment() {
    const context = useContext(LayerAssessmentContext);
    if (!context) {
        throw new Error('useLayerAssessment must be used within LayerAssessmentProvider');
    }
    return context;
}

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
} from '../utils/breederAssessmentUtils';

const BreederAssessmentContext = createContext();

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
    currentCategoryId: null,
    currentQuestionIndex: 0,
    categoryOrder: [], // Array of category IDs in order

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
                metadata: action.payload.metadata,
                categoryOrder: Object.keys(action.payload.categories || {}),
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
                currentCategoryId: action.payload,
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
                categoryOrder: state.categoryOrder,
                isLoading: false
            };

        case ACTIONS.LOAD_SAVED_ASSESSMENT:
            return {
                ...state,
                answers: action.payload.answers,
                currentCategoryId: action.payload.currentCategoryId,
                currentQuestionIndex: action.payload.currentQuestionIndex
            };

        default:
            return state;
    }
}

export function BreederAssessmentProvider({ children }) {
    const [state, dispatch] = useReducer(assessmentReducer, initialState);
    const { language } = useLanguage();

    // Load assessment data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            const response = await fetch('/data/poultry/breeder_assessment.json');
            if (!response.ok) throw new Error('Failed to load breeder assessment data');

            const data = await response.json();
            dispatch({ type: ACTIONS.SET_DATA, payload: data });

            // Try to load saved progress
            const saved = loadAssessment();
            if (saved && saved.answers && Object.keys(saved.answers).length > 0) {
                dispatch({
                    type: ACTIONS.LOAD_SAVED_ASSESSMENT,
                    payload: {
                        answers: saved.answers,
                        currentCategoryId: saved.metadata?.currentCategoryId || Object.keys(data.categories)[0],
                        currentQuestionIndex: saved.metadata?.currentQuestionIndex || 0
                    }
                });
            } else {
                // No saved progress - set initial position to first category
                const firstCategoryId = Object.keys(data.categories)[0];
                dispatch({
                    type: ACTIONS.SET_CURRENT_CATEGORY,
                    payload: firstCategoryId
                });
            }
        } catch (error) {
            console.error('Error loading breeder assessment data:', error);
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
            currentCategoryId: state.currentCategoryId,
            currentQuestionIndex: state.currentQuestionIndex
        });
    }, [state.answers, state.currentCategoryId, state.currentQuestionIndex]);

    // Navigate to category
    const navigateToCategory = useCallback((categoryId) => {
        dispatch({ type: ACTIONS.SET_CURRENT_CATEGORY, payload: categoryId });

        // Save position
        saveAssessment(state.answers, {
            currentCategoryId: categoryId,
            currentQuestionIndex: 0
        });
    }, [state.answers]);

    // Navigate to question index
    const navigateToQuestion = useCallback((questionIndex) => {
        dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: questionIndex });

        // Save position
        saveAssessment(state.answers, {
            currentCategoryId: state.currentCategoryId,
            currentQuestionIndex: questionIndex
        });
    }, [state.answers, state.currentCategoryId]);

    // Get current category
    const getCurrentCategory = useCallback(() => {
        const { currentCategoryId, categories } = state;
        return currentCategoryId && categories ? categories[currentCategoryId] : null;
    }, [state.currentCategoryId, state.categories]);

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
        const { currentQuestionIndex, currentCategoryId, categoryOrder } = state;

        // Check if there are more questions in current category
        if (currentQuestionIndex < visibleQuestions.length - 1) {
            navigateToQuestion(currentQuestionIndex + 1);
            return true;
        }

        // Move to next category
        const currentCategoryIndex = categoryOrder.indexOf(currentCategoryId);
        if (currentCategoryIndex < categoryOrder.length - 1) {
            const nextCategoryId = categoryOrder[currentCategoryIndex + 1];
            navigateToCategory(nextCategoryId);
            return true;
        }

        // No more questions
        return false;
    }, [state, getVisibleQuestions, navigateToQuestion, navigateToCategory]);

    // Previous question
    const previousQuestion = useCallback(() => {
        const { currentQuestionIndex, currentCategoryId, categoryOrder, categories } = state;

        // Go to previous question in current category
        if (currentQuestionIndex > 0) {
            navigateToQuestion(currentQuestionIndex - 1);
            return true;
        }

        // Go to previous category
        const currentCategoryIndex = categoryOrder.indexOf(currentCategoryId);
        if (currentCategoryIndex > 0) {
            const prevCategoryId = categoryOrder[currentCategoryIndex - 1];
            const prevCategory = categories[prevCategoryId];

            // Get visible questions for previous category
            const prevVisibleQuestions = prevCategory.questions.filter(q =>
                shouldShowQuestion(q, state.answers)
            );

            dispatch({ type: ACTIONS.SET_CURRENT_CATEGORY, payload: prevCategoryId });
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

        // Set to first category
        if (state.categoryOrder.length > 0) {
            navigateToCategory(state.categoryOrder[0]);
        }
    }, [state.categoryOrder, navigateToCategory]);

    // Get category progress
    const getCategoryProgress = useCallback((categoryId) => {
        const category = state.categories?.[categoryId];
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
        <BreederAssessmentContext.Provider value={value}>
            {children}
        </BreederAssessmentContext.Provider>
    );
}

export function useBreederAssessment() {
    const context = useContext(BreederAssessmentContext);
    if (!context) {
        throw new Error('useBreederAssessment must be used within BreederAssessmentProvider');
    }
    return context;
}

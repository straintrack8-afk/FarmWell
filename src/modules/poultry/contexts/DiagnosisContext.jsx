import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { STEPS, STORAGE_KEYS } from '../utils/constants';
import { filterDiseases, countMatchingDiseases, filterByAge } from '../utils/filterDiseases';
import { useLanguage } from '../../../contexts/LanguageContext';

// Initial state
const initialState = {
    step: STEPS.LANDING,
    selectedAge: null,
    selectedSymptoms: [],
    filteredDiseases: [],
    selectedDisease: null,
    allDiseases: [],
    symptomCategories: {},
    ageGroups: [],
    isLoading: true,
    isOffline: false,
    error: null,
    ageFilteredDiseases: [] // Diseases filtered by age only (for symptom counting)
};

// Action types
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_DATA: 'SET_DATA',
    SET_STEP: 'SET_STEP',
    SET_AGE: 'SET_AGE',
    TOGGLE_SYMPTOM: 'TOGGLE_SYMPTOM',
    CLEAR_SYMPTOMS: 'CLEAR_SYMPTOMS',
    SET_SELECTED_DISEASE: 'SET_SELECTED_DISEASE',
    RESET: 'RESET',
    SET_OFFLINE: 'SET_OFFLINE'
};

// Reducer
function diagnosisReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };

        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload, isLoading: false };

        case ACTIONS.SET_DATA:
            return {
                ...state,
                allDiseases: action.payload.diseases,
                symptomCategories: action.payload.symptomCategories,
                ageGroups: action.payload.ageGroups,
                filteredDiseases: action.payload.diseases,
                isLoading: false
            };

        case ACTIONS.SET_STEP:
            return { ...state, step: action.payload };

        case ACTIONS.SET_AGE: {
            const ageFilteredDiseases = filterByAge(state.allDiseases, action.payload);
            return {
                ...state,
                selectedAge: action.payload,
                ageFilteredDiseases,
                filteredDiseases: ageFilteredDiseases,
                selectedSymptoms: []
            };
        }

        case ACTIONS.TOGGLE_SYMPTOM: {
            const symptom = action.payload;
            const isSelected = state.selectedSymptoms.includes(symptom);
            const newSymptoms = isSelected
                ? state.selectedSymptoms.filter(s => s !== symptom)
                : [...state.selectedSymptoms, symptom];

            const filtered = filterDiseases(
                state.allDiseases,
                state.selectedAge,
                newSymptoms
            );

            return {
                ...state,
                selectedSymptoms: newSymptoms,
                filteredDiseases: filtered
            };
        }

        case ACTIONS.CLEAR_SYMPTOMS: {
            const ageFiltered = filterByAge(state.allDiseases, state.selectedAge);
            return {
                ...state,
                selectedSymptoms: [],
                filteredDiseases: ageFiltered
            };
        }

        case ACTIONS.SET_SELECTED_DISEASE:
            return { ...state, selectedDisease: action.payload };

        case ACTIONS.RESET:
            return {
                ...initialState,
                allDiseases: state.allDiseases,
                symptomCategories: state.symptomCategories,
                ageGroups: state.ageGroups,
                filteredDiseases: state.allDiseases,
                isLoading: false
            };

        case ACTIONS.SET_OFFLINE:
            return { ...state, isOffline: action.payload };

        default:
            return state;
    }
}

// Context
const DiagnosisContext = createContext(null);

// Provider component
export function DiagnosisProvider({ children }) {
    // Detect initial step from URL
    const getInitialStep = () => {
        const path = window.location.pathname;
        if (path.includes('/age')) return STEPS.AGE;
        if (path.includes('/symptoms')) return STEPS.SYMPTOMS;
        if (path.includes('/results')) return STEPS.RESULTS;
        return STEPS.LANDING;
    };

    const [state, dispatch] = useReducer(diagnosisReducer, {
        ...initialState,
        step: getInitialStep()
    });

    const { language } = useLanguage();

    // Load data on mount and when language changes
    useEffect(() => {
        loadData(language);
    }, [language]);

    // Check online status
    useEffect(() => {
        const handleOnline = () => dispatch({ type: ACTIONS.SET_OFFLINE, payload: false });
        const handleOffline = () => dispatch({ type: ACTIONS.SET_OFFLINE, payload: true });

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        dispatch({ type: ACTIONS.SET_OFFLINE, payload: !navigator.onLine });

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const loadData = async (lang = 'en') => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });

        try {
            // Determine file path based on language
            const fileName = lang === 'en' ? 'diseases.json' : `diseases_${lang}.json`;
            const filePath = `/data/poultry/${fileName}`;

            // Try to load from network first
            let response = await fetch(filePath);

            // If language-specific file not found, fallback to English
            if (!response.ok && lang !== 'en') {
                console.warn(`Language file not found for ${lang}, falling back to English`);
                response = await fetch('/data/poultry/diseases.json');
            }

            if (!response.ok) throw new Error('Failed to fetch diseases');

            const data = await response.json();

            // Cache in localStorage for offline use (language-specific cache)
            try {
                const cacheKey = `${STORAGE_KEYS.DISEASES}_${lang}`;
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(`${STORAGE_KEYS.LAST_UPDATED}_${lang}`, new Date().toISOString());
            } catch (e) {
                console.warn('Failed to cache data:', e);
            }

            dispatch({ type: ACTIONS.SET_DATA, payload: data });
        } catch (error) {
            // Try to load from cache (language-specific)
            try {
                const cacheKey = `${STORAGE_KEYS.DISEASES}_${lang}`;
                let cached = localStorage.getItem(cacheKey);

                // If no cache for this language, try English cache
                if (!cached && lang !== 'en') {
                    cached = localStorage.getItem(STORAGE_KEYS.DISEASES);
                }

                if (cached) {
                    const data = JSON.parse(cached);
                    dispatch({ type: ACTIONS.SET_DATA, payload: data });
                    dispatch({ type: ACTIONS.SET_OFFLINE, payload: true });
                } else {
                    dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load disease data' });
                }
            } catch (e) {
                dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load disease data' });
            }
        }
    };

    // Actions
    const setStep = useCallback((step) => {
        dispatch({ type: ACTIONS.SET_STEP, payload: step });
    }, []);

    const setAge = useCallback((age) => {
        dispatch({ type: ACTIONS.SET_AGE, payload: age });
    }, []);

    const toggleSymptom = useCallback((symptom) => {
        dispatch({ type: ACTIONS.TOGGLE_SYMPTOM, payload: symptom });
    }, []);

    const clearSymptoms = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_SYMPTOMS });
    }, []);

    const selectDisease = useCallback((disease) => {
        dispatch({ type: ACTIONS.SET_SELECTED_DISEASE, payload: disease });
        dispatch({ type: ACTIONS.SET_STEP, payload: STEPS.DETAIL });
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: ACTIONS.RESET });
    }, []);

    const goBack = useCallback(() => {
        switch (state.step) {
            case STEPS.AGE:
                window.location.href = '/poultry';
                break;
            case STEPS.SYMPTOMS:
                dispatch({ type: ACTIONS.SET_STEP, payload: STEPS.AGE });
                break;
            case STEPS.RESULTS:
                dispatch({ type: ACTIONS.SET_STEP, payload: STEPS.SYMPTOMS });
                break;
            case STEPS.DETAIL:
                dispatch({ type: ACTIONS.SET_STEP, payload: STEPS.RESULTS });
                break;
            default:
                break;
        }
    }, [state.step]);

    // Get symptom count for a specific symptom
    const getSymptomCount = useCallback((symptom) => {
        return countMatchingDiseases(
            symptom,
            state.ageFilteredDiseases.length > 0 ? state.ageFilteredDiseases : state.allDiseases,
            state.selectedSymptoms
        );
    }, [state.ageFilteredDiseases, state.allDiseases, state.selectedSymptoms]);

    const value = {
        ...state,
        setStep,
        setAge,
        toggleSymptom,
        clearSymptoms,
        selectDisease,
        reset,
        goBack,
        getSymptomCount
    };

    return (
        <DiagnosisContext.Provider value={value}>
            {children}
        </DiagnosisContext.Provider>
    );
}

// Custom hook to use the context
export function useDiagnosis() {
    const context = useContext(DiagnosisContext);
    if (!context) {
        throw new Error('useDiagnosis must be used within a DiagnosisProvider');
    }
    return context;
}

export default DiagnosisContext;

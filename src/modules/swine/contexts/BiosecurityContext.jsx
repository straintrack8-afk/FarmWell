import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import {
  getFarmProfile,
  getCurrentAssessment,
  startNewAssessment,
  saveAnswer as saveAnswerToStorage,
  completeFocusArea as completeFocusAreaInStorage,
  completeAssessment as completeAssessmentInStorage,
  clearCurrentAssessment
} from '../utils/biosecurityStorage';
import {
  calculateFocusAreaScore,
  calculateExternalScore,
  calculateInternalScore,
  calculateOverallScore,
  getAllDiseaseRisks,
  getCriticalItemsByPriority,
  getHighPriorityRecommendations,
  getScoreInterpretation
} from '../utils/biosecurityScoring';
import { detectFarmType, getFarmTypeDisplayName } from '../utils/farmTypeDetection';
import { getFilteredFocusAreaQuestions, getPriorityRecommendations } from '../data/questions_data';

const BiosecurityContext = createContext();

export function useBiosecurity() {
  const context = useContext(BiosecurityContext);
  if (!context) {
    throw new Error('useBiosecurity must be used within a BiosecurityProvider');
  }
  return context;
}

export function BiosecurityProvider({ children }) {
  const { language } = useLanguage(); // Use global language context
  const [farmProfile, setFarmProfile] = useState(getFarmProfile());
  const [currentAssessment, setCurrentAssessment] = useState(getCurrentAssessment());
  const [loading, setLoading] = useState(false);
  const [farmType, setFarmType] = useState(null);
  const [diseaseRisks, setDiseaseRisks] = useState({});
  const [priorityRecommendations, setPriorityRecommendations] = useState(null);

  // Detect farm type when farm profile changes
  useEffect(() => {
    if (farmProfile && farmProfile.data) {
      // Use farmType directly from farm profile if available
      const detectedType = farmProfile.data.farmType || 'unknown';
      setFarmType(detectedType);
      console.log('[Farm Type] Detected from profile:', detectedType, '|', getFarmTypeDisplayName(detectedType, language));
    } else if (farmProfile && farmProfile.pre_q1) {
      // Fallback: try to detect from pre_q1 if available (old format)
      const detected = detectFarmType(farmProfile.pre_q1);
      setFarmType(detected);
      console.log('[Farm Type] Detected from pre_q1:', detected, '|', getFarmTypeDisplayName(detected, language));
    } else {
      setFarmType(null);
      console.log('[Farm Type] No farm profile data available');
    }
  }, [farmProfile, language]);

  // Start new assessment
  const startAssessment = () => {
    const assessment = startNewAssessment(language);
    setCurrentAssessment(assessment);
    return assessment;
  };

  // Save answer
  const saveAnswer = (focusArea, questionId, answer) => {
    saveAnswerToStorage(focusArea, questionId, answer);
    // Reload assessment from storage
    setCurrentAssessment(getCurrentAssessment());
  };

  // Complete focus area
  const completeFocusArea = (focusArea) => {
    const assessment = getCurrentAssessment();
    if (!assessment) return;

    const answers = assessment.focus_areas[focusArea]?.answers || {};
    const score = calculateFocusAreaScore(focusArea, answers, language, farmType);

    completeFocusAreaInStorage(focusArea, score);
    setCurrentAssessment(getCurrentAssessment());

    return score;
  };

  // Complete entire assessment
  const completeAssessment = () => {
    const assessment = getCurrentAssessment();
    if (!assessment) return;

    const overallScore = calculateOverallScore(assessment, language);
    const externalScore = calculateExternalScore(assessment, language);
    const internalScore = calculateInternalScore(assessment, language);

    // Calculate disease risks
    const risks = getAllDiseaseRisks(assessment, language);
    setDiseaseRisks(risks);

    // Calculate priority recommendations
    const recommendations = getPriorityRecommendations(assessment, language);
    setPriorityRecommendations(recommendations);

    const completed = completeAssessmentInStorage(overallScore, externalScore, internalScore);
    setCurrentAssessment(completed);

    return {
      overall: overallScore,
      external: externalScore,
      internal: internalScore,
      interpretation: getScoreInterpretation(overallScore, language),
      diseaseRisks: risks,
      priorityRecommendations: recommendations
    };
  };

  // Reset assessment
  const resetAssessment = () => {
    clearCurrentAssessment();
    setCurrentAssessment(null);
  };

  // Get current focus area progress
  const getFocusAreaProgress = (focusArea) => {
    if (!currentAssessment) return { answered: 0, total: 0, percentage: 0 };

    const answers = currentAssessment.focus_areas[focusArea]?.answers || {};
    const answered = Object.keys(answers).length;

    // TODO: Calculate total based on conditional logic
    // For now, use a rough estimate
    const totalEstimates = { 1: 44, 2: 29, 3: 23, 4: 20 };
    const total = totalEstimates[focusArea] || 0;

    return {
      answered,
      total,
      percentage: total > 0 ? Math.round((answered / total) * 100) : 0
    };
  };

  // Check if assessment is complete
  const isComplete = () => {
    if (!currentAssessment) return false;
    return Object.values(currentAssessment.focus_areas).every(fa => fa.completed);
  };

  // Get disease risks (calculated on assessment completion)
  const getDiseaseRisks = () => {
    if (Object.keys(diseaseRisks).length === 0 && currentAssessment) {
      // Calculate on-demand if not already calculated
      const risks = getAllDiseaseRisks(currentAssessment, language);
      setDiseaseRisks(risks);
      return risks;
    }
    return diseaseRisks;
  };

  // Get priority recommendations (calculated on assessment completion)
  const getPriorityRecommendationsData = () => {
    if (!priorityRecommendations && currentAssessment) {
      // Calculate on-demand if not already calculated
      const recommendations = getPriorityRecommendations(currentAssessment, language);
      setPriorityRecommendations(recommendations);
      return recommendations;
    }
    return priorityRecommendations;
  };

  // Get high priority items count
  const getHighPriorityCount = () => {
    if (!currentAssessment) return 0;
    const highPriority = getHighPriorityRecommendations(currentAssessment, language);
    return highPriority.length;
  };

  // Get critical items by priority level
  const getCriticalItems = (priority) => {
    if (!currentAssessment) return [];
    return getCriticalItemsByPriority(currentAssessment, priority, language);
  };

  const value = {
    language,
    farmProfile,
    setFarmProfile,
    farmType,
    currentAssessment,
    startAssessment,
    saveAnswer,
    completeFocusArea,
    completeAssessment,
    resetAssessment,
    getFocusAreaProgress,
    isComplete,
    loading,
    // Enhanced risk assessment features
    diseaseRisks,
    getDiseaseRisks,
    priorityRecommendations,
    getPriorityRecommendationsData,
    getHighPriorityCount,
    getCriticalItems
  };

  return (
    <BiosecurityContext.Provider value={value}>
      {children}
    </BiosecurityContext.Provider>
  );
}

export default BiosecurityContext;

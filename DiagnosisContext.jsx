/**
 * DiagnosisContext - UPDATED FOR symptomsEnhanced
 * Properly handles enhanced symptom structure with 34 symptoms
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STEPS } from '../utils/constants';

const DiagnosisContext = createContext();

export const useDiagnosis = () => {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error('useDiagnosis must be used within DiagnosisProvider');
  }
  return context;
};

export const DiagnosisProvider = ({ children }) => {
  // States
  const [step, setStep] = useState(STEPS.AGE);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [allSymptoms, setAllSymptoms] = useState([]); // ⭐ NEW: Store processed symptoms
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Load disease database
  useEffect(() => {
    loadDiseaseData();
  }, []);

  const loadDiseaseData = async () => {
    try {
      setIsLoading(true);
      // ⭐ Load enhanced file
      const response = await fetch('/data/diseases/diseases_enhanced_en.json');
      
      if (!response.ok) {
        throw new Error('Failed to load disease database');
      }

      const data = await response.json();
      const loadedDiseases = data.diseases || [];
      
      // ⭐ Process symptoms from symptomsEnhanced
      const symptomsMap = new Map();
      
      loadedDiseases.forEach(disease => {
        if (disease.symptomsEnhanced && Array.isArray(disease.symptomsEnhanced)) {
          disease.symptomsEnhanced.forEach(symptom => {
            if (!symptomsMap.has(symptom.id)) {
              symptomsMap.set(symptom.id, {
                id: symptom.id,
                name: symptom.name,
                category: symptom.category,
                weight: symptom.weight,
                significance: symptom.significance,
                specificity: symptom.specificity,
                urgency: symptom.urgency
              });
            }
          });
        }
      });

      const uniqueSymptoms = Array.from(symptomsMap.values());
      
      console.log('Total diseases loaded:', loadedDiseases.length);
      console.log('Total unique symptoms collected:', uniqueSymptoms.length);
      
      // Count by category
      const categoryCount = {};
      uniqueSymptoms.forEach(s => {
        categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
      });
      console.log('Symptom distribution by body part:', categoryCount);

      setDiseases(loadedDiseases);
      setAllSymptoms(uniqueSymptoms);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading diseases:', err);
      setError(err.message);
      setIsLoading(false);
      setIsOffline(true);
    }
  };

  // Toggle body part selection
  const toggleBodyPart = (bodyPartId) => {
    setSelectedBodyParts(prev => {
      if (prev.includes(bodyPartId)) {
        return prev.filter(id => id !== bodyPartId);
      } else {
        return [...prev, bodyPartId];
      }
    });
  };

  // Clear body parts
  const clearBodyParts = () => {
    setSelectedBodyParts([]);
  };

  // Toggle symptom selection (by symptom ID)
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        return prev.filter(id => id !== symptomId);
      } else {
        return [...prev, symptomId];
      }
    });
  };

  // Get filtered symptoms based on selected body parts
  const getFilteredSymptoms = () => {
    if (selectedBodyParts.length === 0) {
      return allSymptoms; // Show all if no body part selected
    }
    
    return allSymptoms.filter(symptom => 
      selectedBodyParts.includes(symptom.category)
    );
  };

  // Calculate results with enhanced scoring
  const calculateResults = () => {
    if (selectedSymptoms.length === 0) {
      setResults([]);
      return;
    }

    // Filter diseases by age if selected
    let filteredDiseases = diseases;
    if (selectedAge && selectedAge !== 'All ages') {
      filteredDiseases = diseases.filter(disease => 
        disease.ageGroups && disease.ageGroups.includes(selectedAge)
      );
    }

    // Calculate match scores with weighted algorithm
    const scored = filteredDiseases.map(disease => {
      if (!disease.symptomsEnhanced) {
        return null;
      }

      let totalScore = 0;
      let maxPossibleScore = 0;
      const matchedSymptoms = [];

      disease.symptomsEnhanced.forEach(symptom => {
        const symptomWeight = symptom.weight || 0.5;
        const specificityMultiplier = {
          'high': 1.5,
          'medium': 1.0,
          'low': 0.5
        }[symptom.specificity] || 1.0;

        const baseScore = symptom.significance === 'primary' ? 10 : 5;
        const maxScore = baseScore * symptomWeight * specificityMultiplier;
        
        maxPossibleScore += maxScore;

        // Check if symptom is selected
        if (selectedSymptoms.includes(symptom.id)) {
          totalScore += maxScore;
          matchedSymptoms.push(symptom);
        }
      });

      const percentage = maxPossibleScore > 0 
        ? (totalScore / maxPossibleScore) * 100 
        : 0;

      const confidence = 
        percentage >= 75 ? 'high' :
        percentage >= 50 ? 'medium' :
        percentage >= 25 ? 'low' : 'unlikely';

      return {
        ...disease,
        matchedSymptoms,
        matchCount: matchedSymptoms.length,
        totalSymptoms: disease.symptomsEnhanced.length,
        score: totalScore,
        maxScore: maxPossibleScore,
        percentage: Math.round(percentage * 10) / 10,
        confidence
      };
    }).filter(d => d && d.matchCount > 0);

    // Sort by score, then match count
    const sorted = scored.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.matchCount - a.matchCount;
    });

    setResults(sorted);
  };

  // Navigate to next step
  const nextStep = () => {
    if (step === STEPS.AGE) {
      setStep(STEPS.BODY_PART);
    } else if (step === STEPS.BODY_PART) {
      setStep(STEPS.SYMPTOMS);
    } else if (step === STEPS.SYMPTOMS) {
      calculateResults();
      setStep(STEPS.RESULTS);
    }
  };

  // Navigate to previous step
  const previousStep = () => {
    if (step === STEPS.SYMPTOMS) {
      setStep(STEPS.BODY_PART);
    } else if (step === STEPS.BODY_PART) {
      setStep(STEPS.AGE);
    } else if (step === STEPS.RESULTS) {
      setStep(STEPS.SYMPTOMS);
    } else if (step === STEPS.DETAIL) {
      setStep(STEPS.RESULTS);
    }
  };

  // View disease detail
  const viewDiseaseDetail = (disease) => {
    setSelectedDisease(disease);
    setStep(STEPS.DETAIL);
  };

  // Reset diagnosis
  const reset = () => {
    setStep(STEPS.AGE);
    setSelectedAge(null);
    setSelectedBodyParts([]);
    setSelectedSymptoms([]);
    setResults([]);
    setSelectedDisease(null);
  };

  const value = {
    // States
    step,
    selectedAge,
    selectedBodyParts,
    selectedSymptoms,
    results,
    selectedDisease,
    diseases,
    allSymptoms,           // ⭐ NEW: Processed symptoms list
    isLoading,
    error,
    isOffline,
    STEPS,

    // Actions
    setStep,
    setSelectedAge,
    toggleBodyPart,
    clearBodyParts,
    toggleSymptom,
    getFilteredSymptoms,   // ⭐ NEW: Get symptoms filtered by body part
    calculateResults,
    nextStep,
    previousStep,
    viewDiseaseDetail,
    reset
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
};

/**
 * DiagnosisContext - UPDATED
 * Added body part selection functionality
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STEPS, BODY_PARTS } from '../utils/constants';

const DiagnosisContext = createContext();

export const useDiagnosis = () => {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error('useDiagnosis must be used within DiagnosisProvider');
  }
  return context;
};

export const DiagnosisProvider = ({ children }) => {
  // Age groups definition
  const ageGroups = [
    { id: 'All ages', label: 'All Ages', icon: '🐣🐔', description: 'Any age group' },
    { id: '0-3 weeks', label: '0-3 Weeks', icon: '🐣', description: 'Chicks' },
    { id: '4-8 weeks', label: '4-8 Weeks', icon: '🐤', description: 'Growers' },
    { id: '9+ weeks', label: '9+ Weeks', icon: '🐔', description: 'Adults' }
  ];

  // Load persisted state from localStorage
  const loadPersistedState = () => {
    try {
      const saved = localStorage.getItem('poultry_diagnosis_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate step - must be one of the valid STEPS
        const validSteps = Object.values(STEPS);
        const validatedStep = validSteps.includes(parsed.step) ? parsed.step : STEPS.AGE;
        
        console.log('Loading persisted state:', {
          step: validatedStep,
          hasAge: !!parsed.selectedAge,
          symptomsCount: parsed.selectedSymptoms?.length || 0,
          hasDisease: !!parsed.selectedDisease
        });
        
        return {
          step: validatedStep,
          selectedAge: parsed.selectedAge || null,
          selectedSymptoms: Array.isArray(parsed.selectedSymptoms) ? parsed.selectedSymptoms : [],
          selectedDisease: parsed.selectedDisease || null,
          selectedBodyParts: Array.isArray(parsed.selectedBodyParts) ? parsed.selectedBodyParts : []
        };
      }
    } catch (err) {
      console.error('Failed to load persisted state:', err);
      // Clear corrupted localStorage
      try {
        localStorage.removeItem('poultry_diagnosis_state');
      } catch (e) {
        console.error('Failed to clear corrupted state:', e);
      }
    }
    
    console.log('Using default state: STEPS.AGE');
    return {
      step: STEPS.AGE,
      selectedAge: null,
      selectedSymptoms: [],
      selectedDisease: null,
      selectedBodyParts: []
    };
  };

  const persistedState = loadPersistedState();

  // Existing states with persisted initial values
  const [step, setStep] = useState(persistedState.step);
  const [selectedAge, setSelectedAge] = useState(persistedState.selectedAge);
  const [selectedSymptoms, setSelectedSymptoms] = useState(persistedState.selectedSymptoms);
  const [results, setResults] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(persistedState.selectedDisease);
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // ⭐ NEW: Body part selection state
  const [selectedBodyParts, setSelectedBodyParts] = useState(persistedState.selectedBodyParts);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const stateToSave = {
        step,
        selectedAge,
        selectedSymptoms,
        selectedDisease,
        selectedBodyParts
      };
      localStorage.setItem('poultry_diagnosis_state', JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Failed to persist state:', err);
    }
  }, [step, selectedAge, selectedSymptoms, selectedDisease, selectedBodyParts]);

  // Load disease database
  useEffect(() => {
    loadDiseaseData();
  }, []);

  const loadDiseaseData = async (language = 'en') => {
    try {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      
      // Determine filename and disease key based on language
      let filename, diseaseKey;
      switch(language) {
        case 'id':
          filename = 'diseases_COMPLETE_129_v4.1_ENRICHED_id.json';
          diseaseKey = 'penyakit'; // Indonesian uses different root key
          break;
        case 'vn':
          filename = 'diseases_COMPLETE_129_v4.1_ENRICHED_vn.json';
          diseaseKey = 'diseases';
          break;
        case 'en':
        default:
          filename = 'diseases_COMPLETE_129_v4.1_ENRICHED_en.json';
          diseaseKey = 'diseases';
      }
      
      const url = `/data/poultry/${filename}?v=${timestamp}`;
      console.log('Loading enriched disease data from:', url);
      
      const response = await fetch(url, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load disease database: ${response.status}`);
      }

      const data = await response.json();
      const diseasesArray = data[diseaseKey] || [];
      
      console.log('Enriched disease data loaded:', {
        language,
        filename,
        diseaseKey,
        totalDiseases: diseasesArray.length,
        firstDisease: diseasesArray[0]?.name,
        hasEnrichment: !!diseasesArray[0]?.description || !!diseasesArray[0]?.deskripsi,
        hasSymptomsEnhanced: !!diseasesArray[0]?.symptomsEnhanced,
        allSymptomsCount: data.allSymptoms?.length,
        version: data.metadata?.version
      });
      
      setDiseases(diseasesArray);
      
      // Store allSymptoms for direct access (v4.1 feature)
      if (data.allSymptoms) {
        window.__allSymptoms = data.allSymptoms;
        console.log('✅ Loaded', data.allSymptoms.length, 'symptoms from database');
      } else {
        // ENRICHED database doesn't have allSymptoms array - extract from diseases
        console.log('⚠️ No allSymptoms in database, extracting from diseases...');
        const symptomMap = new Map();
        
        diseasesArray.forEach(disease => {
          const symptomsArray = disease.symptomsEnhanced || disease.symptoms || [];
          symptomsArray.forEach(symptom => {
            if (typeof symptom === 'object' && symptom.id) {
              // Use symptom ID as unique key
              if (!symptomMap.has(symptom.id)) {
                symptomMap.set(symptom.id, {
                  id: symptom.id,
                  name: symptom.name,
                  category: symptom.category,
                  bodyPart: symptom.bodyPart,
                  weight: symptom.weight,
                  significance: symptom.significance,
                  specificity: symptom.specificity,
                  urgency: symptom.urgency
                });
              }
            }
          });
        });
        
        window.__allSymptoms = Array.from(symptomMap.values());
        console.log('✅ Extracted', window.__allSymptoms.length, 'unique symptoms from', diseasesArray.length, 'diseases');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading diseases:', err);
      setError(err.message);
      setIsLoading(false);
      setIsOffline(true);
    }
  };

  // ⭐ NEW: Toggle body part selection
  const toggleBodyPart = (bodyPartId) => {
    setSelectedBodyParts(prev => {
      if (prev.includes(bodyPartId)) {
        return prev.filter(id => id !== bodyPartId);
      } else {
        return [...prev, bodyPartId];
      }
    });
  };

  // ⭐ NEW: Clear body parts
  const clearBodyParts = () => {
    setSelectedBodyParts([]);
  };

  // Generate body parts with symptoms from diseases database
  const bodyPartsWithSymptoms = React.useMemo(() => {
    if (!diseases || diseases.length === 0) {
      return BODY_PARTS; // Fallback to hardcoded if no diseases loaded
    }
    
    // v4.1: Use allSymptoms from database if available
    const allSymptomsFromDB = window.__allSymptoms || [];
    
    console.log('Total diseases loaded:', diseases.length);
    console.log('Total unique symptoms from database:', allSymptomsFromDB.length);
    
    // If no allSymptoms in database, fallback to collecting from diseases
    if (allSymptomsFromDB.length === 0) {
      console.warn('No allSymptoms found in database, collecting from diseases...');
      const allSymptoms = new Set();
      const symptomMetadata = new Map();
      
      diseases.forEach(disease => {
        const symptomsArray = disease.symptomsEnhanced || disease.symptoms || [];
        symptomsArray.forEach(symptom => {
          const symptomName = typeof symptom === 'string' ? symptom : symptom.name;
          allSymptoms.add(symptomName);
          if (typeof symptom === 'object') {
            symptomMetadata.set(symptomName, {
              category: symptom.category,
              weight: symptom.weight,
              significance: symptom.significance,
              bodyPart: symptom.bodyPart
            });
          }
        });
      });
      console.log('Collected symptoms from diseases:', allSymptoms.size);
    }

    // v4.1: Categorize symptoms by bodyPart field from database
    // NOTE: 'nervous' category removed - neurological symptoms now in 'general', 'musculoskeletal', etc.
    const bodyPartSymptoms = {
      respiratory: [],
      digestive: [],
      musculoskeletal: [],
      integumentary: [],
      reproductive: [],
      general: []
    };

    // Use allSymptoms from database (v4.1) which has bodyPart field
    allSymptomsFromDB.forEach(symptom => {
      const bodyPart = symptom.bodyPart || 'systemic';
      
      // Map v4.1 bodyPart categories to our existing 7 categories
      const categoryMap = {
        'respiratory': 'respiratory',
        'neck': 'respiratory',
        'crop': 'digestive',
        'droppings': 'digestive',
        'abdomen': 'digestive',
        'comb_wattles': 'integumentary',
        'eyes': 'integumentary',
        'beak_mouth': 'integumentary',
        'ears': 'integumentary',
        'face': 'integumentary',
        'skin_feathers': 'integumentary',
        'wings': 'musculoskeletal',
        'legs_feet': 'musculoskeletal',
        'breast_keel': 'musculoskeletal',
        'vent': 'reproductive',
        'eggs': 'reproductive',
        'behavior': 'general',
        'systemic': 'general'
      };
      
      const targetCategory = categoryMap[bodyPart] || 'general';
      
      // Add symptom name to appropriate category
      if (bodyPartSymptoms[targetCategory]) {
        bodyPartSymptoms[targetCategory].push(symptom.name);
      } else {
        bodyPartSymptoms.general.push(symptom.name);
      }
    });

    // Log categorization results
    console.log('Symptom distribution by body part:');
    Object.keys(bodyPartSymptoms).forEach(key => {
      console.log(`  ${key}: ${bodyPartSymptoms[key].length} symptoms`);
    });
    
    // Update BODY_PARTS with actual symptoms from database
    // Preserve detailedParts for filtering in BodyPartSelection
    return BODY_PARTS.map(part => ({
      ...part,
      symptoms: bodyPartSymptoms[part.id] || [],
      detailedParts: part.detailedParts || []  // Keep mapping to ChickenBodyMapImproved parts
    }));
  }, [diseases]);

  // Generate symptom categories from diseases (for SymptomSelection page if needed)
  const symptomCategories = React.useMemo(() => {
    if (!diseases || diseases.length === 0) return {};
    
    const categories = {};
    bodyPartsWithSymptoms.forEach(part => {
      if (part.symptoms && part.symptoms.length > 0) {
        categories[part.id] = {
          label: part.name,
          symptoms: part.symptoms
        };
      }
    });

    return categories;
  }, [bodyPartsWithSymptoms]);

  // Toggle symptom selection
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // Clear symptoms
  const clearSymptoms = () => {
    setSelectedSymptoms([]);
  };

  // Calculate results based on symptoms
  const calculateResults = () => {
    if (selectedSymptoms.length === 0) {
      setResults([]);
      return;
    }

    console.log('🔍 Calculating results...');
    console.log('Selected symptoms:', selectedSymptoms);

    // Filter diseases by age if selected
    let filteredDiseases = diseases;
    if (selectedAge && selectedAge !== 'All ages') {
      filteredDiseases = diseases.filter(disease => 
        disease.ageGroups && disease.ageGroups.includes(selectedAge)
      );
    }

    console.log('Diseases to check:', filteredDiseases.length);

    // Calculate match scores with weighted scoring
    const scored = filteredDiseases.map(disease => {
      // Use symptomsEnhanced if available for weighted scoring
      const symptomsArray = disease.symptomsEnhanced || disease.symptoms || [];
      
      let matchedSymptoms = [];
      let totalWeight = 0;
      let matchedWeight = 0;
      
      symptomsArray.forEach(symptom => {
        const symptomName = typeof symptom === 'string' ? symptom : symptom.name;
        const symptomWeight = typeof symptom === 'object' ? (symptom.weight || 0.5) : 0.5;
        
        totalWeight += symptomWeight;
        
        if (selectedSymptoms.includes(symptomName)) {
          matchedSymptoms.push(symptomName);
          matchedWeight += symptomWeight;
        }
      });
      
      const matchCount = matchedSymptoms.length;
      const totalSymptoms = symptomsArray.length;
      
      // Calculate percentage based on weighted scoring
      const percentage = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

      return {
        ...disease,
        matchedSymptoms,
        matchCount,
        totalSymptoms,
        percentage: Math.round(percentage * 10) / 10
      };
    });

    // Filter and sort by match count
    const filtered = scored.filter(d => d.matchCount > 0);
    const sorted = filtered.sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return b.percentage - a.percentage;
    });

    console.log('✅ Results calculated:', sorted.length, 'diseases matched');
    if (sorted.length > 0) {
      console.log('Top match:', sorted[0].name, '-', sorted[0].percentage + '%', `(${sorted[0].matchCount}/${sorted[0].totalSymptoms} symptoms)`);
    } else {
      console.warn('⚠️ No diseases matched! Check if symptom names match database.');
      console.log('First disease symptoms sample:', filteredDiseases[0]?.symptomsEnhanced?.slice(0, 3).map(s => s.name));
    }

    setResults(sorted);
  };

  // Navigate to next step
  const nextStep = () => {
    if (step === STEPS.AGE) {
      setStep(STEPS.BODY_PART);  // ⭐ Go to body part selection
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
      setStep(STEPS.BODY_PART);  // ⭐ Go back to body part
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
    setSelectedBodyParts([]);  // ⭐ Clear body parts
    setSelectedSymptoms([]);
    setResults([]);
    setSelectedDisease(null);
    // Clear persisted state
    try {
      localStorage.removeItem('poultry_diagnosis_state');
    } catch (err) {
      console.error('Failed to clear persisted state:', err);
    }
  };

  const value = {
    // States
    step,
    selectedAge,
    selectedBodyParts,      // ⭐ NEW
    selectedSymptoms,
    results,                // ⭐ Calculated disease matches with confidence %
    selectedDisease,
    diseases,
    ageGroups,              // ⭐ NEW
    bodyPartsWithSymptoms,  // ⭐ NEW - Body parts with actual symptoms from database
    symptomCategories,      // ⭐ NEW
    isLoading,
    error,
    isOffline,
    STEPS,

    // Actions
    setStep,
    setSelectedAge,
    setAge: setSelectedAge, // Alias for compatibility
    toggleBodyPart,         // ⭐ NEW
    clearBodyParts,         // ⭐ NEW
    toggleSymptom,
    clearSymptoms,          // ⭐ NEW
    calculateResults,
    nextStep,
    previousStep,
    viewDiseaseDetail,
    reset,
    
    // Helper functions (add if needed by components)
    filteredDiseases: diseases,
    getSymptomCount: (symptom) => {
      // Count how many diseases have this symptom
      return diseases.filter(disease => 
        disease.symptoms && disease.symptoms.includes(symptom)
      ).length;
    }
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
};

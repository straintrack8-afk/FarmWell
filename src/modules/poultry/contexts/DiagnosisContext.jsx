/**
 * DiagnosisContext - UPDATED
 * Added body part selection functionality and language support
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { STEPS, BODY_PARTS } from '../utils/constants';
import { useLanguage } from '../../../contexts/LanguageContext';

const DiagnosisContext = createContext();

export const useDiagnosis = () => {
  const context = useContext(DiagnosisContext);
  if (!context) {
    throw new Error('useDiagnosis must be used within DiagnosisProvider');
  }
  return context;
};

export const DiagnosisProvider = ({ children }) => {
  // Get current language from LanguageContext
  const { language } = useLanguage();

  // Age groups definition with filtering configuration
  const AGE_GROUPS = {
    'All ages': {
      id: 'All ages',
      label: 'All Ages',
      icon: '🐣🐔',
      description: 'Any age group',
      canLayEggs: true,
      excludedSymptomCategories: [],
      excludedSymptomIds: [],
      diseaseAgeMatches: ['Mọi lứa tuổi', 'All ages', 'Semua umur'] // Match any age in disease data
    },
    '0-3 weeks': {
      id: '0-3 weeks',
      label: '0-3 Weeks',
      icon: '🐣',
      description: 'Chicks',
      canLayEggs: false,
      excludedSymptomCategories: ['egg', 'reproductive', 'trứng', 'sinh sản', 'telur', 'reproduksi'],
      excludedSymptomIds: [],
      diseaseAgeMatches: ['Day-old chicks (0-1 days)', 'Growers (2-8 weeks)', 'Chicks', 'Broilers',
                          'Gà con mới nở (0-1 ngày tuổi)', 'Gà giò (2-8 tuần tuổi)', 'Gà thịt',
                          'Anak ayam baru menetas (0-1 hari)', 'Grower (2-8 minggu)', 'Ayam pedaging',
                          'Mọi lứa tuổi', 'All ages', 'Semua umur']
    },
    '4-8 weeks': {
      id: '4-8 weeks',
      label: '4-8 Weeks',
      icon: '🐤',
      description: 'Growers',
      canLayEggs: false,
      excludedSymptomCategories: ['egg', 'reproductive', 'trứng', 'sinh sản', 'telur', 'reproduksi'],
      excludedSymptomIds: [],
      diseaseAgeMatches: ['Growers (2-8 weeks)', 'Broilers', 'Gà giò (2-8 tuần tuổi)', 'Gà thịt',
                          'Grower (2-8 minggu)', 'Ayam pedaging',
                          'Mọi lứa tuổi', 'All ages', 'Semua umur']
    },
    '9+ weeks': {
      id: '9+ weeks',
      label: '9+ Weeks',
      icon: '🐔',
      description: 'Adults',
      canLayEggs: true,
      excludedSymptomCategories: [],
      excludedSymptomIds: [],
      diseaseAgeMatches: ['Layers', 'Breeders', 'Pullets (9-20 weeks)', 'Broilers',
                          'Gà đẻ', 'Gà giống', 'Gà hậu bị (9-20 tuần tuổi)', 'Gà thịt',
                          'Ayam petelur', 'Ayam pembiak', 'Pullet (9-20 minggu)', 'Ayam pedaging',
                          'Mọi lứa tuổi', 'All ages', 'Semua umur']
    }
  };

  const ageGroups = Object.values(AGE_GROUPS);

  // Create symptom name to ID mapping for translation
  const createSymptomNameToIdMap = (diseases) => {
    const nameToId = new Map();
    
    diseases.forEach(disease => {
      const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
      symptomsArray.forEach(symptom => {
        if (typeof symptom === 'object' && symptom.id) {
          const symptomName = symptom.name || symptom.nama;
          if (symptomName) {
            nameToId.set(symptomName, symptom.id);
          }
        }
      });
    });
    
    return nameToId;
  };

  // Create symptom ID to name mapping for translation
  const createSymptomIdToNameMap = (diseases) => {
    const idToName = new Map();
    
    diseases.forEach(disease => {
      const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
      symptomsArray.forEach(symptom => {
        if (typeof symptom === 'object' && symptom.id) {
          const symptomName = symptom.name || symptom.nama;
          if (symptomName && symptom.id) {
            idToName.set(symptom.id, symptomName);
          }
        }
      });
    });
    
    return idToName;
  };

  /**
   * Filter symptoms based on selected age group
   * Removes age-inappropriate symptoms (e.g., egg symptoms for chicks)
   */
  const filterSymptomsByAge = (allSymptoms, selectedAgeGroup) => {
    if (!selectedAgeGroup || selectedAgeGroup === 'All ages') {
      return allSymptoms; // No filtering for "All ages"
    }

    const ageConfig = AGE_GROUPS[selectedAgeGroup];
    if (!ageConfig) {
      console.warn(`Unknown age group: ${selectedAgeGroup}`);
      return allSymptoms;
    }

    const filtered = allSymptoms.filter(symptom => {
      const symptomCategory = (symptom.category || symptom.kategori || '').toLowerCase();
      
      // Check if symptom category is excluded for this age group
      const isCategoryExcluded = ageConfig.excludedSymptomCategories.some(excluded => 
        symptomCategory.includes(excluded.toLowerCase())
      );
      
      if (isCategoryExcluded) {
        return false;
      }
      
      // Check if specific symptom ID is excluded
      if (ageConfig.excludedSymptomIds.includes(symptom.id)) {
        return false;
      }
      
      return true;
    });

    const removedCount = allSymptoms.length - filtered.length;
    if (removedCount > 0) {
      console.log(`🔍 Age filter (${selectedAgeGroup}): Removed ${removedCount} age-inappropriate symptoms`);
    }

    return filtered;
  };

  /**
   * Filter diseases based on selected age group
   * Only shows diseases that affect the selected age range
   */
  const filterDiseasesByAge = (allDiseases, selectedAgeGroup) => {
    if (!selectedAgeGroup || selectedAgeGroup === 'All ages') {
      return allDiseases; // No filtering for "All ages"
    }

    const ageConfig = AGE_GROUPS[selectedAgeGroup];
    if (!ageConfig) {
      console.warn(`Unknown age group: ${selectedAgeGroup}`);
      return allDiseases;
    }

    const filtered = allDiseases.filter(disease => {
      const diseaseAgeGroups = disease.ageGroups || disease.kelompok_umur || [];
      
      // Check if any of the disease's age groups match our selected age
      const hasAgeMatch = diseaseAgeGroups.some(diseaseAge => 
        ageConfig.diseaseAgeMatches.some(matchPattern => 
          diseaseAge.includes(matchPattern) || matchPattern.includes(diseaseAge)
        )
      );
      
      return hasAgeMatch;
    });

    const removedCount = allDiseases.length - filtered.length;
    if (removedCount > 0) {
      console.log(`🔍 Age filter (${selectedAgeGroup}): Removed ${removedCount} age-inappropriate diseases`);
    }

    return filtered;
  };

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
  const [selectedBodyParts, setSelectedBodyParts] = useState(persistedState.selectedBodyParts || []);

  // Store previous diseases for symptom translation
  const [previousDiseases, setPreviousDiseases] = useState(null);

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
    loadDiseaseData(language);
  }, [language]);

  // Auto-translate selected symptoms when language changes
  useEffect(() => {
    if (!diseases || diseases.length === 0 || !previousDiseases || selectedSymptoms.length === 0) {
      // Store current diseases for next language change
      if (diseases && diseases.length > 0) {
        setPreviousDiseases(diseases);
      }
      return;
    }

    console.log('🌐 Language changed - translating symptoms...');
    console.log('Previous symptoms:', selectedSymptoms);

    // Step 1: Map old symptom names to IDs using previous disease data
    const oldNameToId = createSymptomNameToIdMap(previousDiseases);
    const symptomIds = selectedSymptoms
      .map(symptomName => oldNameToId.get(symptomName))
      .filter(id => id !== undefined);

    console.log('Symptom IDs:', symptomIds);

    // Step 2: Map IDs to new symptom names using current disease data
    const newIdToName = createSymptomIdToNameMap(diseases);
    const translatedSymptoms = symptomIds
      .map(id => newIdToName.get(id))
      .filter(name => name !== undefined);

    console.log('Translated symptoms:', translatedSymptoms);

    // Step 3: Update selected symptoms with translated names
    if (translatedSymptoms.length > 0) {
      setSelectedSymptoms(translatedSymptoms);
      console.log('✅ Symptoms translated successfully!');
    } else {
      console.warn('⚠️ No symptoms could be translated - clearing selection');
      setSelectedSymptoms([]);
    }

    // Store current diseases for next language change
    setPreviousDiseases(diseases);
  }, [diseases]); // Only trigger when diseases change (which happens on language change)

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
        case 'vi':
        case 'vn': // Legacy support
        case 'vt': // Legacy support
          filename = 'diseases_COMPLETE_129_v4.1_ENRICHED_vi.json';
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
          // Handle different field names: EN/VN uses 'symptomsEnhanced', ID uses 'gejala_lengkap'
          const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
          symptomsArray.forEach(symptom => {
            if (typeof symptom === 'object' && symptom.id) {
              // Use symptom ID as unique key
              if (!symptomMap.has(symptom.id)) {
                symptomMap.set(symptom.id, {
                  id: symptom.id,
                  // Handle both 'name' (EN/VN) and 'nama' (ID)
                  name: symptom.name || symptom.nama,
                  category: symptom.category || symptom.kategori,
                  // Handle both 'bodyPart' (EN/VN) and 'bagian_tubuh' (ID)
                  bodyPart: symptom.bodyPart || symptom.bagian_tubuh,
                  weight: symptom.weight || symptom.bobot,
                  significance: symptom.significance || symptom.signifikansi,
                  specificity: symptom.specificity || symptom.spesifisitas,
                  urgency: symptom.urgency || symptom.urgensi
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
    let allSymptomsFromDB = window.__allSymptoms || [];
    
    // STAGE 1: Apply age-based symptom filtering
    if (selectedAge && selectedAge !== 'All ages') {
      allSymptomsFromDB = filterSymptomsByAge(allSymptomsFromDB, selectedAge);
    }
    
    console.log('Total diseases loaded:', diseases.length);
    console.log('Total unique symptoms from database:', allSymptomsFromDB.length);
    if (selectedAge && selectedAge !== 'All ages') {
      console.log(`🐣 Age-based filtering active: ${selectedAge}`);
    }
    
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
      // Includes English, Indonesian, and Vietnamese field values
      const categoryMap = {
        // English values
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
        'systemic': 'general',
        // Indonesian values
        'pernapasan': 'respiratory',
        'leher': 'respiratory',
        'tembolok': 'digestive',
        'kotoran': 'digestive',
        'perut': 'digestive',
        'jengger_pial': 'integumentary',
        'mata': 'integumentary',
        'paruh_mulut': 'integumentary',
        'telinga': 'integumentary',
        'wajah': 'integumentary',
        'kulit_bulu': 'integumentary',
        'sayap': 'musculoskeletal',
        'kaki': 'musculoskeletal',
        'dada_lunas': 'musculoskeletal',
        'telur': 'reproductive',
        'perilaku': 'general',
        'sistemik': 'general',
        // Vietnamese values
        'hô hấp': 'respiratory',
        'cổ': 'respiratory',
        'diều': 'digestive',
        'phân': 'digestive',
        'bụng': 'digestive',
        'mào_tích': 'integumentary',
        'mắt': 'integumentary',
        'mỏ_miệng': 'integumentary',
        'tai': 'integumentary',
        'mặt': 'integumentary',
        'da_lông': 'integumentary',
        'cánh': 'musculoskeletal',
        'chân': 'musculoskeletal',
        'ngực_xương_ức': 'musculoskeletal',
        'lỗ huyệt': 'reproductive',
        'trứng': 'reproductive',
        'hành vi': 'general',
        'toàn thân': 'general'
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
  }, [diseases, selectedAge]); // Re-filter when age changes

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

  /**
   * Calculate consistency bonus based on logical symptom patterns
   */
  const calculateConsistencyBonus = (disease, matchedSymptoms) => {
    let bonus = 0;
    
    const categories = matchedSymptoms.map(s => s.category || s.kategori || 'general');
    const categorySet = new Set(categories);
    
    const hasRespiratory = categories.some(c => 
      c === 'respiratory' || c === 'head_respiratory' || c === 'pernapasan'
    );
    const hasSystemic = categories.some(c => 
      c === 'general' || c === 'behavior' || c === 'systemic' || c === 'umum' || c === 'perilaku'
    );
    const hasDigestive = categories.some(c => 
      c === 'digestive' || c === 'droppings' || c === 'pencernaan' || c === 'kotoran'
    );
    const hasNeurological = categories.some(c => 
      c === 'neurological' || c === 'neck' || c === 'neurologis' || c === 'leher'
    );
    const hasSkinFeathers = categories.some(c => 
      c === 'skin' || c === 'feathers' || c === 'skin_feathers' || c === 'kulit' || c === 'bulu'
    );
    
    const diseaseCategory = disease.category || disease.kategori || '';
    if ((diseaseCategory === 'Viral' || diseaseCategory === 'Virus') && hasRespiratory && hasSystemic) {
      bonus += 10;
    }
    
    if (diseaseCategory === 'Bacterial' || diseaseCategory === 'Bakteri') {
      if ((hasDigestive || hasRespiratory) && hasSystemic) {
        bonus += 10;
      }
    }
    
    if (hasNeurological && (hasSystemic || hasRespiratory)) {
      bonus += 10;
    }
    
    const severityIsHigh = disease.severity === 'High' || 
                          disease.tingkat_keparahan === 'Tinggi' || 
                          disease.severity === 'Cao';
    
    if (severityIsHigh && categorySet.size >= 3) {
      bonus += 5;
    }
    
    if ((diseaseCategory === 'Parasitic' || diseaseCategory === 'Fungal' || 
         diseaseCategory === 'Parasit' || diseaseCategory === 'Jamur') && 
        hasSkinFeathers && hasSystemic) {
      bonus += 5;
    }
    
    return Math.min(bonus, 20);
  };

  /**
   * Calculate hybrid confidence score for a disease
   */
  const calculateHybridScore = (disease, matchedSymptoms, symptomsArray) => {
    if (matchedSymptoms.length === 0) {
      return {
        total: 0,
        components: { weighted: 0, primary: 0, specificity: 0, category: 0, consistency: 0 },
        breakdown: { matchedSymptoms: 0, totalSymptoms: symptomsArray.length, matchedPrimary: 0, totalPrimary: 0 }
      };
    }
    
    // COMPONENT 1: WEIGHTED SCORE (40%)
    const matchedWeight = matchedSymptoms.reduce((sum, s) => {
      const weight = typeof s === 'object' ? (s.weight || s.bobot || 0.5) : 0.5;
      return sum + weight;
    }, 0);
    const totalWeight = symptomsArray.reduce((sum, s) => {
      const weight = typeof s === 'object' ? (s.weight || s.bobot || 0.5) : 0.5;
      return sum + weight;
    }, 0);
    
    const weightedScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;
    
    // COMPONENT 2: PRIMARY SCORE (30%)
    const primarySymptoms = symptomsArray.filter(s => {
      if (typeof s === 'string') return false;
      const significance = s.significance || s.signifikansi;
      return significance === 'primary' || significance === 'primer';
    });
    const matchedPrimary = matchedSymptoms.filter(s => {
      if (typeof s === 'string') return false;
      const significance = s.significance || s.signifikansi;
      return significance === 'primary' || significance === 'primer';
    });
    
    let primaryScore = 0;
    if (primarySymptoms.length > 0) {
      primaryScore = (matchedPrimary.length / primarySymptoms.length) * 100;
      
      if (matchedPrimary.length === primarySymptoms.length && primarySymptoms.length > 0) {
        primaryScore += 20;
        console.log(`✨ BONUS: ${disease.name || disease.nama} matched ALL ${primarySymptoms.length} primary symptoms!`);
      }
    } else {
      primaryScore = 50;
    }
    
    // COMPONENT 3: SPECIFICITY SCORE (20%)
    const highSpecificitySymptoms = symptomsArray.filter(s => {
      if (typeof s === 'string') return false;
      const specificity = s.specificity || s.spesifisitas;
      return specificity === 'high' || specificity === 'tinggi';
    });
    const matchedHighSpecificity = matchedSymptoms.filter(s => {
      if (typeof s === 'string') return false;
      const specificity = s.specificity || s.spesifisitas;
      return specificity === 'high' || specificity === 'tinggi';
    });
    
    let specificityScore = 50;
    if (highSpecificitySymptoms.length > 0) {
      specificityScore = (matchedHighSpecificity.length / highSpecificitySymptoms.length) * 100;
    }
    
    // COMPONENT 4: CATEGORY COVERAGE (10%)
    const allCategories = [...new Set(
      symptomsArray.map(s => typeof s === 'object' ? (s.category || s.kategori || 'general') : 'general')
    )];
    const matchedCategories = [...new Set(
      matchedSymptoms.map(s => typeof s === 'object' ? (s.category || s.kategori || 'general') : 'general')
    )];
    
    const categoryCoverage = allCategories.length > 0 ? (matchedCategories.length / allCategories.length) * 100 : 0;
    
    // COMPONENT 5: CONSISTENCY BONUS (0-20 points)
    const consistencyBonus = calculateConsistencyBonus(disease, matchedSymptoms);
    
    // CALCULATE TOTAL SCORE
    let totalScore = (
      (weightedScore * 0.40) +
      (primaryScore * 0.30) +
      (specificityScore * 0.20) +
      (categoryCoverage * 0.10) +
      consistencyBonus
    );
    
    totalScore = Math.max(0, Math.min(100, totalScore));
    totalScore = Math.round(totalScore * 10) / 10;
    
    return {
      total: totalScore,
      components: {
        weighted: Math.round(weightedScore * 0.40 * 10) / 10,
        primary: Math.round(primaryScore * 0.30 * 10) / 10,
        specificity: Math.round(specificityScore * 0.20 * 10) / 10,
        category: Math.round(categoryCoverage * 0.10 * 10) / 10,
        consistency: consistencyBonus
      },
      breakdown: {
        matchedSymptoms: matchedSymptoms.length,
        totalSymptoms: symptomsArray.length,
        matchedPrimary: matchedPrimary.length,
        totalPrimary: primarySymptoms.length,
        matchedCategories: matchedCategories.length,
        totalCategories: allCategories.length,
        allPrimaryMatched: matchedPrimary.length === primarySymptoms.length && primarySymptoms.length > 0
      }
    };
  };

  // Calculate results based on symptoms
  const calculateResults = () => {
    if (selectedSymptoms.length === 0) {
      setResults([]);
      return;
    }

    console.log('🔍 Calculating results...');
    console.log('Selected symptoms:', selectedSymptoms);

    // STAGE 2: Filter diseases by age if selected
    let filteredDiseases = diseases;
    if (selectedAge && selectedAge !== 'All ages') {
      filteredDiseases = filterDiseasesByAge(diseases, selectedAge);
    }

    // Filter out non-chicken diseases (Turkey, Duck, Quail specific)
    const NON_CHICKEN_DISEASE_IDS = [1076, 1102, 1103, 1104, 1105, 1108];
    filteredDiseases = filteredDiseases.filter(disease => {
      // Exclude diseases with specific IDs
      if (NON_CHICKEN_DISEASE_IDS.includes(disease.id)) {
        return false;
      }
      // Exclude diseases with Turkey/Duck/Quail in the name
      const diseaseName = disease.name || disease.nama || '';
      if (diseaseName.includes('Turkey') || diseaseName.includes('Duck') || 
          diseaseName.includes('Quail') || diseaseName.includes('Kalkun') || 
          diseaseName.includes('Bebek') || diseaseName.includes('Puyuh')) {
        return false;
      }
      return true;
    });

    console.log('Diseases to check:', filteredDiseases.length);
    console.log('🐔 Chicken-only filter applied (excluded non-chicken diseases)');
    console.log('\n🔍 HYBRID SCORING - Starting diagnosis...');

    // Calculate match scores with hybrid scoring
    const scored = filteredDiseases.map(disease => {
      const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
      
      // Filter matched symptoms
      const matchedSymptomsArray = symptomsArray.filter(symptom => {
        const symptomName = typeof symptom === 'string' ? symptom : (symptom.name || symptom.nama);
        return selectedSymptoms.includes(symptomName);
      });
      
      // Calculate hybrid score
      const scoreData = calculateHybridScore(disease, matchedSymptomsArray, symptomsArray);
      
      // Get matched symptom names for display
      const matchedSymptoms = matchedSymptomsArray.map(s => 
        typeof s === 'string' ? s : (s.name || s.nama)
      );

      return {
        ...disease,
        matchedSymptoms,
        matchCount: matchedSymptomsArray.length,
        totalSymptoms: symptomsArray.length,
        percentage: scoreData.total,
        scoreComponents: scoreData.components,
        breakdown: scoreData.breakdown
      };
    });

    // Filter and sort by total score (highest first)
    const filtered = scored.filter(d => d.matchCount > 0);
    const sorted = filtered.sort((a, b) => b.percentage - a.percentage);

    // Log top 5 for debugging
    console.log('\n🏆 TOP 5 RESULTS (HYBRID SCORING):');
    sorted.slice(0, 5).forEach((r, i) => {
      const diseaseName = r.name || r.nama;
      console.log(`#${i+1}: ${diseaseName} - ${r.percentage}%`);
      if (r.scoreComponents) {
        console.log(`   Components: W:${r.scoreComponents.weighted} P:${r.scoreComponents.primary} S:${r.scoreComponents.specificity} C:${r.scoreComponents.category} +${r.scoreComponents.consistency}`);
        console.log(`   Match: ${r.breakdown.matchedSymptoms}/${r.breakdown.totalSymptoms} total, ${r.breakdown.matchedPrimary}/${r.breakdown.totalPrimary} primary`);
      }
    });

    console.log('\n✅ Results calculated:', sorted.length, 'diseases matched');
    if (sorted.length === 0) {
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
    // Age filtering helpers
    AGE_GROUPS,
    filterSymptomsByAge,
    filterDiseasesByAge,
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

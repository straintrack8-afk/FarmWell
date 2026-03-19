/**
 * Swine DiagnosisContext - Rebuilt from Poultry Architecture
 * Uses symptom ID-based matching with hybrid confidence scoring
 * Adapted for Swine: disease paths, age groups, no body parts
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
// No STEPS or BODY_PARTS needed for Swine
import { useLanguage } from '../../../contexts/LanguageContext';

// Helper: Normalize symptom names for deduplication
function normalizeSymptomName(name) {
  if (!name) return '';
  
  let normalized = name.toLowerCase().trim();
  
  // Remove parenthetical details like "(acute PHE)", "(best-growing pigs)"
  normalized = normalized.replace(/\s*\([^)]*\)/g, '');
  
  // Remove temperature specifics like "(>41°C)", "(40.5-42°C)"
  normalized = normalized.replace(/\s*\([\d.°c\-]+\)/gi, '');
  
  // Standardize simple plurals - "deaths" → "death", "lesions" → "lesion"
  normalized = normalized.replace(/\bdeaths\b/g, 'death');
  normalized = normalized.replace(/\blesions\b/g, 'lesion');
  normalized = normalized.replace(/\bhemorrhages\b/g, 'hemorrhage');
  
  // Standardize plurals: "returns" → "return"
  normalized = normalized.replace(/returns?/g, 'return');
  
  // Remove mild/moderate/severe qualifiers
  normalized = normalized.replace(/\s+(mild|moderate|severe|acute|chronic|subclinical)$/i, '');
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

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

  // Load English disease data for symptom categorization (language-independent)
  const [englishDiseases, setEnglishDiseases] = useState(null);
  
  // Load English disease data once on mount
  useEffect(() => {
    fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json')
      .then(r => r.json())
      .then(data => {
        setEnglishDiseases(data.diseases || []);
        console.log('✅ Loaded English reference:', data.diseases?.length, 'diseases');
      })
      .catch(err => console.error('Failed to load English reference:', err));
  }, []);

  // Swine Age Groups
  const AGE_GROUPS = {
    'All ages': {
      id: 'All ages',
      label: 'All Ages',
      icon: '�',
      description: 'Any age group',
      diseaseAgeMatches: ['All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Newborn': {
      id: 'Newborn',
      label: 'Newborn (0-7 days)',
      icon: '�',
      description: 'Neonatal piglets',
      diseaseAgeMatches: ['Newborn', 'Neonatus: 0 to 7 days', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Suckling': {
      id: 'Suckling',
      label: 'Suckling (0-3 weeks)',
      icon: '🐷',
      description: 'Pre-weaning phase',
      diseaseAgeMatches: ['Suckling', 'Neonatus: 0 to 7 days', 'Nursery: 8 to 56 days', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Weaned': {
      id: 'Weaned',
      label: 'Weaned (3-8 weeks)',
      icon: '�',
      description: 'Post-weaning',
      diseaseAgeMatches: ['Weaners: 15 to 56 days', 'Nursery: 8 to 56 days', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Growers': {
      id: 'Growers',
      label: 'Growers (2-4 months)',
      icon: '🐖',
      description: 'Growing phase',
      diseaseAgeMatches: ['Growers / finishers', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Finishers': {
      id: 'Finishers',
      label: 'Finishers (4-6 months)',
      icon: '🐷',
      description: 'Near market weight',
      diseaseAgeMatches: ['Growers / finishers', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Sows': {
      id: 'Sows',
      label: 'Sows / Gilts',
      icon: '�',
      description: 'Breeding females',
      diseaseAgeMatches: ['Sows / gilts / boars', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
    },
    'Boars': {
      id: 'Boars',
      label: 'Boars',
      icon: '🐗',
      description: 'Breeding males',
      diseaseAgeMatches: ['Sows / gilts / boars', 'All Ages', 'Semua Umur', 'Mọi lứa tuổi']
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

  // Swine doesn't need symptom filtering by age (no egg/reproductive exclusions)

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

  // Swine doesn't use persisted state

  // Swine doesn't use persisted state or step navigation
  // Existing states
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  // Swine doesn't use body part selection

  // Store previous diseases for symptom translation
  const [previousDiseases, setPreviousDiseases] = useState(null);

  // Swine doesn't persist state to localStorage

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
      
      // Swine disease files
      const filename = `pig_diseases_COMPLETE_104_v1.0_ENRICHED_${language}.json`;
      const diseaseKey = 'diseases';
      
      const url = `/data/swine/${filename}?v=${timestamp}`;
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

  // Swine doesn't use body part selection

  // Swine doesn't use body part categorization

  // Generate symptom categories from diseases for Swine
  const symptomCategories = React.useMemo(() => {
    if (!diseases || diseases.length === 0 || !englishDiseases) {
      console.log('⚠️ Waiting for disease data...', { diseases: !!diseases, englishDiseases: !!englishDiseases });
      return {
        mortality: { label: 'Mortality', symptoms: [] },
        fever: { label: 'Fever Status', symptoms: [] },
        respiratory: { label: 'Respiratory', symptoms: [] },
        digestive: { label: 'Digestive', symptoms: [] },
        nervous: { label: 'Nervous', symptoms: [] },
        skin: { label: 'Skin', symptoms: [] },
        reproductive: { label: 'Reproductive', symptoms: [] },
        systemic: { label: 'Systemic', symptoms: [] }
      };
    }
    
    console.log(`🔍 Building symptom categories for language: ${language}`);
    console.log(`🔍 Total diseases loaded: ${diseases.length}`);
    console.log(`🔍 English reference loaded: ${englishDiseases.length} diseases`);
    
    // Translation keys for category labels
    const categoryLabels = {
      en: {
        mortality: 'Mortality',
        fever: 'Fever Status',
        respiratory: 'Respiratory',
        digestive: 'Digestive',
        nervous: 'Nervous',
        skin: 'Skin',
        reproductive: 'Reproductive',
        systemic: 'Systemic'
      },
      id: {
        mortality: 'Mortalitas',
        fever: 'Status Demam',
        respiratory: 'Pernapasan',
        digestive: 'Pencernaan',
        nervous: 'Saraf',
        skin: 'Kulit',
        reproductive: 'Reproduksi',
        systemic: 'Sistemik'
      },
      vi: {
        mortality: 'Tỷ lệ chết',
        fever: 'Tình trạng sốt',
        respiratory: 'Hô hấp',
        digestive: 'Tiêu hóa',
        nervous: 'Thần kinh',
        skin: 'Da',
        reproductive: 'Sinh sản',
        systemic: 'Toàn thân'
      }
    };
    
    // Use current language for labels
    const labels = categoryLabels[language] || categoryLabels.en;
    
    const categories = {
      mortality: { label: labels.mortality, symptoms: [] },
      fever: { label: labels.fever, symptoms: [] },
      respiratory: { label: labels.respiratory, symptoms: [] },
      digestive: { label: labels.digestive, symptoms: [] },
      nervous: { label: labels.nervous, symptoms: [] },
      skin: { label: labels.skin, symptoms: [] },
      reproductive: { label: labels.reproductive, symptoms: [] },
      systemic: { label: labels.systemic, symptoms: [] }
    };

    // Build symptom ID → English name map from English reference data
    const idToEnglish = new Map();
    englishDiseases.forEach(disease => {
      (disease.symptomsEnhanced || []).forEach(symptom => {
        if (symptom.id && symptom.name) {
          idToEnglish.set(symptom.id, symptom.name);
        }
      });
    });
    
    // Extract unique symptoms from current language diseases
    const symptomMap = new Map();
    diseases.forEach(disease => {
      (disease.symptomsEnhanced || []).forEach(symptom => {
        if (symptom.id && symptom.name && !symptomMap.has(symptom.id)) {
          symptomMap.set(symptom.id, symptom.name);
        }
      });
    });
    
    console.log(`🔍 ${idToEnglish.size} English names, ${symptomMap.size} ${language} symptoms`);
    
    // Categorize using English keywords (language-independent)
    symptomMap.forEach((currentName, symptomId) => {
      const englishName = idToEnglish.get(symptomId) || currentName;
      const lower = englishName.toLowerCase();
      
      let category = 'systemic';
      
      if (lower.includes('death') || lower.includes('mortality') || lower.includes('sudden') || lower.includes('dead')) {
        category = 'mortality';
      } else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('°c') || lower.includes('°f') || lower.includes('pyrexia')) {
        category = 'fever';
      } else if (lower.includes('cough') || lower.includes('respiratory') || lower.includes('breath') || lower.includes('nasal') || lower.includes('sneez') || lower.includes('pneumon') || lower.includes('lung')) {
        category = 'respiratory';
      } else if (lower.includes('diarr') || lower.includes('vomit') || lower.includes('digest') || lower.includes('feces') || lower.includes('faeces') || lower.includes('constipat') || lower.includes('intestin')) {
        category = 'digestive';
      } else if (lower.includes('nervous') || lower.includes('seizure') || lower.includes('tremor') || lower.includes('paralys') || lower.includes('incoord') || lower.includes('convuls') || lower.includes('ataxia')) {
        category = 'nervous';
      } else if (lower.includes('skin') || lower.includes('lesion') || lower.includes('rash') || lower.includes('cyanosis') || lower.includes('discolor') || lower.includes('purple') || lower.includes('dermat')) {
        category = 'skin';
      } else if (lower.includes('reproduct') || lower.includes('abort') || lower.includes('birth') || lower.includes('farrow') || lower.includes('stillborn') || lower.includes('pregnan') || lower.includes('litter')) {
        category = 'reproductive';
      }
      
      // Add ALL symptom variations - no deduplication at this level
      // Disease matching needs all variations to work correctly
      categories[category].symptoms.push(currentName);
    });
    
    // Remove exact duplicates and sort symptoms in each category
    Object.keys(categories).forEach(key => {
      // Remove exact duplicates using Set (same text = same symptom)
      categories[key].symptoms = [...new Set(categories[key].symptoms)];
      
      // Sort alphabetically
      categories[key].symptoms.sort((a, b) => a.localeCompare(b, language));
    });
    
    console.log('🔍 Final category counts:', {
      language,
      mortality: categories.mortality.symptoms.length,
      fever: categories.fever.symptoms.length,
      respiratory: categories.respiratory.symptoms.length,
      digestive: categories.digestive.symptoms.length,
      nervous: categories.nervous.symptoms.length,
      skin: categories.skin.symptoms.length,
      reproductive: categories.reproductive.symptoms.length,
      systemic: categories.systemic.symptoms.length
    });

    return categories;
  }, [diseases, englishDiseases, language]);

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

    console.log('Diseases to check:', filteredDiseases.length);
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

  // Swine uses React Router for navigation, not step state

  // Reset diagnosis
  const reset = () => {
    setSelectedAge(null);
    setSelectedSymptoms([]);
    setResults([]);
    setSelectedDisease(null);
  };

  const value = {
    // States
    selectedAge,
    selectedSymptoms,
    results,
    selectedDisease,
    // Age filtering helpers
    AGE_GROUPS,
    filterDiseasesByAge,
    diseases,
    ageGroups,
    symptomCategories,
    isLoading,
    error,
    isOffline,

    // Actions
    setSelectedAge,
    toggleSymptom,
    clearSymptoms,
    calculateResults,
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

// REPLACEMENT CODE FOR SYMPTOM CATEGORIZATION
// Use this to replace the symptomCategories useMemo in DiagnosisContext.jsx

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
    
    console.log(`🔍 Building categories for ${language}: ${diseases.length} diseases, ${englishDiseases.length} EN ref`);
    
    const categories = {
      mortality: { label: 'Mortality', symptoms: [] },
      fever: { label: 'Fever Status', symptoms: [] },
      respiratory: { label: 'Respiratory', symptoms: [] },
      digestive: { label: 'Digestive', symptoms: [] },
      nervous: { label: 'Nervous', symptoms: [] },
      skin: { label: 'Skin', symptoms: [] },
      reproductive: { label: 'Reproductive', symptoms: [] },
      systemic: { label: 'Systemic', symptoms: [] }
    };

    // Build symptom ID → English name map
    const idToEnglish = new Map();
    englishDiseases.forEach(d => {
      (d.symptomsEnhanced || []).forEach(s => {
        if (s.id && s.name) idToEnglish.set(s.id, s.name);
      });
    });
    
    // Extract unique symptoms from current language
    const symptomMap = new Map();
    diseases.forEach(d => {
      (d.symptomsEnhanced || []).forEach(s => {
        if (s.id && s.name && !symptomMap.has(s.id)) {
          symptomMap.set(s.id, s.name);
        }
      });
    });
    
    console.log(`🔍 ${idToEnglish.size} EN names, ${symptomMap.size} ${language} symptoms`);
    
    // Categorize using English keywords
    symptomMap.forEach((currentName, id) => {
      const en = (idToEnglish.get(id) || currentName).toLowerCase();
      
      let cat = 'systemic';
      if (en.includes('death') || en.includes('mortality') || en.includes('sudden')) cat = 'mortality';
      else if (en.includes('fever') || en.includes('temperature') || en.includes('°c')) cat = 'fever';
      else if (en.includes('cough') || en.includes('respiratory') || en.includes('breath') || en.includes('nasal') || en.includes('pneumon')) cat = 'respiratory';
      else if (en.includes('diarr') || en.includes('vomit') || en.includes('digest') || en.includes('feces') || en.includes('intestin')) cat = 'digestive';
      else if (en.includes('nervous') || en.includes('seizure') || en.includes('tremor') || en.includes('paralys') || en.includes('ataxia')) cat = 'nervous';
      else if (en.includes('skin') || en.includes('lesion') || en.includes('rash') || en.includes('cyanosis') || en.includes('discolor')) cat = 'skin';
      else if (en.includes('reproduct') || en.includes('abort') || en.includes('birth') || en.includes('farrow') || en.includes('stillborn')) cat = 'reproductive';
      
      categories[cat].symptoms.push(currentName);
    });
    
    // Sort
    Object.keys(categories).forEach(k => {
      categories[k].symptoms.sort((a, b) => a.localeCompare(b, language));
    });
    
    console.log('🔍 Final counts:', {
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

# FINAL FIX: USE ENGLISH CATEGORIES AS SOURCE OF TRUTH

## 🔍 PROBLEM CONFIRMED

Disease data does NOT have `category` field in symptomsEnhanced.

**Evidence:**
```
✅ Extracted 369 unique symptoms from 104 diseases
// Extracted from disease.symptoms (strings), not symptomsEnhanced (objects)
```

**Current structure:**
```javascript
disease.symptoms = ["Fever (>40°C)", "Coughing", "Sudden deaths"]
// Just an array of strings - NO category metadata!
```

**NOT:**
```javascript
disease.symptomsEnhanced = [
  { id: "SYM_001", name: "Fever", category: "fever" }
]
```

---

## ✅ SOLUTION: KEYWORD-BASED CATEGORIZATION WITH ENGLISH AS SOURCE

Since we don't have category metadata, we'll use **English keyword matching** but apply it to ALL languages by:

1. Build symptom ID → category map from English keywords
2. Use this map for all languages (ID/VI)
3. Categorize based on symptom ID (language-independent)

---

## 🔧 IMPLEMENTATION

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

**REPLACE the entire symptom categorization useMemo with:**

```javascript
const symptomCategories = useMemo(() => {
    if (!diseases || diseases.length === 0 || !allSymptoms || allSymptoms.length === 0) {
        console.log('⚠️ No diseases or symptoms loaded yet');
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
    console.log(`🔍 Total unique symptoms: ${allSymptoms.length}`);
    
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
    
    // Build symptom ID → English name map for keyword matching
    const symptomIdToEnglish = new Map();
    
    // Load English names for categorization (language-independent)
    allSymptoms.forEach(symptom => {
        if (symptom.id && symptom.translations?.en) {
            symptomIdToEnglish.set(symptom.id, symptom.translations.en);
        } else if (symptom.id && language === 'en') {
            // If current language is English, use current name
            symptomIdToEnglish.set(symptom.id, symptom.name);
        }
    });
    
    console.log(`🔍 Built English name map for ${symptomIdToEnglish.size} symptoms`);
    
    // Categorize symptoms based on English keywords
    const categorizedCount = { mortality: 0, fever: 0, respiratory: 0, digestive: 0, nervous: 0, skin: 0, reproductive: 0, systemic: 0 };
    
    allSymptoms.forEach(symptom => {
        if (!symptom.name || !symptom.id) return;
        
        // Get English name for keyword matching
        const englishName = symptomIdToEnglish.get(symptom.id) || symptom.name;
        const lower = englishName.toLowerCase();
        
        // Get current language name for display
        const displayName = symptom.name;
        
        // Keyword-based categorization (using English)
        let category = 'systemic'; // Default
        
        if (lower.includes('death') || lower.includes('mortality') || lower.includes('sudden') || lower.includes('dead')) {
            category = 'mortality';
        } else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('°c') || lower.includes('°f') || lower.includes('pyrexia') || lower.includes('hot')) {
            category = 'fever';
        } else if (lower.includes('cough') || lower.includes('respiratory') || lower.includes('breath') || lower.includes('nasal') || lower.includes('sneez') || lower.includes('pneumon') || lower.includes('lung') || lower.includes('trachea') || lower.includes('bronch')) {
            category = 'respiratory';
        } else if (lower.includes('diarr') || lower.includes('vomit') || lower.includes('digest') || lower.includes('feces') || lower.includes('faeces') || lower.includes('constipat') || lower.includes('intestin') || lower.includes('stomach') || lower.includes('gastro')) {
            category = 'digestive';
        } else if (lower.includes('nervous') || lower.includes('seizure') || lower.includes('tremor') || lower.includes('paralys') || lower.includes('incoord') || lower.includes('convuls') || lower.includes('ataxia') || lower.includes('neurolog')) {
            category = 'nervous';
        } else if (lower.includes('skin') || lower.includes('lesion') || lower.includes('rash') || lower.includes('blue') || lower.includes('cyanosis') || lower.includes('discolor') || lower.includes('purple') || lower.includes('red') || lower.includes('pale') || lower.includes('dermat') || lower.includes('hair') || lower.includes('coat')) {
            category = 'skin';
        } else if (lower.includes('reproduct') || lower.includes('abort') || lower.includes('birth') || lower.includes('farrow') || lower.includes('stillborn') || lower.includes('pregnan') || lower.includes('litter') || lower.includes('breeding')) {
            category = 'reproductive';
        }
        
        // Add to category (using current language name for display)
        categories[category].symptoms.push(displayName);
        categorizedCount[category]++;
    });
    
    // Sort symptoms in each category
    Object.keys(categories).forEach(key => {
        categories[key].symptoms.sort((a, b) => a.localeCompare(b, language));
    });
    
    // Final count report
    console.log('🔍 Symptoms categorized by English keywords:', categorizedCount);
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
}, [diseases, allSymptoms, language]);
```

---

## 🔍 HOW IT WORKS

1. **Load English names** for all symptoms via `symptom.translations.en`
2. **Categorize based on English keywords** (death, fever, cough, etc)
3. **Display current language name** in UI
4. **Language-independent**: Same symptom ID gets same category in EN/ID/VI

**Example:**
```javascript
Symptom ID: SYM_PIG_FEVER_001

EN: "Fever (>40°C)" → Categorize by "fever" → Category: fever
ID: "Demam (>40°C)" → Categorize by "fever" (from EN) → Category: fever
VI: "Sốt (>40°C)" → Categorize by "fever" (from EN) → Category: fever

Result: All 3 languages → fever category ✅
```

---

## 🧪 EXPECTED RESULT AFTER FIX

**All languages should have SAME counts:**

```
EN: mortality: 22, fever: 15, respiratory: 29, digestive: 40
ID: mortality: 22, fever: 15, respiratory: 29, digestive: 40  ✅
VI: mortality: 22, fever: 15, respiratory: 29, digestive: 40  ✅
```

---

## 📋 IMPLEMENTATION STEPS

1. Replace symptomCategories useMemo with code above
2. Test in English → verify categories populated (not 0)
3. Test in Indonesian → verify same counts as English
4. Test in Vietnamese → verify same counts as English/Indonesian

---

## ⚠️ CRITICAL ASSUMPTION

**This assumes `allSymptoms` has `translations` field:**

```javascript
symptom = {
  id: "SYM_PIG_FEVER_001",
  name: "Demam (>40°C)",  // Current language
  translations: {
    en: "Fever (>40°C)",
    id: "Demam (>40°C)",
    vi: "Sốt (>40°C)"
  }
}
```

**IF `translations` field doesn't exist:**

We need to build it by loading all 3 language files:

```javascript
// Load all 3 language files to build translation map
const [enDiseases, idDiseases, viDiseases] = await Promise.all([
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json').then(r => r.json()),
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_id.json').then(r => r.json()),
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_vi.json').then(r => r.json())
]);

// Build symptom ID → translations map
const symptomTranslations = new Map();

enDiseases.forEach(disease => {
  disease.symptomsEnhanced?.forEach(symptom => {
    if (!symptomTranslations.has(symptom.id)) {
      symptomTranslations.set(symptom.id, { en: symptom.name });
    }
  });
});

// Add ID translations
idDiseases.forEach(disease => {
  disease.symptomsEnhanced?.forEach(symptom => {
    const existing = symptomTranslations.get(symptom.id) || {};
    symptomTranslations.set(symptom.id, { ...existing, id: symptom.name });
  });
});

// Add VI translations
viDiseases.forEach(disease => {
  disease.symptomsEnhanced?.forEach(symptom => {
    const existing = symptomTranslations.get(symptom.id) || {};
    symptomTranslations.set(symptom.id, { ...existing, vi: symptom.name });
  });
});
```

---

## ✅ RECOMMENDED APPROACH

**STEP 1:** Try the main solution (assumes translations exist)

**STEP 2:** If symptoms still empty → check if `allSymptoms` has `translations` field

**STEP 3:** If no translations → implement the 3-file loading approach above

---

END OF FINAL FIX

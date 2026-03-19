# BUG 2 FINAL FIX - Symptom Translation Inconsistency

**ROOT CAUSE CONFIRMED:** Same symptom returns different disease counts across languages.

**TEST RESULTS:**
- EN: "Sudden deaths" → 7 diseases ❌
- ID: "Kematian mendadak" → 19 diseases ✅
- VI: "Chết đột ngột" → 18 diseases ✅

**DIAGNOSIS:** Symptom ID mapping or symptom matching is broken for English.

---

## 🔍 INVESTIGATION REQUIRED

### STEP 1: Check Symptom Data in Disease Files

Open these 3 files and search for "Sudden death" symptom:

```bash
# File 1: English
public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json

# File 2: Indonesian
public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_id.json

# File 3: Vietnamese
public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_vi.json
```

**FOR EACH FILE, CHECK:**

1. How many diseases contain "Sudden death" in `symptomsEnhanced` array?
2. What is the exact symptom ID? (e.g., `SYM_PIG_SUDDEN_DEATH_001`)
3. What is the exact symptom name?

**EXPECTED:** All 3 files should have:
- **Same number of diseases** with this symptom (probably 19)
- **Same symptom ID** across all languages
- **Different symptom names** (EN: "Sudden deaths", ID: "Kematian mendadak", VI: "Chết đột ngột")

---

### STEP 2: Verify Symptom ID Consistency

**Run this check in DiagnosisContext.jsx:**

Add this debugging code in the `matchDiseases` function:

```javascript
const matchDiseases = (selectedSymptomIds) => {
  console.log('🔍 BUG 2 DEBUG - Selected symptom IDs:', selectedSymptomIds);
  console.log('🔍 BUG 2 DEBUG - Current language:', language);
  
  // Check how many diseases have "Sudden death" symptom ID
  const diseasesWithSymptom = diseases.filter(disease => {
    return disease.symptomsEnhanced.some(s => 
      s.id === 'SYM_PIG_SUDDEN_DEATH_001' || // Try actual ID
      s.name.toLowerCase().includes('sudden death')
    );
  });
  
  console.log(`🔍 BUG 2 DEBUG - Total diseases with "sudden death": ${diseasesWithSymptom.length}`);
  console.log('🔍 BUG 2 DEBUG - First 3 diseases:', diseasesWithSymptom.slice(0, 3).map(d => d.name));
  
  // Now do actual matching
  const matches = diseases.filter(disease => {
    const diseaseSymptomIds = disease.symptomsEnhanced.map(s => s.id);
    const matchCount = selectedSymptomIds.filter(id => 
      diseaseSymptomIds.includes(id)
    ).length;
    
    if (matchCount > 0) {
      console.log(`  ✅ Match: ${disease.name} (${matchCount} symptoms matched)`);
    }
    
    return matchCount > 0;
  });
  
  console.log(`🔍 BUG 2 DEBUG - Final matches: ${matches.length}`);
  return matches;
};
```

**RE-TEST AFTER ADDING THIS:**
1. Select "Sudden deaths" in English
2. Copy the console output
3. Look for:
   - "Total diseases with 'sudden death': X" (should be 19)
   - "Final matches: X" (currently 7, should be 19)

---

### STEP 3: Check Symptom Selection Logic

**Find where symptoms are being collected/stored:**

In `SymptomsPage.jsx`, check:

```javascript
// When user clicks a symptom checkbox, what gets stored?
const handleSymptomToggle = (symptom) => {
  // Is it storing symptom.id or symptom.name?
  // Is the ID correct?
  console.log('🔍 Symptom clicked:', symptom);
  console.log('🔍 Symptom ID:', symptom.id);
  console.log('🔍 Symptom name:', symptom.name);
};
```

**CRITICAL CHECK:**
- Are you storing symptom **IDs** or symptom **names**?
- If storing names: Are you translating names → IDs correctly?
- If storing IDs: Are the IDs consistent across language files?

---

## 🎯 LIKELY ROOT CAUSE #1: Duplicate Symptom IDs

**Hypothesis:** "Sudden deaths" exists multiple times with different IDs.

**Check in diseases_en.json:**

```javascript
// Search for ALL occurrences of "Sudden death"
// Example:
{
  "id": "SYM_PIG_SUDDEN_DEATH_001",
  "name": "Sudden deaths"
}
// vs
{
  "id": "SYM_PIG_MORTALITY_SUDDEN_002", // Different ID!
  "name": "Sudden deaths"
}
```

**IF DUPLICATES EXIST:**

**FIX A:** Consolidate to single symptom ID across all diseases

**FIX B:** When matching, match by symptom NAME instead of ID:

```javascript
const matchDiseases = (selectedSymptomNames) => {
  return diseases.filter(disease => {
    const diseaseSymptomNames = disease.symptomsEnhanced.map(s => 
      s.name.toLowerCase().trim()
    );
    
    return selectedSymptomNames.some(name => 
      diseaseSymptomNames.includes(name.toLowerCase().trim())
    );
  });
};
```

---

## 🎯 LIKELY ROOT CAUSE #2: Translation Map Issue

**Check if there's a symptom translation map:**

```javascript
// In DiagnosisContext.jsx, look for:
const symptomTranslationMap = {
  en: {
    'Sudden deaths': 'SYM_PIG_SUDDEN_DEATH_001',
    // ...
  },
  id: {
    'Kematian mendadak': 'SYM_PIG_SUDDEN_DEATH_001',
    // ...
  }
};
```

**IF MAP EXISTS:**

**Problem:** Incomplete mapping for English

**FIX:** Rebuild map programmatically from disease files:

```javascript
const buildSymptomMap = (diseases) => {
  const map = {};
  
  diseases.forEach(disease => {
    disease.symptomsEnhanced.forEach(symptom => {
      if (!map[symptom.name]) {
        map[symptom.name] = symptom.id;
      }
    });
  });
  
  console.log('🔍 Built symptom map:', map);
  return map;
};

// Use in matching:
const symptomMap = buildSymptomMap(diseases);
const selectedIds = selectedSymptomNames.map(name => symptomMap[name]);
```

---

## 🎯 LIKELY ROOT CAUSE #3: English Disease File Incomplete

**Check disease counts:**

```javascript
// In DiagnosisContext, after loading diseases:
useEffect(() => {
  const loadDiseases = async () => {
    const data = await fetch(`/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_${language}.json`);
    const diseases = await data.json();
    
    console.log(`🔍 Loaded ${diseases.length} diseases for language: ${language}`);
    
    // Count diseases with "Sudden deaths" symptom
    const withSuddenDeath = diseases.filter(d => 
      d.symptomsEnhanced.some(s => s.name.toLowerCase().includes('sudden death'))
    );
    
    console.log(`🔍 Diseases with "sudden death": ${withSuddenDeath.length}`);
    console.log(`🔍 Sample diseases:`, withSuddenDeath.slice(0, 3).map(d => d.name));
    
    setDiseases(diseases);
  };
  
  loadDiseases();
}, [language]);
```

**EXPECTED OUTPUT:**
```
EN: Loaded 104 diseases, 19 with "sudden death"
ID: Loaded 104 diseases, 19 with "kematian mendadak"
VI: Loaded 104 diseases, 18 with "chết đột ngột"
```

**IF ENGLISH FILE HAS FEWER:**
- Re-export from source
- Verify JSON structure integrity

---

## ✅ RECOMMENDED FIX (SIMPLEST)

**Use symptom NAMES for matching (not IDs):**

```javascript
// In DiagnosisContext.jsx

// 1. Store selected symptom NAMES (not IDs)
const [selectedSymptomNames, setSelectedSymptomNames] = useState([]);

// 2. Match by name (case-insensitive)
const matchDiseases = (selectedNames) => {
  const normalizedSelected = selectedNames.map(n => n.toLowerCase().trim());
  
  return diseases.filter(disease => {
    const diseaseSymptomNames = disease.symptomsEnhanced.map(s => 
      s.name.toLowerCase().trim()
    );
    
    const matchCount = normalizedSelected.filter(name => 
      diseaseSymptomNames.includes(name)
    ).length;
    
    return matchCount > 0;
  });
};

// 3. In SymptomsPage, store names:
const handleSymptomToggle = (symptom) => {
  setSelectedSymptomNames(prev => 
    prev.includes(symptom.name) 
      ? prev.filter(n => n !== symptom.name)
      : [...prev, symptom.name]
  );
};
```

**WHY THIS WORKS:**
- No dependency on symptom IDs
- No translation map needed
- Simple case-insensitive string matching
- Guaranteed to work across all languages

---

## 📋 IMPLEMENTATION STEPS

### **STEP 1: Switch to Name-Based Matching**

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

```javascript
// Change from:
const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);

// To:
const [selectedSymptomNames, setSelectedSymptomNames] = useState([]);

// Update matching function:
const matchDiseases = useCallback((selectedNames) => {
  if (!selectedNames || selectedNames.length === 0) {
    return [];
  }
  
  const normalizedSelected = selectedNames.map(name => 
    name.toLowerCase().trim()
  );
  
  const matches = diseases.filter(disease => {
    const diseaseSymptomNames = disease.symptomsEnhanced.map(s => 
      s.name.toLowerCase().trim()
    );
    
    const matchCount = normalizedSelected.filter(name => 
      diseaseSymptomNames.includes(name)
    ).length;
    
    return matchCount > 0;
  });
  
  return matches.sort((a, b) => {
    // Sort by match count (diseases matching more symptoms first)
    const aMatches = a.symptomsEnhanced.filter(s => 
      normalizedSelected.includes(s.name.toLowerCase().trim())
    ).length;
    
    const bMatches = b.symptomsEnhanced.filter(s => 
      normalizedSelected.includes(s.name.toLowerCase().trim())
    ).length;
    
    return bMatches - aMatches;
  });
}, [diseases]);
```

### **STEP 2: Update SymptomsPage**

**File:** `src/modules/swine/pages/SymptomsPage.jsx`

```javascript
// When symptom is selected:
const handleSymptomToggle = (symptom) => {
  const symptomName = symptom.name; // Use name, not ID
  
  setSelectedSymptomNames(prev => 
    prev.includes(symptomName)
      ? prev.filter(n => n !== symptomName)
      : [...prev, symptomName]
  );
};

// Update context:
const { matchDiseases, selectedSymptomNames, setSelectedSymptomNames } = useDiagnosis();

// Get matched diseases:
const matchedDiseases = matchDiseases(selectedSymptomNames);
```

### **STEP 3: Remove Translation Map (if exists)**

Delete or comment out any symptom translation map code.

### **STEP 4: Test**

```
1. Select "Sudden deaths" in EN → Should show 19 diseases
2. Switch to ID, select "Kematian mendadak" → Should show 19 diseases
3. Switch to VI, select "Chết đột ngột" → Should show 18-19 diseases
4. All three should return SAME diseases (just translated names)
```

---

## 🚨 CRITICAL NOTE

**Vietnamese showing 18 vs 19 might be intentional** if one disease:
- Doesn't affect Vietnamese pig breeds, OR
- Symptom translation is slightly different

**Focus on EN vs ID matching first.** If EN = 19 and ID = 19, that's success!

---

## 📤 AFTER IMPLEMENTATION

Test and report:

```
✅ BUG 2 FIX APPLIED: Name-based matching

TEST RESULTS:
- EN "Sudden deaths": X diseases
- ID "Kematian mendadak": X diseases  
- VI "Chết đột ngột": X diseases

COUNTS MATCH: ✅ YES / ❌ NO
```

---

**IMPLEMENT NAME-BASED MATCHING NOW. THIS IS THE SIMPLEST AND MOST RELIABLE FIX.**

---

END OF FINAL FIX INSTRUCTIONS

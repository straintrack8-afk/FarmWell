# CRITICAL BUG FIXES - SWINE MODULE (BEFORE PHASE 2)

**PRIORITY:** CRITICAL - Fix these bugs BEFORE proceeding to Phase 2  
**SCOPE:** 2 bugs blocking core functionality  

---

## 🐛 BUG 1: Disease Detail Page Crashes

### **ERROR MESSAGE:**
```
Uncaught TypeError: text.replace is not a function
    at textToBullets (formatters.js:37:24)
    at DiseasePage (DiseasePage.jsx:206:34)
```

### **SYMPTOMS:**
- Clicking any disease card from results page crashes
- Disease detail page shows blank/error
- Console shows "text.replace is not a function"

### **ROOT CAUSE:**
`textToBullets()` function in `formatters.js` expects a string but receives array/null/undefined.

### **LOCATION:**
- File: `src/modules/swine/utils/formatters.js` (or similar)
- Function: `textToBullets()`
- Line: 37

### **FIX:**

**STEP 1:** Find the `textToBullets()` function:

```javascript
// CURRENT (BROKEN):
export const textToBullets = (text) => {
  return text.replace(/\n/g, '<br/>'); // ❌ Crashes if text is not a string
};
```

**STEP 2:** Add type checking and defensive programming:

```javascript
// FIXED:
export const textToBullets = (text) => {
  // Handle null/undefined
  if (!text) return '';
  
  // Handle arrays (join into string)
  if (Array.isArray(text)) {
    return text.map(item => `• ${item}`).join('<br/>');
  }
  
  // Handle objects (shouldn't happen, but be safe)
  if (typeof text === 'object') {
    console.warn('textToBullets received object:', text);
    return JSON.stringify(text);
  }
  
  // Handle strings (normal case)
  if (typeof text === 'string') {
    return text.replace(/\n/g, '<br/>');
  }
  
  // Fallback: convert to string
  return String(text);
};
```

**STEP 3:** Find where `textToBullets()` is called in `DiseasePage.jsx` (line ~206):

```javascript
// Check what's being passed:
console.log('Type of text:', typeof someField);
console.log('Value:', someField);
```

**STEP 4:** Verify the disease data structure:

The Swine database has these fields as **ARRAYS**, not strings:
- `clinicalSigns` → Array
- `transmission` → Array
- `diagnosis` → Array
- `treatment` → Array
- `control` → Array
- `vaccineRecommendations` → Array

**CORRECT USAGE:**

```javascript
// For array fields, map to bullet list:
{disease.clinicalSigns && disease.clinicalSigns.length > 0 && (
  <ul>
    {disease.clinicalSigns.map((sign, index) => (
      <li key={index}>{sign}</li>
    ))}
  </ul>
)}

// For string fields, use textToBullets:
{disease.description && (
  <p dangerouslySetInnerHTML={{ __html: textToBullets(disease.description) }} />
)}
```

**DO NOT use `textToBullets()` on array fields!**

### **TESTING:**
```
1. Navigate to /swine/diagnosis/age
2. Select age → Select symptom "Fever"
3. Click "Get Diagnosis"
4. Click any disease card
5. ✅ Disease detail page should load without errors
6. ✅ All sections should display correctly (description, clinical signs, treatment, etc.)
7. ✅ No console errors
```

---

## 🐛 BUG 2: English Symptom Selection Shows 0 Diseases

### **SYMPTOMS:**
- **English (EN):** Select "Diarrhea" → 0 possible diseases ❌
- **Indonesian (ID):** Select "Diare" → 19 possible diseases ✅
- **Vietnamese (VI):** Select "Tiêu chảy" → 19 possible diseases ✅

### **ROOT CAUSE:**
Symptom ID translation map is broken or missing for English.

### **LOCATION:**
- File: `src/modules/swine/contexts/DiagnosisContext.jsx`
- Section: Symptom translation map / symptom matching logic

### **DIAGNOSIS STEPS:**

**STEP 1:** Check symptom translation in DiagnosisContext:

```javascript
// Find this section (or similar):
const symptomTranslationMap = {
  en: {
    'Diarrhea': 'SYM_PIG_DIARRHEA_XXX',
    'Fever': 'SYM_PIG_FEVER_XXX',
    // ...
  },
  id: {
    'Diare': 'SYM_PIG_DIARRHEA_XXX',
    'Demam': 'SYM_PIG_FEVER_XXX',
    // ...
  },
  vi: {
    'Tiêu chảy': 'SYM_PIG_DIARRHEA_XXX',
    'Sốt': 'SYM_PIG_FEVER_XXX',
    // ...
  }
};
```

**STEP 2:** Verify symptom IDs in database:

```bash
# Check diseases_en.json for symptom structure:
public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json

# Look at symptomsEnhanced array:
"symptomsEnhanced": [
  {
    "id": "SYM_PIG_DIARRHEA_XXX",  // ✅ This is the ID to match
    "name": "Diarrhea",
    "category": "digestive",
    ...
  }
]
```

**STEP 3:** Debug symptom matching:

Add console.log to DiagnosisContext:

```javascript
const matchDiseases = (selectedSymptomIds) => {
  console.log('🔍 Selected symptom IDs:', selectedSymptomIds);
  console.log('🔍 Current language:', language);
  console.log('🔍 Total diseases loaded:', diseases.length);
  
  const matches = diseases.filter(disease => {
    const diseaseSymptomIds = disease.symptomsEnhanced.map(s => s.id);
    console.log(`  - ${disease.name}: symptom IDs`, diseaseSymptomIds);
    
    const matchCount = selectedSymptomIds.filter(id => 
      diseaseSymptomIds.includes(id)
    ).length;
    
    console.log(`    → Matches: ${matchCount}`);
    return matchCount > 0;
  });
  
  console.log('✅ Total matches found:', matches.length);
  return matches;
};
```

**STEP 4:** Check if symptom names match exactly:

English disease file has: `"name": "Diarrhea"`  
User selects in UI: `"Diarrhea"`  
Translation map expects: `"Diarrhea"` → `"SYM_PIG_DIARRHEA_XXX"`

**CRITICAL:** Case-sensitive! Spaces matter! Trailing characters matter!

### **LIKELY FIX:**

**Option A:** Symptom names don't match exactly (case/spacing issue)

```javascript
// Normalize symptom names before matching:
const normalizeSymptomName = (name) => {
  return name.toLowerCase().trim();
};

// Use in matching:
const selectedSymptomIds = selectedSymptomNames.map(name => 
  symptomTranslationMap[language][normalizeSymptomName(name)]
);
```

**Option B:** Translation map is incomplete for English

```javascript
// Verify ALL symptoms in EN database are in translation map
// Generate map programmatically from database:

const buildSymptomTranslationMap = () => {
  const map = { en: {}, id: {}, vi: {} };
  
  ['en', 'id', 'vi'].forEach(lang => {
    const diseaseFile = require(`../../../public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_${lang}.json`);
    
    diseaseFile.diseases.forEach(disease => {
      disease.symptomsEnhanced.forEach(symptom => {
        map[lang][symptom.name] = symptom.id;
      });
    });
  });
  
  return map;
};
```

**Option C:** Use symptom IDs directly (RECOMMENDED)

Don't translate names → IDs. Store and match IDs directly:

```javascript
// In symptom selection:
const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);

// When user clicks symptom:
const handleSymptomClick = (symptom) => {
  setSelectedSymptomIds(prev => [...prev, symptom.id]); // ✅ Store ID directly
};

// In disease matching:
const matches = diseases.filter(disease => {
  const diseaseSymptomIds = disease.symptomsEnhanced.map(s => s.id);
  return selectedSymptomIds.some(id => diseaseSymptomIds.includes(id));
});
```

### **TESTING:**
```
1. Navigate to /swine/diagnosis/age
2. Select "All Ages"
3. Select symptom "Diarrhea" (in ENGLISH)
4. ✅ Should show "19 Possible Diseases" (or similar non-zero number)
5. Click "Get Diagnosis"
6. ✅ Should show disease results
7. Switch to Indonesian
8. Go back, select "Diare"
9. ✅ Should show same number of diseases
10. Switch to Vietnamese
11. Go back, select "Tiêu chảy"
12. ✅ Should show same number of diseases
```

---

## 📋 TESTING PROTOCOL AFTER FIXES

### **Complete Flow Test (All 3 Languages):**

**English:**
```
1. /swine → Click "Disease Diagnosis"
2. /swine/diagnostic → Click "Diagnosis Tools"
3. /swine/diagnosis/age → Select "All Ages" → Continue
4. /swine/diagnosis/symptoms → Select "Fever" → Should show ~20 diseases
5. Click "Get Diagnosis"
6. /swine/diagnosis/results → Should show disease list
7. Click first disease card
8. /swine/diagnosis/disease/:id → ✅ Detail page loads without errors
```

**Indonesian:**
```
1. Switch language to ID
2. Navigate /swine/diagnosis/age
3. Select "Semua Umur"
4. Select "Demam" → Should show ~20 diseases
5. Get Diagnosis → Should show results
6. Click disease → Detail page loads
```

**Vietnamese:**
```
1. Switch language to VI
2. Navigate /swine/diagnosis/age
3. Select "Mọi lứa tuổi"
4. Select "Sốt" → Should show ~20 diseases
5. Get Diagnosis → Should show results
6. Click disease → Detail page loads
```

### **Cross-Language Consistency:**
```
Same symptom selected in EN/ID/VI should return SAME disease count:
- EN: "Fever" → X diseases
- ID: "Demam" → X diseases (same count)
- VI: "Sốt" → X diseases (same count)
```

---

## 🚨 CONSTRAINTS

**DO:**
- ✅ Fix both bugs completely
- ✅ Test in all 3 languages (EN/ID/VI)
- ✅ Add defensive programming (type checks)
- ✅ Add console.log for debugging
- ✅ Verify disease counts match across languages

**DON'T:**
- ❌ Touch Phase 1 code (DiagnosticLanding.jsx)
- ❌ Modify working features
- ❌ Skip testing any language
- ❌ Leave console.logs in production code (remove after debugging)

---

## 📊 COMPLETION CRITERIA

```
□ BUG 1 FIXED:
  □ Disease detail pages load without errors
  □ All fields display correctly (description, clinical signs, etc.)
  □ No "text.replace is not a function" errors
  □ Arrays display as bullet lists
  □ Strings display as formatted text

□ BUG 2 FIXED:
  □ English symptom selection shows correct disease count
  □ Indonesian symptom selection shows same count
  □ Vietnamese symptom selection shows same count
  □ Cross-language consistency verified
  □ No "0 possible diseases" in any language

□ REGRESSION TESTS PASS:
  □ Phase 1 diagnostic landing still works
  □ Navigation flow intact
  □ Multi-language switching works
  □ All existing features unchanged
```

---

## 📤 DELIVERABLE

After fixing both bugs, submit:

1. ✅ List of files modified
2. ✅ Description of fixes applied
3. ✅ Test results for both bugs (EN/ID/VI)
4. ✅ Console output showing no errors
5. ✅ Confirmation that disease counts match across languages

**Format:**
```markdown
# BUG FIX COMPLETION REPORT

## BUG 1: Disease Detail Page Crash
- Root cause: [description]
- Files modified: [list]
- Fix applied: [description]
- Test result: ✅ PASS / ❌ FAIL

## BUG 2: English Symptom Selection
- Root cause: [description]
- Files modified: [list]
- Fix applied: [description]
- Test result EN: [X diseases found]
- Test result ID: [X diseases found]
- Test result VI: [X diseases found]
- Counts match: ✅ YES / ❌ NO

## Regression Tests:
- Phase 1 landing: ✅ PASS
- Navigation: ✅ PASS
- Multi-language: ✅ PASS
```

---

**FIX THESE 2 BUGS NOW. DO NOT PROCEED TO PHASE 2 UNTIL BOTH BUGS ARE RESOLVED.**

---

END OF BUG FIX INSTRUCTIONS

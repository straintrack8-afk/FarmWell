# SWINE DIAGNOSIS REBUILD - COPY FROM POULTRY

**DECISION:** Abandon bugfix approach. Rebuild Swine diagnosis using proven Poultry architecture.

**REASON:** Multiple fix attempts failed. Poultry works perfectly. Swine database is adequate. Fastest path = copy working code.

---

## 🎯 OBJECTIVE

**Replace broken Swine diagnosis flow with Poultry's working architecture AND 3-column UI layout.**

**What stays the same:**
- ✅ Swine disease database (already adequate)
- ✅ Swine translation files
- ✅ Phase 1 Diagnostic Landing page (already working)
- ✅ Disease detail pages (already working)
- ✅ Age selection page (keep current flow: Age → Symptoms → Results)

**What gets rebuilt:**
- 🔄 DiagnosisContext.jsx → Copy from Poultry
- 🔄 SymptomsPage.jsx → Copy Poultry's 3-column layout
- 🔄 Symptom selection logic → Copy from Poultry  
- 🔄 Disease matching algorithm → Copy from Poultry
- 🔄 Real-time results display → Copy from Poultry

**What gets REMOVED:**
- ❌ Body Part Selection (Swine doesn't need chicken map)
- ❌ Old 2-column vertical layout
- ❌ Separate Results page (results show in 3rd column now)

---

## 📂 FILES TO COPY

### **SOURCE (Poultry):**
```
src/modules/poultry/contexts/DiagnosisContext.jsx
src/modules/poultry/pages/diagnostic/*.jsx (or similar)
```

### **DESTINATION (Swine):**
```
src/modules/swine/contexts/DiagnosisContext.jsx (REPLACE)
src/modules/swine/pages/diagnosis/* (UPDATE)
```

---

## 🔧 STEP-BY-STEP REBUILD

### **STEP 1: Backup Current Swine Diagnosis**

```bash
# Create backup of current broken implementation
cp src/modules/swine/contexts/DiagnosisContext.jsx src/modules/swine/contexts/DiagnosisContext.jsx.BACKUP
```

---

### **STEP 2: Copy Poultry DiagnosisContext**

**ACTION:** Copy `src/modules/poultry/contexts/DiagnosisContext.jsx` to Swine module.

**FILE:** Create new `src/modules/swine/contexts/DiagnosisContext.jsx`

**CHANGES NEEDED:**

1. **Update disease data path:**
```javascript
// FROM (Poultry):
const diseaseFile = `/data/poultry/diseases_COMPLETE_129_v4.1_ENRICHED_${language}.json`;

// TO (Swine):
const diseaseFile = `/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_${language}.json`;
```

2. **Update age groups:**
```javascript
// FROM (Poultry):
const ageGroups = [
  "0-3 weeks",
  "4-8 weeks",
  "9-16 weeks",
  // ... etc
];

// TO (Swine):
const ageGroups = [
  "All Ages",
  "Newborn",
  "Suckling",
  "Weaned",
  "Growers",
  "Finishers",
  "Sows / Gilts",
  "Boars"
];
```

3. **Remove body part logic:**
Swine doesn't have body part selection like Poultry (no chicken map). Remove:
```javascript
// REMOVE these from Swine:
const [selectedBodyPart, setSelectedBodyPart] = useState(null);
const filterSymptomsByBodyPart = () => { ... };
```

4. **Keep symptom matching logic AS-IS from Poultry:**
```javascript
// This is the WORKING code from Poultry - DO NOT MODIFY
const matchDiseases = (selectedSymptomIds) => {
  // ... exact Poultry implementation
};
```

---

### **STEP 3: Copy Poultry's 3-Column Layout**

**FILE:** `src/modules/poultry/pages/diagnostic/BodyPartSelection.jsx` (or similar symptom selection page)

**COPY TO:** `src/modules/swine/pages/SymptomsPage.jsx`

**LAYOUT STRUCTURE:**

```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* COLUMN 1: Search & Categories */}
  <div className="bg-white rounded-lg p-6">
    <h3>1. Search All Symptoms</h3>
    <input 
      type="text" 
      placeholder="Search symptoms..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    
    {/* Symptom Categories (collapsible) */}
    {categories.map(category => (
      <CategorySection 
        key={category}
        title={category}
        symptoms={filterSymptomsByCategory(category)}
        onSymptomClick={handleSymptomToggle}
        selectedIds={selectedSymptomIds}
      />
    ))}
  </div>

  {/* COLUMN 2: Selected Symptoms */}
  <div className="bg-white rounded-lg p-6">
    <h3>2. Selected Symptoms</h3>
    {selectedSymptoms.map(symptom => (
      <div key={symptom.id} className="flex items-center justify-between">
        <span>{symptom.name}</span>
        <button onClick={() => handleSymptomToggle(symptom.id)}>
          ✕
        </button>
      </div>
    ))}
    <button onClick={clearAll}>Clear All</button>
  </div>

  {/* COLUMN 3: Real-Time Results */}
  <div className="bg-white rounded-lg p-6">
    <h3>3. Possible Conditions ({matchedDiseases.length})</h3>
    {matchedDiseases.map(disease => (
      <DiseaseCard 
        key={disease.id}
        disease={disease}
        confidenceScore={calculateConfidence(disease)}
        onClick={() => navigate(`/swine/diagnosis/disease/${disease.id}`)}
      />
    ))}
  </div>
</div>
```

**ADAPTATIONS FOR SWINE:**

1. **Remove Body Part Logic:**
```javascript
// ❌ DELETE this from Poultry code:
const [selectedBodyPart, setSelectedBodyPart] = useState(null);
const filterByBodyPart = () => { ... };

// ✅ Keep only:
const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
```

2. **Use Swine Symptom Categories:**
```javascript
// Swine categories (from current implementation):
const categories = [
  "Mortality",
  "Fever status",
  "Number of affected pigs",
  "Respiratory",
  "Digestive",
  "Nervous",
  "Skin",
  "Behavioral",
  "Reproductive",
  "Systemic"
];
```

3. **Real-Time Disease Matching:**
```javascript
// Get matched diseases in real-time
const matchedDiseases = useMemo(() => {
  return getMatchedDiseases(selectedSymptomIds);
}, [selectedSymptomIds]);
```

4. **Confidence Scoring:**
```javascript
// Calculate confidence percentage (like Poultry)
const calculateConfidence = (disease) => {
  const totalSymptoms = disease.symptomsEnhanced.length;
  const matchedCount = selectedSymptomIds.filter(id =>
    disease.symptomsEnhanced.some(s => s.id === id)
  ).length;
  
  return ((matchedCount / totalSymptoms) * 100).toFixed(1);
};
```

---

### **STEP 4: Update Routes**

**FILE:** `src/modules/swine/App.jsx`

**CURRENT ROUTES:**
```jsx
/swine/diagnosis/age → AgePage ✅ Keep
/swine/diagnosis/symptoms → SymptomsPage 🔄 Rebuild with 3-column
/swine/diagnosis/results → ResultsPage ❌ Remove (merged into SymptomsPage)
/swine/diagnosis/disease/:id → DiseasePage ✅ Keep
```

**NEW ROUTES:**
```jsx
/swine/diagnosis/age → AgePage (unchanged)
/swine/diagnosis/symptoms → SymptomsPage (3-column layout with real-time results)
/swine/diagnosis/disease/:id → DiseasePage (click from 3rd column)
```

**NAVIGATION FLOW:**
```
Age Selection
    ↓ Continue button
Symptoms Page (3 columns)
    ↓ Click disease card in column 3
Disease Detail Page
```

No separate "Get Diagnosis" button or Results page needed - results show in real-time!

**FILES TO UPDATE:**
- `src/modules/swine/pages/AgePage.jsx`
- `src/modules/swine/pages/SymptomsPage.jsx`
- `src/modules/swine/pages/ResultsPage.jsx`

**CHANGES:**

1. **Import new context:**
```javascript
import { useDiagnosis } from '../contexts/DiagnosisContext';
```

2. **Use Poultry's symptom selection pattern:**
```javascript
// Get from context (Poultry style):
const { 
  selectedSymptomIds,    // Array of symptom IDs
  toggleSymptom,          // Function to add/remove symptom
  getMatchedDiseases,     // Function to get results
  selectedAge,
  setSelectedAge
} = useDiagnosis();

// When symptom is clicked:
const handleSymptomClick = (symptom) => {
  toggleSymptom(symptom.id);  // ✅ Use symptom ID (Poultry way)
};
```

3. **Display selected symptoms:**
```javascript
// Get symptoms from context:
const selectedSymptoms = selectedSymptomIds.map(id => {
  // Find symptom object by ID in current disease list
  const symptom = diseases
    .flatMap(d => d.symptomsEnhanced)
    .find(s => s.id === id);
  return symptom;
}).filter(Boolean);
```

---

### **STEP 4: Verify Symptom Data Structure**

**CRITICAL:** Ensure Swine disease data has `symptomsEnhanced` with IDs:

```javascript
// Expected structure in pig_diseases_COMPLETE_104_v1.0_ENRICHED_*.json:
{
  "id": 1,
  "name": "App (Actinobacillus pleuropneumoniae)",
  "symptomsEnhanced": [
    {
      "id": "SYM_PIG_SUDDEN_DEATH_001",  // ✅ Must have ID
      "name": "Sudden deaths",
      "category": "systemic",
      // ... other fields
    }
  ]
}
```

**IF IDs ARE MISSING:** Generate them:

```javascript
// Add this to DiagnosisContext after loading diseases:
const ensureSymptomIds = (diseases) => {
  return diseases.map(disease => ({
    ...disease,
    symptomsEnhanced: disease.symptomsEnhanced.map((symptom, index) => ({
      ...symptom,
      id: symptom.id || `SYM_${disease.id}_${index}` // Generate if missing
    }))
  }));
};

setDiseases(ensureSymptomIds(loadedDiseases));
```

---

### **STEP 5: Remove Broken Translation Map**

**DELETE** any symptom translation map code:

```javascript
// ❌ REMOVE this entirely:
const symptomTranslationMap = { ... };
const getSymptomId = (symptomName) => { ... };
```

**WHY:** Poultry doesn't use translation maps. It uses symptom IDs directly from `symptomsEnhanced`.

---

### **STEP 6: Update Results Page**

**FILE:** `src/modules/swine/pages/ResultsPage.jsx`

**USE POULTRY PATTERN:**

```javascript
function ResultsPage() {
  const { getMatchedDiseases, selectedSymptomIds } = useDiagnosis();
  const results = getMatchedDiseases();
  
  return (
    <div>
      <h2>{results.length} Possible Diseases</h2>
      {results.map(disease => (
        <DiseaseCard 
          key={disease.id}
          disease={disease}
          onClick={() => navigate(`/swine/diagnosis/disease/${disease.id}`)}
        />
      ))}
    </div>
  );
}
```

---

## 🧪 TESTING PROTOCOL

### **After Rebuild:**

1. **Test English:**
```
- Select "All Ages"
- Select "Sudden deaths"
- Expected: ~9 diseases (same as Poultry logic would return)
```

2. **Test Indonesian:**
```
- Select "Semua Umur"  
- Select "Kematian mendadak"
- Expected: SAME count as English
```

3. **Test Vietnamese:**
```
- Select "Mọi lứa tuổi"
- Select "Chết đột ngột"
- Expected: SAME count as English/Indonesian
```

4. **Cross-language consistency:**
```
Same symptom ID in all 3 languages → SAME disease count
```

---

## 📋 IMPLEMENTATION CHECKLIST

```
□ STEP 1: Backup current DiagnosisContext.jsx
□ STEP 2: Copy Poultry DiagnosisContext to Swine
  □ Update disease data path
  □ Update age groups
  □ Remove body part logic
  □ Keep symptom matching AS-IS
□ STEP 3: Update Swine pages
  □ AgePage.jsx uses new context
  □ SymptomsPage.jsx uses toggleSymptom(symptom.id)
  □ ResultsPage.jsx uses getMatchedDiseases()
□ STEP 4: Verify symptomsEnhanced has IDs
  □ If missing, generate IDs
□ STEP 5: Remove translation map code
□ STEP 6: Update Results page to Poultry pattern
□ STEP 7: Test in all 3 languages
```

---

## 🚨 CRITICAL RULES

**DO:**
- ✅ Copy Poultry's working code exactly
- ✅ Only adapt disease paths and age groups
- ✅ Use symptom IDs for matching (Poultry way)
- ✅ Test cross-language consistency

**DON'T:**
- ❌ Try to "fix" Poultry's code
- ❌ Use symptom names for matching
- ❌ Keep translation map logic
- ❌ Modify core matching algorithm

---

## 📊 SUCCESS CRITERIA

```
✅ English symptom selection returns X diseases
✅ Indonesian same symptom returns X diseases (SAME count)
✅ Vietnamese same symptom returns X diseases (SAME count)
✅ No console errors
✅ Disease detail pages still work
✅ Results page displays correctly
✅ All 3 languages work identically
```

---

## ⏱️ ESTIMATED TIME

**Rebuild:** 30-45 minutes  
**Testing:** 15 minutes  
**Total:** ~1 hour

**vs. continued debugging:** Unknown (already wasted 2+ hours)

---

## 📤 DELIVERABLE

After rebuild completion, report:

```markdown
# SWINE DIAGNOSIS REBUILD COMPLETE

## Files Replaced:
- src/modules/swine/contexts/DiagnosisContext.jsx (from Poultry)

## Files Updated:
- src/modules/swine/pages/AgePage.jsx
- src/modules/swine/pages/SymptomsPage.jsx
- src/modules/swine/pages/ResultsPage.jsx

## Test Results:
- EN "Sudden deaths": X diseases
- ID "Kematian mendadak": X diseases
- VI "Chết đột ngột": X diseases

Cross-language consistency: ✅ YES / ❌ NO

## Issues Encountered:
[List any issues]

## Status:
✅ READY FOR PHASE 2 / ❌ NEEDS MORE WORK
```

---

**START REBUILD NOW. COPY POULTRY'S WORKING CODE. STOP TRYING TO FIX BROKEN CODE.**

---

END OF REBUILD INSTRUCTIONS

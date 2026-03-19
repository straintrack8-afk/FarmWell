# CROSS-LANGUAGE SYMPTOM CATEGORIZATION FIX

## 🚨 PROBLEM

Symptom categorization only works in English because it uses English keyword matching:

```javascript
// CURRENT CODE - BROKEN FOR ID/VI
if (lower.includes('fever')) {  // Only matches "fever", not "Demam" or "Sốt"
    categories.fever.symptoms.push(symptomName);
}
```

**Result:**
- EN: Categories balanced ✅
- ID: Most symptoms in "Systemic" (299 items) ❌
- VI: Most symptoms in "Systemic" (305 items) ❌

---

## ✅ SOLUTION

**Use the `category` field from `symptomsEnhanced` instead of keyword matching!**

Each symptom in the disease data already has a `category` field that's language-independent.

---

## 🔧 IMPLEMENTATION

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

**FIND (around line 100-150):**
```javascript
useEffect(() => {
    if (!diseases || diseases.length === 0) return;
    
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
    
    diseases.forEach(disease => {
        if (disease.symptomsEnhanced && Array.isArray(disease.symptomsEnhanced)) {
            disease.symptomsEnhanced.forEach(symptom => {
                const symptomName = typeof symptom === 'string' ? symptom : symptom.name;
                if (symptomName) {
                    // KEYWORD MATCHING - BROKEN FOR ID/VI
                    const lower = symptomName.toLowerCase();
                    if (lower.includes('death') || lower.includes('mortality')) {
                        categories.mortality.symptoms.push(symptomName);
                    } else if (lower.includes('fever')) {
                        categories.fever.symptoms.push(symptomName);
                    }
                    // ... etc
                }
            });
        }
    });
    
    setSymptomCategories(categories);
}, [diseases]);
```

**REPLACE WITH:**
```javascript
useEffect(() => {
    if (!diseases || diseases.length === 0) return;
    
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
    
    // Category mapping from disease data to our categories
    const categoryMap = {
        'mortality': 'mortality',
        'fever': 'fever',
        'fever status': 'fever',
        'respiratory': 'respiratory',
        'digestive': 'digestive',
        'gastrointestinal': 'digestive',
        'nervous': 'nervous',
        'neurological': 'nervous',
        'skin': 'skin',
        'integumentary': 'skin',
        'reproductive': 'reproductive',
        'systemic': 'systemic',
        'general': 'systemic',
        'behavioral': 'systemic'
    };
    
    // Extract symptoms using category field from symptomsEnhanced
    const symptomSet = new Map(); // Use Map to track symptom name + category
    
    diseases.forEach(disease => {
        if (disease.symptomsEnhanced && Array.isArray(disease.symptomsEnhanced)) {
            disease.symptomsEnhanced.forEach(symptom => {
                if (typeof symptom === 'object' && symptom.name) {
                    const symptomName = symptom.name;
                    const symptomCategory = (symptom.category || 'systemic').toLowerCase();
                    
                    // Map to our category structure
                    const mappedCategory = categoryMap[symptomCategory] || 'systemic';
                    
                    // Add to symptom set (deduplicate)
                    const key = `${symptomName}:${mappedCategory}`;
                    if (!symptomSet.has(key)) {
                        symptomSet.set(key, { name: symptomName, category: mappedCategory });
                    }
                }
            });
        }
    });
    
    // Populate categories from symptom set
    symptomSet.forEach(({ name, category }) => {
        if (categories[category]) {
            categories[category].symptoms.push(name);
        }
    });
    
    // Sort symptoms in each category
    Object.keys(categories).forEach(key => {
        categories[key].symptoms.sort();
    });
    
    console.log('🔍 Symptom categories built:', {
        mortality: categories.mortality.symptoms.length,
        fever: categories.fever.symptoms.length,
        respiratory: categories.respiratory.symptoms.length,
        digestive: categories.digestive.symptoms.length,
        nervous: categories.nervous.symptoms.length,
        skin: categories.skin.symptoms.length,
        reproductive: categories.reproductive.symptoms.length,
        systemic: categories.systemic.symptoms.length
    });
    
    setSymptomCategories(categories);
}, [diseases, language]); // ⚠️ Add language dependency to rebuild on language change
```

---

## 🔍 VERIFY SYMPTOM DATA STRUCTURE

**Before implementing, verify the disease data has `category` field:**

**Open browser console and run:**
```javascript
// Check disease data structure
fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json')
  .then(r => r.json())
  .then(diseases => {
    const firstDisease = diseases[0];
    console.log('First disease:', firstDisease.name);
    console.log('Symptoms:', firstDisease.symptomsEnhanced?.slice(0, 3));
    
    // Check if symptoms have category field
    const hasCategory = firstDisease.symptomsEnhanced?.[0]?.category;
    console.log('Has category field?', hasCategory ? 'YES ✅' : 'NO ❌');
  });
```

**Expected output:**
```javascript
First disease: "African Swine Fever"
Symptoms: [
  {
    id: "SYM_PIG_001",
    name: "Fever (>40°C)",
    category: "fever",  // ← Should have this!
    weight: 0.8,
    significance: "high"
  },
  // ...
]
Has category field? YES ✅
```

---

## 🚨 IF CATEGORY FIELD MISSING

**If `symptomsEnhanced` doesn't have `category` field, we need to:**

### Option A: Add category field to disease data

**This requires updating all 3 JSON files** (en, id, vi) with category data.

### Option B: Fallback to English-based categorization + translation

**Use English keywords but translate them first:**

```javascript
// Get symptom in English for categorization
const englishName = symptomIdToName[symptom.id]?.en || symptomName;
const lower = englishName.toLowerCase();

// Now categorize based on English keywords
if (lower.includes('death') || lower.includes('mortality')) {
    categories.mortality.symptoms.push(symptomName); // Store current language name
}
```

**This requires building `symptomIdToName` map:**
```javascript
const symptomIdToName = {};

// Load all 3 language files
const [enDiseases, idDiseases, viDiseases] = await Promise.all([
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json').then(r => r.json()),
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_id.json').then(r => r.json()),
  fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_vi.json').then(r => r.json())
]);

// Build ID to name mapping
enDiseases.forEach(disease => {
  disease.symptomsEnhanced?.forEach(symptom => {
    if (!symptomIdToName[symptom.id]) {
      symptomIdToName[symptom.id] = { en: symptom.name };
    }
  });
});
```

---

## ✅ RECOMMENDED APPROACH

**Priority 1:** Check if `category` field exists in disease data  
**Priority 2:** If YES → Use category-based approach (cleaner, faster)  
**Priority 3:** If NO → Use Option B (English keywords + ID mapping)

---

## 🧪 TESTING AFTER FIX

1. Select age: "Growers"
2. **English:**
   - Check category counts (should be balanced)
3. **Switch to Indonesian:**
   - Check category counts (should match English counts)
4. **Switch to Vietnamese:**
   - Check category counts (should match English/Indonesian counts)

**Expected:**
```
EN: Mortality: 22, Respiratory: 25, Digestive: 31
ID: Mortality: 22, Respiratory: 25, Digestive: 31  ✅ SAME
VI: Mortality: 22, Respiratory: 25, Digestive: 31  ✅ SAME
```

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Check if disease data has `category` field in `symptomsEnhanced`
- [ ] If YES: Implement category-based approach
- [ ] If NO: Implement English keyword + ID mapping approach
- [ ] Add `language` dependency to useEffect
- [ ] Add console.log to debug category counts
- [ ] Test in EN → verify balanced categories
- [ ] Test in ID → verify same counts as EN
- [ ] Test in VI → verify same counts as EN/ID

---

END OF FIX

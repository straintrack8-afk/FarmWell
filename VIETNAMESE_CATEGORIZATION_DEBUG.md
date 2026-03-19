# VIETNAMESE CATEGORIZATION ISSUE - ADVANCED DEBUG & FIX

## 🚨 PROBLEM

Category counts still different across languages, especially Vietnamese:

**EN vs ID vs VI:**
- Respiratory: 29 = 29 = 28 (close)
- Digestive: 40 = 40 = 39 (close)
- Nervous: 15 = 15 = 15 ✅
- **Skin: 7 = 7 = 48** ❌❌❌ (MAJOR ISSUE)
- Reproductive: 21 = 20 = 21 (close)
- Systemic: 206 = 205 = 160 (different)

**Vietnamese Skin category has 48 symptoms vs EN/ID with only 7!**

---

## 🔍 ROOT CAUSE ANALYSIS

**Possible causes:**

1. **Symptom ID mismatch** - Different symptom IDs for same symptom across languages
2. **Category field inconsistency** - EN/ID say "systemic", VI says "skin"
3. **Duplicate symptoms** - Same symptom added multiple times
4. **Translation errors** - Multiple Vietnamese symptom names for same concept

---

## 🔧 SOLUTION: Enhanced Deduplication + Debug Logging

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

**REPLACE the entire symptom categorization useEffect with this ENHANCED version:**

```javascript
useMemo(() => {
    if (!diseases || diseases.length === 0) {
        console.log('⚠️ No diseases loaded yet');
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
    
    // Category mapping
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
        'dermatological': 'skin',
        'reproductive': 'reproductive',
        'systemic': 'systemic',
        'general': 'systemic',
        'behavioral': 'systemic'
    };
    
    // Use symptom ID as unique key (language-independent)
    const symptomMap = new Map(); // Map<symptomId, {name, category}>
    
    let totalSymptoms = 0;
    let categorizedSymptoms = 0;
    
    diseases.forEach((disease, diseaseIndex) => {
        if (!disease.symptomsEnhanced || !Array.isArray(disease.symptomsEnhanced)) {
            console.warn(`⚠️ Disease ${disease.name} has no symptomsEnhanced array`);
            return;
        }
        
        disease.symptomsEnhanced.forEach((symptom, symptomIndex) => {
            totalSymptoms++;
            
            if (typeof symptom === 'string') {
                // Symptom is just a string - skip or handle
                console.warn(`⚠️ Symptom is string (not object):`, symptom);
                return;
            }
            
            if (!symptom.id || !symptom.name) {
                console.warn(`⚠️ Symptom missing id or name:`, symptom);
                return;
            }
            
            const symptomId = symptom.id;
            const symptomName = symptom.name;
            const symptomCategory = (symptom.category || 'systemic').toLowerCase().trim();
            
            // Map to our category structure
            const mappedCategory = categoryMap[symptomCategory] || 'systemic';
            
            // Check if we've already added this symptom ID
            if (symptomMap.has(symptomId)) {
                const existing = symptomMap.get(symptomId);
                
                // Debug: Check if category changed
                if (existing.category !== mappedCategory) {
                    console.log(`🔍 Symptom ID ${symptomId} has different categories:`, {
                        existingName: existing.name,
                        existingCategory: existing.category,
                        newName: symptomName,
                        newCategory: mappedCategory,
                        disease: disease.name
                    });
                }
                
                // Skip - already added
                return;
            }
            
            // Add to map (deduplicated by ID)
            symptomMap.set(symptomId, {
                name: symptomName,
                category: mappedCategory
            });
            
            categorizedSymptoms++;
        });
    });
    
    console.log(`🔍 Total symptom instances found: ${totalSymptoms}`);
    console.log(`🔍 Unique symptoms after deduplication: ${symptomMap.size}`);
    console.log(`🔍 Successfully categorized: ${categorizedSymptoms}`);
    
    // Populate categories from symptom map
    let populatedCount = 0;
    
    symptomMap.forEach(({ name, category }) => {
        if (categories[category]) {
            categories[category].symptoms.push(name);
            populatedCount++;
        } else {
            console.warn(`⚠️ Unknown category: ${category} for symptom: ${name}`);
        }
    });
    
    console.log(`🔍 Symptoms populated into categories: ${populatedCount}`);
    
    // Sort symptoms in each category
    Object.keys(categories).forEach(key => {
        categories[key].symptoms.sort((a, b) => a.localeCompare(b, language));
    });
    
    // Final count report
    const categoryCounts = {
        language,
        mortality: categories.mortality.symptoms.length,
        fever: categories.fever.symptoms.length,
        respiratory: categories.respiratory.symptoms.length,
        digestive: categories.digestive.symptoms.length,
        nervous: categories.nervous.symptoms.length,
        skin: categories.skin.symptoms.length,
        reproductive: categories.reproductive.symptoms.length,
        systemic: categories.systemic.symptoms.length
    };
    
    console.log('🔍 Final category counts:', categoryCounts);
    
    // Check for Skin category issue (Vietnamese has 48 vs EN 7)
    if (language === 'vi' && categories.skin.symptoms.length > 20) {
        console.warn('⚠️ VIETNAMESE SKIN CATEGORY ISSUE DETECTED!');
        console.log('🔍 First 10 skin symptoms:', categories.skin.symptoms.slice(0, 10));
        
        // Check if these are actually skin symptoms or miscategorized
        categories.skin.symptoms.forEach(symptom => {
            // Find the symptom in diseases to check its category
            for (const disease of diseases) {
                const found = disease.symptomsEnhanced?.find(s => s.name === symptom);
                if (found) {
                    console.log(`  - "${symptom}" → category: "${found.category}"`);
                    break;
                }
            }
        });
    }
    
    return categories;
}, [diseases, language]);
```

---

## 🧪 TESTING WITH ENHANCED DEBUG

1. Open browser console (F12)
2. Navigate to `/swine/diagnosis/age`
3. Select "All Ages"
4. Navigate to symptoms page

**Check console output for:**

```
🔍 Building symptom categories for language: en
🔍 Total diseases loaded: 104
🔍 Total symptom instances found: 1247
🔍 Unique symptoms after deduplication: 368
🔍 Successfully categorized: 368
🔍 Symptoms populated into categories: 368
🔍 Final category counts: {
  language: 'en',
  mortality: 22,
  fever: 15,
  respiratory: 29,
  digestive: 40,
  nervous: 15,
  skin: 7,
  reproductive: 21,
  systemic: 206
}
```

5. Switch to Vietnamese
6. **Check for warning:**

```
⚠️ VIETNAMESE SKIN CATEGORY ISSUE DETECTED!
🔍 First 10 skin symptoms: [
  "Bệnh thận kính gây chết người (trẻ sơ sinh)",
  "Sốt",
  "Bỏ ăn / giảm tăng trưởng",
  ...
]
```

7. **Look for miscategorization patterns:**

```
  - "Bệnh thận kính gây chết người" → category: "skin" ❌ (should be systemic!)
  - "Da xanh / tím" → category: "skin" ✅ (correct)
```

---

## 🔍 EXPECTED FINDINGS

**If you see symptoms like "Fever", "Anorexia", "Death" in Skin category:**
→ **Vietnamese disease data has WRONG category values!**

**If you see duplicate symptom names:**
→ **Deduplication by ID failed - check if symptom IDs are consistent**

---

## 🔧 FIX OPTION 1: Correct Vietnamese Category Data

**If Vietnamese JSON has wrong categories, we need to fix the source data:**

**File:** `public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_vi.json`

**Find symptoms with `"category": "skin"` that are clearly NOT skin symptoms**

**Example:**
```json
{
  "id": "SYM_PIG_FEVER_001",
  "name": "Sốt",
  "category": "skin",  // ❌ WRONG! Should be "fever" or "systemic"
  "weight": 0.8
}
```

**Change to:**
```json
{
  "id": "SYM_PIG_FEVER_001",
  "name": "Sốt",
  "category": "fever",  // ✅ CORRECT
  "weight": 0.8
}
```

---

## 🔧 FIX OPTION 2: Use English Category as Source of Truth

**If fixing Vietnamese data is too complex, use English category for ALL languages:**

**Add this to DiagnosisContext:**

```javascript
// Load English disease data once for category reference
const [englishDiseases, setEnglishDiseases] = useState([]);

useEffect(() => {
    fetch('/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json')
        .then(r => r.json())
        .then(data => {
            console.log('🔍 Loaded English reference data');
            setEnglishDiseases(data);
        })
        .catch(err => console.error('Failed to load English reference:', err));
}, []);

// Build symptom ID to category map from English
const symptomIdToCategory = useMemo(() => {
    const map = new Map();
    
    englishDiseases.forEach(disease => {
        disease.symptomsEnhanced?.forEach(symptom => {
            if (symptom.id && symptom.category) {
                // Use English category as source of truth
                map.set(symptom.id, symptom.category);
            }
        });
    });
    
    return map;
}, [englishDiseases]);

// Then in categorization:
const symptomCategory = symptomIdToCategory.get(symptomId) || 
                       (symptom.category || 'systemic').toLowerCase().trim();
```

---

## ✅ RECOMMENDED APPROACH

**STEP 1:** Run enhanced debug code → Identify which symptoms are miscategorized in Vietnamese

**STEP 2:** If only a few symptoms → Fix Vietnamese JSON manually

**STEP 3:** If many symptoms → Use English category as source of truth (Option 2)

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Replace useEffect with enhanced debug version
- [ ] Test in English → check console logs
- [ ] Test in Vietnamese → check for SKIN CATEGORY ISSUE warning
- [ ] Identify miscategorized symptoms from console
- [ ] Choose fix approach (Option 1 or Option 2)
- [ ] Implement fix
- [ ] Re-test EN/ID/VI → verify same counts

---

END OF ADVANCED DEBUG & FIX

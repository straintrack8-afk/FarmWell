# SIMPLE SYMPTOM FIXES - Duplicates & Descriptions

## 🎯 OBJECTIVE

1. Find and fix simple duplicates (plural, order variations)
2. Add symptom descriptions (tooltip like Poultry)

---

## 🔧 PART 1: FIND SIMPLE DUPLICATES

### Audit Script to Find Duplicates

**Create:** `find_duplicates.js` in project root

```javascript
const fs = require('fs');

function findDuplicates() {
  const enData = JSON.parse(
    fs.readFileSync('./public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json', 'utf8')
  );
  
  // Extract all unique symptoms
  const symptomMap = new Map();
  
  enData.diseases.forEach(disease => {
    const symptoms = disease.symptomsEnhanced || disease.symptoms || [];
    symptoms.forEach(symptom => {
      const name = typeof symptom === 'string' ? symptom : symptom.name;
      if (name) {
        symptomMap.set(name, (symptomMap.get(name) || 0) + 1);
      }
    });
  });
  
  // Sort alphabetically
  const symptoms = Array.from(symptomMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log('\n=== POTENTIAL DUPLICATES ===\n');
  
  const duplicates = [];
  
  for (let i = 0; i < symptoms.length - 1; i++) {
    const current = symptoms[i].name;
    const next = symptoms[i + 1].name;
    
    // Check for plural variations
    if (current + 's' === next || current === next + 's') {
      duplicates.push({
        type: 'PLURAL',
        symptom1: current,
        symptom2: next,
        suggestion: current.length < next.length ? current : next
      });
      console.log(`PLURAL: "${current}" vs "${next}"`);
      console.log(`  → Suggested fix: Use "${current.length < next.length ? current : next}"\n`);
    }
    
    // SKIP order variations - clinical sequence matters!
    // Example: "Anorexia / depression" ≠ "Depression / anorexia"
    // Order indicates which symptom appeared first
    
    // SKIP similar strings - too risky without medical review
    // Will be clarified with tooltips later
  }
  
  // Save report
  fs.writeFileSync('./DUPLICATE_SYMPTOMS_REPORT.json', JSON.stringify({
    totalSymptoms: symptoms.length,
    duplicatesFound: duplicates.length,
    duplicates: duplicates
  }, null, 2));
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total unique symptoms: ${symptoms.length}`);
  console.log(`Potential duplicates found: ${duplicates.length}`);
  console.log(`Report saved to: DUPLICATE_SYMPTOMS_REPORT.json\n`);
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

findDuplicates();
```

**Run:**
```bash
cd A:\Projects\FarmWell\FarmWell
node find_duplicates.js
```

**Output:** `DUPLICATE_SYMPTOMS_REPORT.json` with list of duplicates to review

---

## 🔧 PART 2: ADD SYMPTOM DESCRIPTIONS

### Implementation Plan

**Inspired by Poultry's symptom tooltips!**

**Step 1: Add descriptions to symptom data**

**Option A: Add to existing JSON** (if symptomsEnhanced has space)
```json
{
  "id": "SYM_PIG_SUDDEN_DEATH_001",
  "name": "Sudden death",
  "description": "Pig found dead with no prior clinical signs",
  "category": "mortality",
  "weight": 0.9
}
```

**Option B: Create separate descriptions file** (cleaner)
```json
// public/data/swine/symptom_descriptions_en.json
{
  "SYM_PIG_SUDDEN_DEATH_001": "Pig found dead with no prior clinical signs",
  "SYM_PIG_FEVER_HIGH_001": "Body temperature above 40°C (104°F)",
  "SYM_PIG_LAMENESS_001": "Difficulty walking or standing, reluctance to move",
  ...
}
```

**Step 2: Load descriptions in DiagnosisContext**

```javascript
// In DiagnosisContext.jsx
const [symptomDescriptions, setSymptomDescriptions] = useState({});

useEffect(() => {
  // Load symptom descriptions
  fetch(`/data/swine/symptom_descriptions_${language}.json`)
    .then(r => r.json())
    .then(data => setSymptomDescriptions(data))
    .catch(err => console.warn('No symptom descriptions available'));
}, [language]);

// Add to context value
return (
  <DiagnosisContext.Provider value={{
    // ... existing values
    symptomDescriptions
  }}>
```

**Step 3: Add tooltip to SymptomsPage**

**Install tooltip library** (or use CSS-only)

Option A: react-tooltip (lightweight)
```bash
npm install react-tooltip
```

Option B: Pure CSS tooltip (no dependencies)

**File:** `src/modules/swine/pages/SymptomsPage.jsx`

```javascript
import { useState } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';

function SymptomsPage() {
  const { symptomDescriptions } = useDiagnosis();
  const [hoveredSymptom, setHoveredSymptom] = useState(null);
  
  return (
    // ... existing code
    
    // In symptom rendering:
    symptoms.map((symptom, idx) => {
      const symptomId = typeof symptom === 'object' ? symptom.id : null;
      const description = symptomId ? symptomDescriptions[symptomId] : null;
      
      return (
        <div 
          key={idx}
          style={{ position: 'relative' }}
          onMouseEnter={() => description && setHoveredSymptom(symptomId)}
          onMouseLeave={() => setHoveredSymptom(null)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{symptom.name}</span>
            
            {description && (
              <span style={{ 
                color: '#10B981', 
                cursor: 'help',
                fontSize: '1rem'
              }}>
                ⓘ
              </span>
            )}
          </div>
          
          {/* Tooltip */}
          {hoveredSymptom === symptomId && description && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              zIndex: 1000,
              background: '#1F2937',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '8px',
              maxWidth: '300px',
              fontSize: '0.875rem',
              marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {description}
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                top: '-6px',
                left: '16px',
                width: '12px',
                height: '12px',
                background: '#1F2937',
                transform: 'rotate(45deg)'
              }} />
            </div>
          )}
        </div>
      );
    })
  );
}
```

---

## 📝 SYMPTOM DESCRIPTIONS TO CREATE

**High Priority Symptoms (Most Common):**

```javascript
// symptom_descriptions_en.json
{
  "SYM_PIG_SUDDEN_DEATH_001": "Pig found dead with no prior clinical signs",
  "SYM_PIG_FEVER_HIGH_001": "Body temperature above 40°C (104°F), pig appears lethargic",
  "SYM_PIG_LAMENESS_001": "Difficulty walking or standing, reluctance to move or bear weight",
  "SYM_PIG_COUGHING_001": "Repeated forceful expulsion of air from lungs, may be dry or productive",
  "SYM_PIG_DIARRHEA_001": "Loose or watery feces, may contain blood or mucus",
  "SYM_PIG_ANOREXIA_001": "Loss of appetite, refusing feed or eating less than normal",
  "SYM_PIG_RESPIRATORY_DISTRESS_001": "Labored breathing, open-mouth breathing, increased respiratory rate",
  "SYM_PIG_SKIN_LESIONS_001": "Abnormal marks, sores, or discoloration on skin surface",
  "SYM_PIG_NERVOUS_SIGNS_001": "Abnormal neurological behavior such as tremors, seizures, or incoordination",
  "SYM_PIG_ABORTION_001": "Premature expulsion of fetus before full term",
  // ... add more
}
```

**Indonesian:**
```javascript
// symptom_descriptions_id.json
{
  "SYM_PIG_SUDDEN_DEATH_001": "Babi ditemukan mati tanpa tanda klinis sebelumnya",
  "SYM_PIG_FEVER_HIGH_001": "Suhu tubuh di atas 40°C, babi tampak lesu",
  "SYM_PIG_LAMENESS_001": "Kesulitan berjalan atau berdiri, enggan bergerak atau menahan berat badan",
  // ... add more
}
```

**Vietnamese:**
```javascript
// symptom_descriptions_vi.json
{
  "SYM_PIG_SUDDEN_DEATH_001": "Lợn chết đột ngột không có dấu hiệu lâm sàng trước đó",
  "SYM_PIG_FEVER_HIGH_001": "Nhiệt độ cơ thể trên 40°C, lợn có vẻ uể oải",
  "SYM_PIG_LAMENESS_001": "Khó đi hoặc đứng, miễn cưỡng di chuyển hoặc chịu trọng lượng",
  // ... add more
}
```

---

## 📋 IMPLEMENTATION STEPS

### Phase 1: Find Duplicates (15 minutes)
1. Create find_duplicates.js script
2. Run script
3. Review DUPLICATE_SYMPTOMS_REPORT.json
4. You decide which duplicates to fix
5. Create fix list

### Phase 2: Fix Duplicates (30 minutes)
1. Update EN JSON with standardized names
2. Update ID JSON to match
3. Update VI JSON to match
4. Test symptom selection still works

### Phase 3: Add Descriptions (1-2 hours)
1. Create symptom_descriptions_en.json (start with top 20 symptoms)
2. Translate to Indonesian
3. Translate to Vietnamese
4. Update DiagnosisContext to load descriptions
5. Update SymptomsPage to show tooltip
6. Test in all 3 languages

---

## ✅ EXPECTED RESULTS

**After Duplicates Fix:**
- "Sudden death" and "Sudden deaths" → unified to "Sudden death"
- "Anorexia / depression" and "Depression / anorexia" → unified order
- Cleaner symptom lists

**After Descriptions Added:**
- Hover over ⓘ icon → see description
- Example: "Sudden death" → tooltip shows "Pig found dead with no prior clinical signs"
- Works in all 3 languages
- Improves user understanding

---

## 🎯 PRIORITY

**Recommended Order:**
1. **Phase 1 first** - Find duplicates (quick, gives us data)
2. **You review** - Decide which to fix
3. **Phase 2** - Fix duplicates (data cleanup)
4. **Phase 3** - Add descriptions (UX enhancement)

---

END OF SIMPLE FIXES PLAN

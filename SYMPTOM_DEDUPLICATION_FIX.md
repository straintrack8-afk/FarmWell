# SYMPTOM DEDUPLICATION - AUDIT & FIX

## 🚨 PROBLEM

Many duplicate symptoms appearing in categories due to slight variations in symptom names across different diseases.

**Examples:**
- "Sudden death" appears 6 times
- "High fever" appears 6 times  
- "High fever (41-42°C)" appears 3 times
- "Infertility / return to service" vs "Infertility / returns to service"

**Root Cause:**
Different diseases use slightly different phrasing for the same symptom concept.

---

## 🔍 AUDIT REQUEST

**STEP 1: Identify all duplicate/similar symptoms**

Run this analysis on the disease data to find duplicates:

**File:** Create new temporary file `symptom_audit.js` in project root

```javascript
// Symptom Deduplication Audit Script
const fs = require('fs');

async function auditSymptoms() {
  // Load all 3 language files
  const enData = JSON.parse(fs.readFileSync('./public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_en.json', 'utf8'));
  const idData = JSON.parse(fs.readFileSync('./public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_id.json', 'utf8'));
  const viData = JSON.parse(fs.readFileSync('./public/data/swine/pig_diseases_COMPLETE_104_v1.0_ENRICHED_vi.json', 'utf8'));
  
  // Extract all symptoms from EN
  const symptomMap = new Map();
  
  enData.diseases.forEach(disease => {
    const symptoms = disease.symptomsEnhanced || disease.symptoms || [];
    symptoms.forEach(symptom => {
      const name = typeof symptom === 'string' ? symptom : symptom.name;
      const id = typeof symptom === 'object' ? symptom.id : null;
      
      if (!symptomMap.has(name)) {
        symptomMap.set(name, { count: 0, id: id, diseases: [] });
      }
      
      const entry = symptomMap.get(name);
      entry.count++;
      entry.diseases.push(disease.name);
    });
  });
  
  // Find potential duplicates (similar names)
  const symptoms = Array.from(symptomMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  console.log('\n=== SYMPTOM AUDIT REPORT ===\n');
  console.log(`Total unique symptom names: ${symptoms.length}`);
  console.log(`Total symptom instances: ${symptoms.reduce((sum, s) => sum + s.count, 0)}`);
  
  // Group similar symptoms
  const groups = [];
  let currentGroup = [];
  
  for (let i = 0; i < symptoms.length; i++) {
    const current = symptoms[i];
    const next = symptoms[i + 1];
    
    currentGroup.push(current);
    
    if (!next || !areSimilar(current.name, next.name)) {
      if (currentGroup.length > 1) {
        groups.push(currentGroup);
      }
      currentGroup = [];
    }
  }
  
  console.log(`\n=== POTENTIAL DUPLICATE GROUPS (${groups.length}) ===\n`);
  
  groups.forEach((group, index) => {
    console.log(`\nGroup ${index + 1}:`);
    group.forEach(symptom => {
      console.log(`  - "${symptom.name}" (${symptom.count} diseases)`);
    });
    console.log(`  Suggested normalized name: "${normalizeSymptom(group[0].name)}"`);
  });
  
  // Export to JSON for review
  fs.writeFileSync('./SYMPTOM_AUDIT_REPORT.json', JSON.stringify({
    totalUnique: symptoms.length,
    duplicateGroups: groups.map(group => ({
      symptoms: group.map(s => ({ name: s.name, count: s.count })),
      suggestedName: normalizeSymptom(group[0].name)
    }))
  }, null, 2));
  
  console.log('\n=== Full report saved to SYMPTOM_AUDIT_REPORT.json ===');
}

function areSimilar(str1, str2) {
  // Remove special characters and extra spaces
  const clean1 = str1.toLowerCase().replace(/[()\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const clean2 = str2.toLowerCase().replace(/[()\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Check if one is substring of another
  if (clean1.includes(clean2) || clean2.includes(clean1)) return true;
  
  // Check Levenshtein distance for typos
  const distance = levenshteinDistance(clean1, clean2);
  const maxLen = Math.max(clean1.length, clean2.length);
  
  return distance / maxLen < 0.3; // 30% difference threshold
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

function normalizeSymptom(name) {
  // Remove parenthetical details
  let normalized = name.replace(/\s*\([^)]*\)/g, '');
  
  // Standardize punctuation
  normalized = normalized.replace(/\s*\/\s*/g, ' / ');
  normalized = normalized.replace(/\s*-\s*/g, ' - ');
  
  // Remove trailing qualifiers
  normalized = normalized.replace(/\s+(mild|moderate|severe|acute|chronic)$/i, '');
  
  return normalized.trim();
}

auditSymptoms().catch(console.error);
```

---

## 🔧 TEMPORARY FIX: Client-Side Deduplication

While we audit the data, apply client-side deduplication in DiagnosisContext.

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

**FIND (in symptomCategories useMemo):**
```javascript
// Populate categories from symptom map
categorizedCount[category]++;
categories[category].symptoms.push(displayName);
```

**REPLACE WITH:**
```javascript
// Normalize symptom name for deduplication
const normalizedName = normalizeSymptomName(displayName);

// Check if normalized version already exists in category
const existingIndex = categories[category].symptoms.findIndex(s => 
  normalizeSymptomName(s) === normalizedName
);

if (existingIndex === -1) {
  // New symptom - add it
  categories[category].symptoms.push(displayName);
  categorizedCount[category]++;
} else {
  // Duplicate found - keep shorter/cleaner version
  const existing = categories[category].symptoms[existingIndex];
  if (displayName.length < existing.length) {
    // Replace with shorter version
    categories[category].symptoms[existingIndex] = displayName;
  }
  // Don't increment count
}
```

**ADD this helper function at the top of DiagnosisContext:**

```javascript
// Helper: Normalize symptom names for deduplication
function normalizeSymptomName(name) {
  if (!name) return '';
  
  let normalized = name.toLowerCase().trim();
  
  // Remove parenthetical details like "(acute PHE)", "(best-growing pigs)"
  normalized = normalized.replace(/\s*\([^)]*\)/g, '');
  
  // Remove temperature specifics like "(>41°C)", "(40.5-42°C)"
  normalized = normalized.replace(/\s*\([\d.°c\-]+\)/gi, '');
  
  // Standardize plurals: "returns" → "return"
  normalized = normalized.replace(/returns?/g, 'return');
  
  // Remove mild/moderate/severe qualifiers
  normalized = normalized.replace(/\s+(mild|moderate|severe|acute|chronic|subclinical)$/i, '');
  
  // Normalize whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}
```

---

## 🧪 EXPECTED RESULT AFTER FIX

**Before:**
```
Mortality (28)
- Sudden death
- Sudden death
- Sudden death
- Sudden death
- Sudden death
- Sudden death
- Sudden death (acute PHE)
- Sudden death (best-growing pigs)
```

**After:**
```
Mortality (3)
- Sudden death
- Sudden death (acute PHE)
- Sudden death (best-growing pigs)
```

Or even better with aggressive normalization:

```
Mortality (1)
- Sudden death
```

---

## 📋 IMPLEMENTATION STEPS

**IMMEDIATE (Client-side fix):**
1. Add `normalizeSymptomName()` helper function
2. Update symptom categorization to use normalization
3. Keep shorter/cleaner version when duplicates found
4. Test in browser

**LONG-TERM (Data cleanup):**
1. Run symptom_audit.js script
2. Review SYMPTOM_AUDIT_REPORT.json
3. Decide normalization strategy:
   - Option A: Keep all variations (current)
   - Option B: Normalize to base symptom only
   - Option C: Keep most common variation + unique qualifiers
4. Update all 3 language JSON files
5. Ensure symptom IDs are consistent

---

## ⚠️ NORMALIZATION STRATEGY DECISION

**Question for user:** How aggressive should deduplication be?

**Option A: CONSERVATIVE** (Keep unique qualifiers)
```
Mortality:
- Sudden death
- Sudden death (acute PHE)
- Sudden death (best-growing pigs)
```
Pros: Preserves clinical detail  
Cons: More items in list

**Option B: MODERATE** (Remove parenthetical details only)
```
Mortality:
- Sudden death
```
Pros: Cleaner UI  
Cons: Loses some clinical specificity

**Option C: AGGRESSIVE** (Normalize everything)
```
Fever:
- High fever (combines all "High fever", "High fever (41-42°C)", etc)
```
Pros: Minimal duplication  
Cons: May over-simplify

**Recommendation:** Start with **Option B (MODERATE)** for UI display, keep full details in disease data.

---

## 🔍 SPECIFIC DUPLICATES TO ADDRESS

Based on screenshots, these need normalization:

**Mortality:**
- "Sudden death" (6x) → Keep 1
- "Sudden death (acute PHE)" → Keep as separate (specific qualifier)
- "Sudden death (best-growing pigs)" → Keep as separate (specific qualifier)

**Fever:**
- "High fever" (6x) → Keep 1
- "High fever (40.5-41.5°C)" → Normalize to "High fever"
- "High fever (41-42°C)" (3x) → Normalize to "High fever"
- "High fever (42°C)" → Normalize to "High fever"

**Reproductive:**
- "Infertility / return to service" → Normalize
- "Infertility / returns to service" → Normalize (plural vs singular)

**Respiratory:**
- "Labored breathing" vs "Respiratory distress" → Keep both (different concepts)

---

## ✅ TESTING AFTER FIX

1. Navigate to symptoms page
2. Expand Mortality category
3. Verify: Should see ~3-5 symptoms (not 8+)
4. Expand Fever category
5. Verify: Should see ~2-3 "High fever" entries (not 6+)
6. Test in all 3 languages
7. Verify: Deduplication works consistently

---

END OF DEDUPLICATION AUDIT & FIX

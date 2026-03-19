# AGEPAGE ERROR FIX - Cannot read 'split' of undefined

## 🚨 ERROR

```
Uncaught TypeError: Cannot read properties of undefined (reading 'split')
at AgePage.jsx:163:50
```

## 🔍 ROOT CAUSE

AgePage is trying to access a property from the old DiagnosisContext that doesn't exist in the new Poultry-based context.

**Line 163 is likely:**
```javascript
// OLD CODE - BROKEN
const ageLabels = someProperty.split(','); // someProperty is undefined
```

## 🎯 SOLUTION

Update AgePage.jsx to work with new DiagnosisContext.

---

## 📋 STEP-BY-STEP FIX

### STEP 1: Check Current AgePage Imports

**File:** `src/modules/swine/pages/AgePage.jsx`

**Current import (probably):**
```javascript
import { useDiagnosis } from '../contexts/DiagnosisContext';
```

**What AgePage needs from context:**
```javascript
const {
  selectedAge,
  setSelectedAge,
  // Maybe other properties that don't exist anymore
} = useDiagnosis();
```

### STEP 2: Review New DiagnosisContext Exports

**New context provides:**
```javascript
// Available from new DiagnosisContext:
- selectedAge
- setSelectedAge
- diseases
- selectedSymptoms
- toggleSymptom
- clearSymptoms
- symptomCategories
- filterDiseasesByAge
- AGE_GROUPS (constant)
```

**NOT available (removed):**
- ❌ step, setStep, nextStep, previousStep (no step navigation)
- ❌ bodyParts related stuff
- ❌ Any custom age label splitting

### STEP 3: Fix AgePage Age Selection

**FIND the error line (around line 163):**

Look for code like:
```javascript
// BROKEN - old code
{ages.map(age => {
  const label = age.label.split(' - '); // ERROR HERE if age.label undefined
  // ...
})}
```

**REPLACE with:**

```javascript
// FIXED - use new AGE_GROUPS constant
import { AGE_GROUPS } from '../contexts/DiagnosisContext';

// In component:
const ageOptions = Object.entries(AGE_GROUPS).map(([key, config]) => ({
  value: key,
  label: config.label || key
}));

// Then in render:
{ageOptions.map(option => (
  <div 
    key={option.value}
    onClick={() => handleAgeSelect(option.value)}
  >
    {option.label}
  </div>
))}
```

### STEP 4: Update Age Selection Handler

**OLD CODE (probably broken):**
```javascript
const handleAgeSelect = (age) => {
  setSelectedAge(age);
  navigate('/swine/diagnosis/symptoms');
};
```

**NEW CODE (should work):**
```javascript
const handleAgeSelect = (ageKey) => {
  setSelectedAge(ageKey); // Just the key like 'Growers', 'Newborn', etc.
  navigate('/swine/diagnosis/symptoms');
};
```

---

## 🔧 COMPLETE AGEPAGE FIX

**File:** `src/modules/swine/pages/AgePage.jsx`

**Replace the age selection rendering section with:**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';

// Import AGE_GROUPS constant
const AGE_GROUPS = {
  'All ages': { label: 'All Ages' },
  'Newborn': { label: 'Newborn (0-7 days)' },
  'Suckling': { label: 'Suckling (0-3 weeks)' },
  'Weaned': { label: 'Weaned (3-8 weeks)' },
  'Growers': { label: 'Growers (2-4 months)' },
  'Finishers': { label: 'Finishers (4-6 months)' },
  'Sows': { label: 'Sows / Gilts' },
  'Boars': { label: 'Boars' }
};

function AgePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => swineTranslations[language]?.[key] || swineTranslations['en'][key];
  
  const { setSelectedAge } = useDiagnosis();
  const [hoveredAge, setHoveredAge] = useState(null);

  const handleAgeSelect = (ageKey) => {
    setSelectedAge(ageKey);
    navigate('/swine/diagnosis/symptoms');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{t('selectAge')}</h1>
      <p>{t('selectAgeDescription')}</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {Object.entries(AGE_GROUPS).map(([key, config]) => (
          <div
            key={key}
            onClick={() => handleAgeSelect(key)}
            onMouseEnter={() => setHoveredAge(key)}
            onMouseLeave={() => setHoveredAge(null)}
            style={{
              padding: '1.5rem',
              background: hoveredAge === key ? '#F0FDF4' : 'white',
              border: '2px solid',
              borderColor: hoveredAge === key ? '#10B981' : '#E5E7EB',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>
              {t(key) || config.label}
            </h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.875rem' }}>
              {config.label}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/swine/diagnostic')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {t('back')}
        </button>
      </div>
    </div>
  );
}

export default AgePage;
```

---

## ✅ TESTING AFTER FIX

1. Navigate to `/swine/diagnosis/age`
2. **Verify:** Page loads without error
3. **Verify:** All age groups display correctly
4. Click any age group
5. **Verify:** Navigates to `/swine/diagnosis/symptoms`
6. **Verify:** SymptomsPage loads with selected age

---

## 🚨 IF STILL ERRORS

If error persists, check:

1. **DiagnosisContext export:**
```javascript
// In DiagnosisContext.jsx, make sure AGE_GROUPS is exported:
export const AGE_GROUPS = { ... };

// Or export in context provider:
return (
  <DiagnosisContext.Provider value={{
    selectedAge,
    setSelectedAge,
    AGE_GROUPS, // Add this if not present
    // ... other values
  }}>
```

2. **Check line 163 specifically:**
```bash
# View the exact line causing error
cat src/modules/swine/pages/AgePage.jsx | sed -n '160,170p'
```

3. **Console log for debugging:**
```javascript
// Add at top of AgePage component
const context = useDiagnosis();
console.log('🔍 DiagnosisContext values:', context);
console.log('🔍 Available keys:', Object.keys(context));
```

---

## 📤 IMPLEMENTATION

**Apply this fix now to AgePage.jsx**

**Test flow:**
1. Navigate `/swine/diagnosis/age`
2. Should load without errors
3. Click age group
4. Should navigate to symptoms page
5. Should see 3-column layout

---

END OF QUICKFIX

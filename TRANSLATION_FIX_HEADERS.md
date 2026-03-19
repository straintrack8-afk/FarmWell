# TRANSLATION FIX: Category & Column Headers

## 🚨 ISSUES

1. **Category headers showing English in ID/VI**
   - "Mortality" should be "Mortalitas" / "Tỷ lệ chết"
   - "Fever Status" should be "Status Demam" / "Tình trạng sốt"

2. **Column headers showing English in ID/VI**
   - "Search Symptoms" should translate
   - "Selected Symptoms" should translate
   - "Possible Diseases" should translate

---

## 🔧 FIX 1: Category Header Labels

**File:** `src/modules/swine/contexts/DiagnosisContext.jsx`

**FIND (in symptomCategories useMemo):**
```javascript
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
```

**REPLACE WITH:**
```javascript
// Translation keys for category labels
const categoryLabels = {
    en: {
        mortality: 'Mortality',
        fever: 'Fever Status',
        respiratory: 'Respiratory',
        digestive: 'Digestive',
        nervous: 'Nervous',
        skin: 'Skin',
        reproductive: 'Reproductive',
        systemic: 'Systemic'
    },
    id: {
        mortality: 'Mortalitas',
        fever: 'Status Demam',
        respiratory: 'Pernapasan',
        digestive: 'Pencernaan',
        nervous: 'Saraf',
        skin: 'Kulit',
        reproductive: 'Reproduksi',
        systemic: 'Sistemik'
    },
    vi: {
        mortality: 'Tỷ lệ chết',
        fever: 'Tình trạng sốt',
        respiratory: 'Hô hấp',
        digestive: 'Tiêu hóa',
        nervous: 'Thần kinh',
        skin: 'Da',
        reproductive: 'Sinh sản',
        systemic: 'Toàn thân'
    }
};

// Use current language for labels
const labels = categoryLabels[language] || categoryLabels.en;

const categories = {
    mortality: { label: labels.mortality, symptoms: [] },
    fever: { label: labels.fever, symptoms: [] },
    respiratory: { label: labels.respiratory, symptoms: [] },
    digestive: { label: labels.digestive, symptoms: [] },
    nervous: { label: labels.nervous, symptoms: [] },
    skin: { label: labels.skin, symptoms: [] },
    reproductive: { label: labels.reproductive, symptoms: [] },
    systemic: { label: labels.systemic, symptoms: [] }
};
```

---

## 🔧 FIX 2: Column Headers Translation

**File:** `src/modules/swine/pages/SymptomsPage.jsx`

**ADD translation keys to swineTranslations:**

**File:** `src/modules/swine/translations.js`

**ADD these keys:**
```javascript
export const swineTranslations = {
  en: {
    // ... existing keys
    searchSymptoms: 'Search Symptoms',
    selectedSymptoms: 'Selected Symptoms',
    possibleDiseases: 'Possible Diseases',
    noSymptomsSelected: 'No symptoms selected yet',
    selectSymptomsToSee: 'Select symptoms to see possible diseases',
    clearAll: 'Clear All'
  },
  id: {
    // ... existing keys
    searchSymptoms: 'Cari Gejala',
    selectedSymptoms: 'Gejala Terpilih',
    possibleDiseases: 'Kemungkinan Penyakit',
    noSymptomsSelected: 'Belum ada gejala terpilih',
    selectSymptomsToSee: 'Pilih gejala untuk melihat kemungkinan penyakit',
    clearAll: 'Hapus Semua'
  },
  vi: {
    // ... existing keys
    searchSymptoms: 'Tìm kiếm triệu chứng',
    selectedSymptoms: 'Triệu chứng đã chọn',
    possibleDiseases: 'Các bệnh có thể',
    noSymptomsSelected: 'Chưa chọn triệu chứng nào',
    selectSymptomsToSee: 'Chọn triệu chứng để xem các bệnh có thể',
    clearAll: 'Xóa tất cả'
  }
};
```

**THEN UPDATE SymptomsPage.jsx:**

**FIND:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
    1️⃣ Search Symptoms
</div>
```

**REPLACE WITH:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
    1️⃣ {t('searchSymptoms')}
</div>
```

**FIND:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>2️⃣ Selected Symptoms ({selectedSymptoms.length})</span>
    {selectedSymptoms.length > 0 && <button onClick={clearSymptoms} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Clear All</button>}
</div>
```

**REPLACE WITH:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>2️⃣ {t('selectedSymptoms')} ({selectedSymptoms.length})</span>
    {selectedSymptoms.length > 0 && <button onClick={clearSymptoms} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>{t('clearAll')}</button>}
</div>
```

**FIND:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
    3️⃣ Possible Diseases ({matchedDiseases.length})
</div>
```

**REPLACE WITH:**
```javascript
<div style={{ background: '#10B981', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: '600' }}>
    3️⃣ {t('possibleDiseases')} ({matchedDiseases.length})
</div>
```

**FIND:**
```javascript
<div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
    <p style={{ fontSize: '0.875rem' }}>{t('noSymptomsSelected')}</p>
</div>
```

**KEEP AS IS** (already using t())

**FIND:**
```javascript
<div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
    <p style={{ fontSize: '0.875rem' }}>{t('selectSymptomsToSee')}</p>
</div>
```

**KEEP AS IS** (already using t())

---

## ✅ TESTING AFTER FIX

1. Navigate to symptoms page in English
2. Verify category headers: "Mortality", "Fever Status", etc
3. Verify column headers: "1️⃣ Search Symptoms", "2️⃣ Selected Symptoms", "3️⃣ Possible Diseases"
4. Switch to Indonesian
5. Verify category headers: "Mortalitas", "Status Demam", "Pernapasan", etc
6. Verify column headers: "1️⃣ Cari Gejala", "2️⃣ Gejala Terpilih", "3️⃣ Kemungkinan Penyakit"
7. Switch to Vietnamese
8. Verify category headers: "Tỷ lệ chết", "Tình trạng sốt", "Hô hấp", etc
9. Verify column headers: "1️⃣ Tìm kiếm triệu chứng", "2️⃣ Triệu chứng đã chọn", "3️⃣ Các bệnh có thể"

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Fix 1: Add categoryLabels translations to DiagnosisContext
- [ ] Fix 2: Add column header translation keys to translations.js
- [ ] Fix 3: Replace hardcoded English text with t() calls in SymptomsPage
- [ ] Test in English → verify all labels display
- [ ] Test in Indonesian → verify all labels translate
- [ ] Test in Vietnamese → verify all labels translate

---

END OF TRANSLATION FIX

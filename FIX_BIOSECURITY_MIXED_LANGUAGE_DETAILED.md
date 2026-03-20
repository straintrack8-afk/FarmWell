# FIX: Swine Biosecurity - Mixed Vietnamese/English Language Issue

## PROBLEM FOUND

When Vietnamese language is selected, these pages show MIXED Vietnamese + English:

**Page 1: `/swine/biosecurity/dashboard`**
- Title: "Bảng điều khiển Đánh giá An ninh sinh học" ✅ Vietnamese
- But descriptions: "Prevent disease entry through animals and vehicles" ❌ English
- "Purchase & Transport" ❌ English
- "Facilities & People" ❌ English
- "Production Management" ❌ English
- "Hygiene Protocol" ❌ English

**Page 2: `/swine/biosecurity/report`**
- Headers: Vietnamese ✅
- But: "Needs Improvement" ❌ English
- "Purchase & Transport" ❌ English
- "Facilities & People" ❌ English
- "Production Management" ❌ English
- "Hygiene Protocols" ❌ English
- "Prevent disease entry through animals and vehicles" ❌ English

**Page 3: `/swine/biosecurity/assessment/1`**
- Title: "Focus Area 1: Purchase & Transport" ❌ English
- But buttons: "Trước" ✅ Vietnamese
- Question: "Are breeding pigs (sows/gilts/boars) purchased?" ❌ English

---

## ROOT CAUSE

Two possible issues:

### Issue 1: Still using 'vt' instead of 'vi' in some files
Previous fix changed 9 files from `'vt'` to `'vi'`, but there might be MORE files still using `'vt'`.

### Issue 2: Hardcoded English strings not using translation system
Some strings are written directly in English instead of using `getTranslation()` or `t()` function.

---

## IMPLEMENTATION PLAN

We will fix this in **3 STEPS**:

**STEP 1:** Find ALL remaining files with `'vt'` language code → change to `'vi'`  
**STEP 2:** Find hardcoded English strings → replace with translation calls  
**STEP 3:** Verify all pages work in Vietnamese

---

## STEP 1: SEARCH AND FIX ALL 'vt' LANGUAGE CODES

### 1.1 Search for all files with 'vt' language code

Run this command in terminal:

```bash
grep -r "'vt'" src/modules/swine/pages/biosecurity --include="*.jsx" -n
```

This will show ALL files that still have `'vt'` and the line numbers.

Expected output example:
```
src/modules/swine/pages/biosecurity/SomePage.jsx:45:  const translations = { en: ..., id: ..., vt: ... }
src/modules/swine/pages/biosecurity/AnotherPage.jsx:12:  language === 'vt' ? 'Text' : 'Other'
```

### 1.2 For EACH file found, change 'vt' to 'vi'

**Pattern to find:** `'vt'` (with quotes)  
**Replace with:** `'vi'` (with quotes)

**IMPORTANT:** Also check for these variants:
- `"vt"` (double quotes)
- `vt:` (in object keys)
- `language === 'vt'`
- `language == 'vt'`

**Example changes:**

BEFORE:
```javascript
const translations = {
  en: 'Purchase & Transport',
  id: 'Pembelian & Transportasi',
  vt: 'Mua & Vận chuyển'  // ❌ WRONG
};
```

AFTER:
```javascript
const translations = {
  en: 'Purchase & Transport',
  id: 'Pembelian & Transportasi',
  vi: 'Mua & Vận chuyển'  // ✅ CORRECT
};
```

### 1.3 Verify no more 'vt' exists

Run this command again:
```bash
grep -r "'vt'" src/modules/swine/pages/biosecurity --include="*.jsx"
```

Expected output: **NOTHING** (no results)

If it still shows results, repeat step 1.2 for those files.

---

## STEP 2: FIND AND FIX HARDCODED ENGLISH STRINGS

### 2.1 Search for hardcoded Focus Area titles

Run this command:
```bash
grep -r "Purchase & Transport" src/modules/swine/pages/biosecurity --include="*.jsx" -n
```

This will find where "Purchase & Transport" appears.

### 2.2 Check if it's using translation or hardcoded

Open the file and look at how the string is used.

**BAD (hardcoded):**
```javascript
<h2>Purchase & Transport</h2>
```

**BAD (ternary without Vietnamese):**
```javascript
<h2>{language === 'id' ? 'Pembelian & Transportasi' : 'Purchase & Transport'}</h2>
```

**GOOD (using translation function):**
```javascript
<h2>{getTranslation('focusArea1Title')}</h2>
```

OR

```javascript
<h2>{t('swine.biosecurity.focusArea1.title')}</h2>
```

### 2.3 Fix each hardcoded string

For EACH hardcoded English string found, you need to:

**Option A: Add to existing getTranslation() function**

1. Find the `getTranslation()` function in the file (usually near the top of the component)

2. Add the missing translation:

```javascript
const getTranslation = (key) => {
  const translations = {
    focusArea1Title: {
      en: 'Purchase & Transport',
      id: 'Pembelian & Transportasi',
      vi: 'Mua & Vận chuyển'  // ADD THIS
    },
    focusArea1Desc: {
      en: 'Prevent disease entry through animals and vehicles',
      id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan',
      vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện'  // ADD THIS
    },
    // ... add all other missing translations
  };
  return translations[key]?.[language] || translations[key]?.en || key;
};
```

3. Replace the hardcoded string with translation call:

BEFORE:
```javascript
<h2>Purchase & Transport</h2>
```

AFTER:
```javascript
<h2>{getTranslation('focusArea1Title')}</h2>
```

**Option B: Use global translation (if using i18next)**

If the file imports `useTranslation`:
```javascript
import { useTranslation } from 'react-i18next';
```

Then you can use:
```javascript
const { t } = useTranslation();

// In JSX:
<h2>{t('swine.biosecurity.focusArea1.title')}</h2>
```

But you MUST add the translation to `src/i18n/translations.js` first.

### 2.4 Common strings to translate

Search for and fix ALL of these hardcoded English strings:

**Focus Area Titles:**
- "Purchase & Transport"
- "Facilities & People"
- "Production Management"
- "Hygiene Protocol" or "Hygiene Protocols"

**Focus Area Descriptions:**
- "Prevent disease entry through animals and vehicles"
- "Control access and maintain infrastructure"
- "Disease monitoring and production practices"
- "Cleaning and disinfection procedures"

**Status Labels:**
- "Needs Improvement"
- "Pending"
- "Completed"
- "In Progress"

**Question Text:**
Search for questions like:
- "Are breeding pigs (sows/gilts/boars) purchased?"
- Any other question text that appears in English

**Action Buttons:**
- "Start Assessment"
- "Continue"
- "Save & Exit"
- "View Report"

---

## STEP 3: VERIFICATION

### 3.1 Test Dashboard Page

1. Open browser: `http://localhost:5173/swine/biosecurity/dashboard`
2. Click Vietnamese flag (🇻🇳)
3. **CHECK:** ALL text should be in Vietnamese
   - Focus area titles
   - Focus area descriptions
   - Button labels
   - Status labels

If ANY English appears → go back to Step 2 and find that string

### 3.2 Test Report Page

1. Navigate to: `http://localhost:5173/swine/biosecurity/report`
2. Click Vietnamese flag
3. **CHECK:** ALL text should be in Vietnamese
   - Page headers
   - Focus area titles
   - Score labels
   - Status text

### 3.3 Test Assessment Page

1. Navigate to: `http://localhost:5173/swine/biosecurity/assessment/1`
2. Click Vietnamese flag
3. **CHECK:** ALL text should be in Vietnamese
   - Page title
   - Focus area title
   - Question text
   - Radio button labels ("Yes" / "No")
   - Button labels

### 3.4 Test Language Switching

For EACH page above:
1. Switch to English (🇬🇧) → should show English
2. Switch to Indonesian (🇮🇩) → should show Indonesian
3. Switch to Vietnamese (🇻🇳) → should show Vietnamese
4. Switch back to English → should show English again

**NO mixed languages should appear at any time.**

---

## COMPLETE TRANSLATION REFERENCE

Here are the Vietnamese translations for common biosecurity terms:

### Focus Areas
```javascript
{
  focusArea1: {
    title: { en: 'Purchase & Transport', id: 'Pembelian & Transportasi', vi: 'Mua & Vận chuyển' },
    desc: { en: 'Prevent disease entry through animals and vehicles', id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan', vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện' }
  },
  focusArea2: {
    title: { en: 'Facilities & People', id: 'Fasilitas & Orang', vi: 'Cơ sở & Con người' },
    desc: { en: 'Control access and maintain infrastructure', id: 'Kontrol akses dan pemeliharaan infrastruktur', vi: 'Kiểm soát truy cập và duy trì cơ sở hạ tầng' }
  },
  focusArea3: {
    title: { en: 'Production Management', id: 'Manajemen Produksi', vi: 'Quản lý Sản xuất' },
    desc: { en: 'Disease monitoring and production practices', id: 'Pemantauan penyakit dan praktik produksi', vi: 'Giám sát bệnh tật và thực hành sản xuất' }
  },
  focusArea4: {
    title: { en: 'Hygiene Protocols', id: 'Protokol Kebersihan', vi: 'Quy trình Vệ sinh' },
    desc: { en: 'Cleaning and disinfection procedures', id: 'Prosedur pembersihan dan disinfeksi', vi: 'Quy trình vệ sinh và khử trùng' }
  }
}
```

### Status Labels
```javascript
{
  needsImprovement: { en: 'Needs Improvement', id: 'Perlu Perbaikan', vi: 'Cần Cải thiện' },
  pending: { en: 'Pending', id: 'Tertunda', vi: 'Đang chờ' },
  completed: { en: 'Completed', id: 'Selesai', vi: 'Hoàn thành' },
  inProgress: { en: 'In Progress', id: 'Sedang Berlangsung', vi: 'Đang tiến hành' }
}
```

### Common Buttons
```javascript
{
  startAssessment: { en: 'Start Assessment', id: 'Mulai Penilaian', vi: 'Bắt đầu Đánh giá' },
  continue: { en: 'Continue', id: 'Lanjutkan', vi: 'Tiếp tục' },
  saveExit: { en: 'Save & Exit', id: 'Simpan & Keluar', vi: 'Lưu & Thoát' },
  viewReport: { en: 'View Report', id: 'Lihat Laporan', vi: 'Xem Báo cáo' },
  backToDashboard: { en: 'Back to Dashboard', id: 'Kembali ke Dasbor', vi: 'Quay lại Bảng điều khiển' }
}
```

### Yes/No Radio Buttons
```javascript
{
  yes: { en: 'Yes', id: 'Ya', vi: 'Có' },
  no: { en: 'No', id: 'Tidak', vi: 'Không' }
}
```

---

## CHECKLIST FOR EACH FILE

When fixing a file, check ALL of these:

- [ ] Change all `'vt'` to `'vi'`
- [ ] Change all `"vt"` to `"vi"`
- [ ] Change all `vt:` to `vi:`
- [ ] Find all hardcoded English strings
- [ ] Add Vietnamese translations for each string
- [ ] Replace hardcoded strings with `getTranslation()` or `t()` calls
- [ ] Test the page in Vietnamese
- [ ] Verify no mixed languages appear

---

## FILES TO CHECK (based on previous fix)

These files were already fixed for `'vt'` → `'vi'`, but may still have hardcoded English:

1. `BiosecurityMainDashboard.jsx`
2. `BiosecurityDashboard.jsx`
3. `FarmProfilePage.jsx`
4. `BiosecurityReportPage.jsx`
5. `BiosecurityHistoryPage.jsx`
6. `AssessmentPage.jsx`
7. `FocusAreaCard.jsx`
8. `PriorityRecommendationsSection.jsx`
9. `DiseaseRiskSection.jsx`

**Plus any other files in:** `src/modules/swine/pages/biosecurity/`

---

## EXAMPLE: Complete Fix for One String

**Problem found:** "Purchase & Transport" appears in English

**Step 1:** Search for it
```bash
grep -r "Purchase & Transport" src/modules/swine/pages/biosecurity -n
```

**Step 2:** Found in `FocusAreaCard.jsx` line 25

**Step 3:** Open file, find the code:
```javascript
<h3 className="font-bold">Purchase & Transport</h3>
```

**Step 4:** Check if `getTranslation()` exists in file. If yes, add translation:
```javascript
const getTranslation = (key) => {
  const translations = {
    // ... existing translations ...
    focusArea1Title: {
      en: 'Purchase & Transport',
      id: 'Pembelian & Transportasi',
      vi: 'Mua & Vận chuyển'
    }
  };
  return translations[key]?.[language] || key;
};
```

**Step 5:** Replace the hardcoded string:
```javascript
<h3 className="font-bold">{getTranslation('focusArea1Title')}</h3>
```

**Step 6:** Save file

**Step 7:** Test in browser → should show "Mua & Vận chuyển" in Vietnamese

**Step 8:** Repeat for ALL other hardcoded strings in the file

---

## WHAT TO DO IF getTranslation() DOESN'T EXIST

If the file doesn't have a `getTranslation()` function, you need to create one:

**Add this near the top of the component (after imports, inside the component function):**

```javascript
const YourComponent = () => {
  const { language } = useLanguage(); // Make sure this import exists
  
  // ADD THIS FUNCTION
  const getTranslation = (key) => {
    const translations = {
      // Add all your translations here
      focusArea1Title: {
        en: 'Purchase & Transport',
        id: 'Pembelian & Transportasi',
        vi: 'Mua & Vận chuyển'
      },
      focusArea1Desc: {
        en: 'Prevent disease entry through animals and vehicles',
        id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan',
        vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện'
      },
      // ... add all other needed translations
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };
  
  // Rest of component code...
}
```

**Make sure the file imports useLanguage:**
```javascript
import { useLanguage } from '../../context/LanguageContext';
```

---

## FINAL VERIFICATION COMMAND

After all fixes, run this to make sure no 'vt' remains:

```bash
grep -r "vt" src/modules/swine/pages/biosecurity --include="*.jsx" | grep -v "// " | grep -v "vtl" | grep -v "pvt"
```

This searches for 'vt' but excludes:
- Comments (lines starting with //)
- False positives like "vtl" or "pvt"

Expected output: **NOTHING or only Vietnamese text content**

---

## SUMMARY

**Total steps to complete:**
1. Find and replace ALL `'vt'` → `'vi'`
2. Find ALL hardcoded English strings
3. Add Vietnamese translations for each string
4. Replace hardcoded strings with translation function calls
5. Test each page in all 3 languages

**Expected result:**
- ✅ Vietnamese page shows 100% Vietnamese
- ✅ No mixed English/Vietnamese
- ✅ All pages work in EN/ID/VI
- ✅ Language switching works smoothly

**Files to modify:** 9+ files in `src/modules/swine/pages/biosecurity/`

**Estimated time:** 45-60 minutes

---

## IMPORTANT NOTES

- Do NOT skip any file - check ALL files in biosecurity folder
- Do NOT assume a string is translated - verify in the browser
- Do NOT forget to add `vi:` translations - not `vt:`
- Do test EVERY page after changes
- Do check console for any errors about missing translations

Good luck! Take it step by step, and check EVERY file thoroughly.

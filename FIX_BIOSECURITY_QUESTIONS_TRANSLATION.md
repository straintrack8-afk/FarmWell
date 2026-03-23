# FIX: Biosecurity Assessment Questions - Still in English

## EXACT PROBLEM FROM SCREENSHOTS

**Image 1 - Focus Area 1 (Vietnamese selected):**
- Button: "Quay lại Bảng điều khiển" ✅ Vietnamese
- Title: "Khu vực 1: Purchase & Transport" ❌ MIXED (half Vietnamese, half English)
- Description: "Prevent disease entry through animals and vehicles" ❌ English
- Progress: "Câu hỏi 1 của 44" ✅ Vietnamese
- **QUESTION: "Are breeding pigs (sows/gilts/boars) purchased?"** ❌ ENGLISH
- **OPTIONS: "Yes" / "No"** ❌ ENGLISH
- Buttons: "Trước" / "Lưu & Thoát" / "Tiếp" ✅ Vietnamese

**Image 2 - Focus Area 2 (Vietnamese selected):**
- Title: "Khu vực 2: Facilities & People" ❌ MIXED
- Description: "Control access and maintain infrastructure" ❌ English
- **QUESTION: "What type of feed is used on the farm?"** ❌ ENGLISH
- **OPTIONS:**
  - "Commercial feed" ❌ ENGLISH
  - "Own-produced or natural crops (e.g. acorn)" ❌ ENGLISH
  - "Swill feed uncooked" ❌ ENGLISH
  - "Swill feed cooked" ❌ ENGLISH

**Image 3 - Focus Area 2 (Indonesian selected):**
- Button: "Kembali ke Dashboard" ✅ Indonesian
- Title: "Area Fokus 2: Facilities & People" ❌ MIXED
- Description: "Control access and maintain infrastructure" ❌ English
- Progress: "Pertanyaan 1 dari 31" ✅ Indonesian
- **QUESTION: "What type of feed is used on the farm?"** ❌ ENGLISH
- **OPTIONS: Same as above** ❌ ALL ENGLISH
- Buttons: "Sebelumnya" / "Simpan & Keluar" / "Selanjutnya" ✅ Indonesian

---

## ROOT CAUSE

The biosecurity questions and answer options come from **JSON data files**, NOT from the component's translation system.

**File location (most likely):**
- `public/data/swine/biosecurity/questions.json`
- OR `public/data/swine/biosecurity/biocheck_questions.json`
- OR similar JSON file containing all 116 questions

**Current structure (WRONG):**
```json
{
  "id": 1,
  "question": "Are breeding pigs (sows/gilts/boars) purchased?",
  "options": ["Yes", "No"]
}
```

**Required structure (CORRECT):**
```json
{
  "id": 1,
  "question": {
    "en": "Are breeding pigs (sows/gilts/boars) purchased?",
    "id": "Apakah babi bibit (induk/dara/pejantan) dibeli?",
    "vi": "Lợn giống (nái/cái/đực) có được mua không?"
  },
  "options": {
    "en": ["Yes", "No"],
    "id": ["Ya", "Tidak"],
    "vi": ["Có", "Không"]
  }
}
```

---

## SOLUTION

We need to:
1. Find the questions JSON file
2. Check its current structure
3. Either:
   - **Option A:** Restructure the JSON to include all 3 languages
   - **Option B:** Create separate JSON files for each language
4. Update the component to access the correct language

---

## STEP 1: FIND THE QUESTIONS FILE

Run this command:

```bash
find public/data/swine -name "*.json" | xargs grep -l "Are breeding pigs"
```

This will find the JSON file that contains the questions.

**Expected output:**
```
public/data/swine/biosecurity/questions_en.json
```
OR
```
public/data/swine/biosecurity/biocheck_pig_questions.json
```

**Write down the exact file path.**

---

## STEP 2: CHECK THE FILE STRUCTURE

Open the file you found and check how questions are structured.

### Scenario A: Single file with only English

**File:** `questions_en.json` or `questions.json`

**Content looks like:**
```json
[
  {
    "id": 1,
    "focusArea": 1,
    "question": "Are breeding pigs (sows/gilts/boars) purchased?",
    "options": ["Yes", "No"],
    "type": "radio"
  },
  {
    "id": 2,
    "question": "What type of feed is used on the farm?",
    "options": [
      "Commercial feed",
      "Own-produced or natural crops (e.g. acorn)",
      "Swill feed uncooked",
      "Swill feed cooked"
    ],
    "type": "checkbox"
  }
]
```

**If this is the case → Go to SOLUTION A**

### Scenario B: Separate files per language

**Files exist:**
- `questions_en.json` (English)
- `questions_id.json` (Indonesian)  
- `questions_vi.json` (Vietnamese)

**If this is the case → Go to SOLUTION B**

### Scenario C: Multi-language in one file

**File contains:**
```json
[
  {
    "id": 1,
    "question": {
      "en": "Are breeding pigs purchased?",
      "id": "Apakah babi bibit dibeli?",
      "vi": "Lợn giống có được mua không?"
    }
  }
]
```

**If this is the case → Go to SOLUTION C**

---

## SOLUTION A: Single English File Exists

**You need to:**
1. Create Indonesian version: `questions_id.json`
2. Create Vietnamese version: `questions_vi.json`
3. Update component to load correct file based on language

### A.1 Get the complete translations

**CRITICAL:** We need the COMPLETE Indonesian and Vietnamese translations for ALL 116 questions.

**Where to get them:**
- Check if there's a PDF or document with translations
- Check `public/data/swine/biosecurity/` for translation files
- Ask the project owner for the translated questions

**DO NOT use Google Translate** - biosecurity questions need accurate technical translations.

### A.2 Create the language files

Once you have the translations:

**Create:** `public/data/swine/biosecurity/questions_id.json`
```json
[
  {
    "id": 1,
    "focusArea": 1,
    "question": "Apakah babi bibit (induk/dara/pejantan) dibeli?",
    "options": ["Ya", "Tidak"],
    "type": "radio"
  },
  {
    "id": 2,
    "question": "Jenis pakan apa yang digunakan di peternakan?",
    "options": [
      "Pakan komersial",
      "Produksi sendiri atau tanaman alami (mis. biji ek)",
      "Pakan sisa mentah",
      "Pakan sisa matang"
    ],
    "type": "checkbox"
  }
]
```

**Create:** `public/data/swine/biosecurity/questions_vi.json`
```json
[
  {
    "id": 1,
    "focusArea": 1,
    "question": "Lợn giống (nái/cái/đực) có được mua không?",
    "options": ["Có", "Không"],
    "type": "radio"
  },
  {
    "id": 2,
    "question": "Loại thức ăn nào được sử dụng trong trang trại?",
    "options": [
      "Thức ăn công nghiệp",
      "Tự sản xuất hoặc cây trồng tự nhiên (ví dụ: hạt sồi)",
      "Thức ăn thừa chưa nấu chín",
      "Thức ăn thừa đã nấu chín"
    ],
    "type": "checkbox"
  }
]
```

### A.3 Update the component to load language-specific file

**Find the component** that loads questions:
```bash
grep -r "questions.json" src/modules/swine/pages/biosecurity --include="*.jsx" -l
```

**Open that file** and find the fetch/import statement.

**BEFORE:**
```javascript
const response = await fetch('/data/swine/biosecurity/questions.json');
const questions = await response.json();
```

**AFTER:**
```javascript
const { language } = useLanguage(); // Make sure this is imported

const getQuestionsFile = () => {
  switch(language) {
    case 'id': return '/data/swine/biosecurity/questions_id.json';
    case 'vi': return '/data/swine/biosecurity/questions_vi.json';
    default: return '/data/swine/biosecurity/questions_en.json';
  }
};

const response = await fetch(getQuestionsFile());
const questions = await response.json();
```

---

## SOLUTION B: Separate Language Files Already Exist

**If files already exist:**
- `questions_id.json`
- `questions_vi.json`

**The problem is:** Component is not loading them correctly.

### B.1 Check how component loads questions

Find the component and check the fetch logic.

**BAD (always loads English):**
```javascript
const response = await fetch('/data/swine/biosecurity/questions_en.json');
```

**GOOD (loads based on language):**
```javascript
const { language } = useLanguage();
const response = await fetch(`/data/swine/biosecurity/questions_${language}.json`);
```

### B.2 Fix the component

Add language-based file loading:

```javascript
import { useLanguage } from '../../../context/LanguageContext';

const AssessmentPage = () => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`/data/swine/biosecurity/questions_${language}.json`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Failed to load questions:', error);
        // Fallback to English
        const fallback = await fetch('/data/swine/biosecurity/questions_en.json');
        setQuestions(await fallback.json());
      }
    };
    
    loadQuestions();
  }, [language]); // Re-load when language changes
  
  // Rest of component...
};
```

---

## SOLUTION C: Multi-language Structure Already Exists

**If the JSON already has:**
```json
{
  "question": {
    "en": "...",
    "id": "...",
    "vi": "..."
  }
}
```

**The problem is:** Component is not accessing the language field.

### C.1 Find how component renders questions

**BAD (always shows English):**
```javascript
<p>{question.question}</p>
```

**GOOD (shows correct language):**
```javascript
const { language } = useLanguage();
<p>{question.question[language] || question.question.en}</p>
```

### C.2 Fix all question and option rendering

**For questions:**
```javascript
<h3>{currentQuestion.question[language] || currentQuestion.question.en}</h3>
```

**For options (radio buttons):**
```javascript
{currentQuestion.options[language]?.map((option, index) => (
  <label key={index}>
    <input type="radio" value={option} />
    {option}
  </label>
))}
```

**For options (checkboxes):**
```javascript
{currentQuestion.options[language]?.map((option, index) => (
  <label key={index}>
    <input type="checkbox" value={option} />
    {option}
  </label>
))}
```

---

## STEP 3: FIX FOCUS AREA TITLES

From screenshots, Focus Area titles are also mixed:
- "Khu vực 1: Purchase & Transport" ❌
- "Khu vực 2: Facilities & People" ❌

These need to be fully translated.

**Find where Focus Area titles are rendered.**

**BEFORE:**
```javascript
<h2>Focus Area 1: Purchase & Transport</h2>
```

**AFTER:**
```javascript
const focusAreaTitles = {
  1: {
    en: 'Purchase & Transport',
    id: 'Pembelian & Transportasi',
    vi: 'Mua & Vận chuyển'
  },
  2: {
    en: 'Facilities & People',
    id: 'Fasilitas & Orang',
    vi: 'Cơ sở & Con người'
  },
  3: {
    en: 'Production Management',
    id: 'Manajemen Produksi',
    vi: 'Quản lý Sản xuất'
  },
  4: {
    en: 'Hygiene Protocols',
    id: 'Protokol Kebersihan',
    vi: 'Quy trình Vệ sinh'
  }
};

// In JSX:
<h2>
  {language === 'vi' ? 'Khu vực' : language === 'id' ? 'Area Fokus' : 'Focus Area'} {focusAreaNumber}: {focusAreaTitles[focusAreaNumber][language]}
</h2>
```

---

## STEP 4: FIX FOCUS AREA DESCRIPTIONS

**Descriptions are also English:**
- "Prevent disease entry through animals and vehicles"
- "Control access and maintain infrastructure"

**Add translations:**
```javascript
const focusAreaDescriptions = {
  1: {
    en: 'Prevent disease entry through animals and vehicles',
    id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan',
    vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện'
  },
  2: {
    en: 'Control access and maintain infrastructure',
    id: 'Kontrol akses dan pemeliharaan infrastruktur',
    vi: 'Kiểm soát truy cập và duy trì cơ sở hạ tầng'
  },
  3: {
    en: 'Disease monitoring and production practices',
    id: 'Pemantauan penyakit dan praktik produksi',
    vi: 'Giám sát bệnh tật và thực hành sản xuất'
  },
  4: {
    en: 'Cleaning and disinfection procedures',
    id: 'Prosedur pembersihan dan disinfeksi',
    vi: 'Quy trình vệ sinh và khử trùng'
  }
};

// In JSX:
<p>{focusAreaDescriptions[focusAreaNumber][language]}</p>
```

---

## COMPLETE EXAMPLE FIX

Here's what a properly translated assessment page should look like:

```javascript
import { useLanguage } from '../../../context/LanguageContext';

const AssessmentPage = () => {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Focus Area metadata
  const focusAreas = {
    1: {
      title: {
        en: 'Purchase & Transport',
        id: 'Pembelian & Transportasi',
        vi: 'Mua & Vận chuyển'
      },
      description: {
        en: 'Prevent disease entry through animals and vehicles',
        id: 'Mencegah masuknya penyakit melalui hewan dan kendaraan',
        vi: 'Ngăn ngừa bệnh xâm nhập qua động vật và phương tiện'
      }
    },
    // ... other focus areas
  };
  
  // Load questions based on language
  useEffect(() => {
    const loadQuestions = async () => {
      const response = await fetch(`/data/swine/biosecurity/questions_${language}.json`);
      const data = await response.json();
      setQuestions(data);
    };
    loadQuestions();
  }, [language]);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div>
      <h2>
        {language === 'vi' ? 'Khu vực' : language === 'id' ? 'Area Fokus' : 'Focus Area'} {currentQuestion.focusArea}: {focusAreas[currentQuestion.focusArea].title[language]}
      </h2>
      <p>{focusAreas[currentQuestion.focusArea].description[language]}</p>
      
      <h3>{currentQuestion.question}</h3>
      
      {currentQuestion.type === 'radio' && (
        <div>
          {currentQuestion.options.map((option, index) => (
            <label key={index}>
              <input type="radio" name="answer" value={option} />
              {option}
            </label>
          ))}
        </div>
      )}
      
      {currentQuestion.type === 'checkbox' && (
        <div>
          {currentQuestion.options.map((option, index) => (
            <label key={index}>
              <input type="checkbox" value={option} />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## TESTING CHECKLIST

After all fixes:

### Test Focus Area 1 (Purchase & Transport)
- [ ] Navigate to `/swine/biosecurity/assessment/1`
- [ ] Switch to Vietnamese → Title should be "Khu vực 1: Mua & Vận chuyển"
- [ ] Description should be in Vietnamese
- [ ] Question should be in Vietnamese
- [ ] Options ("Yes"/"No") should be "Có"/"Không"

### Test Focus Area 2 (Facilities & People)  
- [ ] Navigate to `/swine/biosecurity/assessment/2`
- [ ] Switch to Indonesian → Title should be "Area Fokus 2: Fasilitas & Orang"
- [ ] Description should be in Indonesian
- [ ] Question should be in Indonesian
- [ ] All checkbox options should be in Indonesian

### Test Language Switching
- [ ] Start assessment in English
- [ ] Switch to Vietnamese mid-assessment
- [ ] Question and options change to Vietnamese
- [ ] Switch to Indonesian
- [ ] Question and options change to Indonesian

---

## CRITICAL NOTES

**FOR ANTIGRAVITY TO UNDERSTAND:**

1. **The questions come from JSON files**, not from the component
2. You need to **either**:
   - Create separate JSON files for each language, OR
   - Update component to access multi-language JSON structure
3. **Focus Area titles and descriptions** also need translation in the component
4. **ALL 116 questions** must be translated, not just the ones in screenshots
5. **DO NOT use Google Translate** for technical biosecurity terms - get proper translations

**FILES TO MODIFY:**
- `public/data/swine/biosecurity/questions_*.json` (data files)
- Assessment page component (probably `AssessmentPage.jsx` or `BiosecurityAssessmentPage.jsx`)

**ESTIMATED TIME:** 2-3 hours (if translations are available)

---

## WHERE TO GET TRANSLATIONS

**Option 1:** Check if translations already exist
```bash
find public/data/swine/biosecurity -name "*id.json" -o -name "*vi.json"
```

**Option 2:** Check for translation documents
```bash
find . -name "*translation*" -o -name "*bahasa*" -o -name "*tieng*"
```

**Option 3:** Ask project owner for:
- Indonesian biosecurity question translations
- Vietnamese biosecurity question translations
- Complete BIOCHECK Pig 4.0 questionnaire in ID and VI

**DO NOT PROCEED with Google Translate** - veterinary/biosecurity terms need accurate professional translation.

---

## SUMMARY

**Problem:** Questions and options showing in English even when ID/VI selected

**Root Cause:** Questions come from JSON data files, not translation system

**Solution:**
1. Find questions JSON file
2. Create/update language-specific versions
3. Update component to load correct language file
4. Translate Focus Area titles/descriptions in component
5. Test all 4 focus areas in all 3 languages

**Priority:** HIGH (entire assessment unusable in ID/VI)  
**Complexity:** MEDIUM (need complete translations)  
**Files:** JSON data files + 1 component file

# Swine Biosecurity Check Module

## Overview
A comprehensive biosecurity assessment module for pig farms based on BIOCHECK PIG V4.0 from Ghent University. This module evaluates farm biosecurity practices across 13 critical categories and provides risk assessment with disease predictions.

## Features

### ✅ Implemented Features
1. **Complete Question Bank** - 116 questions across 13 biosecurity categories
2. **Smart Assessment Flow** - Progressive questionnaire with conditional logic
3. **Real-time Scoring** - Weighted scoring system based on scientific standards
4. **Disease Risk Assessment** - Identifies risks for 6 major swine diseases
5. **Personalized Recommendations** - Priority-based action items
6. **Progress Tracking** - Category-wise progress visualization
7. **Draft Saving** - Auto-save to localStorage for incomplete assessments
8. **Assessment History** - View and compare past assessments
9. **Responsive Design** - Works on desktop, tablet, and mobile
10. **Offline Capability** - All data stored locally, no backend required

## Module Structure

```
src/modules/swine/
├── contexts/
│   └── BiosecurityContext.jsx          # State management
├── pages/
│   ├── BiosecurityHomePage.jsx         # Landing page
│   ├── BiosecurityAssessmentPage.jsx   # Question flow
│   └── BiosecurityResultsPage.jsx      # Results dashboard
├── utils/
│   ├── biosecurityScoring.js           # Scoring algorithms
│   └── diseaseRisk.js                  # Disease risk assessment
└── App.jsx                              # Updated with biosecurity routes

public/data/swine/
└── swine_questions_complete.json       # Complete 116-question bank
```

## Categories Assessed

1. **Farm Characteristics** (5% weight)
   - Animal types, farm experience, building age, other animals on farm

2. **Purchase of Animals & Semen** (12% weight)
   - Supplier health status, quarantine protocols, breeding methods, semen procurement

3. **Transport & Deadstock** (10% weight)
   - Loading areas, vehicle disinfection, deadstock management, manure handling

4. **Feed, Water & Equipment** (8% weight)
   - Feed storage, water quality, equipment hygiene, shared equipment protocols

5. **Visitors & Workers** (12% weight)
   - Hygiene locks, visitor logs, worker protocols, biosecurity training

6. **Vermin & Bird Control** (8% weight)
   - Pest control programs, wild animal access, bird protection

7. **Location** (7% weight)
   - Farm density, proximity to other farms, wild boar presence

8. **Disease Management** (10% weight)
   - Health plans, vaccination, isolation protocols, runt pig management

9. **Farrowing & Suckling Period** (7% weight)
   - Sow washing, cross-fostering, piglet handling, tool disinfection

10. **Nursery Unit** (7% weight)
    - All-in/all-out management, age group separation, stocking density

11. **Finishing Unit** (7% weight)
    - Compartment management, age group mixing, pig density

12. **Measures Between Compartments** (7% weight)
    - Working sequences, equipment separation, hygiene between units

13. **Cleaning & Disinfection** (7% weight)
    - Cleaning protocols, disinfection frequency, efficacy testing

## Scoring System

### Overall Score Calculation
- Each category receives a percentage score (0-100%)
- Category scores are weighted according to their importance
- Final score = Σ(Category Score × Category Weight)

### Risk Levels
- **85-100**: Low Risk (Grade A) - ✅ Excellent biosecurity
- **70-84**: Medium Risk (Grade B) - ⚠️ Good with room for improvement
- **50-69**: High Risk (Grade C-D) - 🟠 Significant gaps detected
- **0-49**: Critical Risk (Grade F) - 🔴 Critical deficiencies

## Disease Risk Assessment

The module evaluates risk for:
1. **African Swine Fever** (CRITICAL) - No treatment/vaccine available
2. **PRRS** (HIGH) - Major economic impact
3. **Salmonella** (MEDIUM) - Zoonotic risk
4. **E. coli & Clostridial Diseases** (MEDIUM)
5. **Swine Influenza** (MEDIUM)
6. **Parasitic Infections** (LOW)

### Risk Triggers
Each disease has specific trigger conditions based on answers:
- **CRITICAL**: Immediate action required (e.g., feeding uncooked food waste)
- **HIGH**: Serious concern (e.g., no quarantine for new animals)
- **MEDIUM**: Moderate risk (e.g., infrequent cleaning)

## Usage

### Starting a New Assessment
1. Navigate to `/swine/biosecurity`
2. Click "Start New Assessment"
3. Answer all 50 questions
4. Review results and recommendations

### Continuing a Draft
- Assessments are auto-saved to localStorage
- Return to the biosecurity home page to continue

### Viewing Results
- Access assessment history from home page
- Click any past assessment to view detailed report
- Print or save reports for record-keeping

## Technical Details

### State Management
- Uses React Context API for global state
- LocalStorage for persistence
- No backend required

### Data Flow
1. Questions loaded from JSON file
2. Answers stored in context + localStorage
3. On completion:
   - Calculate scores using weighted algorithm
   - Assess disease risks based on triggers
   - Generate personalized recommendations
   - Save to assessment history

### Scoring Algorithm
```javascript
// Category score calculation
categoryScore = (totalPoints / maxPoints) × 100

// Overall score
overallScore = Σ(categoryScore × categoryWeight)

// Example:
// If Purchase of Animals scores 75%
// Contribution = 75 × 0.12 = 9 points to overall score
```

### Disease Risk Logic
```javascript
// Each disease has triggers with weights
if (criticalTriggers >= 1) → CRITICAL RISK
else if (highTriggers >= 2) → HIGH RISK
else if (highTriggers >= 1 AND mediumTriggers >= 2) → HIGH RISK
else if (mediumTriggers >= 3) → MEDIUM RISK
```

## Future Enhancements

### Potential Additions
1. **PDF Report Generation** - Export detailed reports
2. **Photo Upload** - Document biosecurity measures
3. **GPS Location** - Track farm location
4. **Comparison Charts** - Compare with regional averages
5. **Action Plan Tracking** - Monitor recommendation implementation
6. **Multi-language Support** - Vietnamese, English, etc.
7. **Backend Integration** - Cloud sync and analytics
8. **Certification System** - Official biosecurity certification

### Backend API (Future)
If backend is added, suggested endpoints:
```
POST   /api/v1/swine/assessments
GET    /api/v1/swine/assessments/:id
POST   /api/v1/swine/assessments/:id/answers
POST   /api/v1/swine/assessments/:id/complete
GET    /api/v1/swine/assessments/:id/report/pdf
GET    /api/v1/farms/:farmId/assessments/history
```

## Testing Checklist

- [x] Questions load correctly from JSON
- [x] Answer selection works for all question types
- [x] Progress tracking updates correctly
- [x] Draft saving/loading works
- [x] Scoring calculation is accurate
- [x] Disease risk assessment triggers correctly
- [x] Recommendations generate properly
- [x] Results display correctly
- [x] Assessment history persists
- [x] Navigation between pages works
- [x] Responsive design on mobile
- [x] Print functionality works

## Credits

Based on **BIOCHECK PIG V4.0** developed by:
- Ghent University, Faculty of Veterinary Medicine
- Research Group Veterinary Epidemiology

## License

Part of the FarmWell application suite.
© 2026 FarmWell - Powered by Vaksindo

## Support

For questions or issues:
1. Check this documentation
2. Review the question bank JSON structure
3. Examine the scoring utilities
4. Test with sample data

## Version History

- **v1.0.0** (2026-01-09)
  - Initial implementation
  - 50 questions across 10 categories
  - Complete scoring and risk assessment
  - LocalStorage persistence
  - Assessment history
  - Responsive UI

/**
 * Constants for Poultry Diagnostic App
 * Updated to include Body Part Selection step
 */

// Diagnostic Steps - Updated with BODY_PART and ALL_DISEASES
export const STEPS = {
  AGE: 'age',
  BODY_PART: 'body_part',  // ⭐ NEW STEP
  SYMPTOMS: 'symptoms',
  RESULTS: 'results',
  ALL_DISEASES: 'all_diseases',  // ⭐ NEW: Browse all diseases
  DETAIL: 'detail'
};

// Body Part Categories - Updated for v4.1 (removed 'nervous', symptoms now distributed)
export const BODY_PARTS = [
  {
    id: 'respiratory',
    name: 'Head & Respiratory',
    description: 'Eyes, nose, throat, lungs, breathing',
    symptoms: [],  // Will be populated from database
    detailedParts: ['eyes', 'beak_mouth', 'ears', 'face', 'neck', 'respiratory']  // Maps to ChickenBodyMapImproved
  },
  {
    id: 'digestive',
    name: 'Digestive System',
    description: 'Intestines, stomach, cloaca, droppings',
    symptoms: [],  // Will be populated from database
    detailedParts: ['crop', 'abdomen', 'droppings']  // Maps to ChickenBodyMapImproved
  },
  {
    id: 'musculoskeletal',
    name: 'Bones & Joints',
    description: 'Legs, wings, bones, joints, walking issues',
    symptoms: [],  // Will be populated from database
    detailedParts: ['wings', 'breast_keel', 'legs_feet']  // Maps to ChickenBodyMapImproved
  },
  {
    id: 'integumentary',
    name: 'Skin & Feathers',
    description: 'Skin, comb, wattles, feathers, face',
    symptoms: [],  // Will be populated from database
    detailedParts: ['comb_wattles', 'skin_feathers']  // Maps to ChickenBodyMapImproved
  },
  {
    id: 'reproductive',
    name: 'Reproductive System',
    description: 'Egg production, vent, laying issues',
    symptoms: [],  // Will be populated from database
    detailedParts: ['vent', 'eggs']  // Maps to ChickenBodyMapImproved
  },
  {
    id: 'general',
    name: 'Behavior & Systemic',
    description: 'Overall health, behavior, neurological signs',
    symptoms: [],  // Will be populated from database (includes former 'nervous' symptoms)
    detailedParts: ['behavior', 'systemic']  // Maps to ChickenBodyMapImproved
  }
];

// Age Groups (keep existing)
export const AGE_GROUPS = [
  'Day-old chicks (0-1 days)',
  'Growers (2-8 weeks)',
  'Layers',
  'Broilers',
  'Breeders',
  'Ducks'
];

// Confidence Thresholds
export const CONFIDENCE_LEVELS = {
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25
};

// Confidence Colors
export const CONFIDENCE_COLORS = {
  high: '#22c55e',    // green
  medium: '#f59e0b',  // orange
  low: '#3b82f6',     // blue
  unlikely: '#9ca3af' // gray
};

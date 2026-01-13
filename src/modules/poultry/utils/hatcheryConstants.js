// Hatchery Audit specific constants

// Audit workflow steps
export const AUDIT_STEPS = {
    INFO: 'info',
    VACCINE_STORAGE: 'vaccine_storage',
    EQUIPMENT: 'equipment',
    TECHNIQUES: 'techniques',
    SAMPLE_PLAN: 'sample_plan',
    SAMPLE_COLLECTION: 'sample_collection',
    INCUBATION: 'incubation',
    RESULTS: 'results',
    REVIEW: 'review'
};

// Sample location codes
export const SAMPLE_LOCATIONS = {
    H: { code: 'H', name: 'Hatchers', defaultCount: 5, type: 'air_plate' },
    S: { code: 'S', name: 'Setters', defaultCount: 5, type: 'air_plate' },
    HV: { code: 'HV', name: 'Hatcher Ventilation', defaultCount: 2, type: 'swab' },
    SV: { code: 'SV', name: 'Setter Top', defaultCount: 4, type: 'swab' },
    HHV: { code: 'HHV', name: 'Hallways', defaultCount: 4, type: 'air_plate' },
    GV: { code: 'GV', name: 'Fans', defaultCount: 4, type: 'swab' },
    M_CHICK: { code: 'M', name: 'Chick Room', defaultCount: 1, type: 'air_plate' },
    M_COLD: { code: 'M', name: 'Cold Room', defaultCount: 1, type: 'air_plate' },
    M_VACCINE: { code: 'M', name: 'Vaccine Room', defaultCount: 1, type: 'air_plate' },
    M_CANDLING: { code: 'M', name: 'Candling Machine', defaultCount: 2, type: 'swab' },
    CONTROL: { code: '#', name: 'Control', defaultCount: 1, type: 'air_plate' }
};

// Sample types
export const SAMPLE_TYPES = {
    AIR_PLATE: 'air_plate',
    SWAB: 'swab',
    EGG_TOUCH: 'egg_touch'
};

// Scoring thresholds
export const SCORING = {
    // Plate score (1-5)
    PLATE_SCORE: {
        EXCELLENT: 1,      // No Aspergillus, <40 other molds
        GOOD: 2,           // No Aspergillus, >40 other molds
        FAIR: 3,           // 1-3 Aspergillus, <40 other
        WARNING: 4,        // 4-10 Aspergillus OR 1-3 Aspergillus with >40 other
        CRITICAL: 5        // >10 Aspergillus
    },

    // Environmental classification
    CLASSIFICATION: {
        GOOD: { max: 28, label: 'GOOD', color: 'green' },
        FAIR: { min: 29, max: 40, label: 'FAIR', color: 'yellow' },
        POOR: { min: 41, label: 'POOR', color: 'red' }
    },

    // Compliance thresholds
    COMPLIANCE: {
        EXCELLENT: 95,
        GOOD: 85,
        FAIR: 75
    }
};

// Equipment types
export const EQUIPMENT_TYPES = {
    SPRAY_CABINET: 'spray_cabinet',
    PNEUMATIC_VACCINATOR: 'pneumatic_vaccinator',
    OTHER: 'other'
};

// Audit status
export const AUDIT_STATUS = {
    DRAFT: 'draft',
    IN_PROGRESS: 'in_progress',
    SAMPLES_COLLECTED: 'samples_collected',
    INCUBATING: 'incubating',
    RESULTS_PENDING: 'results_pending',
    COMPLETED: 'completed',
    APPROVED: 'approved'
};

// Audit type
export const AUDIT_TYPE = {
    SCHEDULED: 'scheduled',
    AD_HOC: 'ad_hoc'
};

// Storage keys
export const HATCHERY_STORAGE_KEYS = {
    AUDITS: 'hatchery-audits',
    CURRENT_AUDIT: 'hatchery-current-audit',
    SETTINGS: 'hatchery-settings',
    LOCATIONS: 'hatchery-locations',
    AUDITORS: 'hatchery-auditors',
    LAST_UPDATED: 'hatchery-last-updated'
};

// Default settings
export const DEFAULT_SETTINGS = {
    frequency: 'quarterly',
    reminderDaysBefore: 7,
    scoringThresholds: {
        good: 28,
        fair: 40
    },
    defaultAuditor: '',
    autoAssign: false,
    notifications: {
        auditDue: true,
        auditCompleted: true,
        criticalIssues: true
    }
};

// Droplet uniformity options
export const DROPLET_UNIFORMITY = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    FAIR: 'fair',
    POOR: 'poor'
};

// Priority levels for recommendations
export const PRIORITY_LEVELS = {
    CRITICAL: 'critical',
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
};

// Color scheme for audit status
export const AUDIT_COLORS = {
    GOOD: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        solid: '#10B981',
        icon: '✓'
    },
    FAIR: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        solid: '#F59E0B',
        icon: '⚠'
    },
    POOR: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        solid: '#EF4444',
        icon: '✗'
    },
    INFO: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        solid: '#3B82F6',
        icon: 'ℹ'
    }
};

// Color scheme for disease categories
export const CATEGORY_COLORS = {
    Bacterial: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        solid: '#3B82F6'
    },
    Viral: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        solid: '#EF4444'
    },
    Parasitic: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        solid: '#10B981'
    },
    Fungal: {
        bg: 'bg-teal-100',
        text: 'text-teal-800',
        border: 'border-teal-200',
        solid: '#14B8A6'
    },
    Nutritional: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
        solid: '#F59E0B'
    },
    Toxicosis: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        solid: '#8B5CF6'
    },
    Protozoal: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        solid: '#6366F1'
    },
    'Toxicosis / Management': {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        solid: '#F97316'
    },
    'Skeletal / Metabolic': {
        bg: 'bg-cyan-100',
        text: 'text-cyan-800',
        border: 'border-cyan-200',
        solid: '#06B6D4'
    },
    'Viral / Immunosuppressive': {
        bg: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-200',
        solid: '#F43F5E'
    },
    Other: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        solid: '#6B7280'
    }
};

// Age group mapping for filtering
export const AGE_GROUP_MAPPING = {
    'day-old': ['Day-old chicks (0-1 days)', 'All ages'],
    'chicks': ['Chicks (1-7 days)', 'All ages'],
    'young-chicks': ['Young chicks (7-14 days)', 'All ages'],
    'growers': ['Growers (2-8 weeks)', 'All ages'],
    'layers': ['Layers', 'All ages'],
    'broilers': ['Broilers', 'All ages'],
    'breeders': ['Breeders', 'All ages'],
    'ducks': ['Ducks', 'All ages'],
    'all': ['All ages']
};

// App navigation steps
export const STEPS = {
    LANDING: 'landing',
    AGE: 'age',
    SYMPTOMS: 'symptoms',
    RESULTS: 'results',
    DETAIL: 'detail'
};

// Storage keys for offline support
export const STORAGE_KEYS = {
    DISEASES: 'swine-dx-diseases',
    LAST_UPDATED: 'swine-dx-last-updated'
};

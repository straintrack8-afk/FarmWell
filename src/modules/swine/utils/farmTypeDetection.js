/**
 * Farm Type Auto-Detection Utility
 * Detects farm type from animal categories selected in pre_q1
 */

/**
 * Auto-detect farm type from animal categories
 * @param {Array<string>} selectedCategories - Animal categories from pre_q1
 * @returns {string} - Farm type: 'breeding', 'finishing', 'nursery', or 'farrow_to_finish'
 */
export function detectFarmType(selectedCategories) {
    if (!selectedCategories || selectedCategories.length === 0) {
        return 'breeding'; // Default fallback
    }

    const categories = new Set(selectedCategories);
    const hasSows = categories.has('sows_gilts_boars');
    const hasSlaughter = categories.has('slaughter_pigs');
    const hasWeaned = categories.has('weaned_piglets');
    const hasSuckling = categories.has('suckling_piglets');

    // RULE 1: Farrow-to-Finish (most comprehensive)
    // Has sows + 3 or more categories
    if (hasSows && categories.size >= 3) {
        return 'farrow_to_finish';
    }

    // RULE 2: Finishing Farm
    // ONLY slaughter pigs (nothing else)
    if (categories.size === 1 && hasSlaughter) {
        return 'finishing';
    }

    // RULE 3: Nursery Farm
    // Has weaned piglets but NO sows
    if (hasWeaned && !hasSows) {
        return 'nursery';
    }

    // RULE 4: Breeding Farm
    // Has sows + max 2 categories (sows + maybe suckling)
    if (hasSows && categories.size <= 2) {
        return 'breeding';
    }

    // RULE 5: Default to breeding if has sows
    if (hasSows) {
        return 'breeding';
    }

    // Fallback
    return 'breeding';
}

/**
 * Get farm type display name
 * @param {string} farmType - Farm type code
 * @param {string} language - Language code (en, id, vt)
 * @returns {string} - Display name
 */
export function getFarmTypeDisplayName(farmType, language = 'en') {
    const names = {
        en: {
            breeding: 'Breeding Farm (Sows & Piglets)',
            finishing: 'Finishing Farm (Fattening Pigs)',
            nursery: 'Nursery Farm (Weaned Piglets)',
            farrow_to_finish: 'Farrow-to-Finish (Complete Cycle)'
        },
        id: {
            breeding: 'Peternakan Induk (Induk & Anak Babi)',
            finishing: 'Peternakan Penggemukan',
            nursery: 'Peternakan Penyapihan',
            farrow_to_finish: 'Siklus Lengkap'
        },
        vt: {
            breeding: 'Trang trại giống (Lợn nái & con)',
            finishing: 'Trang trại thịt',
            nursery: 'Trang trại cai sữa',
            farrow_to_finish: 'Chu kỳ hoàn chỉnh'
        }
    };

    return names[language]?.[farmType] || names.en[farmType];
}

/**
 * Get farm type description
 * @param {string} farmType - Farm type code
 * @param {string} language - Language code
 * @returns {string} - Description
 */
export function getFarmTypeDescription(farmType, language = 'en') {
    const descriptions = {
        en: {
            breeding: 'Focus on breeding pigs and raising piglets',
            finishing: 'Focus on fattening pigs for slaughter',
            nursery: 'Focus on weaned piglets before finishing',
            farrow_to_finish: 'Complete production cycle from breeding to slaughter'
        },
        id: {
            breeding: 'Fokus pada pembiakan babi dan pembesaran anak babi',
            finishing: 'Fokus pada penggemukan babi untuk pemotongan',
            nursery: 'Fokus pada anak babi yang disapih sebelum penggemukan',
            farrow_to_finish: 'Siklus produksi lengkap dari pembiakan hingga pemotongan'
        },
        vt: {
            breeding: 'Tập trung vào nhân giống và nuôi heo con',
            finishing: 'Tập trung vào vỗ béo heo để giết mổ',
            nursery: 'Tập trung vào heo con cai sữa trước khi vỗ béo',
            farrow_to_finish: 'Chu kỳ sản xuất hoàn chỉnh từ nhân giống đến giết mổ'
        }
    };

    return descriptions[language]?.[farmType] || descriptions.en[farmType];
}

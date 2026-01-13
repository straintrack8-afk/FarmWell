import { AGE_GROUP_MAPPING } from './constants';

/**
 * Filter diseases by selected age group
 * @param {Array} diseases - Array of disease objects
 * @param {string} selectedAge - Selected age group ID
 * @returns {Array} Filtered diseases
 */
export function filterByAge(diseases, selectedAge) {
    if (!selectedAge || selectedAge === 'all') {
        return diseases;
    }

    const validAgeGroups = AGE_GROUP_MAPPING[selectedAge] || [];

    return diseases.filter(disease => {
        // Check if any of the disease's age groups match
        return disease.ageGroups.some(ageGroup => {
            // Direct match
            if (validAgeGroups.includes(ageGroup)) return true;
            // "All ages" matches everything
            if (ageGroup === 'All ages') return true;
            return false;
        });
    });
}

/**
 * Filter diseases by selected symptoms (must match ALL selected symptoms)
 * @param {Array} diseases - Array of disease objects
 * @param {Array} selectedSymptoms - Array of selected symptom strings
 * @returns {Array} Filtered diseases
 */
export function filterBySymptoms(diseases, selectedSymptoms) {
    if (!selectedSymptoms || selectedSymptoms.length === 0) {
        return diseases;
    }

    return diseases.filter(disease => {
        // Disease must have ALL selected symptoms
        return selectedSymptoms.every(symptom =>
            disease.symptoms.some(s =>
                s.toLowerCase().includes(symptom.toLowerCase()) ||
                symptom.toLowerCase().includes(s.toLowerCase())
            )
        );
    });
}

/**
 * Combined filter by both age and symptoms
 * @param {Array} diseases - Array of disease objects
 * @param {string} selectedAge - Selected age group ID
 * @param {Array} selectedSymptoms - Array of selected symptom strings
 * @returns {Array} Filtered and ranked diseases
 */
export function filterDiseases(diseases, selectedAge, selectedSymptoms) {
    let filtered = filterByAge(diseases, selectedAge);
    filtered = filterBySymptoms(filtered, selectedSymptoms);
    return rankByRelevance(filtered, selectedSymptoms);
}

/**
 * Count how many diseases match if a symptom is added to current selection
 * @param {string} symptom - Symptom to test
 * @param {Array} diseases - Array of disease objects already filtered by age
 * @param {Array} currentSymptoms - Currently selected symptoms
 * @returns {number} Count of matching diseases
 */
export function countMatchingDiseases(symptom, diseases, currentSymptoms) {
    // If symptom is already selected, count without it
    if (currentSymptoms.includes(symptom)) {
        return filterBySymptoms(diseases, currentSymptoms).length;
    }

    // Test with the new symptom added
    const testSymptoms = [...currentSymptoms, symptom];
    return filterBySymptoms(diseases, testSymptoms).length;
}

/**
 * Rank diseases by number of matching symptoms (most matches first)
 * @param {Array} diseases - Array of disease objects
 * @param {Array} selectedSymptoms - Array of selected symptom strings
 * @returns {Array} Sorted diseases
 */
export function rankByRelevance(diseases, selectedSymptoms) {
    if (!selectedSymptoms || selectedSymptoms.length === 0) {
        return diseases;
    }

    return [...diseases].sort((a, b) => {
        const matchesA = countSymptomMatches(a, selectedSymptoms);
        const matchesB = countSymptomMatches(b, selectedSymptoms);
        return matchesB - matchesA;
    });
}

/**
 * Count how many selected symptoms a disease matches
 * @param {Object} disease - Disease object
 * @param {Array} selectedSymptoms - Array of selected symptom strings
 * @returns {number} Number of matching symptoms
 */
export function countSymptomMatches(disease, selectedSymptoms) {
    return selectedSymptoms.filter(symptom =>
        disease.symptoms.some(s =>
            s.toLowerCase().includes(symptom.toLowerCase()) ||
            symptom.toLowerCase().includes(s.toLowerCase())
        )
    ).length;
}

/**
 * Get match percentage for a disease
 * @param {Object} disease - Disease object
 * @param {Array} selectedSymptoms - Array of selected symptom strings
 * @returns {number} Match percentage (0-100)
 */
export function getMatchPercentage(disease, selectedSymptoms) {
    if (!selectedSymptoms || selectedSymptoms.length === 0) return 0;
    const matches = countSymptomMatches(disease, selectedSymptoms);
    return Math.round((matches / selectedSymptoms.length) * 100);
}

/**
 * Group diseases by category
 * @param {Array} diseases - Array of disease objects
 * @returns {Object} Diseases grouped by category
 */
export function groupByCategory(diseases) {
    return diseases.reduce((groups, disease) => {
        const category = disease.category || 'Other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(disease);
        return groups;
    }, {});
}

/**
 * Search diseases by name or latin name
 * @param {Array} diseases - Array of disease objects
 * @param {string} query - Search query
 * @returns {Array} Matching diseases
 */
export function searchDiseases(diseases, query) {
    if (!query || query.trim() === '') {
        return diseases;
    }

    const lowerQuery = query.toLowerCase().trim();

    return diseases.filter(disease =>
        disease.name.toLowerCase().includes(lowerQuery) ||
        (disease.latinName && disease.latinName.toLowerCase().includes(lowerQuery))
    );
}

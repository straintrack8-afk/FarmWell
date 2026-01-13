import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const DiagnosisContext = createContext(null);

// Age groups for selection
export const AGE_GROUPS = [
    { id: 'newborn', name: 'Newborn (0-7 days)', icon: '🐽', description: 'Neonatal piglets' },
    { id: 'suckling', name: 'Suckling (0-3 weeks)', icon: '🍼', description: 'Pre-weaning phase' },
    { id: 'weaned', name: 'Weaned (3-8 weeks)', icon: '🐷', description: 'Post-weaning' },
    { id: 'growers', name: 'Growers (2-4 months)', icon: '📈', description: 'Growing phase' },
    { id: 'finishers', name: 'Finishers (4-6 months)', icon: '🏁', description: 'Near market weight' },
    { id: 'sows', name: 'Sows / Gilts', icon: '🐖', description: 'Breeding females' },
    { id: 'boars', name: 'Boars', icon: '🐗', description: 'Breeding males' },
    { id: 'all', name: 'All Ages', icon: '✨', description: 'Any age group' },
];

export function DiagnosisProvider({ children }) {
    const [diseases, setDiseases] = useState([]);
    const [symptoms, setSymptoms] = useState({ categories: [], totalSymptoms: 0 });
    const [selectedAge, setSelectedAge] = useState(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Load disease data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [diseasesRes, symptomsRes] = await Promise.all([
                    fetch('/data/swine/pig-diseases.json'),
                    fetch('/data/swine/symptoms.json')
                ]);

                const diseasesData = await diseasesRes.json();
                const symptomsData = await symptomsRes.json();

                setDiseases(diseasesData);
                setSymptoms(symptomsData);
            } catch (error) {
                console.error('Failed to load disease data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Online/offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Map age group ID to actual age group names used in data
    const getAgeGroupNames = (ageId) => {
        const mapping = {
            'newborn': ['Piglets: 0 to 7 days'],
            'suckling': ['Piglets: 7 to 21 days', 'Piglets: 21 to weaning'],
            'weaned': ['Weaners: 15 to 56 days'],
            'growers': ['Growers / finishers'],
            'finishers': ['Growers / finishers'],
            'sows': ['Sows / gilts / boars'],
            'boars': ['Sows / gilts / boars'],
            'all': ['All Ages'],
        };
        return mapping[ageId] || [];
    };

    // Filter diseases based on age and symptoms
    const filteredDiseases = useMemo(() => {
        if (!selectedAge) return [];

        const ageNames = getAgeGroupNames(selectedAge);

        return diseases.filter(disease => {
            // Age filter
            const ageMatch = selectedAge === 'all' ||
                disease.ageGroups.includes('All Ages') ||
                disease.ageGroups.some(ag => ageNames.includes(ag));

            if (!ageMatch) return false;

            // If no symptoms selected, show all age-matched diseases
            if (selectedSymptoms.length === 0) return true;

            // Symptom filter - must match ALL selected symptoms
            const symptomMatch = selectedSymptoms.every(selectedSymptom => {
                if (!selectedSymptom) return true;
                return disease.symptoms?.some(diseaseSymptom => {
                    if (!diseaseSymptom || typeof diseaseSymptom !== 'string') return false;
                    const dsLower = diseaseSymptom.toLowerCase();
                    const ssLower = selectedSymptom.toLowerCase();
                    return dsLower.includes(ssLower) || ssLower.includes(dsLower);
                });
            });

            return symptomMatch;
        }).map(disease => ({
            ...disease,
            matchCount: selectedSymptoms.filter(ss =>
                disease.symptoms?.some(ds => {
                    if (!ds || typeof ds !== 'string' || !ss) return false;
                    return ds.toLowerCase().includes(ss.toLowerCase()) ||
                        ss.toLowerCase().includes(ds.toLowerCase());
                })
            ).length
        })).sort((a, b) => b.matchCount - a.matchCount);
    }, [diseases, selectedAge, selectedSymptoms]);

    // Build symptom -> disease count map for current age
    // SMART FILTERING: Only show symptoms that will lead to at least 1 disease
    const symptomCounts = useMemo(() => {
        if (!selectedAge) return {};

        const ageNames = getAgeGroupNames(selectedAge);
        const counts = {};

        // Get age-filtered diseases
        const ageFilteredDiseases = diseases.filter(disease =>
            selectedAge === 'all' ||
            disease.ageGroups.includes('All Ages') ||
            disease.ageGroups.some(ag => ageNames.includes(ag))
        );

        // If no symptoms selected yet, count all symptoms
        if (selectedSymptoms.length === 0) {
            ageFilteredDiseases.forEach(disease => {
                disease.symptoms.forEach(symptom => {
                    const normalized = symptom.toLowerCase();
                    counts[normalized] = (counts[normalized] || 0) + 1;
                });
            });
        } else {
            // SMART FILTERING: Only count symptoms that would still result in diseases
            // when combined with already selected symptoms
            ageFilteredDiseases.forEach(disease => {
                // Check if disease matches all currently selected symptoms
                const matchesSelected = selectedSymptoms.every(selectedSymptom => {
                    return disease.symptoms.some(diseaseSymptom => {
                        const dsLower = diseaseSymptom.toLowerCase();
                        const ssLower = selectedSymptom.toLowerCase();
                        return dsLower.includes(ssLower) || ssLower.includes(dsLower);
                    });
                });

                // If disease matches selected symptoms, count its remaining symptoms
                if (matchesSelected) {
                    disease.symptoms?.forEach(symptom => {
                        if (!symptom || typeof symptom !== 'string') return;

                        // Don't count already selected symptoms
                        const isAlreadySelected = selectedSymptoms.some(ss =>
                            ss && (ss.toLowerCase() === symptom.toLowerCase() ||
                                symptom.toLowerCase().includes(ss.toLowerCase()) ||
                                ss.toLowerCase().includes(symptom.toLowerCase()))
                        );

                        if (!isAlreadySelected) {
                            const normalized = symptom.toLowerCase();
                            counts[normalized] = (counts[normalized] || 0) + 1;
                        }
                    });
                }
            });
        }

        return counts;
    }, [diseases, selectedAge, selectedSymptoms]);

    // Toggle symptom selection
    const toggleSymptom = (symptomLabel) => {
        setSelectedSymptoms(prev => {
            if (prev.includes(symptomLabel)) {
                return prev.filter(s => s !== symptomLabel);
            }
            return [...prev, symptomLabel];
        });
    };

    // Clear all selected symptoms
    const clearSymptoms = () => {
        setSelectedSymptoms([]);
    };

    // Reset entire diagnosis
    const resetDiagnosis = () => {
        setSelectedAge(null);
        setSelectedSymptoms([]);
    };

    const value = {
        diseases,
        symptoms,
        selectedAge,
        setSelectedAge,
        selectedSymptoms,
        toggleSymptom,
        clearSymptoms,
        filteredDiseases,
        symptomCounts,
        resetDiagnosis,
        loading,
        isOnline,
    };

    return (
        <DiagnosisContext.Provider value={value}>
            {children}
        </DiagnosisContext.Provider>
    );
}

export function useDiagnosis() {
    const context = useContext(DiagnosisContext);
    if (!context) {
        throw new Error('useDiagnosis must be used within a DiagnosisProvider');
    }
    return context;
}

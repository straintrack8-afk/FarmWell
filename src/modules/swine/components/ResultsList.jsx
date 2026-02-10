import React, { useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import { groupByCategory, getMatchPercentage, countSymptomMatches } from '../utils/filterDiseases';
import CategoryBadge from './common/CategoryBadge';
import Button from './common/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    ChevronRight,
    Search,
    AlertTriangle,
    ArrowLeft,
    RefreshCw
} from 'lucide-react';

export default function ResultsList() {
    const {
        filteredDiseases,
        selectedSymptoms,
        selectedAge,
        ageGroups,
        selectDisease,
        setStep,
        reset
    } = useDiagnosis();
    const { t } = useTranslation();

    // Get selected age label
    const selectedAgeLabel = useMemo(() => {
        const age = ageGroups.find(a => a.id === selectedAge);
        return age ? age.shortLabel || age.label : t('swine.diagnosis.symptoms.allAges');
    }, [selectedAge, ageGroups, t]);

    // Group diseases by category
    const groupedDiseases = useMemo(() => {
        return groupByCategory(filteredDiseases);
    }, [filteredDiseases]);

    // Category order for display
    const categoryOrder = ['Viral', 'Bacterial', 'Parasitic', 'Nutritional', 'Toxicosis', 'Other'];

    const handleDiseaseClick = (disease) => {
        selectDisease(disease);
    };

    // No results view
    if (filteredDiseases.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-amber-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {t('swine.diagnosis.results.noResults.title')}
                    </h2>

                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {t('swine.diagnosis.results.noResults.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            variant="secondary"
                            onClick={() => setStep(STEPS.SYMPTOMS)}
                            icon={ArrowLeft}
                        >
                            {t('swine.diagnosis.results.noResults.modifySymptoms')}
                        </Button>

                        <Button
                            onClick={reset}
                            icon={RefreshCw}
                        >
                            {t('swine.diagnosis.results.noResults.startNew')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Results header */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-green-900">
                            {filteredDiseases.length} {filteredDiseases.length !== 1 ? t('swine.diagnosis.results.header.possibleDiseasePlural') : t('swine.diagnosis.results.header.possibleDisease')}
                        </h2>
                        <p className="text-sm text-green-700">
                            {t('swine.diagnosis.results.header.basedOn')} {selectedSymptoms.length} {selectedSymptoms.length !== 1 ? t('swine.diagnosis.results.header.symptomPlural') : t('swine.diagnosis.results.header.symptom')} • {t('swine.diagnosis.results.header.age')}: {selectedAgeLabel}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setStep(STEPS.SYMPTOMS)}
                        icon={ArrowLeft}
                    >
                        {t('swine.diagnosis.results.header.modify')}
                    </Button>
                </div>
            </div>

            {/* Selected symptoms summary */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('swine.diagnosis.results.selectedSymptoms')}</h3>
                <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((symptom) => (
                        <span
                            key={symptom}
                            className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                            {symptom}
                        </span>
                    ))}
                </div>
            </div>

            {/* Results grouped by category */}
            <div className="space-y-6">
                {categoryOrder.map((category) => {
                    const diseases = groupedDiseases[category];
                    if (!diseases || diseases.length === 0) return null;

                    return (
                        <div key={category}>
                            {/* Category header */}
                            <div className="flex items-center gap-3 mb-3">
                                <CategoryBadge category={category} size="md" />
                                <span className="text-sm text-gray-500">
                                    {diseases.length} {diseases.length !== 1 ? t('swine.diagnosis.results.diseasePlural') : t('swine.diagnosis.results.disease')}
                                </span>
                            </div>

                            {/* Disease cards */}
                            <div className="space-y-3">
                                {diseases.map((disease) => {
                                    const matchCount = countSymptomMatches(disease, selectedSymptoms);
                                    const matchPercent = getMatchPercentage(disease, selectedSymptoms);

                                    return (
                                        <button
                                            key={disease.id}
                                            onClick={() => handleDiseaseClick(disease)}
                                            className="w-full bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-primary-300 transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Disease name */}
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                        {disease.name}
                                                    </h3>

                                                    {/* Latin name */}
                                                    {disease.latinName && (
                                                        <p className="text-sm text-gray-500 italic mb-2">
                                                            {disease.latinName}
                                                        </p>
                                                    )}

                                                    {/* Brief description */}
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {disease.description.substring(0, 150)}...
                                                    </p>

                                                    {/* Matched symptoms indicator */}
                                                    <div className="flex items-center gap-3 mt-3">
                                                        <div className="flex items-center gap-1">
                                                            <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full transition-all"
                                                                    style={{ width: `${matchPercent}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {matchCount}/{selectedSymptoms.length} {t('swine.diagnosis.results.matched')}
                                                            </span>
                                                        </div>

                                                        {disease.zoonotic && (
                                                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                                                                ⚠️ {t('swine.diagnosis.results.zoonotic')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 flex-shrink-0 transition-colors" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                    <strong>Note:</strong> {t('swine.diagnosis.results.disclaimer')}
                </p>
            </div>
        </div>
    );
}

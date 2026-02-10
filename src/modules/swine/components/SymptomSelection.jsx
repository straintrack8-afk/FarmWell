import React, { useState, useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import Button from './common/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Check,
    X,
    Search,
    AlertCircle
} from 'lucide-react';

export default function SymptomSelection() {
    const {
        setStep,
        symptomCategories,
        selectedSymptoms,
        toggleSymptom,
        clearSymptoms,
        filteredDiseases,
        getSymptomCount,
        selectedAge,
        ageGroups
    } = useDiagnosis();
    const { t } = useTranslation();

    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(symptomCategories)
    );

    // Get selected age label
    const selectedAgeLabel = useMemo(() => {
        const age = ageGroups.find(a => a.id === selectedAge);
        return age ? age.label : t('swine.diagnosis.symptoms.allAges');
    }, [selectedAge, ageGroups, t]);

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev =>
            prev.includes(categoryKey)
                ? prev.filter(k => k !== categoryKey)
                : [...prev, categoryKey]
        );
    };

    const handleShowResults = () => {
        setStep(STEPS.RESULTS);
    };

    // Category icons
    const categoryIcons = {
        mortality: '💀',
        fever: '🌡️',
        locomotion: '🦿',
        excretion: '💧',
        skin: '🔴',
        production: '🥚'
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header with disease count and controls */}
            <div className="sticky top-[57px] z-40 bg-gray-50 -mx-4 px-4 py-3 mb-4 border-b border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Disease count badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${filteredDiseases.length === 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-primary-100 text-primary-800'
                            }`}>
                            <span className="text-2xl font-bold">{filteredDiseases.length}</span>
                            <span className="text-sm">{filteredDiseases.length !== 1 ? t('swine.diagnosis.symptoms.possibleDiseasesPlural') : t('swine.diagnosis.symptoms.possibleDiseases')}</span>
                        </div>

                        {/* Selected age indicator */}
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                            <span>{t('swine.diagnosis.symptoms.age')}:</span>
                            <span className="font-medium text-gray-900">{selectedAgeLabel}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Selected symptoms count */}
                        {selectedSymptoms.length > 0 && (
                            <span className="text-sm text-gray-600">
                                {selectedSymptoms.length} {selectedSymptoms.length !== 1 ? t('swine.diagnosis.symptoms.symptomsSelectedPlural') : t('swine.diagnosis.symptoms.symptomsSelected')}
                            </span>
                        )}

                        {/* Clear button */}
                        {selectedSymptoms.length > 0 && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={clearSymptoms}
                                icon={X}
                            >
                                {t('swine.diagnosis.symptoms.clear')}
                            </Button>
                        )}

                        {/* Show results button */}
                        <Button
                            size="sm"
                            onClick={handleShowResults}
                            disabled={selectedSymptoms.length === 0}
                            icon={ChevronRight}
                            iconPosition="right"
                        >
                            {t('swine.diagnosis.symptoms.showResults')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        {t('swine.diagnosis.symptoms.instruction')}
                    </div>
                </div>
            </div>

            {/* Symptom categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {Object.entries(symptomCategories).map(([categoryKey, category]) => {
                    const isExpanded = expandedCategories.includes(categoryKey);
                    const icon = categoryIcons[categoryKey] || '📋';
                    const selectedInCategory = category.symptoms.filter(s =>
                        selectedSymptoms.includes(s)
                    ).length;

                    return (
                        <div
                            key={categoryKey}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            {/* Category header */}
                            <button
                                onClick={() => toggleCategory(categoryKey)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{icon}</span>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">
                                            {category.label}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {category.symptoms.length} {t('swine.diagnosis.symptoms.symptoms')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedInCategory > 0 && (
                                        <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                                            {selectedInCategory}
                                        </span>
                                    )}
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                            </button>

                            {/* Symptom list */}
                            {isExpanded && (
                                <div className="p-2 space-y-1">
                                    {category.symptoms.map((symptom) => {
                                        const isSelected = selectedSymptoms.includes(symptom);
                                        const count = getSymptomCount(symptom);

                                        // Hide symptoms with 0 matches unless they're selected
                                        if (count === 0 && !isSelected) {
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={symptom}
                                                onClick={() => toggleSymptom(symptom)}
                                                className={`
                          w-full flex items-center justify-between p-3 rounded-lg transition-all duration-150
                          ${isSelected
                                                        ? 'bg-primary-50 border border-primary-200'
                                                        : 'hover:bg-gray-50 border border-transparent'
                                                    }
                        `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Checkbox */}
                                                    <div className={`
                            w-5 h-5 rounded flex items-center justify-center border-2 transition-all
                            ${isSelected
                                                            ? 'bg-primary-500 border-primary-500'
                                                            : 'border-gray-300'
                                                        }
                          `}>
                                                        {isSelected && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>

                                                    {/* Symptom name */}
                                                    <span className={`text-sm ${isSelected ? 'text-primary-900 font-medium' : 'text-gray-700'}`}>
                                                        {symptom}
                                                    </span>
                                                </div>

                                                {/* Disease count */}
                                                <span className={`
                          min-w-[32px] h-6 px-2 rounded-full text-xs font-medium flex items-center justify-center
                          ${isSelected
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }
                        `}>
                                                    {count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom action bar (mobile) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden shadow-lg">
                <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${filteredDiseases.length === 0 ? 'text-amber-600' : 'text-primary-600'}`}>
                            {filteredDiseases.length}
                        </span>
                        <span className="text-sm text-gray-600">
                            {filteredDiseases.length !== 1 ? t('swine.diagnosis.symptoms.diseasePlural') : t('swine.diagnosis.symptoms.disease')}
                        </span>
                    </div>

                    <Button
                        onClick={handleShowResults}
                        disabled={selectedSymptoms.length === 0}
                        icon={ChevronRight}
                        iconPosition="right"
                    >
                        {t('swine.diagnosis.symptoms.showResults')}
                    </Button>
                </div>
            </div>

            {/* Spacer for mobile bottom bar */}
            <div className="h-20 lg:hidden" />
        </div>
    );
}

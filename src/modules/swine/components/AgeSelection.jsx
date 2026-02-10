import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import Button from './common/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChevronRight, Check } from 'lucide-react';

export default function AgeSelection() {
    const { setStep, setAge, selectedAge, ageGroups } = useDiagnosis();
    const { t } = useTranslation();

    const handleSelect = (ageId) => {
        setAge(ageId);
    };

    const handleContinue = () => {
        if (selectedAge) {
            setStep(STEPS.SYMPTOMS);
        }
    };

    // Icons for each age group
    const ageIcons = {
        'day-old': '🐣',
        'chicks': '🐤',
        'young-chicks': '🐥',
        'growers': '🐔',
        'layers': '🥚',
        'broilers': '🍗',
        'breeders': '🐓',
        'all': '✨'
    };

    // Descriptions for each age group
    const ageDescriptions = {
        'day-old': 'Newly hatched chicks within first 24 hours',
        'chicks': 'Young chicks in brooding period',
        'young-chicks': 'Chicks transitioning from brooder',
        'growers': 'Growing birds in development phase',
        'layers': 'Adult hens in egg production',
        'broilers': 'Meat birds raised for consumption',
        'breeders': 'Birds kept for reproduction',
        'all': 'Show diseases that affect all age groups'
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Instructions */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6">
                <p className="text-primary-800 text-sm">
                    {t('swine.diagnosis.age.instruction')}
                </p>
            </div>

            {/* Age group grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {ageGroups.map((age) => {
                    const isSelected = selectedAge === age.id;
                    const icon = ageIcons[age.id] || age.icon;
                    const description = ageDescriptions[age.id] || '';

                    return (
                        <button
                            key={age.id}
                            onClick={() => handleSelect(age.id)}
                            className={`
                relative p-5 rounded-xl border-2 text-left transition-all duration-200
                ${isSelected
                                    ? 'border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-500/20'
                                    : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'
                                }
              `}
                        >
                            {/* Selected indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* Icon */}
                            <div className="text-4xl mb-3">
                                {icon}
                            </div>

                            {/* Label */}
                            <h3 className={`font-semibold mb-1 ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                {age.shortLabel || age.label}
                            </h3>

                            {/* Description */}
                            <p className={`text-xs ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                                {description}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Continue button */}
            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleContinue}
                    disabled={!selectedAge}
                    icon={ChevronRight}
                    iconPosition="right"
                >
                    {t('swine.diagnosis.age.continue')}
                </Button>
            </div>
        </div>
    );
}

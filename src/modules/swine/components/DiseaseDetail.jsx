import React, { useState } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import CategoryBadge from './common/CategoryBadge';
import Button from './common/Button';
import { useTranslation } from '../../../hooks/useTranslation';
import {
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    RefreshCw,
    Printer,
    ExternalLink,
    AlertTriangle,
    Shield,
    Pill,
    Microscope,
    FileText,
    Activity
} from 'lucide-react';

export default function DiseaseDetail() {
    const { selectedDisease, goBack, reset } = useDiagnosis();
    const { t } = useTranslation();
    const [expandedSections, setExpandedSections] = useState(['symptoms', 'description']);

    if (!selectedDisease) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <p className="text-gray-600">{t('swine.diagnosis.detail.noDisease')}</p>
                <Button onClick={goBack} className="mt-4">
                    {t('swine.diagnosis.detail.goBack')}
                </Button>
            </div>
        );
    }

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const sections = [
        {
            id: 'description',
            title: t('swine.diagnosis.detail.sections.description'),
            icon: FileText,
            content: selectedDisease.description
        },
        {
            id: 'symptoms',
            title: t('swine.diagnosis.detail.sections.symptoms'),
            icon: Activity,
            content: selectedDisease.symptoms,
            isList: true
        },
        {
            id: 'diagnosis',
            title: t('swine.diagnosis.detail.sections.diagnosis'),
            icon: Microscope,
            content: selectedDisease.diagnosis
        },
        {
            id: 'control',
            title: t('swine.diagnosis.detail.sections.control'),
            icon: Shield,
            content: selectedDisease.controlPrevention
        },
        {
            id: 'treatment',
            title: t('swine.diagnosis.detail.sections.treatment'),
            icon: Pill,
            content: selectedDisease.treatment
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CategoryBadge category={selectedDisease.category} size="md" />

                            <h1 className="text-2xl sm:text-3xl font-bold mt-3 mb-2">
                                {selectedDisease.name}
                            </h1>

                            {selectedDisease.latinName && (
                                <p className="text-primary-100 italic text-lg">
                                    {selectedDisease.latinName}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick info bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-gray-100">
                    <div className="p-4 border-r border-b sm:border-b-0 border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mortality</p>
                        <p className="text-sm font-medium text-gray-900">{selectedDisease.mortality || 'Variable'}</p>
                    </div>

                    <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transmission</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {selectedDisease.transmission || 'Various routes'}
                        </p>
                    </div>

                    <div className="p-4 border-r border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Zoonotic Risk</p>
                        <p className={`text-sm font-medium ${selectedDisease.zoonotic ? 'text-amber-600' : 'text-green-600'}`}>
                            {selectedDisease.zoonotic ? '⚠️ Yes' : '✓ No'}
                        </p>
                    </div>

                    <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Age Groups</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {selectedDisease.ageGroups.join(', ')}
                        </p>
                    </div>
                </div>

                {/* Zoonotic warning */}
                {selectedDisease.zoonotic && (
                    <div className="bg-amber-50 border-t border-amber-100 px-6 py-4">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-800">Zoonotic Disease Warning</p>
                                <p className="text-sm text-amber-700">
                                    {selectedDisease.zoonoticNote || 'This disease can be transmitted to humans. Take appropriate precautions.'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Collapsible sections */}
            <div className="space-y-3">
                {sections.map((section) => {
                    const isExpanded = expandedSections.includes(section.id);
                    const Icon = section.icon;

                    if (!section.content || (Array.isArray(section.content) && section.content.length === 0)) {
                        return null;
                    }

                    return (
                        <div
                            key={section.id}
                            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <h2 className="font-semibold text-gray-900">{section.title}</h2>
                                </div>

                                {isExpanded ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </button>

                            {isExpanded && (
                                <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                                    <div className="pl-13">
                                        {section.isList ? (
                                            <ul className="space-y-2">
                                                {section.content.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 text-gray-700"
                                                    >
                                                        <span className="text-primary-500 mt-1">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                                {section.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Vaccine Recommendation Section */}
            {((selectedDisease.vaccines && selectedDisease.vaccines.length > 0) ||
                (selectedDisease.vaccineRecommendation && selectedDisease.vaccineRecommendation.length > 0)) && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 bg-green-100 border-b border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">💉</span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-green-900">Vaccine Recommendation</h2>
                                    <p className="text-sm text-green-700">Recommended vaccines for prevention</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            {/* New format with photos */}
                            {selectedDisease.vaccines && selectedDisease.vaccines.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedDisease.vaccines.map((vaccine, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-xl border border-green-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            {/* Vaccine Photo */}
                                            {vaccine.photo && (
                                                <div className="bg-gray-50 p-4 flex items-center justify-center border-b border-green-100">
                                                    <img
                                                        src={`/data/vaccines/${vaccine.photo}`}
                                                        alt={vaccine.name}
                                                        className="h-32 object-contain"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            {/* Vaccine Name */}
                                            <div className="p-4">
                                                <p className="text-sm font-medium text-green-800 text-center">
                                                    💉 {vaccine.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Legacy format (just names) */
                                <div className="flex flex-wrap gap-2">
                                    {selectedDisease.vaccineRecommendation.map((vaccine, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-green-300 text-green-800 rounded-lg text-sm font-medium shadow-sm"
                                        >
                                            💉 {vaccine}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                    variant="secondary"
                    onClick={goBack}
                    icon={ArrowLeft}
                    className="flex-1"
                >
                    Back to Results
                </Button>

                <Button
                    variant="secondary"
                    onClick={handlePrint}
                    icon={Printer}
                    className="flex-1"
                >
                    Print
                </Button>

                <Button
                    onClick={reset}
                    icon={RefreshCw}
                    className="flex-1"
                >
                    New Diagnosis
                </Button>
            </div>

            {/* Reference link */}
            {selectedDisease.url && (
                <div className="mt-6 text-center">
                    <a
                        href={selectedDisease.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
                    >
                        <ExternalLink className="w-4 h-4" />
                        <span>View more information</span>
                    </a>
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex flex-col items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Powered by</span>
                        <img
                            src="/images/Vaksindo_logo.png"
                            alt="Vaksindo logo"
                            className="h-12 w-auto opacity-80"
                        />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center max-w-2xl leading-relaxed">
                        <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace
                        professional veterinary advice. Always consult a qualified veterinarian for diagnosis and treatment.
                    </p>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import DiagnosisDisclaimer from './disease-diagnosis/DiagnosisDisclaimer';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Results' }
    ];

    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {steps.map(s => (
                    <div key={s.num} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                        <div style={{
                            width: 'clamp(28px, 8vw, 40px)',
                            height: 'clamp(28px, 8vw, 40px)',
                            borderRadius: '50%',
                            background: step >= s.num ? '#10b981' : '#e5e7eb',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: '0.35rem'
                        }}>
                            {s.num}
                        </div>
                        <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getCategoryClass(category) {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('bacterial')) return 'badge-bacterial';
    if (lower.includes('viral')) return 'badge-viral';
    if (lower.includes('parasitic')) return 'badge-parasitic' || 'badge-other';
    if (lower.includes('nutritional')) return 'badge-nutritional';
    if (lower.includes('toxicosis')) return 'badge-toxicosis';
    if (lower.includes('fungal')) return 'badge-bacterial'; // Fallback for fungal
    return 'badge-other';
}

function DiseaseCard({ disease, onClick }) {
    // Poultry data uses "mortality" string instead of "mortalityLevel"
    // We'll extract a hint from the string if possible, or just show the string
    const mortalityText = disease.mortality || 'Unknown';
    const isHigh = mortalityText.toLowerCase().includes('high') || mortalityText.toLowerCase().includes('90');

    return (
        <div className="disease-card" onClick={onClick}>
            <div className="disease-card-header">
                <div>
                    <div className="disease-name">{disease.name}</div>
                    {disease.latinName && (
                        <div className="disease-latin">{disease.latinName}</div>
                    )}
                </div>
                {disease.zoonotic && (
                    <span className="badge badge-zoonotic" title="Can spread to humans">
                        Zoonotic
                    </span>
                )}
            </div>

            <div className="disease-meta">
                <span className={`badge ${getCategoryClass(disease.category)}`}>
                    {disease.category || 'Other'}
                </span>
                <div className={`mortality-indicator ${isHigh ? 'mortality-high' : 'mortality-moderate'}`}>
                    <span className="mortality-dot"></span>
                    {mortalityText}
                </div>
            </div>

            {disease.description && (
                <p className="disease-description">{disease.description}</p>
            )}

            {disease.matchCount > 0 && (
                <div className="match-indicator" style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Matches {disease.matchCount} symptom(s)
                </div>
            )}
        </div>
    );
}

function ResultsList() {
    const {
        filteredDiseases,
        selectedSymptoms,
        selectedAge,
        ageGroups,
        setStep,
        selectDisease,
        reset
    } = useDiagnosis();

    const selectedAgeGroup = ageGroups.find(a => a.id === selectedAge);

    const handleDiseaseClick = (disease) => {
        selectDisease(disease);
        setStep(STEPS.DETAIL);
    };

    const handleNewDiagnosis = () => {
        reset();
        setStep(STEPS.LANDING);
    };

    const handleRefineSymptoms = () => {
        setStep(STEPS.SYMPTOMS);
    };

    return (
        <div>
            <div className="container">
                <div style={{ paddingTop: '2rem' }}>
                    <ProgressBar step={3} />
                </div>

                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">
                        {filteredDiseases.length} Possible Disease{filteredDiseases.length !== 1 ? 's' : ''}
                    </h1>
                    <p className="page-subtitle">
                        Based on observation in bird health
                    </p>
                </div>

                {/* Selection Summary */}
                <div style={{
                    maxWidth: '700px',
                    margin: '0 auto 1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <strong>Age Group:</strong> {selectedAgeGroup?.name || selectedAgeGroup?.label || 'All'}
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <strong>Symptoms ({selectedSymptoms.length}):</strong>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedSymptoms.map(symptom => (
                            <span
                                key={symptom}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8125rem'
                                }}
                            >
                                {symptom}
                            </span>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={handleRefineSymptoms}
                            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                            Refine Symptoms
                        </button>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={handleNewDiagnosis}
                            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                            New Diagnosis
                        </button>
                    </div>
                </div>

                {/* Disease List */}
                <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '2rem' }}>
                    {filteredDiseases.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                            <h3 className="empty-state-title">No Diseases Found</h3>
                            <p className="empty-state-text">
                                No diseases match all your selected symptoms. Try removing some symptoms.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handleRefineSymptoms}
                            >
                                Refine Symptoms
                            </button>
                        </div>
                    ) : (
                        <>
                            {filteredDiseases.map(disease => (
                                <DiseaseCard
                                    key={disease.id}
                                    disease={disease}
                                    onClick={() => handleDiseaseClick(disease)}
                                />
                            ))}

                            {/* Diagnosis Result Disclaimer */}
                            <DiagnosisDisclaimer
                                language="en"
                                diseaseIndicated={filteredDiseases[0]?.name || 'Multiple conditions'}
                            />
                        </>
                    )}
                </div>

                {/* Powered by Vaksindo removed as it is in App.jsx */}
            </div>
        </div>
    );
}

export default ResultsList;

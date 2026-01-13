import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Results' }
    ];

    return (
        <div className="progress-steps">
            {steps.map(s => (
                <div
                    key={s.num}
                    className={`progress-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
                >
                    <div className="step-number">
                        {step > s.num ? '✓' : s.num}
                    </div>
                    <span>{s.label}</span>
                </div>
            ))}
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
                        ⚠️ Zoonotic
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
                    ✓ Matches {disease.matchCount} symptom(s)
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
            <ProgressBar step={3} />

            <div className="container">
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
                        <button className="btn btn-secondary btn-sm" onClick={handleRefineSymptoms}>
                            ← Refine Symptoms
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={handleNewDiagnosis}>
                            🔄 New Diagnosis
                        </button>
                    </div>
                </div>

                {/* Disease List */}
                <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '2rem' }}>
                    {filteredDiseases.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: '3rem' }}>🔍</div>
                            <h3 className="empty-state-title">No Diseases Found</h3>
                            <p className="empty-state-text">
                                No diseases match all your selected symptoms. Try removing some symptoms.
                            </p>
                            <button className="btn btn-primary" onClick={handleRefineSymptoms}>
                                Refine Symptoms
                            </button>
                        </div>
                    ) : (
                        filteredDiseases.map(disease => (
                            <DiseaseCard
                                key={disease.id}
                                disease={disease}
                                onClick={() => handleDiseaseClick(disease)}
                            />
                        ))
                    )}
                </div>

                {/* Powered by Vaksindo */}
                <div className="footer-branding" style={{ marginTop: '1rem', paddingBottom: '2rem' }}>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                        Powered By
                    </p>
                    <div className="flex justify-center items-center">
                        <img
                            src="/images/Vaksindo_logo.png"
                            alt="Vaksindo"
                            className="vaksindo-logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsList;

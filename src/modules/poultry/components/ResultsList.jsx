import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import DiagnosisDisclaimer from './DiagnosisDisclaimer';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Body Part & Symptoms' },
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

function DiseaseCard({ disease, onClick, rank }) {
    const mortalityText = disease.mortality || 'Unknown';
    const isHigh = mortalityText.toLowerCase().includes('high') || mortalityText.toLowerCase().includes('90');
    const percentage = disease.percentage || 0;
    
    // Determine confidence level
    const getConfidenceLevel = (pct) => {
        if (pct >= 75) return 'high';
        if (pct >= 50) return 'medium';
        if (pct >= 25) return 'low';
        return 'unlikely';
    };
    
    const confidenceLevel = getConfidenceLevel(percentage);

    return (
        <div className="disease-card" onClick={onClick} style={{ marginBottom: '1rem', cursor: 'pointer' }}>
            {/* Header with Rank */}
            <div className="disease-card-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                {/* Rank Badge */}
                {rank && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        flexShrink: 0
                    }}>
                        #{rank}
                    </div>
                )}
                
                <div style={{ flex: 1 }}>
                    <div className="disease-name" style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {disease.name}
                    </div>
                    {disease.latinName && (
                        <div className="disease-latin" style={{ fontSize: '0.875rem', color: '#6B7280', fontStyle: 'italic' }}>
                            {disease.latinName}
                        </div>
                    )}
                </div>
            </div>

            {/* Confidence Bar */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1, height: '24px', background: '#F1F5F9', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${percentage}%`,
                            background: confidenceLevel === 'high' ? 'linear-gradient(90deg, #10B981, #059669)' :
                                       confidenceLevel === 'medium' ? 'linear-gradient(90deg, #F59E0B, #D97706)' :
                                       confidenceLevel === 'low' ? 'linear-gradient(90deg, #3B82F6, #2563EB)' :
                                       'linear-gradient(90deg, #9CA3AF, #6B7280)',
                            borderRadius: '12px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '1.125rem', color: '#1E293B', minWidth: '60px', textAlign: 'right' }}>
                        {percentage.toFixed(1)}%
                    </span>
                </div>
                
                {/* Confidence Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        background: confidenceLevel === 'high' ? '#D1FAE5' :
                                   confidenceLevel === 'medium' ? '#FEF3C7' :
                                   confidenceLevel === 'low' ? '#DBEAFE' : '#F3F4F6',
                        color: confidenceLevel === 'high' ? '#065F46' :
                              confidenceLevel === 'medium' ? '#92400E' :
                              confidenceLevel === 'low' ? '#1E40AF' : '#4B5563'
                    }}>
                        {confidenceLevel.toUpperCase()} CONFIDENCE
                    </span>
                    
                    {disease.zoonotic && (
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: '#FEE2E2',
                            color: '#991B1B'
                        }}>
                            ZOONOTIC
                        </span>
                    )}
                </div>
            </div>

            {/* Match Info */}
            {disease.matchCount > 0 && (
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                    <strong>{t('common.matched')}:</strong> {disease.matchCount}/{disease.totalSymptoms} {t('common.symptoms').toLowerCase()}
                </div>
            )}

            {/* Category and Mortality */}
            <div className="disease-meta" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span className={`badge ${getCategoryClass(disease.category)}`}>
                    {disease.category || 'Other'}
                </span>
                <div className={`mortality-indicator ${isHigh ? 'mortality-high' : 'mortality-moderate'}`}>
                    <span className="mortality-dot"></span>
                    {mortalityText} Mortality
                </div>
            </div>

            {/* Description */}
            {disease.description && (
                <p className="disease-description" style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {disease.description}
                </p>
            )}
            
            {/* View Details Button */}
            <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: '600' }}>
                    View Details ▼
                </span>
            </div>
        </div>
    );
}

function ResultsList() {
    const {
        results,  // ⭐ Use results instead of filteredDiseases
        selectedSymptoms,
        selectedAge,
        ageGroups,
        setStep,
        viewDiseaseDetail,
        reset
    } = useDiagnosis();

    const selectedAgeGroup = ageGroups.find(a => a.id === selectedAge);

    const handleDiseaseClick = (disease) => {
        viewDiseaseDetail(disease);
    };

    const handleNewDiagnosis = () => {
        reset();
        setStep(STEPS.LANDING);
    };

    const handleRefineSymptoms = () => {
        setStep(STEPS.BODY_PART);
    };

    return (
        <div>
            <div className="container">
                <div style={{ paddingTop: '2rem' }}>
                    <ProgressBar step={3} />
                </div>

                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">
                        {results.length} {results.length !== 1 ? t('common.possibleDiseasePlural') : t('common.possibleDisease')}
                    </h1>
                    <p className="page-subtitle">
                        {t('common.basedOnObservation')}
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
                        <strong>{t('common.ageGroup')}:</strong> {selectedAgeGroup?.name || selectedAgeGroup?.label || 'All'}
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <strong>{t('common.symptoms')} ({selectedSymptoms.length}):</strong>
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
                            {t('common.refineSymptoms')}
                        </button>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={handleNewDiagnosis}
                            style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        >
                            {t('common.newDiagnosis')}
                        </button>
                    </div>
                </div>

                {/* Disease List */}
                <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '2rem' }}>
                    {results.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                            <h3 className="empty-state-title">{t('common.noDiseasesFound')}</h3>
                            <p className="empty-state-text">
                                {t('common.noDiseasesMatch')}
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handleRefineSymptoms}
                            >
                                {t('common.refineSymptoms')}
                            </button>
                        </div>
                    ) : (
                        <>
                            {results.map((disease, index) => (
                                <DiseaseCard
                                    key={disease.id}
                                    disease={disease}
                                    rank={index + 1}
                                    onClick={() => handleDiseaseClick(disease)}
                                />
                            ))}

                            {/* Diagnosis Result Disclaimer */}
                            <DiagnosisDisclaimer />
                        </>
                    )}
                </div>

                {/* Powered by Vaksindo removed as it is in App.jsx */}
            </div>
        </div>
    );
}

export default ResultsList;

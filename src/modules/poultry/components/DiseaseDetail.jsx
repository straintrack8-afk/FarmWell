import React, { useEffect } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import { getFieldValue, getUILabels, getSeverityColor, getCategoryClass } from '../utils/diseaseFieldMapping';

// Print-specific styles
const printStyles = `
@media print {
  /* Hide navigation and buttons */
  .fw-page > *:not(.portal-layout),
  .action-buttons,
  button,
  .btn {
    display: none !important;
  }
  
  /* Reset page margins */
  @page {
    margin: 1cm;
    size: A4;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  /* Container adjustments */
  .container {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .card {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    page-break-inside: avoid;
  }
  
  /* Optimize spacing */
  h1 {
    font-size: 1.5rem !important;
    margin-bottom: 0.5rem !important;
    page-break-after: avoid;
  }
  
  h3 {
    font-size: 1.1rem !important;
    margin-top: 1rem !important;
    margin-bottom: 0.5rem !important;
    page-break-after: avoid;
  }
  
  h4 {
    font-size: 0.9rem !important;
    margin-bottom: 0.5rem !important;
    page-break-after: avoid;
  }
  
  /* Prevent orphans and widows */
  p, li {
    orphans: 3;
    widows: 3;
  }
  
  /* Section breaks */
  hr {
    margin: 0.75rem 0 !important;
    page-break-after: avoid;
  }
  
  /* Keep sections together */
  .zoonotic-warning,
  .confidence-box {
    page-break-inside: avoid;
    margin-bottom: 0.75rem !important;
  }
  
  /* Symptom grids */
  div[style*="grid"] {
    display: block !important;
  }
  
  div[style*="grid"] > div {
    display: inline-block;
    width: 48%;
    margin-right: 2%;
    margin-bottom: 0.5rem;
    page-break-inside: avoid;
    vertical-align: top;
  }
  
  /* Lists */
  ul {
    margin: 0.5rem 0 !important;
    padding-left: 1.2rem !important;
  }
  
  li {
    margin-bottom: 0.25rem !important;
    line-height: 1.4 !important;
  }
  
  /* Badges and tags */
  .badge, span[style*="padding"] {
    padding: 0.15rem 0.4rem !important;
    font-size: 0.7rem !important;
  }
  
  /* Remove unnecessary spacing */
  div[style*="paddingBottom"] {
    padding-bottom: 0 !important;
  }
  
  /* Compact content sections */
  div[style*="marginBottom: '2rem'"] {
    margin-bottom: 1rem !important;
  }
  
  div[style*="marginBottom: '1.5rem'"] {
    margin-bottom: 0.75rem !important;
  }
}
`;

const textToBullets = (text) => {
    if (!text) return [];
    let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');
    return cleaned
        .split(/\n|;\s*|\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.endsWith('.') ? s : s + '.');
};

function DiseaseDetail() {
    const {
        selectedDisease: disease,
        selectedSymptoms,
        setStep,
        reset
    } = useDiagnosis();

    // Get current language (default to 'en' for now, can be from context later)
    const language = 'en'; // TODO: Get from LanguageContext
    const labels = getUILabels(language);

    if (!disease) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                    <h3 className="empty-state-title">Disease Not Found</h3>
                    <p className="empty-state-text">
                        Please start a new diagnosis to view disease details.
                    </p>
                    <button className="btn btn-primary" onClick={() => setStep(STEPS.AGE)}>
                        {labels.newDiagnosis}
                    </button>
                </div>
            </div>
        );
    }

    const handleNewDiagnosis = () => {
        reset();
        setStep(STEPS.SYMPTOMS);
    };

    const handleBackToSymptoms = () => {
        setStep(STEPS.SYMPTOMS);
    };

    // Inject print styles
    useEffect(() => {
        const styleId = 'disease-detail-print-styles';
        let styleEl = document.getElementById(styleId);
        
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            styleEl.textContent = printStyles;
            document.head.appendChild(styleEl);
        }
        
        return () => {
            // Cleanup on unmount
            const el = document.getElementById(styleId);
            if (el) el.remove();
        };
    }, []);

    // Get all symptoms from disease
    const allSymptoms = disease.symptomsEnhanced 
        ? disease.symptomsEnhanced.map(s => typeof s === 'string' ? s : s.name)
        : disease.symptoms || [];
    
    // Identify matched symptoms
    const matchedSymptoms = allSymptoms.filter(s => selectedSymptoms.includes(s));
    const unmatchedSymptoms = allSymptoms.filter(s => !selectedSymptoms.includes(s));

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            {/* Main Content Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Disease Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {disease.name}
                    </h1>
                    {disease.latinName && (
                        <p style={{
                            fontStyle: 'italic',
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}>
                            {disease.latinName}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span className={`badge ${getCategoryClass(disease.category)}`}>
                            {disease.category || 'Other'}
                        </span>

                        {disease.severity && (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: disease.severity === 'High' ? '#FEE2E2' : disease.severity === 'Medium' ? '#FEF3C7' : '#DBEAFE',
                                color: disease.severity === 'High' ? '#991B1B' : disease.severity === 'Medium' ? '#92400E' : '#1E40AF',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {disease.severity} Severity
                            </span>
                        )}

                        {disease.zoonotic && (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: '#FEF3C7',
                                color: '#92400E',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                ⚠️ Zoonotic
                            </span>
                        )}

                        {disease.ageGroups?.map(ag => (
                            <span
                                key={ag}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                {ag}
                            </span>
                        ))}
                    </div>

                    {/* Confidence Display */}
                    {disease.percentage !== undefined && (
                        <div style={{ 
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#F0FDF4',
                            borderRadius: '8px',
                            border: '2px solid #10B981'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                                    Confidence Match
                                </span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#059669' }}>
                                    {disease.percentage.toFixed(1)}%
                                </span>
                            </div>
                            <div style={{ 
                                width: '100%',
                                height: '8px',
                                background: '#D1FAE5',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${Math.min(disease.percentage, 100)}%`,
                                    height: '100%',
                                    background: disease.percentage >= 70 ? '#10B981' : disease.percentage >= 40 ? '#F59E0B' : '#EF4444',
                                    transition: 'width 0.3s'
                                }} />
                            </div>
                            {disease.matchCount !== undefined && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#059669' }}>
                                    {disease.matchCount} of {allSymptoms.length} symptoms matched
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Zoonotic Warning */}
                {disease.zoonotic && (
                    <div style={{ 
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: '#FEF3C7',
                        border: '2px solid #F59E0B',
                        borderRadius: '8px',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', color: '#92400E', marginBottom: '0.5rem' }}>
                                {labels.zoonoticHazard}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#92400E', lineHeight: '1.6' }}>
                                {labels.zoonoticWarning}
                            </div>
                        </div>
                    </div>
                )}

                {/* Single Scroll Content */}
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
                    {/* Description - ENRICHED */}
                    {getFieldValue(disease, 'description', language) && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📝 {labels.description}
                            </h3>
                            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {getFieldValue(disease, 'description', language)}
                            </p>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Clinical Signs */}
                    {allSymptoms.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🩺 {labels.clinicalSigns}
                            </h3>
                            
                            {/* Matched Symptoms */}
                            {matchedSymptoms.length > 0 && (
                                <>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', marginBottom: '0.75rem' }}>
                                        ✓ {labels.matchedSymptoms} ({matchedSymptoms.length})
                                    </h4>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '0.75rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {matchedSymptoms.map((symptom, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: '#F0FDF4',
                                                    border: '2px solid #10B981',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '1.125rem' }}>✓</span>
                                                <span style={{ color: '#059669', fontWeight: '500' }}>{symptom}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {/* Other Symptoms */}
                            {unmatchedSymptoms.length > 0 && (
                                <>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.75rem' }}>
                                        {labels.otherSymptoms} ({unmatchedSymptoms.length})
                                    </h4>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '0.75rem'
                                    }}>
                                        {unmatchedSymptoms.map((symptom, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    padding: '0.75rem 1rem',
                                                    background: '#F9FAFB',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span style={{ color: '#9CA3AF', fontWeight: 'bold' }}>•</span>
                                                <span style={{ color: '#6B7280' }}>{symptom}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Transmission - ENRICHED */}
                    {(() => {
                        const transmissionData = getFieldValue(disease, 'transmission', language);
                        if (!transmissionData) return null;
                        const items = Array.isArray(transmissionData) ? transmissionData : textToBullets(transmissionData);
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🦠 {labels.transmission}
                                    </h3>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                        {items.map((item, i) => (
                                            <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        );
                    })()}

                    {/* Diagnosis - ENRICHED */}
                    {(() => {
                        const diagnosisData = getFieldValue(disease, 'diagnosis', language);
                        if (!diagnosisData) return null;
                        const items = Array.isArray(diagnosisData) ? diagnosisData : textToBullets(diagnosisData);
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🔬 {labels.diagnosis}
                                    </h3>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                        {items.map((item, i) => (
                                            <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        );
                    })()}

                    {/* Treatment - ENRICHED */}
                    {(() => {
                        const treatmentData = getFieldValue(disease, 'treatment', language);
                        if (!treatmentData) return null;
                        const items = Array.isArray(treatmentData) ? treatmentData : textToBullets(treatmentData);
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        💊 {labels.treatment}
                                    </h3>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                        {items.map((item, i) => (
                                            <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        );
                    })()}

                    {/* Control & Prevention - ENRICHED */}
                    {(() => {
                        const controlData = getFieldValue(disease, 'control', language);
                        if (!controlData) return null;
                        const items = Array.isArray(controlData) ? controlData : textToBullets(controlData);
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        🛡️ {labels.control}
                                    </h3>
                                    <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                        {items.map((item, i) => (
                                            <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        );
                    })()}

                    {/* Vaccine Recommendations - ENRICHED (Empty State for Now) */}
                    {(() => {
                        const vaccineData = getFieldValue(disease, 'vaccineRecommendations', language);
                        const hasVaccines = vaccineData && vaccineData.length > 0;
                        
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        💉 {labels.vaccineRecommendations}
                                    </h3>
                                    
                                    {!hasVaccines ? (
                                        <div style={{
                                            padding: '1.5rem',
                                            background: '#EFF6FF',
                                            border: '1px solid #BFDBFE',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💉</div>
                                                <div>
                                                    <p style={{ 
                                                        margin: 0,
                                                        color: '#1E40AF',
                                                        fontSize: '0.875rem',
                                                        lineHeight: '1.6'
                                                    }}>
                                                        {labels.vaccineComingSoon}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {vaccineData.map((vac, idx) => (
                                                <div key={idx} style={{
                                                    padding: '1rem',
                                                    background: '#EFF6FF',
                                                    border: '1px solid #BFDBFE',
                                                    borderRadius: '8px'
                                                }}>
                                                    <h4 style={{ margin: '0 0 0.5rem', color: '#1E40AF', fontWeight: '600' }}>
                                                        {vac.name}
                                                    </h4>
                                                    {vac.type && (
                                                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#3B82F6' }}>
                                                            {vac.type}
                                                        </p>
                                                    )}
                                                    {vac.schedule && (
                                                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#60A5FA', lineHeight: '1.5' }}>
                                                            {vac.schedule}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        );
                    })()}

                    {/* Old Vaccines Section - Remove */}
                    {false && disease.vaccines?.length > 0 && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Vaccine Recommendations
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {disease.vaccines.map((vac, idx) => (
                                        <div key={idx} style={{
                                            padding: '1rem',
                                            background: '#E0ECFF',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--primary-light)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem'
                                        }}>
                                            {/* Assumes images are in public/images/ */}
                                            {vac.photo && (
                                                <div style={{ width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                                    <img
                                                        src={`/images/${vac.photo}`}
                                                        alt={vac.name}
                                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                                                    {vac.name}
                                                </h4>
                                                {vac.details && (
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                                        {vac.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons - 2x2 Grid */}
            <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {/* Row 1: Back to Results + New Diagnosis */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        style={{ 
                            flex: 1, 
                            minWidth: 0,
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={handleBackToSymptoms}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#059669';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#10B981';
                        }}
                    >
                        {labels.backToResults}
                    </button>
                    <button
                        style={{ 
                            flex: 1, 
                            minWidth: 0,
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={handleNewDiagnosis}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#059669';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#10B981';
                        }}
                    >
                        {labels.newDiagnosis}
                    </button>
                </div>
                {/* Row 2: All Diseases + Print */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        style={{ 
                            flex: 1, 
                            minWidth: 0,
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setStep(STEPS.ALL_DISEASES)}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#059669';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#10B981';
                        }}
                    >
                        All Poultry Diseases & Conditions
                    </button>
                    <button
                        style={{ 
                            flex: 1, 
                            minWidth: 0,
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => window.print()}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#059669';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#10B981';
                        }}
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiseaseDetail;

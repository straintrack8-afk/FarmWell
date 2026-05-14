import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { STEPS } from '../utils/constants';
import { getFieldValue, getUILabels, getSeverityColor, getCategoryClass } from '../utils/diseaseFieldMapping';
import { useTranslation } from 'react-i18next';
import PoultryTopNav from './common/PoultryTopNav';

// Print-specific styles
const printStyles = `
@media print {
  /* Hide navigation, header, bottom nav, buttons */
  .fw-mod-top,
  .fw-mod-steps,
  .fw-mod-bnav,
  .fw-disease-filter-bar,
  [role="alert"],
  .action-buttons,
  button {
    display: none !important;
  }

  /* Show all content */
  .fw-module-page,
  .fw-mod-card,
  .fw-mod-content,
  .container,
  .card {
    display: block !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
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
    const navigate = useNavigate();
    const {
        selectedDisease: disease,
        selectedSymptoms,
        setStep,
        reset
    } = useDiagnosis();

    // Get current language from LanguageContext
    const { language } = useLanguage();
    const { t } = useTranslation();
    const labels = getUILabels(language);

    // Helper function to get field value with language-specific field names
    const getField = (fieldKey) => getFieldValue(disease, fieldKey, language);

    if (!disease) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                    <h3 className="empty-state-title">{t('common.diseaseNotFound')}</h3>
                    <p className="empty-state-text">
                        {t('common.startNewDiagnosis')}
                    </p>
                    <button className="btn btn-primary" onClick={() => setStep(STEPS.AGE)}>
                        {labels.newDiagnosis}
                    </button>
                </div>
            </div>
        );
    }

    const handleNewDiagnosis = () => {
        reset();  // Clear all selections
        setStep(STEPS.AGE);  // Start from age selection
        navigate('/poultry/diagnostic/age');  // Navigate to age page
    };

    const handleBackToSymptoms = () => {
        setStep(STEPS.SYMPTOMS);
        navigate('/poultry/diagnostic/symptoms');
    };

    const handlePrint = () => {
        const contentEl = document.querySelector('.container');
        if (!contentEl) {
            window.print();
            return;
        }

        const printWindow = window.open('', '_blank', 'width=800,height=600');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${disease.name || 'Disease Detail'} - FarmWell</title>
                <meta charset="UTF-8">
                <style>
                    body {
                        font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
                        padding: 2cm;
                        color: #1a2e1a;
                        font-size: 12pt;
                        line-height: 1.6;
                    }
                    h1 { font-size: 20pt; margin-bottom: 8px; }
                    h3 { font-size: 13pt; margin-top: 20px; margin-bottom: 8px; color: #1E7A42; border-bottom: 1px solid #C8E8D4; padding-bottom: 4px; }
                    h4 { font-size: 11pt; margin-top: 12px; margin-bottom: 6px; }
                    p { margin: 6px 0; }
                    ul { margin: 6px 0; padding-left: 20px; }
                    li { margin-bottom: 4px; }
                    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9pt; font-weight: 600; margin-right: 4px; background: #e8e8e8; }
                    .card { border: 1px solid #C8E8D4; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
                    .matched { background: #F4FBF7; border: 1px solid #2EAA5E; border-radius: 6px; padding: 6px 10px; margin: 4px 0; color: #1E7A42; font-weight: 600; }
                    .unmatched { background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 6px; padding: 6px 10px; margin: 4px 0; }
                    hr { border: none; border-top: 1px solid #C8E8D4; margin: 16px 0; }
                    .no-print { display: none !important; }
                    @page { margin: 2cm; size: A4; }
                </style>
            </head>
            <body>
                ${contentEl.innerHTML}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
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

    // Get all symptoms from disease - handle both English and Indonesian field names
    const symptomsArray = disease.symptomsEnhanced || disease.gejala_lengkap || disease.symptoms || [];
    const allSymptoms = symptomsArray.map(s => {
        if (typeof s === 'string') return s;
        // Handle both 'name' (EN/VN) and 'nama' (ID)
        return s.name || s.nama || '';
    }).filter(s => s.length > 0);
    
    // Identify matched symptoms
    const matchedSymptoms = allSymptoms.filter(s => selectedSymptoms.includes(s));
    const unmatchedSymptoms = allSymptoms.filter(s => !selectedSymptoms.includes(s));

    return (
        <>
            <PoultryTopNav title="Disease Detail" />
            <div className="container" style={{ paddingBottom: '2rem' }}>
            {/* Main Content Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Disease Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {disease.name || disease.nama || disease.ten_benh}
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
                                background: disease.severity === 'High' ? '#FEE2E2' : disease.severity === 'Medium' ? '#FFF7ED' : '#F0FDF4',
                                color: disease.severity === 'High' ? '#991B1B' : disease.severity === 'Medium' ? '#C2410C' : '#166534',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {disease.severity === 'High' ? labels.severityHigh : disease.severity === 'Medium' ? labels.severityMedium : labels.severityLow}
                            </span>
                        )}

                        {disease.zoonotic && (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: '#DDF2E8',
                                color: '#1E7A42',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <svg style={{ width: 11, height: 11 }} viewBox="0 0 24 24" fill="none" stroke="#1E7A42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                {labels.zoonoticBadge}
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
                            border: '1.5px solid #2EAA5E'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669' }}>
                                    {labels.confidenceMatch}
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
                                    background: disease.percentage >= 70 ? '#2EAA5E' : disease.percentage >= 40 ? '#E08000' : '#dc2626',
                                    transition: 'width 0.3s'
                                }} />
                            </div>
                            {disease.matchCount !== undefined && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#059669' }}>
                                    {disease.matchCount} {labels.symptomsMatched.includes('of') ? 'of' : labels.symptomsMatched.includes('dari') ? 'dari' : 'trong'} {allSymptoms.length} {labels.symptomsMatched}
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
                        background: '#F4FBF7',
                        border: '1.5px solid #C8E8D4',
                        borderRadius: '12px',
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <svg style={{ flexShrink: 0, width: 22, height: 22, marginTop: 2 }} viewBox="0 0 24 24" fill="none" stroke="#1E7A42" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700', color: '#1E7A42', marginBottom: '0.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                                {labels.zoonoticHazard}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#1E5C3A', lineHeight: '1.6' }}>
                                {labels.zoonoticWarning}
                            </div>
                        </div>
                    </div>
                )}

                {/* Single Scroll Content */}
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
                    {/* Description - ENRICHED */}
                    {getField('description') && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                                {labels.description}
                            </h3>
                            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {getField('description')}
                            </p>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Clinical Signs */}
                    {allSymptoms.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                {labels.clinicalSigns}
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
                                                    border: '1.5px solid #2EAA5E',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <span style={{ color: '#2EAA5E', fontWeight: 'bold', fontSize: '1.125rem' }}>✓</span>
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
                    {getField('transmission') && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"/></svg>
                                    {labels.transmission}
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {getField('transmission').map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Diagnosis - ENRICHED */}
                    {getField('diagnosis') && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M6 13h12M6 18h12"/></svg>
                                    {labels.diagnosis}
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {getField('diagnosis').map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Treatment - ENRICHED */}
                    {getField('treatment') && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v3"/><path d="M16 19h6M19 16v6"/></svg>
                                    {labels.treatment}
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {getField('treatment').map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Control & Prevention - ENRICHED */}
                    {getField('control') && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                    {labels.control}
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {getField('control').map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Vaccine Recommendations - ENRICHED (Empty State for Now) */}
                    {(() => {
                        const vaccineData = getField('vaccineRecommendations');
                        const hasVaccines = vaccineData && vaccineData.length > 0;
                        
                        return (
                            <>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                                <div style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <svg style={{ width: 18, height: 18, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24"><path d="M18 2l4 4-10 10H8v-4L18 2z"/><path d="M8 16L2 22"/></svg>
                                        {labels.vaccineRecommendations}
                                    </h3>
                                    
                                    {!hasVaccines ? (
                                        <div style={{
                                            padding: '1.5rem',
                                            background: '#EFF6FF',
                                            border: '1px solid #BFDBFE',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                <svg style={{ flexShrink: 0, width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="#2EAA5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2l4 4-10 10H8v-4L18 2z"/><path d="M8 16L2 22"/></svg>
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
            <div className="action-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.5rem' }}>
                <button
                    style={{ padding: '0.75rem 1.25rem', background: '#2EAA5E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.15s' }}
                    onClick={handleBackToSymptoms}
                >
                    {labels.backToResults}
                </button>
                <button
                    style={{ padding: '0.75rem 1.25rem', background: '#2EAA5E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.15s' }}
                    onClick={handleNewDiagnosis}
                >
                    {labels.newDiagnosis}
                </button>
                <button
                    style={{ padding: '0.75rem 1.25rem', background: '#2EAA5E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.15s' }}
                    onClick={() => {
                        setStep(STEPS.ALL_DISEASES);
                        navigate('/poultry/diseases');
                    }}
                >
                    {labels.allDiseases}
                </button>
                <button
                    style={{ padding: '0.75rem 1.25rem', background: '#2EAA5E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.15s' }}
                    onClick={handlePrint}
                >
                    {labels.print}
                </button>
            </div>
        </div>

        <div className="fw-mod-bnav">
            <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'white', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>Home</span>
            </button>
            <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry/diagnostic')}>
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                </svg>
                <span>Diagnostic</span>
            </button>
        </div>
        </>
    );
}

export default DiseaseDetail;

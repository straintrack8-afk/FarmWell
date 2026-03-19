import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';
import { diseasePageTranslations } from '../translations_extended';
import { formatDescription, cleanText, textToBullets } from '../utils/formatters';

function getCategoryClass(category) {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('bacterial')) return 'badge-bacterial';
    if (lower.includes('viral')) return 'badge-viral';
    if (lower.includes('parasitic')) return 'badge-parasitic';
    if (lower.includes('nutritional')) return 'badge-nutritional';
    if (lower.includes('toxicosis')) return 'badge-toxicosis';
    return 'badge-other';
}

function getMortalityClass(level) {
    const mapping = {
        'Very High': 'mortality-very-high',
        'High': 'mortality-high',
        'Moderate': 'mortality-moderate',
        'Low': 'mortality-low',
        'Minimal': 'mortality-minimal'
    };
    return mapping[level] || 'mortality-moderate';
}

function DiseasePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { diseases, resetDiagnosis, clearSymptoms, symptoms: contextSymptoms, selectedSymptoms } = useDiagnosis();
    const { language } = useLanguage();
    const t = (key) => diseasePageTranslations[language]?.[key] || swineTranslations[language]?.[key] || diseasePageTranslations['en'][key] || swineTranslations['en'][key];

    const disease = diseases.find(d => d.id === parseInt(id));

    if (!disease) {
        return (
            <div className="container swine-diagnosis">
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                    <h3 className="empty-state-title">{t('diseaseNotFound')}</h3>
                    <p className="empty-state-text">
                        {t('diseaseNotFoundText')}
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        {t('goHome')}
                    </button>
                </div>
            </div>
        );
    }

    const dName = typeof disease.name === 'object' ? (disease.name[language] || disease.name.en || disease.name) : disease.name;
    const dDesc = typeof disease.description === 'object' ? (disease.description[language] || disease.description.en || disease.description) : disease.description;
    
    // Handle both array and object formats for transmission
    const dTransmission = Array.isArray(disease.transmission) ? disease.transmission : 
                         (typeof disease.transmission === 'object' ? (disease.transmission[language] || disease.transmission.en || disease.transmission) : disease.transmission);
    
    // Handle both field names: diagnosis/diagnosisMethod
    const diagnosisData = disease.diagnosis || disease.diagnosisMethod;
    const dDiagnosis = Array.isArray(diagnosisData) ? diagnosisData :
                      (typeof diagnosisData === 'object' ? (diagnosisData[language] || diagnosisData.en || diagnosisData) : diagnosisData);
    
    // Handle both field names: treatment/treatmentOptions
    const treatmentData = disease.treatment || disease.treatmentOptions;
    const dTreatment = Array.isArray(treatmentData) ? treatmentData :
                      (typeof treatmentData === 'object' ? (treatmentData[language] || treatmentData.en || treatmentData) : treatmentData);
    
    // Handle both field names: control/controlPrevention
    const preventionData = disease.control || disease.controlPrevention;
    const dPrevention = Array.isArray(preventionData) ? preventionData :
                       (typeof preventionData === 'object' ? (preventionData[language] || preventionData.en || preventionData) : preventionData);

    // Helper to get translated symptom name
    const getTranslatedSymptom = (symptomEnStr) => {
        if (!contextSymptoms || !contextSymptoms.categories) return symptomEnStr;
        for (const cat of contextSymptoms.categories) {
            const sym = cat.symptoms?.find(s =>
                (typeof s.label === 'object' ? (s.label.en || s.label) : s.label) === symptomEnStr
            );
            if (sym) {
                return typeof sym.label === 'object' ? (sym.label[language] || sym.label.en || sym.label) : sym.label;
            }
        }
        return symptomEnStr;
    };

    const handleNewDiagnosis = () => {
        clearSymptoms();
        navigate('/swine/diagnosis/symptoms');
    };

    // Get all symptoms and separate matched vs unmatched
    const allSymptoms = disease.symptoms || [];
    const matchedSymptoms = allSymptoms.filter(s => selectedSymptoms.includes(s));
    const unmatchedSymptoms = allSymptoms.filter(s => !selectedSymptoms.includes(s));

    return (
        <div className="container swine-diagnosis" style={{ paddingBottom: '2rem' }}>
            {/* Main Content Card */}
            <div className="disease-detail-card">
                {/* Disease Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {dName}
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
                            {disease.category?.replace(/\*/g, '').trim() || 'Other'}
                        </span>

                        <div className={`mortality-indicator ${getMortalityClass(disease.mortalityLevel)}`}>
                            <span className="mortality-dot"></span>
                            {disease.mortalityLevel} {t('mortalityText')}
                        </div>

                        {/* Zoonotic Risk Badge */}
                        {disease.zoonoticRisk && (
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                background: '#FEF3C7',
                                color: '#92400E',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                ⚠️ {t('zoonoticRiskTitle')}
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

                    {/* Confidence Match */}
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
                                    {t('confidenceMatch')}
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
                            {matchedSymptoms.length > 0 && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#059669' }}>
                                    {matchedSymptoms.length} {t('strong')} {allSymptoms.length} {t('symptomsMatched')}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Zoonotic Warning */}
                {disease.zoonoticRisk && (
                    <div className="zoonotic-warning" style={{ marginBottom: '1.5rem' }}>
                        <div className="zoonotic-warning-icon" style={{ fontSize: '1.5rem' }}></div>
                        <div className="zoonotic-warning-content">
                            <div className="zoonotic-warning-title">{t('zoonoticDisease')}</div>
                            <div className="zoonotic-warning-text">
                                {disease.zoonoticDetails || t('zoonoticDiseaseText')}
                            </div>
                        </div>
                    </div>
                )}

                {/* Single Scroll Content */}
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
                    {/* Description */}
                    {dDesc && (
                        <div style={{ 
                            border: '2px solid #10B981', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            background: '#F0FDF4',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                                📝 {t('description')}
                            </h3>
                            <div style={{ 
                                padding: '1rem', 
                                background: 'white', 
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}>
                                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-line' }}>
                                    {formatDescription(dDesc)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Clinical Signs */}
                    {allSymptoms.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🩺 {t('clinicalSignsTitle')}
                            </h3>
                            
                            {/* Matched Symptoms */}
                            {matchedSymptoms.length > 0 && (
                                <>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#059669', marginBottom: '0.75rem' }}>
                                        ✓ {t('matchedSymptoms')} ({matchedSymptoms.length})
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
                                                <span style={{ color: '#059669', fontWeight: '500' }}>{getTranslatedSymptom(symptom)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {/* Other Symptoms */}
                            {unmatchedSymptoms.length > 0 && (
                                <>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6B7280', marginBottom: '0.75rem' }}>
                                        {t('otherSymptoms')} ({unmatchedSymptoms.length})
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
                                                <span style={{ color: '#6B7280' }}>{getTranslatedSymptom(symptom)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Transmission */}
                    {dTransmission && (
                        <div style={{ 
                            border: '2px solid #10B981', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            background: '#F0FDF4',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                                🦠 {t('transmissionTitle')}
                            </h3>
                            <div style={{ 
                                padding: '1rem', 
                                background: 'white', 
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {(Array.isArray(dTransmission) ? dTransmission : textToBullets(dTransmission)).map((item, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Diagnosis Methods */}
                    {dDiagnosis && (
                        <div style={{ 
                            border: '2px solid #10B981', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            background: '#F0FDF4',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                                🔬 {t('diagnosisMethodsTitle')}
                            </h3>
                            <div style={{ 
                                padding: '1rem', 
                                background: 'white', 
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {(Array.isArray(dDiagnosis) ? dDiagnosis : textToBullets(dDiagnosis)).map((item, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Treatment Options */}
                    {dTreatment && (
                        <div style={{ 
                            border: '2px solid #10B981', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            background: '#F0FDF4',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                                💊 {t('treatmentOptionsTitle')}
                            </h3>
                            <div style={{ 
                                padding: '1rem', 
                                background: 'white', 
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {(Array.isArray(dTreatment) ? dTreatment : textToBullets(dTreatment)).map((item, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Control & Prevention */}
                    {dPrevention && (
                        <div style={{ 
                            border: '2px solid #10B981', 
                            borderRadius: '8px', 
                            padding: '1rem', 
                            background: '#F0FDF4',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                                🛡️ {t('controlPreventionTitle')}
                            </h3>
                            <div style={{ 
                                padding: '1rem', 
                                background: 'white', 
                                borderRadius: '6px',
                                border: '1px solid #D1D5DB'
                            }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {(Array.isArray(dPrevention) ? dPrevention : textToBullets(dPrevention)).map((item, i) => (
                                        <li key={i} style={{ fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ marginRight: '0.5rem', color: '#10B981', fontWeight: 'bold' }}>•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Vaccine Recommendations - Always visible */}
                    <div style={{ 
                        border: '2px solid #10B981', 
                        borderRadius: '8px', 
                        padding: '1rem', 
                        background: '#F0FDF4',
                        marginBottom: '1.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.75rem' }}>
                            💉 {t('vaccineRecommendationTitle')}
                        </h3>
                        
                        {(() => {
                            const vaccineData = disease.vaccineRecommendations || disease.vaccines || [];
                            const hasVaccines = vaccineData && vaccineData.length > 0;
                            const hasVaccineText = disease.vaccineRecommendation;
                            
                            if (!hasVaccines && !hasVaccineText) {
                                return (
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
                                                    {t('vaccineComingSoon')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            
                            if (hasVaccineText) {
                                return (
                                    <div style={{ 
                                        padding: '1rem', 
                                        background: 'white', 
                                        borderRadius: '6px',
                                        border: '1px solid #D1D5DB'
                                    }}>
                                        <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
                                            {cleanText(disease.vaccineRecommendation)}
                                        </p>
                                    </div>
                                );
                            }
                            
                            return (
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
                            );
                        })()}
                    </div>

                </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ 
                marginTop: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxWidth: '100%'
            }}>
                {/* Row 1: Equal width buttons */}
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                }}>
                    <button 
                        onClick={() => navigate('/swine/diagnosis/symptoms')}
                        style={{
                            padding: '1rem',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10B981'}
                    >
                        {t('backToResults')}
                    </button>
                    
                    <button 
                        onClick={handleNewDiagnosis}
                        style={{
                            padding: '1rem',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10B981'}
                    >
                        {t('newDiagnosis')}
                    </button>
                </div>
                
                {/* Row 2: Equal width buttons */}
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                }}>
                    <button 
                        onClick={() => navigate('/swine/diseases')}
                        style={{
                            padding: '1rem',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10B981'}
                    >
                        {t('allSwineDiseases')}
                    </button>
                    
                    <button 
                        onClick={() => window.print()}
                        style={{
                            padding: '1rem',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10B981'}
                    >
                        {t('print')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiseasePage;

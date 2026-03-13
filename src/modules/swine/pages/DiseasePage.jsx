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
    const { diseases, resetDiagnosis, symptoms: contextSymptoms } = useDiagnosis();
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
    const dTransmission = typeof disease.transmission === 'object' ? (disease.transmission[language] || disease.transmission.en || disease.transmission) : disease.transmission;
    const dDiagnosis = typeof disease.diagnosisMethod === 'object' ? (disease.diagnosisMethod[language] || disease.diagnosisMethod.en || disease.diagnosisMethod) : disease.diagnosisMethod;
    const dTreatment = typeof disease.treatmentOptions === 'object' ? (disease.treatmentOptions[language] || disease.treatmentOptions.en || disease.treatmentOptions) : disease.treatmentOptions;
    const dPrevention = typeof disease.controlPrevention === 'object' ? (disease.controlPrevention[language] || disease.controlPrevention.en || disease.controlPrevention) : disease.controlPrevention;

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
        resetDiagnosis();
        navigate('/swine/diagnosis/age');
    };

    return (
        <div className="container swine-diagnosis" style={{ paddingBottom: '2rem' }}>
            {/* Back Button */}
            <div style={{ padding: '1rem 0' }}>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/swine/diagnosis/results')}
                >
                    {t('backToResults')}
                </button>
            </div>

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
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('description')}
                            </h3>
                            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                                {formatDescription(dDesc)}
                            </div>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Clinical Signs */}
                    {disease.symptoms?.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('clinicalSignsTitle')}
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                                gap: '0.75rem'
                            }}>
                                {disease.symptoms.map((symptom, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <span style={{ color: 'var(--primary)' }}>•</span>
                                        {getTranslatedSymptom(symptom)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Transmission */}
                    {dTransmission && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('transmissionTitle')}
                            </h3>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {textToBullets(dTransmission).map((item, i) => (
                                    <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Diagnosis Methods */}
                    {dDiagnosis && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('diagnosisMethodsTitle')}
                            </h3>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {textToBullets(dDiagnosis).map((item, i) => (
                                    <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Treatment Options */}
                    {dTreatment && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('treatmentOptionsTitle')}
                            </h3>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {textToBullets(dTreatment).map((item, i) => (
                                    <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Control & Prevention */}
                    {dPrevention && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('controlPreventionTitle')}
                            </h3>
                            <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                {textToBullets(dPrevention).map((item, i) => (
                                    <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Vaccine Recommendation */}
                    {disease.vaccineRecommendation && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {t('vaccineRecommendationTitle')}
                                </h3>
                                <div style={{
                                    padding: '1rem',
                                    background: '#f0fdf4',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(16, 185, 129, 0.4)',
                                    lineHeight: '1.7'
                                }}>
                                    {cleanText(disease.vaccineRecommendation)}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Key Facts */}
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t('keyFactsTitle')}
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
                            gap: '1rem'
                        }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('mortalityTitle')}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                    {disease.mortality || disease.mortalityLevel || 'Unknown'}
                                </div>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{t('zoonoticRiskTitle')}</div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                    {disease.zoonoticRisk ? t('zoonoticRiskYes') : t('zoonoticRiskNo')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {/* Back to Results + New Diagnosis side by side */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={() => navigate('/swine/diagnosis/results')}
                    >
                        {t('backToResults')}
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={handleNewDiagnosis}
                    >
                        {t('newDiagnosisButton')}
                    </button>
                </div>
                {/* Print full-width below */}
                <button
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                    onClick={() => window.print()}
                >
                    {t('printButton')}
                </button>
            </div>
        </div>
    );
}

export default DiseasePage;

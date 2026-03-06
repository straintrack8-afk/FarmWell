import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useTranslation } from '../../../hooks/useTranslation';

function HomePage() {
    const navigate = useNavigate();
    const { loading } = useDiagnosis();
    const { t } = useTranslation();

    const handleStartDiagnosis = () => {
        navigate('diagnosis/age');
    };

    const handleStartBiosecurity = () => {
        navigate('biosecurity');
    };

    const handleOpenCalculator = () => {
        navigate('farm-calculator');
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="fw-page" style={{ minHeight: 'auto', background: 'transparent' }}>
            {/* Header section similar to WelcomePage for consistent branding/spacing */}
            <section className="fw-header-light" style={{ padding: '24px 20px 48px', background: 'transparent', borderBottom: 'none' }}>
                <div className="fw-header-logo-wrap" style={{ cursor: 'default' }}>
                    <img src="/images/PigWell_Logo.png" alt="PigWell" className="fw-header-logo" />
                </div>
                <p className="fw-header-sub">
                    An integrated swine management platform for diagnostics, production analytics, financial planning, and farm biosecurity audits.
                </p>
            </section>

            <div className="fw-section" style={{ paddingTop: 0, paddingBottom: '4rem' }}>
                <div className="fw-modules-grid-2">
                    {/* Disease Diagnosis Feature */}
                    <div className="fw-module-card mc-pig" onClick={handleStartDiagnosis} style={{ cursor: 'pointer' }}>
                        <div className="fmc-header">
                            <div className="fmc-icon-wrap">
                                <span className="fmc-emoji">⚕️</span>
                            </div>
                            <span className="mc-badge mb-live">✓ Active</span>
                        </div>
                        <div className="fmc-body">
                            <div className="fmc-name">{t('swine.diagnosis.title')}</div>
                            <div className="fmc-desc">{t('swine.diagnosis.description')}</div>
                            <div className="fmc-tags">
                                <span className="fmc-tag">{t('swine.diagnosis.features.ageSpecific')}</span>
                                <span className="fmc-tag">{t('swine.diagnosis.features.symptomBased')}</span>
                                <span className="fmc-tag">{t('swine.diagnosis.features.treatment')}</span>
                            </div>
                            <button className="fmc-cta" onClick={(e) => { e.stopPropagation(); handleStartDiagnosis(); }}>
                                {t('swine.diagnosis.button')}
                                <div className="fmc-cta-arrow">›</div>
                            </button>
                        </div>
                    </div>

                    {/* Biosecurity Assessment Feature */}
                    <div className="fw-module-card mc-poultry" onClick={handleStartBiosecurity} style={{ cursor: 'pointer' }}>
                        <div className="fmc-header">
                            <div className="fmc-icon-wrap">
                                <span className="fmc-emoji">🛡️</span>
                            </div>
                            <span className="mc-badge mb-live">✓ Active</span>
                        </div>
                        <div className="fmc-body">
                            <div className="fmc-name">{t('swine.biosecurity.title')}</div>
                            <div className="fmc-desc">{t('swine.biosecurity.description')}</div>
                            <div className="fmc-tags">
                                <span className="fmc-tag">{t('swine.biosecurity.features.questions')}</span>
                                <span className="fmc-tag">{t('swine.biosecurity.features.scores')}</span>
                                <span className="fmc-tag">{t('swine.biosecurity.features.reports')}</span>
                            </div>
                            <button className="fmc-cta" onClick={(e) => { e.stopPropagation(); handleStartBiosecurity(); }}>
                                {t('swine.biosecurity.button')}
                                <div className="fmc-cta-arrow">›</div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Second row for Calculator */}
                <div className="fw-modules-grid-2" style={{ marginTop: '24px' }}>
                    <div className="fw-module-card mc-feed" onClick={handleOpenCalculator} style={{ cursor: 'pointer' }}>
                        <div className="fmc-header">
                            <div className="fmc-icon-wrap">
                                <span className="fmc-emoji">🧮</span>
                            </div>
                            <span className="mc-badge mb-new">✦ Updated</span>
                        </div>
                        <div className="fmc-body">
                            <div className="fmc-name">{t('swine.calculator.title')}</div>
                            <div className="fmc-desc">{t('swine.calculator.description')}</div>
                            <div className="fmc-tags">
                                <span className="fmc-tag">Cost Analysis</span>
                                <span className="fmc-tag">Performance</span>
                            </div>
                            <button className="fmc-cta" onClick={(e) => { e.stopPropagation(); handleOpenCalculator(); }}>
                                {t('swine.calculator.button')}
                                <div className="fmc-cta-arrow">›</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Branding - removed since Welcome page doesn't have it explicitly mapped in these cards */}
        </div>
    );
}

export default HomePage;

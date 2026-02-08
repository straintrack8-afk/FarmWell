import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';

function PoultryLanding() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language } = useLanguage();

    const handleDiagnosticTool = () => {
        navigate('/poultry/diagnostic/age');
    };

    const handleHatcheryAudit = () => {
        navigate('/poultry/hatchery-audit');
    };

    const handleBroilerAssessment = () => {
        navigate('/poultry/biosecurity');
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header with FarmWell logo and Online status */}
                    <div className="header">
                        <div
                            className="header-logo"
                            onClick={() => navigate('/')}
                            style={{
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <img
                                src="/images/FarmWell_Logo.png"
                                alt="FarmWell"
                                style={{ height: '80px', width: 'auto' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                {language.toUpperCase()}
                            </div>
                            <div className="offline-indicator online">
                                <span className="status-dot" style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#10B981'
                                }}></span>
                                Online
                            </div>
                        </div>
                    </div>

                    {/* PoultryWell Logo (centered) */}
                    <div className="page-header" style={{
                        padding: '0.1875rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <img
                            src="/images/PoultryWell_Logo.png"
                            alt="PoultryWell"
                            style={{ height: '200px', width: 'auto', marginBottom: '0.75rem' }}
                        />
                    </div>

                    {/* Feature Cards */}
                    <div className="feature-grid" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        padding: '0 1rem 2rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Diagnostic Tool Card */}
                        <div className="action-card" onClick={handleDiagnosticTool}>
                            <span className="action-card-icon">🔍</span>
                            <h3 className="action-card-title">
                                {t('poultry.diagnosis.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.diagnosis.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.diagnosis.features.ageSpecific')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.diagnosis.features.symptomBased')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.diagnosis.features.treatment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.diagnosis.features.offline')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.diagnosis.button')} →
                            </button>
                        </div>

                        {/* Hatchery Audit Card */}
                        <div className="action-card" onClick={handleHatcheryAudit}>
                            <span className="action-card-icon">🧫</span>
                            <h3 className="action-card-title">
                                {t('poultry.hatchery.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.hatchery.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.hatchery.features.vaccine')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.hatchery.features.environmental')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.hatchery.features.reports')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.hatchery.features.quarterly')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                                {t('poultry.hatchery.button')} →
                            </button>
                        </div>

                        {/* Broiler Assessment Card */}
                        <div className="action-card" onClick={handleBroilerAssessment}>
                            <span className="action-card-icon">📋</span>
                            <h3 className="action-card-title">
                                {t('poultry.biosecurity.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.biosecurity.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.biosecurity.features.comprehensive')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.biosecurity.features.scoring')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.biosecurity.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.biosecurity.features.biocheck')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                {t('poultry.biosecurity.button')} →
                            </button>
                        </div>

                        {/* Breeder Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/breeder-assessment')}>
                            <span className="action-card-icon">🏭</span>
                            <h3 className="action-card-title">
                                {t('poultry.breeder.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.breeder.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.breeder.features.assessment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.breeder.features.priority')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.breeder.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.breeder.features.multilingual')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                                {t('poultry.breeder.button')} →
                            </button>
                        </div>

                        {/* Layer Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/layer-assessment')}>
                            <span className="action-card-icon">🥚</span>
                            <h3 className="action-card-title">
                                {t('poultry.layer.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.layer.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.layer.features.assessment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.layer.features.categories')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.layer.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon">✓</span>
                                    <span>{t('poultry.layer.features.multilingual')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }}>
                                {t('poultry.layer.button')} →
                            </button>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="footer-branding" style={{ marginTop: '4rem', paddingBottom: '2rem' }}>
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
        </div>
    );
}

export default PoultryLanding;

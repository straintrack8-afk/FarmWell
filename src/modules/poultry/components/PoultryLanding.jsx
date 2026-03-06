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
                <div className="portal-card" style={{ background: 'none' }}>
                    {/* PoultryWell Logo (centered) */}
                    <div className="page-header" style={{
                        padding: '0.1875rem 1rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <img
                            src="/images/PoultryWell_Logo.png"
                            alt="PoultryWell"
                            style={{ height: '200px', width: 'auto', marginBottom: '1.5rem' }}
                        />
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#4B5563',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            An integrated poultry management platform for disease diagnostics, biosecurity audits, and farm management support.
                        </p>
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
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.diagnosis.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.diagnosis.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.diagnosis.features.ageSpecific')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.diagnosis.features.symptomBased')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.diagnosis.features.treatment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.diagnosis.features.offline')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.diagnosis.button')}
                            </button>
                        </div>

                        {/* Hatchery Audit Card */}
                        <div className="action-card" onClick={handleHatcheryAudit}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.hatchery.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.hatchery.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.hatchery.features.vaccine')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.hatchery.features.environmental')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.hatchery.features.reports')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.hatchery.features.quarterly')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.hatchery.button')}
                            </button>
                        </div>

                        {/* Broiler Assessment Card */}
                        <div className="action-card" onClick={handleBroilerAssessment}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.biosecurity.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.biosecurity.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.biosecurity.features.comprehensive')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.biosecurity.features.scoring')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.biosecurity.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.biosecurity.features.biocheck')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.biosecurity.button')}
                            </button>
                        </div>

                        {/* Breeder Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/breeder-assessment')}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.breeder.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.breeder.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.breeder.features.assessment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.breeder.features.priority')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.breeder.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.breeder.features.multilingual')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.breeder.button')}
                            </button>
                        </div>

                        {/* Layer Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/layer-assessment')}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.layer.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.layer.description')}
                            </p>
                            <ul className="action-card-features">
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.layer.features.assessment')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.layer.features.categories')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.layer.features.risks')}</span>
                                </li>
                                <li className="action-card-feature">
                                    <span className="action-card-feature-icon"></span>
                                    <span>{t('poultry.layer.features.multilingual')}</span>
                                </li>
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                {t('poultry.layer.button')}
                            </button>
                        </div>
                    </div>

                    </div>
            </div>
        </div>
    );
}

export default PoultryLanding;

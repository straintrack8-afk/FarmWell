import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';

function PoultryLanding() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language } = useLanguage();

    const handleDiagnosticTool = () => {
        navigate('/poultry/diagnostic');
    };

    const handleHatcheryAudit = () => {
        navigate('/poultry/hatchery-audit');
    };

    const handleBroilerAssessment = () => {
        navigate('/poultry/biosecurity');
    };

    const tagline = {
        en: "An integrated poultry management platform for disease diagnostics, biosecurity audits, and farm management support.",
        id: "Platform manajemen unggas terintegrasi untuk diagnostik penyakit, audit biosekuriti, dan dukungan manajemen peternakan.",
        vi: "Nền tảng quản lý gia cầm tích hợp cho chẩn đoán bệnh, kiểm toán an toàn sinh học và hỗ trợ quản lý trang trại."
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
                            {tagline[language]}
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="feature-grid" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1rem',
                        border: '3px solid #10B981',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        {/* Diagnostic Tool Card */}
                        <div className="action-card" onClick={handleDiagnosticTool} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.diagnosis.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.diagnosis.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('poultry.diagnosis.button')}
                            </button>
                        </div>

                        {/* Hatchery Audit Card */}
                        <div className="action-card" onClick={handleHatcheryAudit} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.hatchery.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.hatchery.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('poultry.hatchery.button')}
                            </button>
                        </div>

                        {/* Broiler Assessment Card */}
                        <div className="action-card" onClick={handleBroilerAssessment} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.biosecurity.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.biosecurity.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('poultry.biosecurity.button')}
                            </button>
                        </div>

                        {/* Breeder Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/breeder-assessment')} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.breeder.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.breeder.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('poultry.breeder.button')}
                            </button>
                        </div>

                        {/* Layer Assessment Card */}
                        <div className="action-card" onClick={() => navigate('/poultry/layer-assessment')} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('poultry.layer.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('poultry.layer.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
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

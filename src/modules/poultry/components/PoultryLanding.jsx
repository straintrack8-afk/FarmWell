import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useTranslation } from '../../../hooks/useTranslation';

const DiagnosticIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
        <path d="M12 8v4l2 2"/>
    </svg>
);

const HatcheryIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7"/>
        <path d="M12 2c4 0 7 4 7 8 0 3-1.5 5.5-4 7"/>
        <path d="M9 17c0 2.5 1.3 4 3 4s3-1.5 3-4"/>
        <circle cx="12" cy="11" r="2"/>
    </svg>
);

const BroilerIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 2c-1 0-2 .5-2 1.5S11 5 12 5s2-.5 2-1.5S13 2 12 2z"/>
        <path d="M8 5C6 5 4 7 4 10c0 2 1 3.5 3 4.5"/>
        <path d="M16 5c2 0 4 2 4 5 0 2-1 3.5-3 4.5"/>
        <ellipse cx="12" cy="15" rx="5" ry="4"/>
        <path d="M9 19l-1 2M15 19l1 2"/>
        <path d="M3 8l2 1M21 8l-2 1"/>
    </svg>
);

const BreederIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M8 3c-.8 0-1.5.5-1.5 1.5S7.2 6 8 6s1.5-.5 1.5-1.5S8.8 3 8 3z"/>
        <path d="M5 6C3 6 1 8 1 11c0 2 1 3 2.5 4"/>
        <ellipse cx="8" cy="16" rx="4" ry="3.5"/>
        <path d="M6 20l-.5 2M10 20l.5 2"/>
        <path d="M16 3c.8 0 1.5.5 1.5 1.5S16.8 6 16 6s-1.5-.5-1.5-1.5S15.2 3 16 3z"/>
        <path d="M19 6c2 0 4 2 4 5 0 2-1 3-2.5 4"/>
        <ellipse cx="16" cy="16" rx="4" ry="3.5"/>
        <path d="M14 20l-.5 2M18 20l.5 2"/>
    </svg>
);

const LayerIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 2c-1 0-2 .5-2 1.5S11 5 12 5s2-.5 2-1.5S13 2 12 2z"/>
        <path d="M8 5C6 5 4 7 4 10c0 2 1 3.5 3 4.5"/>
        <path d="M16 5c2 0 4 2 4 5 0 2-1 3.5-3 4.5"/>
        <ellipse cx="12" cy="15" rx="5" ry="4"/>
        <path d="M9 19l-1 2M15 19l1 2"/>
        <ellipse cx="19" cy="20" rx="2" ry="2.5" transform="rotate(-10 19 20)"/>
    </svg>
);

function PoultryLanding() {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    const features = [
        {
            id: 'diagnostic',
            icon: <DiagnosticIcon />,
            name: t('poultry.diagnosis.title') || 'Disease Diagnostic',
            desc: t('poultry.diagnosis.description') || 'Symptom-based diagnosis tool',
            route: '/poultry/diagnostic',
        },
        {
            id: 'hatchery',
            icon: <HatcheryIcon />,
            name: t('poultry.hatchery.title') || 'Hatchery Audit',
            desc: t('poultry.hatchery.description') || 'Quality assessment for hatchery',
            route: '/poultry/hatchery-audit',
        },
        {
            id: 'broiler',
            icon: <BroilerIcon />,
            name: t('poultry.biosecurity.title') || 'Broiler Biosecurity',
            desc: t('poultry.biosecurity.description') || 'Biosecurity evaluation for broiler farms',
            route: '/poultry/biosecurity',
        },
        {
            id: 'breeder',
            icon: <BreederIcon />,
            name: t('poultry.breeder.title') || 'Breeder Assessment',
            desc: t('poultry.breeder.description') || 'Biosecurity for breeder farms',
            route: '/poultry/breeder-assessment',
        },
        {
            id: 'layer',
            icon: <LayerIcon />,
            name: t('poultry.layer.title') || 'Layer Assessment',
            desc: t('poultry.layer.description') || 'Biosecurity evaluation for layer farms',
            route: '/poultry/layer-assessment',
        },
    ];

    return (
        <div className="fw-module-page">

            {/* ── COMPACT HEADER ── */}
            <div className="fw-mod-top">
                <div
                    className="fw-mod-top-logo"
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <img src="/images/PoultryWell_Logo.png" alt="PoultryWell" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                </div>
                <div className="fw-mod-top-lang">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`fw-mod-top-lang-btn${language === lang.code ? ' active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── WHITE CARD ── */}
            <div className="fw-mod-card">
                <div className="fw-mod-content">
                    <div className="fw-welcome-section-label">
                        PoultryWell — {t('welcome.allModules') || 'Select Tool'}
                    </div>

                    {/* Feature grid */}
                    <div className="fw-module-grid-2">
                        {features.map(feat => (
                            <div
                                key={feat.id}
                                className="fw-mod-item-card mod-poultry"
                                onClick={() => navigate(feat.route)}
                            >
                                <div className="fw-mod-item-icon-wrap">
                                    {feat.icon}
                                </div>
                                <div className="fw-mod-item-name">{feat.name}</div>
                                <div className="fw-mod-item-tag">{feat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM NAV ── */}
                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </button>
                    <button className="fw-mod-bnav-alerts" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                        <span>Alerts</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PoultryLanding;

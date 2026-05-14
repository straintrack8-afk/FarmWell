import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const [showWaitlistModal, setShowWaitlistModal] = useState(false);

    const modules = [
        {
            id: 'feed-additives',
            name: t('welcome.feedAdditivesModule') || 'Feed Module',
            tag: 'Nutrition',
            icon: '/images/feed_additives_logo.svg',
            colorClass: 'mod-feed',
            path: '/feed-additives',
            status: 'live',
        },
        {
            id: 'swine',
            name: t('welcome.swineModule') || 'PigWell',
            tag: 'Swine',
            icon: '/images/PigWell_Logo.png',
            colorClass: 'mod-pig',
            path: '/swine',
            status: 'live',
        },
        {
            id: 'poultry',
            name: t('welcome.poultryModule') || 'PoultryWell',
            tag: 'Poultry',
            icon: '/images/PoultryWell_Logo.png',
            colorClass: 'mod-poultry',
            path: '/poultry',
            status: 'live',
        },
        {
            id: 'farmguide',
            name: t('welcome.farmGuide.name') || 'FarmGuide',
            tag: 'Monitor',
            icon: '/FarmGuide_logo.png',
            colorClass: 'mod-guide',
            path: '/farmguide',
            status: 'live',
        },
    ];

    const handleModuleClick = (mod) => {
        if (mod.status === 'soon') {
            setShowWaitlistModal(true);
        } else if (mod.path) {
            navigate(mod.path);
        }
    };

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    return (
        <div className="fw-welcome-page">

            {/* ── HEADER ── */}
            <div className="fw-welcome-header">
                <div className="fw-welcome-lang-row">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`fw-welcome-lang-btn${language === lang.code ? ' active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
                <div className="fw-welcome-logo-wrap">
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        className="fw-welcome-logo-img"
                    />
                </div>
                <div className="fw-welcome-subtitle">
                    {t('welcome.tagline') || 'Integrated Livestock Platform'}
                </div>
            </div>

            {/* ── WHITE CONTENT CARD ── */}
            <div className="fw-welcome-content">
                <div className="fw-welcome-section-label">
                    {t('welcome.allModules') || 'All Modules'}
                </div>

                {/* 2×2 module grid */}
                <div className="fw-module-grid-2">
                    {modules.map(mod => (
                        <div
                            key={mod.id}
                            className={`fw-mod-item-card ${mod.colorClass}`}
                            onClick={() => handleModuleClick(mod)}
                        >
                            <div className="fw-mod-item-icon-wrap">
                                <img
                                    src={mod.icon}
                                    alt={mod.name}
                                    className="fw-mod-item-icon-img"
                                />
                            </div>
                            <div className="fw-mod-item-name">{mod.name}</div>
                            <div className="fw-mod-item-tag">{mod.tag}</div>
                        </div>
                    ))}
                </div>

                {/* AI Assistant — full width */}
                <div
                    className="fw-mod-item-card-wide"
                    onClick={() => setShowWaitlistModal(true)}
                >
                    <div className="fw-mod-item-icon-wrap">
                        <span style={{ fontSize: '24px' }}>🤖</span>
                    </div>
                    <div>
                        <div className="fw-mod-item-name">
                            {t('welcome.aiModule.name') || 'FarmWell AI Assistant'}
                        </div>
                        <div className="fw-mod-item-tag">
                            {t('welcome.aiModule.tags.chat') || 'AI Chat'} ·{' '}
                            {t('welcome.aiModule.tags.multi') || 'Multi-module'}
                        </div>
                    </div>
                    <div className="fw-mod-item-wide-soon">
                        {t('welcome.aiModule.soon') || 'Soon'}
                    </div>
                </div>

                {/* Vaksindo logo */}
                <div className="fw-vaksindo-area">
                    <img
                        src="/images/Vaksindo_logo.png"
                        alt="Vaksindo"
                        className="fw-vaksindo-img"
                    />
                </div>
            </div>

            {/* ── FOOTER ── */}
            <footer className="fw-welcome-footer">
                <div className="fw-welcome-footer-copy">
                    © 2025 FarmWell · Integrated Livestock Platform
                </div>
            </footer>

            {/* ── WAITLIST MODAL — unchanged logic ── */}
            {showWaitlistModal && (
                <div className="fw-modal-overlay" onClick={() => setShowWaitlistModal(false)}>
                    <div className="fw-modal-content" onClick={e => e.stopPropagation()}>
                        <h2 className="fw-modal-title">
                            {t('welcome.waitlist.title') || 'Feature in Development'}
                        </h2>
                        <p className="fw-modal-desc">
                            {t('welcome.waitlist.description') || 'The FarmWell AI Assistant feature is currently under development. To try this feature and get early access, please contact us.'}
                        </p>
                        <div className="fw-modal-actions">
                            <a
                                href="https://vaksindo.com.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="fw-btn-primary"
                            >
                                {t('welcome.waitlist.contactUs') || 'Contact Us'}
                            </a>
                            <button
                                className="fw-btn-secondary"
                                onClick={() => setShowWaitlistModal(false)}
                            >
                                {t('welcome.waitlist.back') || 'Back'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WelcomePage;

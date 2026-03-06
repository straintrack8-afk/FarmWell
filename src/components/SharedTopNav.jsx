import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const SharedTopNav = ({ hideLogo = false, logoSrc = "/images/FarmWell_Logo.png", logoAlt = "FarmWell", logoHref = "/", logoScale = 1, imageScale = 1 }) => {
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', flag: '/images/flags/flag_en.png', label: 'English' },
        { code: 'id', flag: '/images/flags/flag_id.png', label: 'Indonesia' },
        { code: 'vt', flag: '/images/flags/flag_vn.png', label: 'Tiếng Việt' },
    ];

    return (
        <nav className="fw-topnav">
            {/* FarmWell logo with white square background on the left (hidden if hideLogo is true) */}
            {!hideLogo && (
                <a href={logoHref} style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: `${8 * logoScale}px`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: `${56 * logoScale}px`,
                        height: `${56 * logoScale}px`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'opacity 0.2s ease',
                        position: 'relative',
                    }}
                        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseOut={e => e.currentTarget.style.opacity = '1'}
                    >
                        <img
                            src={logoSrc}
                            alt={logoAlt}
                            style={{
                                width: `${40 * logoScale * imageScale}px`,
                                height: `${40 * logoScale * imageScale}px`,
                                objectFit: 'contain',
                                position: 'absolute'
                            }}
                        />
                    </div>
                </a>
            )}
            <div className="fw-nav-right" style={{ marginLeft: 'auto' }}>
                <div className="fw-lang-switcher">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            className={`fw-lang-btn ${language === lang.code ? 'active' : ''}`}
                            onClick={() => setLanguage(lang.code)}
                            title={lang.label}
                        >
                            <img src={lang.flag} alt={lang.label} className="fw-flag-img" />
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default SharedTopNav;

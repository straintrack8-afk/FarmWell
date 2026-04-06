import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const SharedTopNav = ({ hideLogo = false, logoSrc = "/images/FarmWell_Logo.png", logoAlt = "FarmWell", logoHref = "/", logoScale = 1, imageScale = 1 }) => {
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Deteksi apakah sedang di dalam modul FarmGuide (bukan di home FarmGuide)
    const isInFarmGuideModule = /^\/farmguide\/(broiler|layer|color_chicken|parent_stock)/.test(location.pathname);

    const languages = [
        { code: 'en', flag: '/images/flags/flag_en.png', label: 'English' },
        { code: 'id', flag: '/images/flags/flag_id.png', label: 'Indonesia' },
        { code: 'vi', flag: '/images/flags/flag_vn.png', label: 'Tiếng Việt' },
    ];

    return (
        <nav className="fw-topnav">
            {/* Logo - FarmGuide for module routes, FarmWell for home and /farmguide home */}
            {!hideLogo && (isInFarmGuideModule ? (
                <button
                    onClick={() => navigate('/farmguide')}
                    style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '56px',
                        height: '56px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'opacity 0.2s ease',
                        position: 'relative',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                    <img
                        src="/FarmGuide_logo.png"
                        alt="FarmGuide"
                        style={{
                            width: '52px',
                            height: '52px',
                            objectFit: 'contain',
                            position: 'absolute'
                        }}
                    />
                </button>
            ) : (
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
            ))}
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

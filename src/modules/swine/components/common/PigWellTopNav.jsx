import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';

const PigWellTopNav = ({
    title = '',
    backPath = '/swine',
    backLabel = 'PigWell',
}) => {
    const navigate = useNavigate();
    const { language, setLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    return (
        <div style={{
            background: 'linear-gradient(160deg, #3DC470 0%, #2EAA5E 50%, #1E7A42 100%)',
            padding: '12px 16px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
        }}>
            {/* Left: PigWell logo */}
            <button
                onClick={() => navigate(backPath)}
                title={backLabel}
                style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '4px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
                <img
                    src="/images/PigWell_Logo.png"
                    alt="PigWell"
                    style={{ width: 32, height: 32, objectFit: 'contain' }}
                />
            </button>

            {/* Center: page title */}
            {title ? (
                <div style={{
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'white',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    flex: 1,
                    padding: '0 8px',
                }}>
                    {title}
                </div>
            ) : <div style={{ flex: 1 }} />}

            {/* Right: language toggle */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {languages.map(lang => (
                    <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        style={{
                            background: language === lang.code ? 'white' : 'rgba(255,255,255,0.2)',
                            color: language === lang.code ? '#2EAA5E' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PigWellTopNav;

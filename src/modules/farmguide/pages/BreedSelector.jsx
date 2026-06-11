import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../../../portal.css';

const BreedIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
);

const BROILER_BREEDS = [
    {
        code: 'ross',
        label: 'Ross',
        company: 'Aviagen',
        jsonFile: '/data/farmguide_data/breeds/broiler_ross.json',
        w6_bw: '3,086g',
        w8_fcr: '1.776',
    },
    {
        code: 'cobb',
        label: 'Cobb',
        company: 'Cobb-Vantress',
        jsonFile: '/data/farmguide_data/breeds/broiler_cobb.json',
        w6_bw: '3,278g',
        w8_fcr: '1.842',
    },
    {
        code: 'arboracres',
        label: 'Arbor Acres',
        company: 'Aviagen',
        jsonFile: '/data/farmguide_data/breeds/broiler_arboracres.json',
        w6_bw: '2,981g',
        w8_fcr: '1.810',
    },
    {
        code: 'indianriver',
        label: 'Indian River',
        company: 'Aviagen',
        jsonFile: '/data/farmguide_data/breeds/broiler_indianriver.json',
        w6_bw: '2,995g',
        w8_fcr: '1.822',
    },
];

const PS_LAYER_BREEDS = [
    {
        id: 'ps_lohmann_brown',
        label: 'Lohmann Brown',
        badge: 'Lohmann Tierzucht',
        jsonFile: '/data/farmguide_data/breeds/ps_layer_lohmann_brown.json',
        stats: [
            { label: 'Age 50% prod.', value: 'W21–22' },
            { label: 'Peak prod.', value: '92.9%' },
        ],
    },
    {
        id: 'ps_isa_brown',
        label: 'ISA Brown',
        badge: 'Hendrix Genetics',
        jsonFile: '/data/farmguide_data/breeds/ps_layer_isa_brown.json',
        stats: [
            { label: 'Age 50% prod.', value: 'W20–21' },
            { label: 'Peak prod.', value: '93.2%' },
        ],
    },
    {
        id: 'ps_hyline_brown',
        label: 'Hy-Line Brown',
        badge: 'Hy-Line International',
        jsonFile: '/data/farmguide_data/breeds/ps_layer_hyline_brown.json',
        stats: [
            { label: 'Age 50% prod.', value: '151 days' },
            { label: 'Peak prod.', value: '96.9%' },
        ],
    },,
    {
        id: 'ps_novogen_brown',
        label: 'Novogen Brown',
        badge: 'Novogen',
        jsonFile: '/data/farmguide_data/breeds/ps_layer_novogen_brown.json',
        stats: [
            { label: 'Age 50% prod.', value: 'W20–21' },
            { label: 'Peak prod.', value: '92.5%' },
        ],
    },
    {
        id: 'ps_hyline_w36',
        label: 'Hy-Line W-36',
        badge: 'Hy-Line International',
        jsonFile: '/data/farmguide_data/breeds/ps_layer_hyline_w36.json',
        stats: [
            { label: 'Age 50% prod.', value: '143 days' },
            { label: 'Peak prod.', value: '95.0%' },
        ],
    }
];

const PS_BROILER_BREEDS = [
    {
        id: 'ps_ross308ff',
        label: 'Ross',
        badge: 'Aviagen · 2021',
        jsonFile: '/data/farmguide_data/breeds/ps_broiler_ross308ff.json',
        stats: [
            { label: 'BW W25', value: '2,970 g' },
            { label: 'Peak prod.', value: '88.2%' },
        ],
    },
    {
        id: 'ps_arboracresplus',
        label: 'Arbor Acres',
        badge: 'Aviagen · 2021',
        jsonFile: '/data/farmguide_data/breeds/ps_broiler_arboracresplus.json',
        stats: [
            { label: 'BW W25', value: '2,970 g' },
            { label: 'Peak prod.', value: '89.6%' },
        ],
    },
    {
        id: 'ps_indianriver',
        label: 'Indian River',
        badge: 'Aviagen · 2021',
        jsonFile: '/data/farmguide_data/breeds/ps_broiler_indianriver.json',
        stats: [
            { label: 'BW W25', value: '2,965 g' },
            { label: 'Peak prod.', value: '88.5%' },
        ],
    },
    {
        id: 'ps_cobb500sf',
        label: 'Cobb',
        badge: 'Cobb-Vantress · 2026',
        jsonFile: '/data/farmguide_data/breeds/ps_broiler_cobb500sf.json',
        stats: [
            { label: 'BW W25', value: '3,220 g' },
            { label: 'Peak prod.', value: '86.0%' },
        ],
    },
];

function BreedSelector() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const [selectedBreed, setSelectedBreed] = useState(null);

    const pathParts = location.pathname.split('/').filter(Boolean);
    const category = pathParts[1];
    const moduleSlug = pathParts[2];

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    const handleBreedSelect = (breed) => {
        const existing = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        localStorage.setItem('farmguide_active_flock', JSON.stringify({
            ...existing,
            module_id: moduleSlug,
            breed_code: breed.code || breed.id,
            breed_label: breed.label,
            breed_json: breed.jsonFile,
            selected_at: new Date().toISOString(),
        }));
        navigate(`/farmguide/${category}/${moduleSlug}/panduan`);
    };

    const getModuleName = () => {
        if (category === 'ps' && moduleSlug === 'broiler') return 'Broiler PS';
        if (category === 'ps' && moduleSlug === 'layer') return 'Layer PS';
        if (moduleSlug === 'broiler') return 'Broiler Commercial';
        if (moduleSlug === 'layer') return 'Layer Commercial';
        if (moduleSlug === 'color') return 'Color Chicken';
        if (category === 'ps') return 'Parent Stock';
        return moduleSlug;
    };

    const breeds = (category === 'ps' && moduleSlug === 'broiler') ? PS_BROILER_BREEDS
        : (category === 'ps' && moduleSlug === 'layer') ? PS_LAYER_BREEDS
        : (moduleSlug === 'broiler') ? BROILER_BREEDS : [];

    return (
        <div className="fw-module-page">

            <div className="fw-mod-top">
                <div className="fw-mod-top-logo" onClick={() => navigate('/')} title="Back to Home">
                    <img
                        src="/images/FarmWell_Logo.png"
                        alt="FarmWell"
                        style={{ width: 34, height: 34, objectFit: 'contain' }}
                    />
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

            <div className="fw-mod-card">
                <div className="fw-mod-content">

                    <div className="fw-welcome-section-label">
                        FarmGuide — {getModuleName()}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 12px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2EAA5E', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: '#b8c2bc', textTransform: 'uppercase' }}>
                            {t('farmguide.selectBreed') || 'Select Breed'}
                        </span>
                        <span style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
                    </div>

                    <div className="fw-module-grid-2">
                        {breeds.map(breed => (
                            <div
                                key={breed.code || breed.id}
                                className="fw-mod-item-card mod-poultry"
                                onClick={() => handleBreedSelect(breed)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="fw-mod-item-icon-wrap">
                                    <BreedIcon />
                                </div>
                                <div className="fw-mod-item-name">{breed.label}</div>
                                <div className="fw-mod-item-tag">{breed.badge || (breed.company + ' · 2022')}</div>
                                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {breed.stats ? breed.stats.map((s, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                            <span style={{ color: 'var(--fw-sub)' }}>{s.label}</span>
                                            <span style={{ color: 'var(--fw-text)', fontWeight: 600 }}>{s.value}</span>
                                        </div>
                                    )) : (<>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                            <span style={{ color: 'var(--fw-sub)' }}>W6 target</span>
                                            <span style={{ color: 'var(--fw-text)', fontWeight: 600 }}>{breed.w6_bw}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                                            <span style={{ color: 'var(--fw-sub)' }}>W8 FCR</span>
                                            <span style={{ color: 'var(--fw-text)', fontWeight: 600 }}>{breed.w8_fcr}</span>
                                        </div>
                                    </>)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {breeds.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--fw-sub)' }}>
                            {t('farmguide.noBreedsAvailable') || 'No breeds available for this module.'}
                        </div>
                    )}

                </div>

                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        <span>Home</span>
                    </button>
                    <button className="fw-mod-bnav-alerts" onClick={() => navigate('/farmguide')}>
                        <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>
                        <span>FarmGuide</span>
                    </button>
                </div>
            </div>

        </div>
    );
}

export default BreedSelector;

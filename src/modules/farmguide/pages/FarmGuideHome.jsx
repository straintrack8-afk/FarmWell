import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import SharedTopNav from '../../../components/SharedTopNav';
import '../../../portal.css';
import { flockStorage } from '../utils/flockStorage';

function FarmGuideHome() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language, setLanguage } = useLanguage();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFlocks, setActiveFlocks] = useState([]);

    useEffect(() => {
        const flocks = flockStorage.getAllFlocks();
        setActiveFlocks(flocks.filter(f => f && f.id));
    }, []);

    useEffect(() => {
        // Fetch modules data from JSON
        fetch('/data/farmguide_data/app_config/modules.json')
            .then(res => res.json())
            .then(data => {
                setModules(data.modules);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load FarmGuide modules:', err);
                setLoading(false);
            });
    }, []);

    const handleModuleClick = (moduleId) => {
        // Broiler, Layer, and Color Chicken go directly to panduan (no breed selector)
        if (moduleId === 'broiler') {
            navigate('/farmguide/commercial/broiler/pilih-jenis');
        } else if (moduleId === 'layer') {
            navigate('/farmguide/commercial/layer/pilih-jenis');
        } else if (moduleId === 'color_chicken') {
            // Set default context for color chicken (choi male)
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            localStorage.setItem('farmguide_active_flock', JSON.stringify({
                ...ctx,
                module_id: 'color_chicken',
                breed_code: 'choi',
                sex: 'male',
                breed_label: 'Color Chicken',
            }));
            navigate(`/farmguide/color_chicken/panduan`);
        } else if (moduleId === 'parent_stock') {
            navigate('/farmguide/ps/broiler/pilih-jenis');
        } else {
            navigate(`/farmguide/${moduleId}/pilih-jenis`);
        }
    };

    const getModuleEmoji = (moduleId) => {
        const map = { broiler: '🐔', layer: '🥚', color_chicken: '🐓', parent_stock: '🐣' };
        return map[moduleId] || '🐾';
    };

    const getModuleLabel = (moduleId) => {
        const map = { 
            broiler: 'Broiler', 
            layer: 'Layer', 
            color_chicken: 'Color Chicken', 
            parent_stock: 'Broiler PS' 
        };
        return map[moduleId] || moduleId;
    };

    const handleFlockClick = (flock) => {
        localStorage.setItem('farmguide_active_flock', JSON.stringify({
            ...flock,
            module: flock.module_id,
        }));
        if (flock.module_id === 'layer_ps') {
            navigate('/farmguide/ps/layer/pilih-jenis');
        } else if (flock.module_id === 'parent_stock') {
            navigate('/farmguide/ps/broiler/panduan');
        } else {
            navigate(`/farmguide/${flock.module_id}/panduan`);
        }
    };

    const getModuleIcon = (icon) => {
        // Icons are emoji in modules.json
        return icon;
    };

    const getStatusBadge = (status) => {
        const isNew = status === 'new';
        const badgeLabel = isNew ? t('farmguide.badge.new') || '+ New' : t('farmguide.badge.active') || '✓ Active';
        const badgeClass = isNew ? 'mc-badge mb-new' : 'mc-badge mb-live';
        
        return (
            <span className={badgeClass}>
                {badgeLabel}
            </span>
        );
    };

    const getFeatureLabel = (featureKey) => {
        const labels = {
            management_guide: t('farmguide.weeklyGuide') || 'Weekly Guide',
            growth_chart: t('farmguide.growthChart') || 'Growth Chart',
            flock_saya: t('farmguide.flockSaya') || 'My Flock',
            vaccine_schedule: t('farmguide.vaccine') || 'Vaccine',
            ai_advisory: t('farmguide.aiAdvisory') || 'AI Advisory'
        };
        return labels[featureKey] || featureKey;
    };

    const getModuleTags = (module) => {
        const tags = module.features.map(f => getFeatureLabel(f));
        
        // Add sex selector tag for color_chicken and parent_stock
        if (module.sex_selector_required) {
            tags.push(t('farmguide.maleFemale') || '♂ / ♀');
        }
        
        return tags;
    };

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'id', label: 'ID' },
        { code: 'vi', label: 'VI' },
    ];

    const BroilerIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
    );
    const LayerIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <ellipse cx="12" cy="10" rx="5" ry="6"/>
            <path d="M7 18c0 2 2.2 3 5 3s5-1 5-3"/>
        </svg>
    );
    const ColorIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            <path d="M16 4l2 1M6 4l-2 1M12 2v2"/>
        </svg>
    );
    const BroilerPSIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            <circle cx="18" cy="5" r="2.5"/>
        </svg>
    );
    const LayerPSIcon = () => (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <ellipse cx="12" cy="10" rx="5" ry="6"/>
            <path d="M7 18c0 2 2.2 3 5 3s5-1 5-3"/>
            <ellipse cx="19" cy="19" rx="2" ry="2.5"/>
        </svg>
    );

    const moduleMeta = {
        broiler:        { icon: <BroilerIcon />,   desc: 'D1\u2013D56 management guide' },
        layer:          { icon: <LayerIcon />,     desc: 'W1\u2013W80 production reference' },
        color_chicken:  { icon: <ColorIcon />,     desc: 'W1\u2013W18 local breed guide' },
        broiler_ps:     { icon: <BroilerPSIcon />, desc: 'W1\u2013W64 breeder reference' },
        layer_ps:       { icon: <LayerPSIcon />,   desc: 'W1\u2013W75 breeder guide' },
        color_ps:       { icon: <ColorIcon />,     desc: 'W1–W70 breeder guide' },
    };

    const allModules = [
        { id: 'broiler',       label: 'Broiler',       status: 'active' },
        { id: 'layer',         label: 'Layer',          status: 'active' },
        { id: 'color_chicken', label: 'Color Chicken',  status: 'new' },
        { id: 'broiler_ps',    label: 'Broiler PS',     status: 'active' },
        { id: 'layer_ps',      label: 'Layer PS',       status: 'active' },
        { id: 'color_ps',      label: 'Color PS',       status: 'active' },
    ];

    const commercialModules = allModules.filter(m => !m.id.endsWith('_ps'));
    const parentStockModules = allModules.filter(m => m.id.endsWith('_ps'));

    const handleCardClick = (modId) => {
        if (modId === 'layer_ps') {
            localStorage.setItem('farmguide_active_flock', JSON.stringify({ module_id: 'layer_ps', module: 'layer_ps' }));
            navigate('/farmguide/ps/layer/pilih-jenis');
        } else if (modId === 'color_ps') {
            localStorage.setItem('farmguide_active_flock', JSON.stringify({ module_id: 'color_ps', module: 'color_ps' }));
            navigate('/farmguide/ps/color/pilih-jenis');
        } else if (modId === 'broiler_ps') {
            handleModuleClick('parent_stock');
        } else {
            handleModuleClick(modId);
        }
    };

    const renderModuleCard = (mod) => {
        const meta = moduleMeta[mod.id] || { icon: <BroilerIcon />, desc: '' };
        const isDisabled = mod.status === 'coming_soon';
        return (
            <div
                key={mod.id}
                className={`fw-mod-item-card mod-poultry${isDisabled ? ' disabled' : ''}`}
                onClick={() => !isDisabled && handleCardClick(mod.id)}
                style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
                <div className="fw-mod-item-icon-wrap">
                    {meta.icon}
                </div>
                <div className="fw-mod-item-name">{mod.label}</div>
                <div className="fw-mod-item-tag">{meta.desc}</div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="fw-module-page">
                <div className="fw-mod-card">
                    <div className="fw-mod-content" style={{ textAlign: 'center', padding: '4rem' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fw-module-page">
            {/* ── COMPACT HEADER ── */}
            <div className="fw-mod-top">
                <div
                    className="fw-mod-top-logo"
                    onClick={() => navigate('/')}
                    title="Back to Home"
                >
                    <img src="/images/FarmWell_Logo.png" alt="FarmWell" style={{ width: 34, height: 34, objectFit: 'contain' }} />
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
                        FarmGuide � All Modules
                    </div>

                    {/* Commercial section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 12px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2EAA5E', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: '#b8c2bc', textTransform: 'uppercase' }}>
                            Commercial
                        </span>
                        <span style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
                    </div>
                    <div className="fw-module-grid-2">
                        {commercialModules.map(renderModuleCard)}
                    </div>

                    {/* Parent Stock section */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 12px' }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E87B35', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', color: '#b8c2bc', textTransform: 'uppercase' }}>
                            Parent Stock
                        </span>
                        <span style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
                    </div>
                    <div className="fw-module-grid-2">
                        {parentStockModules.map(renderModuleCard)}
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

export default FarmGuideHome;

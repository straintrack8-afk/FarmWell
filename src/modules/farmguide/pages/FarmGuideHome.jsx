import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import SharedTopNav from '../../../components/SharedTopNav';
import '../../../portal.css';

function FarmGuideHome() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

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
        // Broiler goes directly to panduan (no breed selector)
        if (moduleId === 'broiler') {
            // Set default context for broiler
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            localStorage.setItem('farmguide_active_flock', JSON.stringify({
                ...ctx,
                module_id: 'broiler',
                breed_code: null,
                breed_label: 'Broiler Commercial',
            }));
            navigate(`/farmguide/broiler/panduan`);
        } else {
            // Other modules use breed selector
            navigate(`/farmguide/${moduleId}/pilih-jenis`);
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

    if (loading) {
        return (
            <div className="fw-page">
                <SharedTopNav />
                <div className="fw-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'var(--fw-sub)' }}>
                        Loading modules...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fw-page">
            <SharedTopNav />

            {/* Hero Section */}
            <div className="page-header" style={{
                padding: '2rem 1rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <img
                    src="/FarmGuide_logo.png"
                    alt="FarmGuide"
                    style={{ 
                        height: '120px', 
                        width: 'auto', 
                        marginBottom: '1rem'
                    }}
                />
                <p style={{
                    fontSize: '1.125rem',
                    color: '#4B5563',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6'
                }}>
                    {t('farmguide.subtitle') || 'Production monitor and management reference for poultry farming'}
                </p>
            </div>

            {/* Module Selection */}
            <div className="fw-section">
                {/* All Modules Label */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '700', 
                        letterSpacing: '0.05em', 
                        color: 'var(--fw-sub)',
                        textTransform: 'uppercase'
                    }}>
                        {t('farmguide.allModules') || 'ALL MODULES'}
                    </div>
                </div>

                {/* Module Cards Grid */}
                <div className="fw-modules-grid-2">
                    {modules.map(module => {
                        const isNew = module.status === 'new';
                        return (
                        <div
                            key={module.module_id}
                            className="fw-module-card mc-guide"
                            onClick={() => handleModuleClick(module.module_id)}
                            style={{ 
                                cursor: 'pointer',
                                borderTop: `4px solid ${isNew ? 'var(--fw-orange)' : 'var(--fw-teal)'}` 
                            }}
                        >
                            <div className="fmc-header">
                                <div className="fmc-icon-wrap">
                                    <span className="fmc-emoji">{getModuleIcon(module.icon)}</span>
                                </div>
                                {getStatusBadge(module.status)}
                            </div>
                            <div className="fmc-body">
                                <div className="fmc-name">{module.name}</div>
                                <div className="fmc-desc">
                                    {module.module_id === 'broiler' && (t('farmguide.modules.broiler.desc') || 'Commercial broiler production monitoring with daily BW tracking and performance analysis')}
                                    {module.module_id === 'layer' && (t('farmguide.modules.layer.desc') || 'Layer production monitoring with egg production tracking and rearing performance')}
                                    {module.module_id === 'color_chicken' && (t('farmguide.modules.colorChicken.desc') || 'Color chicken production with daily growth monitoring for male and female birds')}
                                    {module.module_id === 'parent_stock' && (t('farmguide.modules.parentStock.desc') || 'Parent stock management with weekly BW monitoring and production tracking')}
                                </div>
                                <div className="fmc-tags">
                                    {getModuleTags(module).map((tag, idx) => (
                                        <span key={idx} className="fmc-tag">{tag}</span>
                                    ))}
                                </div>
                                <button 
                                    className="fmc-cta" 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        handleModuleClick(module.module_id); 
                                    }}
                                >
                                    {t('farmguide.openModule') || 'Open Module'}
                                    <div className="fmc-cta-arrow">›</div>
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default FarmGuideHome;

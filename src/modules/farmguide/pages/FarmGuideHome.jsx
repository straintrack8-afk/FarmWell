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
        // Broiler, Layer, and Color Chicken go directly to panduan (no breed selector)
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
        } else if (moduleId === 'layer') {
            // Set default context for layer (no breed variants)
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            localStorage.setItem('farmguide_active_flock', JSON.stringify({
                ...ctx,
                module_id: 'layer',
                breed_code: 'layer',
                breed_label: 'Layer Commercial',
            }));
            navigate(`/farmguide/layer/panduan`);
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
            // Set default context for parent stock (broiler PS female)
            const ctx = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            localStorage.setItem('farmguide_active_flock', JSON.stringify({
                ...ctx,
                module_id: 'parent_stock',
                breed_code: 'broiler_ps',
                sex: 'female',
                breed_label: 'Broiler PS',
            }));
            navigate(`/farmguide/parent_stock/panduan`);
        } else {
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
                    style={{ height: '120px', width: 'auto', marginBottom: '1rem' }}
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

            <div className="fw-section">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '960px', margin: '0 auto' }}>

                    {/* COMMERCIAL COLUMN */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--fw-teal)' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--fw-sub)', textTransform: 'uppercase' }}>Commercial</span>
                        </div>
                        <div style={{ borderBottom: '2px solid var(--fw-teal)', marginBottom: '16px' }} />

                        {/* Broiler */}
                        <div className="fw-module-card mc-guide" onClick={() => handleModuleClick('broiler')}
                            style={{ cursor: 'pointer', borderLeft: '4px solid var(--fw-teal)', marginBottom: '12px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🐔</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Broiler</span>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--fw-teal)', fontWeight: '600' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['D1–D56', 'Guide', 'My Flock'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Layer */}
                        <div className="fw-module-card mc-guide" onClick={() => handleModuleClick('layer')}
                            style={{ cursor: 'pointer', borderLeft: '4px solid var(--fw-teal)', marginBottom: '12px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🥚</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Layer</span>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--fw-teal)', fontWeight: '600' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['W1–W80', 'Guide', 'My Flock'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Color Chicken */}
                        <div className="fw-module-card mc-guide" onClick={() => handleModuleClick('color_chicken')}
                            style={{ cursor: 'pointer', borderLeft: '4px solid var(--fw-orange)', marginBottom: '12px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🐓</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Color Chicken</span>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--fw-orange)', fontWeight: '600' }}>New</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['W1–W18', '♂/♀', 'Guide', 'My Flock'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* PARENT STOCK COLUMN */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--fw-orange)' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.08em', color: 'var(--fw-sub)', textTransform: 'uppercase' }}>Parent Stock</span>
                        </div>
                        <div style={{ borderBottom: '2px solid var(--fw-orange)', marginBottom: '16px' }} />

                        {/* Broiler PS */}
                        <div className="fw-module-card mc-guide" onClick={() => handleModuleClick('parent_stock')}
                            style={{ cursor: 'pointer', borderLeft: '4px solid var(--fw-teal)', marginBottom: '12px', padding: '14px 16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🐣</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Broiler PS</span>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--fw-teal)', fontWeight: '600' }}>Active</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['W1–W64', '♂/♀', 'Guide', 'My Flock'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Layer PS - Coming Soon */}
                        <div style={{ borderLeft: '4px solid #ccc', marginBottom: '12px', padding: '14px 16px',
                            background: 'white', borderRadius: '8px', border: '1px solid var(--fw-border)',
                            borderLeftColor: '#ccc', opacity: 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🥚</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Layer PS</span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#999', fontWeight: '600' }}>Coming Soon</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['W1–W70', '♂/♀'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Color PS - Coming Soon */}
                        <div style={{ borderLeft: '4px solid #ccc', marginBottom: '12px', padding: '14px 16px',
                            background: 'white', borderRadius: '8px', border: '1px solid var(--fw-border)',
                            borderLeftColor: '#ccc', opacity: 0.6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>🐓</span>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Color PS</span>
                                </div>
                                <span style={{ fontSize: '11px', color: '#999', fontWeight: '600' }}>Coming Soon</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {['W1–W30', '♂/♀'].map(tag => (
                                    <span key={tag} className="fmc-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FarmGuideHome;

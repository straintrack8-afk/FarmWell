import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import SharedTopNav from '../../../components/SharedTopNav';
import '../../../portal.css';

const BREED_OPTIONS = {
    broiler: [
        { code: 'breed_a', label: 'AA Plus' },
        { code: 'breed_b', label: 'Indian River' },
        { code: 'breed_c', label: 'Ross 308FF' },
    ],
    layer: [
        { code: 'commercial_layer', label: 'Commercial Layer' },
    ],
    color_chicken: [
        { code: 'choi', label: 'Choi' },
        { code: 'mia', label: 'Mia' },
    ],
    parent_stock: [
        { code: 'breed_a', label: 'AA Plus' },
        { code: 'breed_b', label: 'Indian River' },
        { code: 'breed_c', label: 'Ross 308FF' },
    ],
};

function BreedSelector() {
    const navigate = useNavigate();
    const { module } = useParams();
    const { t } = useTranslation();
    const { language } = useLanguage();
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBreed, setSelectedBreed] = useState('');

    useEffect(() => {
        // Broiler doesn't need breed selector - redirect to panduan
        if (module === 'broiler') {
            const existing = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
            localStorage.setItem('farmguide_active_flock', JSON.stringify({
                ...existing,
                module_id: 'broiler',
                breed_code: null,
                breed_label: null,
            }));
            navigate(`/farmguide/broiler/panduan`, { replace: true });
            return;
        }

        // Fetch modules config for other modules
        fetch('/data/farmguide_data/app_config/modules.json')
            .then(res => res.json())
            .then(data => {
                setModules(data.modules);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load modules config:', err);
                setLoading(false);
            });
    }, [module, navigate]);

    useEffect(() => {
        // Auto-select if only one option (layer case)
        if (!loading && modules.length > 0) {
            const options = BREED_OPTIONS[module] || [];
            if (options.length === 1) {
                handleBreedSelect(options[0].code);
            }
        }
    }, [module, loading, modules]);

    const handleBreedSelect = (breedCode) => {
        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('farmguide_active_flock') || '{}');
        
        const updated = {
            ...existing,
            module_id: module,
            breed_code: breedCode,
            selected_at: new Date().toISOString(),
        };
        
        localStorage.setItem('farmguide_active_flock', JSON.stringify(updated));
        
        // Navigate to next screen
        navigateNext();
    };

    const navigateNext = () => {
        const moduleConfig = modules.find(m => m.module_id === module);
        const needsSex = moduleConfig?.sex_selector_required === true;
        
        if (needsSex) {
            navigate(`/farmguide/${module}/pilih-kelamin`);
        } else {
            navigate(`/farmguide/${module}/panduan`);
        }
    };

    const handleContinue = () => {
        if (selectedBreed) {
            handleBreedSelect(selectedBreed);
        }
    };

    const getModuleName = () => {
        const moduleNames = {
            broiler: 'Broiler',
            layer: 'Layer',
            color_chicken: 'Color Chicken',
            parent_stock: 'Parent Stock (PS)',
        };
        return moduleNames[module] || module;
    };

    // Broiler module should not render (already redirected in useEffect)
    if (module === 'broiler') {
        return null;
    }

    const options = BREED_OPTIONS[module] || [];

    // If only one option (layer or color_chicken), show loading while auto-selecting
    if (options.length === 1 && loading) {
        return (
            <div className="fw-page">
                <SharedTopNav />
                <div className="fw-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'var(--fw-sub)' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    // If only one option and loaded, it will auto-navigate (don't render selector)
    if (options.length === 1) {
        return null;
    }

    // Loading state for multi-option modules
    if (loading) {
        return (
            <div className="fw-page">
                <SharedTopNav />
                <div className="fw-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'var(--fw-sub)' }}>
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fw-page">
            <SharedTopNav />

            <div className="fw-section">
                {/* Breadcrumb */}
                <div style={{ 
                    marginBottom: '1.5rem',
                    fontSize: '0.875rem',
                    color: 'var(--fw-sub)'
                }}>
                    <span 
                        onClick={() => navigate('/farmguide')}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        FarmGuide
                    </span>
                    {' > '}
                    <span>{getModuleName()}</span>
                </div>

                {/* Header */}
                <div className="fw-sec-header">
                    <div className="fw-sec-title">{t('farmguide.selectBreed') || 'Select Breed'}</div>
                    <div className="fw-sec-sub">{t('farmguide.selectBreedSubtitle') || 'Choose the breed for your flock'}</div>
                </div>

                {/* Breed Selector Form */}
                <div style={{ 
                    marginTop: '2rem',
                    maxWidth: '500px'
                }}>
                    {/* Label */}
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--fw-text)',
                        marginBottom: '0.5rem'
                    }}>
                        {t('farmguide.breedLabel') || 'Breed'}
                    </label>

                    {/* Dropdown */}
                    <select
                        value={selectedBreed}
                        onChange={(e) => setSelectedBreed(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            color: selectedBreed ? 'var(--fw-text)' : 'var(--fw-sub)',
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--fw-teal)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--fw-border)';
                        }}
                    >
                        <option value="" disabled>
                            {t('farmguide.selectPlaceholder') || '— Select breed —'}
                        </option>
                        {options.map(option => (
                            <option key={option.code} value={option.code}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        disabled={!selectedBreed}
                        style={{
                            marginTop: '1.5rem',
                            padding: '0.875rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: selectedBreed ? 'var(--fw-card)' : 'var(--fw-muted)',
                            background: selectedBreed ? 'var(--fw-teal)' : 'var(--fw-border)',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: selectedBreed ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            opacity: selectedBreed ? 1 : 0.6
                        }}
                        onMouseOver={(e) => {
                            if (selectedBreed) {
                                e.target.style.background = 'var(--fw-teal-dk)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedBreed) {
                                e.target.style.background = 'var(--fw-teal)';
                            }
                        }}
                    >
                        {t('farmguide.continue') || 'Continue →'}
                    </button>
                </div>

                {/* Back Link */}
                <div style={{ marginTop: '2rem' }}>
                    <a
                        onClick={() => navigate('/farmguide')}
                        style={{
                            color: 'var(--fw-sub)',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.color = 'var(--fw-teal)';
                            e.target.style.textDecoration = 'underline';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.color = 'var(--fw-sub)';
                            e.target.style.textDecoration = 'none';
                        }}
                    >
                        {t('farmguide.backToModules') || '← Back to Modules'}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default BreedSelector;

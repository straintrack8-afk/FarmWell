import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import SharedTopNav from '../../../components/SharedTopNav';
import '../../../portal.css';

const MODULES_WITH_SEX = ['color_chicken', 'parent_stock'];

function SexSelector() {
    const navigate = useNavigate();
    const { module } = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        // Route protection: only color_chicken and parent_stock can access this screen
        if (!MODULES_WITH_SEX.includes(module)) {
            navigate('/farmguide');
        }
    }, [module, navigate]);

    const handleSexSelect = (sex) => {
        // sex = 'male' or 'female' (always EN, not translated)
        const existing = JSON.parse(
            localStorage.getItem('farmguide_active_flock') || '{}'
        );

        localStorage.setItem('farmguide_active_flock', JSON.stringify({
            ...existing,
            sex: sex,
        }));

        navigate(`/farmguide/${module}/panduan`);
    };

    const getModuleName = () => {
        const moduleNames = {
            color_chicken: 'Color Chicken',
            parent_stock: 'Parent Stock (PS)',
        };
        return moduleNames[module] || module;
    };

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
                    <div className="fw-sec-title">{t('farmguide.selectSex') || 'Select Sex'}</div>
                    <div className="fw-sec-sub">{t('farmguide.selectSexSubtitle') || 'Choose the sex for your flock'}</div>
                </div>

                {/* Sex Selection Cards */}
                <div style={{ 
                    marginTop: '2.5rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '600px'
                }}>
                    {/* Male Card */}
                    <div
                        onClick={() => handleSexSelect('male')}
                        style={{
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px',
                            padding: '2.5rem 1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fw-orange)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fw-border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            fontSize: '48px',
                            lineHeight: '1',
                            color: 'var(--fw-teal)'
                        }}>
                            ♂
                        </div>
                        
                        {/* Primary Label (localized) */}
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--fw-text)'
                        }}>
                            {t('farmguide.male')?.replace(' ♂', '') || 'Jantan'}
                        </div>
                        
                        {/* Secondary Label (always EN) */}
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--fw-sub)'
                        }}>
                            Male
                        </div>
                    </div>

                    {/* Female Card */}
                    <div
                        onClick={() => handleSexSelect('female')}
                        style={{
                            background: 'var(--fw-card)',
                            border: '2px solid var(--fw-border)',
                            borderRadius: '12px',
                            padding: '2.5rem 1.5rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fw-orange)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--fw-border)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        {/* Icon */}
                        <div style={{
                            fontSize: '48px',
                            lineHeight: '1',
                            color: 'var(--fw-orange)'
                        }}>
                            ♀
                        </div>
                        
                        {/* Primary Label (localized) */}
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: 'var(--fw-text)'
                        }}>
                            {t('farmguide.female')?.replace(' ♀', '') || 'Betina'}
                        </div>
                        
                        {/* Secondary Label (always EN) */}
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'var(--fw-sub)'
                        }}>
                            Female
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div style={{ marginTop: '2rem' }}>
                    <a
                        onClick={() => navigate(`/farmguide/${module}/pilih-jenis`)}
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
                        {t('farmguide.backToBreed') || '← Back'}
                    </a>
                </div>

                {/* Mobile responsive styles */}
                <style>{`
                    @media (max-width: 640px) {
                        .fw-section > div:nth-child(3) {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
}

export default SexSelector;

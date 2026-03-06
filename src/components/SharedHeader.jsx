import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const SharedHeader = ({
    title = '',
    subtitle = '',
    showBackButton = false,
    backPath = '/',
    backLabel = ''
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section className="fw-header-light" style={{ position: 'relative' }}>
            {showBackButton && (
                <button
                    onClick={() => navigate(backPath)}
                    className="fw-back-btn"
                    style={{ position: 'absolute', left: '20px', top: '20px', background: 'var(--fw-card)', padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 'bold', color: 'var(--fw-teal-dk)', border: '1px solid rgba(0,0,0,0.1)', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
                >
                    {backLabel || 'Back'}
                </button>
            )}

            <div
                className="fw-header-logo-wrap"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
                title="Return to Welcome Page"
            >
                <img src="/images/feed_additives_logo.png" alt="Feed Additives" className="fw-header-logo" />
            </div>
            {title && <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--fw-text)', marginTop: '8px', marginBottom: '4px' }}>{title}</h2>}
            <p className="fw-header-sub">
                {subtitle || t('welcome.subtitle') || 'Integrated Livestock Diagnostic & Performance Platform'}
            </p>
        </section>
    );
};

export default SharedHeader;

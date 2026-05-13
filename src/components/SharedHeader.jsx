import React from 'react';
import { useNavigate } from 'react-router-dom';

const SharedHeader = ({
    title = '',
    subtitle = '',
    showBackButton = false,
    backPath = '/',
    backLabel = 'Back',
    logoSrc = '/images/FarmWell_Logo.png',
    logoAlt = 'FarmWell',
}) => {
    const navigate = useNavigate();

    return (
        <div className="fw-module-header">
            {showBackButton && (
                <button
                    className="fw-module-header-back"
                    onClick={() => navigate(backPath)}
                >
                    ← {backLabel}
                </button>
            )}
            <div
                className="fw-module-header-logo-wrap"
                onClick={() => navigate('/')}
                title="Return to Home"
            >
                <img
                    src={logoSrc}
                    alt={logoAlt}
                    className="fw-module-header-logo-img"
                />
            </div>
            {title && (
                <div className="fw-module-header-title">{title}</div>
            )}
            {subtitle && (
                <div className="fw-module-header-sub">{subtitle}</div>
            )}
        </div>
    );
};

export default SharedHeader;

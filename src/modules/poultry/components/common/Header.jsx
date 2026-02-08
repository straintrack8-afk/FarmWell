import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isOffline = false, onBack = null }) => {
    const navigate = useNavigate();

    const handleBackToPoultry = () => {
        if (onBack) {
            onBack();
        }
        navigate('/poultry');
    };

    return (
        <header className="header">
            <div
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={handleBackToPoultry}
            >
                <img
                    src="/images/PoultryWell_Logo.png"
                    alt="PoultryWell"
                    style={{ height: '80px', width: 'auto' }}
                    title="Back to Poultry Module"
                />
            </div>

            <div className="flex items-center gap-3">
                <div className={`offline-indicator ${!isOffline ? 'online' : 'offline'}`}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: !isOffline ? 'var(--success)' : 'var(--warning)'
                    }}></span>
                    {!isOffline ? 'Online' : 'Offline Mode'}
                </div>
            </div>
        </header>
    );
};

export default Header;

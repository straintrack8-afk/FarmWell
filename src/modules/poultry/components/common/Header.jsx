import React from 'react';
import { useDiagnosis } from '../../contexts/DiagnosisContext';
import { STEPS } from '../../utils/constants';

const Header = () => {
    const { isOffline, reset, setStep } = useDiagnosis();

    const resetDiagnosis = () => {
        reset();
    };

    return (
        <header className="header">
            <div
                className="header-logo"
                style={{ cursor: 'pointer' }}
                onClick={() => { resetDiagnosis(); setStep(STEPS.LANDING); }}
            >
                <img
                    src="/images/PoultryWell_Logo.png"
                    alt="FarmWell"
                    style={{ height: '60px', width: 'auto' }}
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

                <a
                    href="/poultry"
                    className="btn btn-sm btn-secondary"
                    style={{ color: '#059669', borderColor: '#d1fae5' }}
                    onClick={(e) => { e.preventDefault(); resetDiagnosis(); window.location.href = '/poultry'; }}
                >
                    ← Back to Poultry Module
                </a>
            </div>
        </header>
    );
};

export default Header;

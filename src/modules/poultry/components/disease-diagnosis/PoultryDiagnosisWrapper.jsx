import React from 'react';
import { usePoultryDisclaimerConsent } from '../../hooks/usePoultryDisclaimerConsent';
import PoultryDisclaimerModal from './PoultryDisclaimerModal';
import PoultryDisclaimerBanner from './PoultryDisclaimerBanner';

function PoultryDiagnosisWrapper({ children, language = 'en' }) {
    const { hasConsented, isLoading, giveConsent } = usePoultryDisclaimerConsent();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid #e5e7eb',
                        borderTopColor: '#667eea',
                        borderRadius: '50%',
                        margin: '0 auto 0.75rem',
                        animation: 'poultryWrapperSpin 1s linear infinite'
                    }} />
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading...</p>
                </div>
                <style>{`
          @keyframes poultryWrapperSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <>
            {/* Step 1: Show modal until user consents */}
            {!hasConsented && (
                <PoultryDisclaimerModal
                    language={language}
                    onAccept={giveConsent}
                />
            )}

            {/* Step 2: After consent — show banner + content */}
            {hasConsented && (
                <>
                    <PoultryDisclaimerBanner language={language} />
                    {children}
                </>
            )}
        </>
    );
}

export default PoultryDiagnosisWrapper;

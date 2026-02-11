import { ReactNode } from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useDisclaimerConsent } from '../../hooks/useDisclaimerConsent';
import { DisclaimerModal } from './DisclaimerModal';
import { PersistentDisclaimerBanner } from './PersistentDisclaimerBanner';
import { DisclaimerLanguage } from '../../constants/disclaimers';

interface DiagnosisWrapperProps {
  children: ReactNode;
}

export function DiagnosisWrapper({ children }: DiagnosisWrapperProps) {
  const { language } = useLanguage();
  const { hasConsented, isLoading, giveConsent } = useDisclaimerConsent();

  // Map app language to disclaimer language
  const disclaimerLanguage: DisclaimerLanguage = 
    language === 'en' ? 'en' : 
    language === 'id' ? 'id' : 
    language === 'vi' ? 'vi' : 'en';

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      {!hasConsented && (
        <DisclaimerModal
          language={disclaimerLanguage}
          onAccept={giveConsent}
        />
      )}
      
      {hasConsented && (
        <>
          <PersistentDisclaimerBanner language={disclaimerLanguage} />
          {children}
        </>
      )}
    </>
  );
}

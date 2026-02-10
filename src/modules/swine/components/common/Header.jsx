import { useDiagnosis } from '../../contexts/DiagnosisContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';

function Header() {
    const { isOnline, resetDiagnosis } = useDiagnosis();
    const { t, language } = useTranslation();
    const location = useLocation();

    // Check if we're on any diagnosis or biosecurity page
    const isPigWellPage = location.pathname.includes('/diagnosis') || location.pathname.includes('/biosecurity');
    const logoSrc = isPigWellPage ? '/images/PigWell_Logo.png' : '/images/FarmWell_Logo.png';
    const logoAlt = isPigWellPage ? 'PigWell Logo' : 'FarmWell Logo';
    const logoHref = isPigWellPage ? '/swine' : '/';

    return (
        <header className="header">
            <a href={logoHref} className="header-logo" onClick={(e) => {
                e.preventDefault();
                // Don't reset diagnosis when navigating from PigWell pages to avoid flash
                // The state will be reset when user starts a new diagnosis
                if (!isPigWellPage) {
                    resetDiagnosis();
                }
                window.location.href = logoHref;
            }}>
                <img
                    src={logoSrc}
                    alt={logoAlt}
                    style={{ height: '80px', width: 'auto' }}
                />
            </a>


            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    padding: '0.5rem 1rem',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    {language.toUpperCase()}
                </div>
                <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isOnline ? '#10B981' : '#F59E0B'
                    }}></span>
                    {isOnline ? t('swine.diagnosis.landing.online') : t('swine.diagnosis.landing.offlineMode')}
                </div>
            </div>
        </header>
    );
}

export default Header;

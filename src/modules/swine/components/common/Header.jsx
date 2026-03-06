import { useDiagnosis } from '../../contexts/DiagnosisContext';
import { useLocation } from 'react-router-dom';

function Header() {
    const { isOnline, resetDiagnosis } = useDiagnosis();
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
                {/* Online/Offline indicator */}
                <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isOnline ? '#10B981' : '#F59E0B'
                    }}></span>
                    {isOnline ? 'Online' : 'Offline'}
                </div>
            </div>
        </header>
    );
}

export default Header;

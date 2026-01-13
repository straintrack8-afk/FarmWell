import { useDiagnosis } from '../../contexts/DiagnosisContext';

function Header() {
    const { isOnline, resetDiagnosis } = useDiagnosis();

    return (
        <header className="header">
            <a href="/" className="header-logo" onClick={(e) => { e.preventDefault(); resetDiagnosis(); window.location.href = '/'; }}>
                <img
                    src="/images/PigWell_Logo.png"
                    alt="FarmWell Logo"
                    style={{ height: '80px', width: 'auto' }}
                />
            </a>


            <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isOnline ? '#10B981' : '#F59E0B'
                    }}></span>
                    {isOnline ? 'Online' : 'Offline'}
                </div>
                <a
                    href="/"
                    onClick={(e) => { e.preventDefault(); resetDiagnosis(); window.location.href = '/'; }}
                    className="exit-link"
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#EF4444',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        background: '#FEF2F2',
                        textDecoration: 'none'
                    }}
                >
                    Exit Module
                </a>
            </div>
        </header>
    );
}

export default Header;

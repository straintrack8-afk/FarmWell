import { useDiagnosis } from '../../contexts/DiagnosisContext';

function Header() {
    const { isOnline, resetDiagnosis } = useDiagnosis();

    return (
        <header className="header">
            <a href="/" className="header-logo" onClick={(e) => { e.preventDefault(); resetDiagnosis(); window.location.href = '/'; }}>
                <img
                    src="/images/Pigwell_logo.png"
                    alt="PigWell Logo"
                    style={{ height: '80px', width: 'auto' }}
                />
                <span style={{ marginLeft: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>PigWell</span>
            </a>

            <div className={`offline-indicator ${isOnline ? 'online' : 'offline'}`}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isOnline ? '#10B981' : '#F59E0B'
                }}></span>
                {isOnline ? 'Online' : 'Offline'}
            </div>
        </header>
    );
}

export default Header;

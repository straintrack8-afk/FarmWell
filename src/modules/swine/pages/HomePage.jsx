import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';

function HomePage() {
    const navigate = useNavigate();
    const { diseases, loading } = useDiagnosis();

    const handleStartDiagnosis = () => {
        navigate('age');
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                    src="/images/PigWell_Logo.png"
                    alt="FarmWell"
                    style={{ height: '180px', width: 'auto', marginBottom: '1.5rem' }}
                />
                <p className="page-subtitle" style={{ width: '100%', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Identify livestock diseases based on age and symptoms. Fast, accurate, and works offline.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleStartDiagnosis}
                    >
                        🔍 Start Diagnosis
                    </button>
                    <button
                        className="btn btn-lg"
                        onClick={() => navigate('biosecurity')}
                        style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        🛡️ Biosecurity Check
                    </button>
                </div>
            </div>

            <div style={{
                maxWidth: '600px',
                margin: '0 auto',
                padding: '0 1rem 2rem'
            }}>
                <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>How It Works</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            flexShrink: 0
                        }}>1</div>
                        <div>
                            <div style={{ fontWeight: '600' }}>Select Age Group</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Choose the affected pig's age category
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            flexShrink: 0
                        }}>2</div>
                        <div>
                            <div style={{ fontWeight: '600' }}>Select Symptoms</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Check all observable symptoms
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            flexShrink: 0
                        }}>3</div>
                        <div>
                            <div style={{ fontWeight: '600' }}>Get Results</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                View matching diseases with details
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="zoonotic-warning" style={{ maxWidth: '600px', margin: '0 auto 2rem', marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="zoonotic-warning-icon">⚠️</div>
                <div className="zoonotic-warning-content">
                    <div className="zoonotic-warning-title">Zoonotic Disease Alerts</div>
                    <div className="zoonotic-warning-text">
                        This app highlights diseases that can spread to humans. Always follow biosecurity protocols.
                    </div>
                </div>
            </div>

            <div className="footer-branding" style={{ marginTop: '4rem', paddingBottom: '2rem' }}>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                    Powered By
                </p>
                <div className="flex justify-center items-center">
                    <img
                        src="/images/Vaksindo_logo.png"
                        alt="Vaksindo"
                        className="vaksindo-logo"
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;

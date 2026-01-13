import React from 'react';
import { useNavigate } from 'react-router-dom';

function PoultryLanding() {
    const navigate = useNavigate();

    const handleDiagnosticTool = () => {
        navigate('/poultry/diagnostic');
    };

    const handleHatcheryAudit = () => {
        navigate('/poultry/hatchery-audit');
    };

    return (
        <div className="container">
            <div className="page-header" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-sm btn-secondary"
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        color: '#dc2626',
                        borderColor: '#fee2e2'
                    }}
                >
                    Exit Module
                </button>
                <img
                    src="/images/PoultryWell_Logo.png"
                    alt="FarmWell Poultry"
                    style={{ height: '180px', width: 'auto', marginBottom: '1.5rem' }}
                />
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
                    Poultry Management Tools
                </h1>
                <p className="page-subtitle" style={{ width: '100%', maxWidth: '600px', margin: '0 auto 2rem', textAlign: 'center' }}>
                    Comprehensive tools for poultry health diagnostics and hatchery quality management
                </p>
            </div>

            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 1rem 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Diagnostic Tool Card */}
                <div className="card" style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid transparent'
                }}
                    onClick={handleDiagnosticTool}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        🔍
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Disease Diagnostic Tool
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Identify poultry diseases based on age and clinical symptoms. Fast, accurate, and works offline.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                        Start Diagnosis
                    </button>
                </div>

                {/* Hatchery Audit Card */}
                <div className="card" style={{
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: '2px solid transparent'
                }}
                    onClick={handleHatcheryAudit}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#10B981';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        🧫
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Hatchery Audit
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Comprehensive quarterly assessment of hatchery operations, vaccine management, and environmental quality.
                    </p>
                    <button className="btn btn-success" style={{ width: '100%' }}>
                        Open Hatchery Audit
                    </button>
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

export default PoultryLanding;

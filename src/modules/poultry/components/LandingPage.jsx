import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

function LandingPage() {
    const { setStep, allDiseases, isLoading } = useDiagnosis();

    const handleStartDiagnosis = () => {
        setStep(STEPS.AGE);
    };

    if (isLoading) {
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
                    src="/images/PoultryWell_Logo.png"
                    alt="FarmWell"
                    style={{ height: '180px', width: 'auto', marginBottom: '1.5rem' }}
                />
                <p className="page-subtitle" style={{ width: '100%', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Identify livestock diseases based on age and symptoms. Fast, accurate, and works offline.
                </p>

                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStartDiagnosis}
                    style={{ marginBottom: '2rem' }}
                >
                    🔍 Start Diagnosis
                </button>
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 0 2rem'
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
                                Choose the affected birds' age category
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
                                Check all observable clinical signs
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
                                View matching diseases with expert details
                            </div>
                        </div>
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

export default LandingPage;

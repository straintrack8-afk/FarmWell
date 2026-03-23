import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Body Part & Symptoms' },
        { num: 3, label: 'Results' }
    ];

    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {steps.map(s => (
                    <div key={s.num} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                        <div style={{
                            width: 'clamp(28px, 8vw, 40px)',
                            height: 'clamp(28px, 8vw, 40px)',
                            borderRadius: '50%',
                            background: step >= s.num ? '#10b981' : '#e5e7eb',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: '0.35rem'
                        }}>
                            {s.num}
                        </div>
                        <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AgeSelection() {
    const navigate = useNavigate();
    const {
        selectedAge,
        setAge,
        setStep,
        ageGroups
    } = useDiagnosis();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Debug: Track when selectedAge changes
    useEffect(() => {
        console.log('⚡ selectedAge changed to:', selectedAge);
    }, [selectedAge]);

    const handleSelectAge = (ageId) => {
        console.log('🔵 Age selected:', ageId);
        console.log('🔵 Before setAge - selectedAge:', selectedAge);
        setAge(ageId);
        console.log('🔵 After setAge - selectedAge:', selectedAge); // Still old value due to async state update
    };

    const handleContinue = (e) => {
        console.log('🟢 Continue clicked');
        console.log('🟢 Current selectedAge:', selectedAge);
        
        e.preventDefault(); // Prevent any default form behavior
        
        if (!selectedAge) {
            console.log('🔴 No age selected - returning');
            return; // Don't proceed if no age is selected
        }
        
        console.log('🟢 Navigating to symptoms page...');
        // Set the step first, then navigate
        setStep(STEPS.SYMPTOMS);
        navigate('/poultry/diagnostic/symptoms');
        console.log('🟢 Navigate called');
    };

    const themeGradient = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            paddingBottom: selectedAge ? '20px' : '2rem'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                <ProgressBar step={1} />

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'var(--primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Select Age Group
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                        Choose the age group of the affected birds
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    padding: '1rem'
                }}>
                    {ageGroups && ageGroups.map((age, index) => (
                        <div
                            key={age.id}
                            style={{
                                background: selectedAge === age.id ? themeGradient : 'white',
                                borderRadius: '1.5rem',
                                padding: '2.5rem 1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selectedAge === age.id
                                    ? '0 20px 40px rgba(16, 185, 129, 0.25)'
                                    : '0 4px 20px rgba(16, 185, 129, 0.05)',
                                border: selectedAge === age.id ? '2px solid transparent' : '2px solid rgba(16, 185, 129, 0.15)',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => handleSelectAge(age.id)}
                            onMouseEnter={(e) => {
                                if (selectedAge !== age.id) {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
                                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedAge !== age.id) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.05)';
                                    e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.15)';
                                }
                            }}
                        >
                            {/* Decorative circle for selected state */}
                            {selectedAge === age.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-40px',
                                    right: '-40px',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    pointerEvents: 'none'
                                }} />
                            )}

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    fontSize: '4rem',
                                    marginBottom: '1rem',
                                    filter: selectedAge === age.id ? 'brightness(1.2)' : 'none'
                                }}>
                                    {age.icon || ''}
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    color: selectedAge === age.id ? 'white' : '#111827'
                                }}>
                                    {age.shortLabel || age.label}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: selectedAge === age.id ? 'rgba(255, 255, 255, 0.9)' : '#6B7280',
                                    lineHeight: '1.5'
                                }}>
                                    {age.shortLabel ? age.label : ''}
                                </div>
                            </div>

                            {/* Checkmark for selected */}
                            {selectedAge === age.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem'
                                }}>

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedAge && (
                <div className="action-bar" style={{ animation: 'slideUp 0.3s ease-out' }}>
                    <div className="action-bar-content">
                        <div className="action-bar-info">
                            Selected: <strong style={{ color: 'white' }}>
                                {ageGroups.find(a => a.id === selectedAge)?.label}
                            </strong>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleContinue}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default AgeSelection;

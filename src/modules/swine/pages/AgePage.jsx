import { useNavigate } from 'react-router-dom';
import { useDiagnosis, AGE_GROUPS } from '../contexts/DiagnosisContext';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Results' }
    ];

    return (
        <div className="progress-steps">
            {steps.map(s => (
                <div
                    key={s.num}
                    className={`progress-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
                >
                    <div className="step-number">
                        {step > s.num ? '✓' : s.num}
                    </div>
                    <span>{s.label}</span>
                </div>
            ))}
        </div>
    );
}

function AgePage() {
    const navigate = useNavigate();
    const { selectedAge, setSelectedAge } = useDiagnosis();

    const handleSelectAge = (ageId) => {
        setSelectedAge(ageId);
    };

    const handleContinue = () => {
        if (selectedAge) {
            navigate('/swine/diagnosis/symptoms');
        }
    };

    // Gradient colors for age cards
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingBottom: selectedAge ? '120px' : '2rem'
        }}>
            <ProgressBar step={1} />

            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Select Age Group
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                        Choose the age group of the affected pig(s)
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    padding: '1rem'
                }}>
                    {AGE_GROUPS.map((age, index) => (
                        <div
                            key={age.id}
                            style={{
                                background: selectedAge === age.id ? gradients[index % gradients.length] : 'white',
                                borderRadius: '1.5rem',
                                padding: '2.5rem 1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: selectedAge === age.id
                                    ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                border: selectedAge === age.id ? 'none' : '2px solid #e5e7eb',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onClick={() => handleSelectAge(age.id)}
                            onMouseEnter={(e) => {
                                if (selectedAge !== age.id) {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.borderColor = '#667eea';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedAge !== age.id) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
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
                                    {age.icon}
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    color: selectedAge === age.id ? 'white' : '#111827'
                                }}>
                                    {age.name}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: selectedAge === age.id ? 'rgba(255, 255, 255, 0.9)' : '#6B7280',
                                    lineHeight: '1.5'
                                }}>
                                    {age.description}
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
                                    ✓
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {selectedAge && (
                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1.5rem 2rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid #e5e7eb',
                    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
                    zIndex: 1000,
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                    }}>
                        <div style={{ fontSize: '1rem', color: '#6B7280' }}>
                            Selected: <strong style={{ color: '#111827' }}>
                                {AGE_GROUPS.find(a => a.id === selectedAge)?.name}
                            </strong>
                        </div>
                        <button
                            style={{
                                padding: '1rem 2.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: 'white',
                                fontSize: '1.0625rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }}
                            onClick={handleContinue}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            Continue →
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

export default AgePage;

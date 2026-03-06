import { useNavigate } from 'react-router-dom';
import { useDiagnosis, AGE_GROUPS } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { swineTranslations } from '../translations';
import { DiagnosisWrapper } from '../components/disease-diagnosis/DiagnosisWrapper';

function ProgressBar({ step, t }) {
    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                        <div style={{
                            width: 'clamp(28px, 8vw, 40px)',
                            height: 'clamp(28px, 8vw, 40px)',
                            borderRadius: '50%',
                            background: step >= s ? '#10b981' : '#e5e7eb',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: '0.35rem'
                        }}>
                            {s}
                        </div>
                        <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                            {s === 1 && t('stepAge')}
                            {s === 2 && t('stepSymptoms')}
                            {s === 3 && t('stepResults')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AgePage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = (key) => swineTranslations[language]?.[key] || swineTranslations['en'][key];
    const { selectedAge, setSelectedAge } = useDiagnosis();

    const handleSelectAge = (ageId) => {
        setSelectedAge(ageId);
    };

    const handleContinue = () => {
        if (selectedAge) {
            navigate('/swine/diagnosis/symptoms');
        }
    };

    // Green theme color for selected age cards
    const themeGradient = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

    return (
        <DiagnosisWrapper>
            <div style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                paddingBottom: selectedAge ? '120px' : '2rem'
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
                    <ProgressBar step={1} t={t} />

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
                            {t('selectAgeGroup')}
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>
                            {t('chooseAgeGroup')}
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
                                        {age.icon}
                                    </div>
                                    <div style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '700',
                                        marginBottom: '0.5rem',
                                        color: selectedAge === age.id ? 'white' : '#111827',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.25rem'
                                    }}>
                                        {t(age.id).split(' (')[0]}
                                        {t(age.id).includes('(') && (
                                            <span style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.9 }}>
                                                ({t(age.id).split(' (')[1]}
                                            </span>
                                        )}
                                    </div>
                                    <div style={{
                                        fontSize: '0.875rem',
                                        color: selectedAge === age.id ? 'rgba(255, 255, 255, 0.9)' : '#6B7280',
                                        lineHeight: '1.5'
                                    }}>
                                        {t(age.id + 'Desc')}
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
                                    {t(selectedAge)}
                                </strong>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={handleContinue}
                            >
                                {t('continueButton')}
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
        </DiagnosisWrapper>
    );
}

export default AgePage;

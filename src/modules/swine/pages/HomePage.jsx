import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useTranslation } from '../../../hooks/useTranslation';

function HomePage() {
    const navigate = useNavigate();
    const { loading } = useDiagnosis();
    const { t } = useTranslation();

    const handleStartDiagnosis = () => {
        navigate('diagnosis/age');
    };

    const handleStartBiosecurity = () => {
        navigate('biosecurity');
    };

    const handleOpenCalculator = () => {
        navigate('farm-calculator');
    };

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <>
            {/* PigWell Logo (centered) */}
            <div className="page-header" style={{
                padding: '0.1875rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <img
                    src="/images/PigWell_Logo.png"
                    alt="PigWell"
                    style={{ height: '200px', width: 'auto', marginBottom: '0.75rem' }}
                />
            </div>

            {/* Feature Cards */}
            <div className="feature-grid" style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 1rem 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Disease Diagnosis Feature */}
                <div className="action-card" onClick={handleStartDiagnosis}>
                    <span className="action-card-icon">🔍</span>
                    <h3 className="action-card-title">
                        {t('swine.diagnosis.title')}
                    </h3>
                    <p className="action-card-description">
                        {t('swine.diagnosis.description')}
                    </p>
                    <ul className="action-card-features">
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.diagnosis.features.ageSpecific')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.diagnosis.features.symptomBased')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.diagnosis.features.treatment')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.diagnosis.features.offline')}</span>
                        </li>
                    </ul>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {t('swine.diagnosis.button')} →
                    </button>
                </div>

                {/* Biosecurity Assessment Feature */}
                <div className="action-card" onClick={handleStartBiosecurity}>
                    <span className="action-card-icon">🛡️</span>
                    <h3 className="action-card-title">
                        {t('swine.biosecurity.title')}
                    </h3>
                    <p className="action-card-description">
                        {t('swine.biosecurity.description')}
                    </p>
                    <ul className="action-card-features">
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.biosecurity.features.questions')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.biosecurity.features.scores')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.biosecurity.features.reports')}</span>
                        </li>
                        <li className="action-card-feature">
                            <span className="action-card-feature-icon">✓</span>
                            <span>{t('swine.biosecurity.features.multilingual')}</span>
                        </li>
                    </ul>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {t('swine.biosecurity.button')} →
                    </button>
                </div>

                {/* Farm Calculator Feature */}
                <div className="action-card" onClick={handleOpenCalculator}>
                    <span className="action-card-icon">🧮</span>
                    <h3 className="action-card-title">
                        {t('swine.calculator.title')}
                    </h3>
                    <p className="action-card-description" style={{ marginBottom: '1.5rem' }}>
                        {t('swine.calculator.description')}
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                        {t('swine.calculator.button')}
                    </button>
                </div>
            </div>

            {/* Footer Branding */}
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
        </>
    );
}

export default HomePage;

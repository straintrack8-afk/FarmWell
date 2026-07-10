import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';

function HomePage() {
    const navigate = useNavigate();
    const { loading } = useDiagnosis();
    const { t } = useTranslation();
    const { language } = useLanguage();

    const handleStartDiagnosis = () => {
        navigate('diagnostic');
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

    const tagline = {
        en: "An integrated swine management platform for disease diagnostics, biosecurity audits, and farm management support.",
        id: "Platform manajemen babi terintegrasi untuk diagnostik penyakit, audit biosekuriti, dan dukungan manajemen peternakan.",
        vi: "Nền tảng quản lý lợn tích hợp cho chẩn đoán bệnh, kiểm toán an toàn sinh học và hỗ trợ quản lý trang trại."
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card" style={{ background: 'none' }}>
            {/* Under Construction Banner */}
            <div style={{
                background: '#FFF8E1',
                border: '1.5px solid #F9A825',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
            }}>
                <svg width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='#F9A825' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'/>
                    <line x1='12' y1='9' x2='12' y2='13'/><line x1='12' y1='17' x2='12.01' y2='17'/>
                </svg>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#E65100' }}>
                        {language === 'vi' ? 'Đang Phát Triển' : language === 'id' ? 'Sedang Dikembangkan' : 'Under Construction'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#795548', marginTop: '2px' }}>
                        {language === 'vi'
                            ? 'PigWell đang được cải tiến. Một số tính năng có thể thay đổi.'
                            : language === 'id'
                            ? 'PigWell sedang dalam pengembangan. Beberapa fitur mungkin berubah.'
                            : 'PigWell is being improved. Some features may change.'}
                    </div>
                </div>
            </div>
                    {/* PigWell Logo (centered) */}
                    <div className="page-header" style={{
                        padding: '0.1875rem 1rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <img
                            src="/images/PigWell_Logo.png"
                            alt="PigWell"
                            style={{ 
                                height: '200px', 
                                width: 'auto', 
                                marginBottom: '1.5rem',
                                marginTop: '-3rem'
                            }}
                        />
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#4B5563',
                            maxWidth: '600px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            {tagline[language]}
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="feature-grid" style={{
                        maxWidth: '900px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '1rem',
                        border: '3px solid #10B981',
                        borderRadius: '12px',
                        padding: '1rem'
                    }}>
                        {/* Diagnostic Tool Card */}
                        <div className="action-card" onClick={handleStartDiagnosis} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('swine.diagnosis.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('swine.diagnosis.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('swine.diagnosis.button')}
                            </button>
                        </div>

                        {/* Biosecurity Assessment Card */}
                        <div className="action-card" onClick={handleStartBiosecurity} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('swine.biosecurity.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('swine.biosecurity.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('swine.biosecurity.button')}
                            </button>
                        </div>

                        {/* Farm Calculator Card */}
                        <div className="action-card" onClick={handleOpenCalculator} style={{
                            border: '2px solid #10B981',
                            borderRadius: '8px'
                        }}>
                            <span className="action-card-icon"></span>
                            <h3 className="action-card-title">
                                {t('swine.calculator.title')}
                            </h3>
                            <p className="action-card-description">
                                {t('swine.calculator.description')}
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
                                {t('swine.calculator.button')}
                            </button>
                        </div>

                    </div>

                    </div>
            </div>
        </div>
    );
}

export default HomePage;

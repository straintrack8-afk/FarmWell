import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getAvailableLanguages } from '../../data/questions_data';

function LanguageSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setLanguage } = useLanguage(); // Use global language context
    const languages = getAvailableLanguages();

    const handleLanguageSelect = (languageCode) => {
        setLanguage(languageCode);

        // Navigate back to previous page if specified, otherwise go to farm profile
        const returnTo = location.state?.returnTo || '/swine/biosecurity/farm-profile';
        navigate(returnTo);
    };

    return (
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    🌾🐷
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    FarmWell - PigWell
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Swine Biosecurity Assessment
                </p>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', marginBottom: '0.5rem' }}>
                    Select Your Language
                </h2>
                <p style={{ fontSize: '1.125rem', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Pilih Bahasa Anda
                </p>
                <p style={{ fontSize: '1.125rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Chọn Ngôn Ngữ
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        className="card"
                        onClick={() => handleLanguageSelect(lang.code)}
                        style={{
                            cursor: 'pointer',
                            border: 'none',
                            background: 'white',
                            padding: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            textAlign: 'left'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(8px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>{lang.flag}</span>
                            <div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                    {lang.nativeName}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {lang.name}
                                </div>
                            </div>
                        </div>
                        <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>›</span>
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                    💡 Note: You can change language anytime in Settings
                </p>
            </div>
        </div>
    );
}

export default LanguageSelectionPage;

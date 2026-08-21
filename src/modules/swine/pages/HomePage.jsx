import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import PigWellTopNav from '../components/common/PigWellTopNav';

const DiagnosisIcon = () => (
    <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
    </svg>
);

const BioIcon = () => (
    <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const CalcIcon = () => (
    <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
        <rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h4"/>
    </svg>
);

function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language } = useLanguage();

    const tagline = {
        en: 'An integrated swine management platform for disease diagnostics, biosecurity audits, and farm management support.',
        id: 'Platform manajemen babi terintegrasi untuk diagnostik penyakit, audit biosekuriti, dan dukungan manajemen peternakan.',
        vi: 'Nền tảng quản lý lợn tích hợp cho chẩn đoán bệnh, kiểm toán an toàn sinh học và hỗ trợ quản lý trang trại.'
    };

    const features = [
        {
            icon: <DiagnosisIcon />,
            title: t('swine.diagnosis.title') || 'Disease Diagnosis',
            desc: t('swine.diagnosis.description') || 'Identify diseases based on age and symptoms',
            action: () => navigate('diagnostic'),
            btn: t('swine.diagnosis.button') || 'Start Diagnosis',
        },
        {
            icon: <BioIcon />,
            title: t('swine.biosecurity.title') || 'Biosecurity Assessment',
            desc: t('swine.biosecurity.description') || 'Comprehensive biosecurity evaluation for your pig farm',
            action: () => navigate('biosecurity'),
            btn: t('swine.biosecurity.button') || 'Start Assessment',
        },
        {
            icon: <CalcIcon />,
            title: t('swine.calculator.title') || 'Pig Farm Calculator',
            desc: t('swine.calculator.description') || 'Production modeling and financial projection',
            action: () => navigate('farm-calculator'),
            btn: t('swine.calculator.button') || 'Open Calculator',
        },
    ];

    return (
        <div className="fw-module-page">
            <PigWellTopNav title="PigWell" backPath="/" backLabel="FarmWell" />

            <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
                <div className="fw-mod-content">
                    {/* Under Construction Banner */}
                    <div style={{
                        background: '#FFF8E1', border: '1.5px solid #F9A825',
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9A825" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#E65100' }}>
                                {language === 'vi' ? 'Đang Phát Triển' : language === 'id' ? 'Sedang Dikembangkan' : 'Under Construction'}
                            </div>
                            <div style={{ fontSize: 11, color: '#795548', marginTop: 2 }}>
                                {language === 'vi' ? 'PigWell đang được cải tiến.' : language === 'id' ? 'PigWell sedang dalam pengembangan.' : 'PigWell is being improved. Some features may change.'}
                            </div>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p style={{ fontSize: 13, color: 'var(--fw-sub)', textAlign: 'center', marginBottom: 20, lineHeight: 1.6 }}>
                        {tagline[language]}
                    </p>

                    {/* Feature cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {features.map((f, i) => (
                            <div key={i} className="fw-mod-item-card mod-swine" onClick={f.action} style={{ cursor: 'pointer' }}>
                                <div className="fw-mod-item-icon-wrap" style={{ background: '#E8F5EE' }}>
                                    {f.icon}
                                </div>
                                <div className="fw-mod-item-name">{f.title}</div>
                                <div className="fw-mod-item-tag">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fw-mod-bnav">
                <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Home</span>
                </button>
                <button className="fw-mod-bnav-alerts" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                    <span>PigWell</span>
                </button>
            </div>
        </div>
    );
}

export default HomePage;

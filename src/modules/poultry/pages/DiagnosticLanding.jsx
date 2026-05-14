import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const AllDiseasesIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="2"/>
        <path d="M9 12h6M9 16h4"/>
    </svg>
);

const DiagnosisIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
    </svg>
);

const CompareIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M18 3l3 3-3 3"/>
        <path d="M21 6H9"/>
        <path d="M6 21l-3-3 3-3"/>
        <path d="M3 18h12"/>
        <path d="M12 3v18"/>
    </svg>
);

const translations = {
    en: {
        pageTitle: 'Diagnostic Tools',
        selectTool: 'Select Tool',
        allDiseases: { name: 'All Diseases & Conditions', desc: 'Browse 129 poultry diseases with detailed info' },
        diagnosis: { name: 'Diagnosis Tool', desc: 'Select symptoms to diagnose with confidence scoring' },
        compare: { name: 'Compare Diseases', desc: 'Side-by-side disease comparison tool' },
        home: 'Home',
        poultrywell: 'PoultryWell',
    },
    id: {
        pageTitle: 'Alat Diagnostik',
        selectTool: 'Pilih Alat',
        allDiseases: { name: 'Semua Penyakit & Kondisi', desc: 'Jelajahi 129 penyakit unggas dengan info lengkap' },
        diagnosis: { name: 'Alat Diagnosis', desc: 'Pilih gejala untuk mendiagnosis dengan skor kepercayaan' },
        compare: { name: 'Bandingkan Penyakit', desc: 'Perbandingan karakteristik penyakit secara berdampingan' },
        home: 'Beranda',
        poultrywell: 'PoultryWell',
    },
    vi: {
        pageTitle: 'Công Cụ Chẩn Đoán',
        selectTool: 'Chọn Công Cụ',
        allDiseases: { name: 'Tất Cả Bệnh & Tình Trạng', desc: 'Duyệt 129 bệnh gia cầm với thông tin chi tiết' },
        diagnosis: { name: 'Công Cụ Chẩn Đoán', desc: 'Chọn triệu chứng để chẩn đoán với điểm tin cậy' },
        compare: { name: 'So Sánh Bệnh', desc: 'Công cụ so sánh đặc điểm bệnh song song' },
        home: 'Trang chủ',
        poultrywell: 'PoultryWell',
    },
};

const DiagnosticLanding = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = translations[language] || translations.en;

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const tools = [
        {
            id: 'all-diseases',
            icon: <AllDiseasesIcon />,
            name: t.allDiseases.name,
            desc: t.allDiseases.desc,
            route: '/poultry/diseases',
        },
        {
            id: 'diagnosis',
            icon: <DiagnosisIcon />,
            name: t.diagnosis.name,
            desc: t.diagnosis.desc,
            route: '/poultry/diagnostic/age',
        },
        {
            id: 'compare',
            icon: <CompareIcon />,
            name: t.compare.name,
            desc: t.compare.desc,
            route: '/poultry/compare',
        },
    ];

    return (
        <div className="fw-module-page">

            {/* ── COMPACT HEADER ── */}
            <div className="fw-mod-top" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/poultry')}
                    title="PoultryWell"
                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px', padding: '4px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <img src="/images/PoultryWell_Logo.png" alt="PoultryWell" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                </button>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'white', letterSpacing: '0.5px' }}>
                    {t.pageTitle}
                </div>
                <div style={{ width: '80px' }} />
            </div>

            {/* ── WHITE CARD ── */}
            <div className="fw-mod-card">
                <div className="fw-mod-content">
                    <div className="fw-welcome-section-label">{t.selectTool}</div>

                    {/* Tool list — horizontal cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tools.map(tool => (
                            <div
                                key={tool.id}
                                onClick={() => navigate(tool.route)}
                                style={{ background: '#f7fbf8', borderRadius: '14px', border: '0.5px solid #dff0e6', padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2EAA5E'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(46,170,94,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dff0e6'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ width: '48px', height: '48px', background: '#ddf2e8', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {tool.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#1a2e1a', marginBottom: '2px' }}>{tool.name}</div>
                                    <div style={{ fontSize: '11px', color: '#6a8a6a', lineHeight: 1.4 }}>{tool.desc}</div>
                                </div>
                                <div style={{ fontSize: '20px', color: '#2EAA5E', fontWeight: '700', flexShrink: 0, lineHeight: 1 }}>›</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── BOTTOM NAV ── */}
                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>{t.home}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DiagnosticLanding;

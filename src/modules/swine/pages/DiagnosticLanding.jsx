import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import PigWellTopNav from '../components/common/PigWellTopNav';

const translations = {
  en: {
    pageTitle: 'Disease Diagnostic Tools',
    allDiseases: { title: 'All Diseases & Conditions', desc: 'Browse 104 swine diseases with detailed info' },
    diagnosis: { title: 'Diagnosis Tool', desc: 'Select symptoms to diagnose with confidence scoring' },
    compare: { title: 'Compare Diseases', desc: 'Side-by-side disease comparison tool' },
  },
  id: {
    pageTitle: 'Alat Diagnostik Penyakit',
    allDiseases: { title: 'Semua Penyakit & Kondisi', desc: 'Jelajahi 104 penyakit babi dengan info lengkap' },
    diagnosis: { title: 'Alat Diagnosis', desc: 'Pilih gejala untuk diagnosis dengan skor kepercayaan' },
    compare: { title: 'Bandingkan Penyakit', desc: 'Perbandingan penyakit secara berdampingan' },
  },
  vi: {
    pageTitle: 'Công Cụ Chẩn Đoán Bệnh',
    allDiseases: { title: 'Tất Cả Bệnh & Tình Trạng', desc: 'Duyệt 104 bệnh lợn với thông tin chi tiết' },
    diagnosis: { title: 'Công Cụ Chẩn Đoán', desc: 'Chọn triệu chứng để chẩn đoán với điểm tin cậy' },
    compare: { title: 'So Sánh Bệnh', desc: 'Công cụ so sánh bệnh song song' },
  }
};

const AllDiseasesIcon = () => (
  <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
    <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4"/>
    <path d="M9 3a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
);

const DiagnosisIcon = () => (
  <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/>
  </svg>
);

const CompareIcon = () => (
  <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
    <path d="M18 20V10M12 20V4M6 20v-6"/>
  </svg>
);

const DiagnosticLanding = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const tools = [
    { icon: <AllDiseasesIcon />, title: t.allDiseases.title, desc: t.allDiseases.desc, route: '/swine/diseases' },
    { icon: <DiagnosisIcon />, title: t.diagnosis.title, desc: t.diagnosis.desc, route: '/swine/diagnosis/age' },
    { icon: <CompareIcon />, title: t.compare.title, desc: t.compare.desc, route: '/swine/compare' },
  ];

  return (
    <div className="fw-module-page">
      <PigWellTopNav title={t.pageTitle} />
      <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
        <div className="fw-mod-content">
          <div className="fw-welcome-section-label">SELECT TOOL</div>
          <div className="fw-module-grid-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {tools.map((tool, i) => (
              <div
                key={i}
                className="fw-mod-item-card"
                onClick={() => navigate(tool.route)}
                style={{ cursor: 'pointer' }}
              >
                <div className="fw-mod-item-icon-wrap" style={{ background: '#E8F5EE' }}>
                  {tool.icon}
                </div>
                <div className="fw-mod-item-name">{tool.title}</div>
                <div className="fw-mod-item-tag">{tool.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fw-mod-bnav">
        <button className="fw-mod-bnav-home" onClick={() => navigate('/swine')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>PigWell</span>
        </button>
      </div>
    </div>
  );
};

export default DiagnosticLanding;

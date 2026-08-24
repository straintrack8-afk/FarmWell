import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../contexts/BiosecurityContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import PigWellTopNav from '../components/common/PigWellTopNav';

const BioIcon = () => (
    <svg viewBox="0 0 24 24" style={{width:22,height:22,stroke:'#2EAA5E',fill:'none',strokeWidth:1.8,strokeLinecap:'round',strokeLinejoin:'round'}}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
);

const tr = {
  en: {
    title: 'Biosecurity Assessment',
    desc: 'Comprehensive biosecurity evaluation for your pig farm',
    startNew: 'Start New Assessment',
    startNewDesc: 'Complete a full biosecurity evaluation',
    viewHistory: 'View History',
    lastScore: 'Last Score',
    noHistory: 'No assessments yet',
    noHistoryDesc: 'Complete your first assessment to see results here',
    draft: 'Continue Draft',
    draftDesc: 'You have an unfinished assessment',
    assessments: 'assessments completed',
    good: 'Good',
    poor: 'Needs Attention',
  },
  id: {
    title: 'Penilaian Biosekuriti',
    desc: 'Evaluasi biosekuriti komprehensif untuk peternakan babi Anda',
    startNew: 'Mulai Penilaian Baru',
    startNewDesc: 'Selesaikan evaluasi biosekuriti lengkap',
    viewHistory: 'Lihat Riwayat',
    lastScore: 'Skor Terakhir',
    noHistory: 'Belum ada penilaian',
    noHistoryDesc: 'Selesaikan penilaian pertama Anda untuk melihat hasilnya',
    draft: 'Lanjutkan Draft',
    draftDesc: 'Anda memiliki penilaian yang belum selesai',
    assessments: 'penilaian selesai',
    good: 'Baik',
    poor: 'Perlu Perhatian',
  },
  vi: {
    title: 'Đánh Giá An Toàn Sinh Học',
    desc: 'Đánh giá an toàn sinh học toàn diện cho trang trại lợn của bạn',
    startNew: 'Bắt Đầu Đánh Giá Mới',
    startNewDesc: 'Hoàn thành đánh giá an toàn sinh học đầy đủ',
    viewHistory: 'Xem Lịch Sử',
    lastScore: 'Điểm Gần Nhất',
    noHistory: 'Chưa có đánh giá nào',
    noHistoryDesc: 'Hoàn thành đánh giá đầu tiên để xem kết quả tại đây',
    draft: 'Tiếp Tục Bản Nháp',
    draftDesc: 'Bạn có một đánh giá chưa hoàn thành',
    assessments: 'đánh giá hoàn thành',
    good: 'Tốt',
    poor: 'Cần Cải Thiện',
  }
};

function BiosecurityHomePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = tr[language] || tr.en;
  const { assessmentHistory, loadDraftAssessment } = useBiosecurity();

  const lastAssessment = assessmentHistory.length > 0
    ? assessmentHistory[assessmentHistory.length - 1]
    : null;

  const hasDraft = (() => {
    try { return localStorage.getItem('biosecurity_draft') !== null; }
    catch { return false; }
  })();

  const handleStartNew = () => navigate('/swine/biosecurity/assessment');
  const handleContinueDraft = () => {
    const hasDraft = loadDraftAssessment();
    if (hasDraft) navigate('/swine/biosecurity/assessment');
  };

  const goodCount = assessmentHistory.filter(a => (a.overallScore || 0) >= 60).length;
  const poorCount = assessmentHistory.filter(a => (a.overallScore || 0) < 60).length;

  return (
    <div className="fw-module-page">
      <PigWellTopNav title={t.title} />
      <div className="fw-mod-card" style={{ marginTop: -18, borderRadius: '16px 16px 12px 12px' }}>
        <div className="fw-mod-content">

          {/* Stats */}
          <div className="fw-module-grid-2" style={{ marginBottom: 16 }}>
            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--fw-sub)', textTransform: 'uppercase', letterSpacing: 1 }}>TOTAL</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--fw-text)' }}>{assessmentHistory.length}</div>
              <div style={{ fontSize: 11, color: 'var(--fw-sub)' }}>{t.assessments}</div>
            </div>
            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--fw-sub)', textTransform: 'uppercase', letterSpacing: 1 }}>{t.lastScore}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: lastAssessment ? '#2EAA5E' : '#9CA3AF' }}>
                {lastAssessment ? Math.round(lastAssessment.overallScore || 0) + '%' : 'N/A'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fw-sub)' }}>
                {lastAssessment ? (lastAssessment.overallScore >= 60 ? t.good : t.poor) : '-'}
              </div>
            </div>
            <div style={{ background: '#F0FDF4', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#2EAA5E', textTransform: 'uppercase', letterSpacing: 1 }}>{t.good}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2EAA5E' }}>{goodCount}</div>
            </div>
            <div style={{ background: '#FEF2F2', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, color: '#EF4444', textTransform: 'uppercase', letterSpacing: 1 }}>{t.poor}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#EF4444' }}>{poorCount}</div>
            </div>
          </div>

          {/* Draft banner */}
          {hasDraft && (
            <div style={{
              background: '#FFF8E1', border: '1.5px solid #F9A825',
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F9A825" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#E65100' }}>{t.draft}</div>
                <div style={{ fontSize: 11, color: '#795548' }}>{t.draftDesc}</div>
              </div>
              <button onClick={handleContinueDraft} style={{
                background: '#F9A825', color: 'white', border: 'none',
                borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}>{t.draft}</button>
            </div>
          )}

          {/* Action buttons */}
          <button onClick={handleStartNew} style={{
            width: '100%', background: '#2EAA5E', color: 'white',
            border: 'none', borderRadius: 12, padding: '14px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            <BioIcon />
            {t.startNew}
          </button>
          <button onClick={() => navigate('/swine/biosecurity/history')} style={{
            width: '100%', background: 'white', color: '#2EAA5E',
            border: '1.5px solid #2EAA5E', borderRadius: 12, padding: '12px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer'
          }}>{t.viewHistory}</button>

          {/* No history */}
          {assessmentHistory.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fw-sub)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.noHistory}</div>
              <div style={{ fontSize: 12 }}>{t.noHistoryDesc}</div>
            </div>
          )}
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
}

export default BiosecurityHomePage;

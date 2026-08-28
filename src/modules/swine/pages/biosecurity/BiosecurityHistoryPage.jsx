import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import { getFullAssessmentHistory, deleteAssessment } from '../../utils/biosecurityStorage';
import { calculateOverallScore, getScoreInterpretation } from '../../utils/biosecurityScoring';
import { downloadBiosecurityReport } from '../../utils/pdfGenerator';
import PigWellTopNav from '../../components/common/PigWellTopNav';

function BiosecurityHistoryPage() {
    const navigate = useNavigate();
    const { language } = useLanguage(); // Use global language context
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const data = getFullAssessmentHistory();
        setHistory(data);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        const confirmMsg = language === 'id' ? 'Hapus penilaian ini secara permanen?' : 'Permanently delete this assessment?';
        if (window.confirm(confirmMsg)) {
            deleteAssessment(id);
            loadHistory();
        }
    };

    const handleViewReport = (assessment) => {
        // Navigate to results page with the assessment data
        navigate('/swine/biosecurity/results', {
            state: {
                assessment: assessment,
                fromHistory: true
            }
        });
    };

    const getTranslation = (key) => {
        const translations = {
            en: {
                title: 'Assessment History',
                backToDashboard: 'Back to Dashboard',
                date: 'Date',
                score: 'Score',
                status: 'Status',
                actions: 'Actions',
                downloadPDF: 'Download PDF',
                viewReport: 'View Report',
                emptyHistory: 'No assessment history found.',
                delete: 'Delete'
            },
            id: {
                title: 'Riwayat Penilaian',
                backToDashboard: 'Kembali ke Dashboard',
                date: 'Tanggal',
                score: 'Skor',
                status: 'Status',
                actions: 'Aksi',
                downloadPDF: 'Unduh PDF',
                viewReport: 'Lihat Laporan',
                emptyHistory: 'Belum ada riwayat penilaian.',
                delete: 'Hapus'
            },
            vi: {
                title: 'Lịch sử Đánh giá',
                backToDashboard: 'Quay lại Bảng điều khiển',
                date: 'Ngày',
                score: 'Điểm',
                status: 'Trạng thái',
                actions: 'Hành động',
                downloadPDF: 'Tải PDF',
                viewReport: 'Xem Báo cáo',
                emptyHistory: 'Không tìm thấy lịch sử đánh giá.',
                delete: 'Xóa'
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    return (
        <div className="fw-module-page">
            <PigWellTopNav />
            <div className="fw-mod-card">
            <div className="fw-mod-content">

                {/* History Table */}
                <div className="card" style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    {history.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* Table Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 1fr) 100px 1fr 250px', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                                <div>{getTranslation('date')}</div>
                                <div>{getTranslation('score')}</div>
                                <div>{getTranslation('status')}</div>
                                <div style={{ textAlign: 'right' }}>{getTranslation('actions')}</div>
                            </div>

                            {/* List */}
                            {history.map((assessment) => {
                                const score = calculateOverallScore(assessment, language);
                                const interpretation = getScoreInterpretation(score, language);

                                return (
                                    <div key={assessment.assessment_id} style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'minmax(150px, 1fr) 100px 1fr 250px',
                                        padding: '1.5rem 1rem',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f3f4f6',
                                        transition: 'background 0.2s'
                                    }}>
                                        <div style={{ color: '#374151' }}>
                                            {new Date(assessment.completed_at).toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#3b82f6' }}>
                                            {score}
                                        </div>
                                        <div>
                                            <span style={{
                                                padding: '0.375rem 0.75rem',
                                                borderRadius: '9999px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                background: interpretation.color + '20', // Add transparency
                                                color: interpretation.color
                                            }}>
                                                {interpretation.label}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleViewReport(assessment)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#2EAA5E',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    fontWeight: '500',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#2EAA5E'}
                                                onMouseLeave={(e) => e.target.style.background = '#2EAA5E'}
                                            >
                                                 {getTranslation('viewReport')}
                                            </button>
                                            <button
                                                onClick={() => downloadBiosecurityReport(assessment, language)}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#6366f1',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#4f46e5'}
                                                onMouseLeave={(e) => e.target.style.background = '#6366f1'}
                                            >
                                                 PDF
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(assessment.assessment_id, e)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: '#fee2e2',
                                                    color: '#ef4444',
                                                    border: 'none',
                                                    borderRadius: '0.375rem',
                                                    cursor: 'pointer',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '36px',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                                onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                                                title={getTranslation('delete')}
                                            >
                                                
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                            {getTranslation('emptyHistory')}
                        </div>
                    )}
                </div>
            </div>
            </div>
                        <div className="fw-mod-bnav">
                <button className="fw-mod-bnav-home" onClick={() => navigate('/swine')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>PigWell</span>
                </button>
                <button className="fw-mod-bnav-alerts" onClick={() => navigate('/swine/biosecurity')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span>Biosecurity</span>
                </button>
            </div>
        </div>
    );
}

export default BiosecurityHistoryPage;
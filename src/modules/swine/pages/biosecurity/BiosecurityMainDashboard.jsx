import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import { getFarmProfile, resetBiosecuritySession } from '../../utils/biosecurityStorage';
import { downloadBiosecurityReport } from '../../utils/pdfGenerator';
import { calculateOverallScore, getScoreInterpretation } from '../../utils/biosecurityScoring';
import CircularProgress from '../../components/biosecurity/CircularProgress';
import { SimplePieChart, SimpleLineChart } from '../../components/biosecurity/SimpleCharts';

function BiosecurityMainDashboard() {
    const navigate = useNavigate();
    const { language } = useBiosecurity();
    const [assessmentHistory, setAssessmentHistory] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        lastScore: null,
        goodAssessments: 0,
        poorAssessments: 0
    });

    useEffect(() => {
        loadAssessmentHistory();
    }, []);

    const loadAssessmentHistory = () => {
        try {
            // Get full assessment history from localStorage
            const historyData = localStorage.getItem('pigwell_assessments_full');
            const history = historyData ? JSON.parse(historyData) : [];

            // Get active assessment
            const activeData = localStorage.getItem('pigwell_current_assessment');
            const activeAssessment = activeData ? JSON.parse(activeData) : null;

            // Filter only completed assessments
            const completedAssessments = history.filter(a => a && a.completed_at);
            setAssessmentHistory(completedAssessments);

            // Calculate statistics
            const total = completedAssessments.length;
            const lastAssessment = completedAssessments[0];

            // Determine score to display (History takes precedence, fallback to active)
            let lastScore = null;
            let scoreLabelKey = 'lastScore';

            if (lastAssessment) {
                lastScore = calculateOverallScore(lastAssessment, language);
            } else if (activeAssessment) {
                lastScore = calculateOverallScore(activeAssessment, language);
                scoreLabelKey = 'currentScore';
            }

            const goodAssessments = completedAssessments.filter(a => {
                const score = calculateOverallScore(a, language);
                return score >= 60;
            }).length;

            const poorAssessments = completedAssessments.filter(a => {
                const score = calculateOverallScore(a, language);
                return score < 60;
            }).length;

            setStats({
                total,
                lastScore,
                scoreLabelKey,
                goodAssessments,
                poorAssessments,
                hasActive: !!activeAssessment && !activeAssessment.completed_at
            });
        } catch (error) {
            console.error('Error loading assessment history:', error);
        }
    };

    const handleStartNewAssessment = () => {
        // Check for stuck completed assessment
        const activeData = localStorage.getItem('pigwell_current_assessment');
        const active = activeData ? JSON.parse(activeData) : null;

        if (!active || active.completed_at) {
            resetBiosecuritySession();
        }

        // Check if language is already set
        const savedLanguage = localStorage.getItem('pigwell_language');

        // If no language is set, go to language selection
        if (!savedLanguage) {
            navigate('/swine/biosecurity/language');
        } else {
            // If language is set, check if farm profile exists
            const farmProfile = getFarmProfile();
            if (!farmProfile) {
                // Go to farm profile page
                navigate('/swine/biosecurity/farm-profile');
            } else {
                // Go to dashboard
                navigate('/swine/biosecurity/dashboard');
            }
        }
    };

    const handleViewHistory = () => {
        navigate('/swine/biosecurity/history');
    };

    const handleDownloadPDF = (assessment) => {
        const farmProfile = getFarmProfile();
        downloadBiosecurityReport(assessment, farmProfile, language);
    };

    const getTranslation = (key) => {
        const translations = {
            en: {
                title: 'Biosecurity Assessment Dashboard',
                subtitle: 'Comprehensive evaluation of farm biosecurity measures',
                backToModule: 'Back to PigWell Module',
                totalAssessments: 'Total Assessments',
                completed: 'completed',
                lastScore: 'Last Assessment Score',
                goodAssessments: 'Good Assessments',
                ofTotal: 'of total',
                poorAssessments: 'Poor Assessments',
                requiresAttention: 'Requires attention',
                quickActions: 'Quick Actions',
                startNew: 'Start New Assessment',
                viewHistory: 'View Assessment History',
                changeLanguage: 'Change Language',
                recentAssessments: 'Recent Assessments',
                noAssessments: 'No Assessments Yet',
                noAssessmentsDesc: 'Start your first biosecurity assessment to track farm health and compliance',
                startFirst: 'Start First Assessment',
                date: 'Date',
                score: 'Score',
                status: 'Status',
                actions: 'Actions',
                downloadPDF: 'Download PDF',
                currentScore: 'Current Score',
                continueAssessment: 'Continue Assessment'
            },
            id: {
                title: 'Dashboard Penilaian Biosekuriti',
                subtitle: 'Evaluasi komprehensif langkah-langkah biosekuriti peternakan',
                backToModule: 'Kembali ke Modul PigWell',
                totalAssessments: 'Total Penilaian',
                completed: 'selesai',
                lastScore: 'Skor Penilaian Terakhir',
                goodAssessments: 'Penilaian Baik',
                ofTotal: 'dari total',
                poorAssessments: 'Penilaian Buruk',
                requiresAttention: 'Perlu perhatian',
                quickActions: 'Aksi Cepat',
                startNew: 'Mulai Penilaian Baru',
                viewHistory: 'Lihat Riwayat Penilaian',
                changeLanguage: 'Ubah Bahasa',
                recentAssessments: 'Penilaian Terkini',
                noAssessments: 'Belum Ada Penilaian',
                noAssessmentsDesc: 'Mulai penilaian biosekuriti pertama Anda untuk melacak kesehatan dan kepatuhan peternakan',
                startFirst: 'Mulai Penilaian Pertama',
                date: 'Tanggal',
                score: 'Skor',
                status: 'Status',
                actions: 'Aksi',
                downloadPDF: 'Unduh PDF',
                currentScore: 'Skor Saat Ini',
                continueAssessment: 'Lanjutkan Penilaian'
            },
            vt: {
                title: 'Bảng điều khiển Đánh giá An ninh sinh học',
                subtitle: 'Đánh giá toàn diện các biện pháp an ninh sinh học trang trại',
                backToModule: 'Quay lại Mô-đun PigWell',
                totalAssessments: 'Tổng số Đánh giá',
                completed: 'hoàn thành',
                lastScore: 'Điểm Đánh giá Cuối cùng',
                goodAssessments: 'Đánh giá Tốt',
                ofTotal: 'của tổng số',
                poorAssessments: 'Đánh giá Kém',
                requiresAttention: 'Cần chú ý',
                quickActions: 'Hành động Nhanh',
                startNew: 'Bắt đầu Đánh giá Mới',
                viewHistory: 'Xem Lịch sử Đánh giá',
                changeLanguage: 'Đổi Ngôn ngữ',
                recentAssessments: 'Đánh giá Gần đây',
                noAssessments: 'Chưa có Đánh giá',
                noAssessmentsDesc: 'Bắt đầu đánh giá an ninh sinh học đầu tiên để theo dõi sức khỏe và tuân thủ trang trại',
                startFirst: 'Bắt đầu Đánh giá Đầu tiên',
                date: 'Ngày',
                score: 'Điểm',
                status: 'Trạng thái',
                actions: 'Hành động',
                downloadPDF: 'Tải PDF',
                currentScore: 'Điểm hiện tại',
                continueAssessment: 'Tiếp tục Đánh giá'
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    const getScoreColor = (score) => {
        if (score >= 80) return '#10B981';
        if (score >= 60) return '#3B82F6';
        if (score >= 40) return '#F59E0B';
        return '#EF4444';
    };

    // Neutral accent colors for stat cards
    const accents = {
        blue: '#366092',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444'
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--fw-bg)',
            padding: '1.5rem 0',
            overflowX: 'hidden'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                            fontWeight: '700',
                            marginBottom: '0.25rem',
                            color: '#1e293b'
                        }}>
                            {getTranslation('title')}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                            {getTranslation('subtitle')}
                        </p>
                    </div>
                </div>

                {/* Statistics Cards — 2×2 grid, all simple metric cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                }}>
                    {/* Card 1: Total Assessments */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                            {getTranslation('totalAssessments')}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>
                            {stats.total}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                            {stats.total} {getTranslation('completed')}
                        </div>
                    </div>

                    {/* Card 2: Last Score */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                            {getTranslation(stats.scoreLabelKey || 'lastScore')}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: stats.lastScore ? getScoreColor(stats.lastScore) : '#94a3b8', lineHeight: 1 }}>
                            {stats.lastScore !== null ? stats.lastScore : 'N/A'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                            {stats.lastScore ? getScoreInterpretation(stats.lastScore, language).label : '-'}
                        </div>
                    </div>

                    {/* Card 3: Good Assessments */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                            {getTranslation('goodAssessments')}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>
                            {stats.goodAssessments || 0}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                            {getTranslation('ofTotal')} {stats.total}
                        </div>
                    </div>

                    {/* Card 4: Poor Assessments */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                            {getTranslation('poorAssessments')}
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444', lineHeight: 1 }}>
                            {stats.poorAssessments || 0}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                            {getTranslation('requiresAttention')}
                        </div>
                    </div>
                </div>


                {/* Charts Section — separate full-width grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                }}>
                    {/* Distribution Pie Chart */}
                    <div style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem', width: '100%', textAlign: 'left' }}>
                            {language === 'id' ? 'Distribusi Hasil' : language === 'vt' ? 'Phân phối Kết quả' : 'Results Distribution'}
                        </h3>
                        {(() => {
                            const pieData = [
                                { label: 'Excellent (80-100)', value: assessmentHistory.filter(a => calculateOverallScore(a, language) >= 80).length, color: '#10B981' },
                                {
                                    label: 'Good (60-79)', value: assessmentHistory.filter(a => {
                                        const s = calculateOverallScore(a, language);
                                        return s >= 60 && s < 80;
                                    }).length, color: '#3B82F6'
                                },
                                {
                                    label: 'Moderate (40-59)', value: assessmentHistory.filter(a => {
                                        const s = calculateOverallScore(a, language);
                                        return s >= 40 && s < 60;
                                    }).length, color: '#F59E0B'
                                },
                                { label: 'Poor (<40)', value: assessmentHistory.filter(a => calculateOverallScore(a, language) < 40).length, color: '#EF4444' }
                            ].filter(item => item.value > 0);

                            return (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <SimplePieChart data={pieData} size={140} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {pieData.map((d, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: d.color, flexShrink: 0 }}></div>
                                                <span>{d.label}</span>
                                                <span style={{ fontWeight: '600' }}>({d.value})</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Progress Line Chart */}
                    <div style={{
                        background: 'white',
                        borderRadius: '0.75rem',
                        padding: '1.25rem',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        overflow: 'hidden'
                    }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '1rem' }}>
                            {language === 'id' ? 'Tren Penilaian' : language === 'vt' ? 'Xu hướng Đánh giá' : 'Assessment Trend'}
                        </h3>
                        {(() => {
                            const lineData = [...assessmentHistory]
                                .sort((a, b) => new Date(a.completed_at) - new Date(b.completed_at))
                                .map(a => ({
                                    label: new Date(a.completed_at).toLocaleDateString(),
                                    value: calculateOverallScore(a, language)
                                }));
                            return <SimpleLineChart data={lineData} height={140} />;
                        })()}
                        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            {language === 'id' ? 'Riwayat Skor Biosekuriti' : language === 'vt' ? 'Lịch sử Điểm An toàn Sinh học' : 'Biosecurity Score History'}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }}>
                    <h2 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        {getTranslation('quickActions')}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{
                                padding: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={handleStartNewAssessment}
                        >
                            {getTranslation(stats.hasActive ? 'continueAssessment' : 'startNew')}
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{
                                padding: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                            }}
                            onClick={handleViewHistory}
                        >
                            {getTranslation('viewHistory')}
                        </button>
                    </div>
                </div>

                {/* Recent Assessments */}
                <div style={{
                    background: 'white',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
                }} id="recent-assessments">
                    <h2 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                        {getTranslation('recentAssessments')}
                    </h2>

                    {assessmentHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>
                                {getTranslation('noAssessments')}
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                                {getTranslation('noAssessmentsDesc')}
                            </p>
                            <button
                                className="btn btn-primary"
                                style={{
                                    padding: '0.75rem 2rem'
                                }}
                                onClick={handleStartNewAssessment}
                            >
                                {getTranslation('startFirst')}
                            </button>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {getTranslation('date')}
                                        </th>
                                        <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {getTranslation('score')}
                                        </th>
                                        <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {getTranslation('status')}
                                        </th>
                                        <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                                            {getTranslation('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assessmentHistory.slice(0, 5).map((assessment, index) => {
                                        const score = calculateOverallScore(assessment, language);
                                        const interpretation = getScoreInterpretation(score, language);
                                        const date = new Date(assessment.completed_at || assessment.started_at);

                                        return (
                                            <tr key={index} style={{
                                                background: '#f9fafb',
                                                borderRadius: '0.75rem'
                                            }}>
                                                <td style={{ padding: '1.25rem', fontSize: '0.9375rem', borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                                                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span style={{
                                                        fontSize: '1.75rem',
                                                        fontWeight: '800',
                                                        color: getScoreColor(score)
                                                    }}>
                                                        {score}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        background: score >= 80 ? '#d1fae5' : score >= 60 ? '#dbeafe' : score >= 40 ? '#fef3c7' : '#fee2e2',
                                                        color: score >= 80 ? '#065f46' : score >= 60 ? '#1e40af' : score >= 40 ? '#92400e' : '#991b1b'
                                                    }}>
                                                        {interpretation.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            fontSize: '0.8125rem'
                                                        }}
                                                        onClick={() => handleDownloadPDF(assessment)}
                                                    >
                                                        {getTranslation('downloadPDF')}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BiosecurityMainDashboard;

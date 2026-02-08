import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import { getAllFocusAreas } from '../../data/questions_data';
import {
    calculateOverallScore,
    calculateExternalScore,
    calculateInternalScore,
    getScoreInterpretation
} from '../../utils/biosecurityScoring';
import {
    resetBiosecuritySession,
    getFarmProfile,
    completeAssessment
} from '../../utils/biosecurityStorage';
import CircularProgress from '../../components/biosecurity/CircularProgress';
import FocusAreaCard from '../../components/biosecurity/FocusAreaCard';

function BiosecurityDashboard() {
    const navigate = useNavigate();
    const { language, currentAssessment, startAssessment, isComplete } = useBiosecurity();
    const farmProfile = getFarmProfile();
    const focusAreas = getAllFocusAreas(language);

    useEffect(() => {
        // COMMENTED OUT: Farm profile check causes redirect loop when farm_profile.questions is empty
        // if (!farmProfile) {
        //     navigate('/swine/biosecurity/farm-profile');
        //     return;
        // }

        // Start assessment if not exists
        if (!currentAssessment) {
            startAssessment();
        }
    }, [currentAssessment]); // Removed farmProfile from dependencies

    const getOverallScore = () => {
        if (!currentAssessment?.overall_score) return null;
        return Math.round(currentAssessment.overall_score);
    };

    const getExternalScore = () => {
        if (!currentAssessment?.external_score) return null;
        return Math.round(currentAssessment.external_score);
    };

    const getInternalScore = () => {
        if (!currentAssessment?.internal_score) return null;
        return Math.round(currentAssessment.internal_score);
    };

    const getScoreColor = (score) => {
        if (!score) return 'var(--text-muted)';
        if (score >= 80) return '#10B981';
        if (score >= 60) return '#3B82F6';
        if (score >= 40) return '#F59E0B';
        return '#EF4444';
    };

    const getScoreLabel = (score) => {
        const labels = {
            en: {
                excellent: 'Excellent',
                good: 'Good',
                moderate: 'Moderate',
                poor: 'Poor'
            },
            id: {
                excellent: 'Sangat Baik',
                good: 'Baik',
                moderate: 'Sedang',
                poor: 'Buruk'
            },
            vt: {
                excellent: 'Xuất sắc',
                good: 'Tốt',
                moderate: 'Vừa phải',
                poor: 'Kém'
            }
        };

        const langLabels = labels[language] || labels.en;

        if (!score) return '';
        if (score >= 80) return langLabels.excellent;
        if (score >= 60) return langLabels.good;
        if (score >= 40) return langLabels.moderate;
        return langLabels.poor;
    };

    const overallScore = getOverallScore();
    const externalScore = getExternalScore();

    // Calculate completed count
    const completedCount = currentAssessment && currentAssessment.focus_areas ?
        Object.values(currentAssessment.focus_areas).filter(fa => fa.completed).length
        : 0;

    const internalScore = getInternalScore();
    const assessmentComplete = isComplete();

    const getTranslation = (key) => {
        const translations = {
            en: {
                title: 'Biosecurity Assessment Dashboard',
                subtitle: 'Comprehensive evaluation of farm biosecurity measures',
                overallScore: 'Overall Biosecurity Score',
                externalBiosecurity: 'External',
                internalBiosecurity: 'Internal',
                farmProfile: 'Farm Profile',
                completed: 'Completed',
                viewReport: 'View Full Report',
                externalSection: 'EXTERNAL BIOSECURITY',
                internalSection: 'INTERNAL BIOSECURITY',
                notStarted: 'Not yet assessed',
                changeLanguage: 'Change Language',
                backToDashboard: 'Back to Dashboard',
                discardAssessment: 'Discard Assessment',
                confirmDiscard: 'Are you sure you want to discard this assessment? All progress will be lost.',
                backToPigWell: 'Back to PigWell Module'
            },
            id: {
                title: 'Dashboard Penilaian Biosekuriti',
                subtitle: 'Evaluasi komprehensif langkah-langkah biosekuriti peternakan',
                overallScore: 'Skor Biosekuriti Keseluruhan',
                externalBiosecurity: 'Eksternal',
                internalBiosecurity: 'Internal',
                farmProfile: 'Profil Peternakan',
                completed: 'Selesai',
                viewReport: 'Lihat Laporan Lengkap',
                externalSection: 'BIOSEKURITI EKSTERNAL',
                internalSection: 'BIOSEKURITI INTERNAL',
                notStarted: 'Belum dinilai',
                changeLanguage: 'Ubah Bahasa',
                backToDashboard: 'Kembali ke Dashboard',
                discardAssessment: 'Buang Penilaian',
                confirmDiscard: 'Apakah Anda yakin ingin membuang penilaian ini? Semua progres akan hilang.',
                backToPigWell: 'Kembali ke Modul PigWell'
            },
            vt: {
                title: 'Bảng điều khiển Đánh giá An ninh sinh học',
                subtitle: 'Đánh giá toàn diện các biện pháp an ninh sinh học trang trại',
                overallScore: 'Điểm An ninh sinh học Tổng thể',
                externalBiosecurity: 'Bên ngoài',
                internalBiosecurity: 'Bên trong',
                farmProfile: 'Hồ sơ Trang trại',
                completed: 'Hoàn thành',
                viewReport: 'Xem Báo cáo Đầy đủ',
                externalSection: 'AN NINH SINH HỌC BÊN NGOÀI',
                internalSection: 'AN NINH SINH HỌC BÊN TRONG',
                notStarted: 'Chưa đánh giá',
                changeLanguage: 'Đổi Ngôn ngữ',
                backToDashboard: 'Quay lại Bảng điều khiển',
                discardAssessment: 'Hủy Đánh giá',
                confirmDiscard: 'Bạn có chắc chắn muốn hủy đánh giá này? Tất cả tiến trình sẽ bị mất.',
                backToPigWell: 'Quay lại Mô-đun PigWell'
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    if (!currentAssessment) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '2rem 0'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.25rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🛡️ {getTranslation('title')}
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)' }}>
                            {getTranslation('subtitle')}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            style={{
                                padding: '0.75rem 1.25rem',
                                background: 'white',
                                border: '2px solid #e5e7eb',
                                borderRadius: '0.75rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onClick={() => navigate('/swine/biosecurity')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#667eea';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e5e7eb';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            ← {getTranslation('backToDashboard')}
                        </button>
                    </div>
                </div>

                {/* Overall Score Card (if assessment complete) */}
                {assessmentComplete && overallScore !== null && (
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2rem',
                        padding: '3rem 2rem',
                        marginBottom: '2.5rem',
                        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative elements */}
                        <div style={{
                            position: 'absolute',
                            top: '-100px',
                            right: '-100px',
                            width: '300px',
                            height: '300px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.1)',
                            pointerEvents: 'none'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-80px',
                            left: '-80px',
                            width: '250px',
                            height: '250px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.08)',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '2rem',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                {getTranslation('overallScore')}
                            </h2>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '4rem',
                                flexWrap: 'wrap'
                            }}>
                                {/* Main Overall Score */}
                                <div style={{ textAlign: 'center', position: 'relative' }}>
                                    <CircularProgress
                                        percentage={overallScore}
                                        size={180}
                                        strokeWidth={12}
                                        color="white"
                                        backgroundColor="rgba(255, 255, 255, 0.2)"
                                        showPercentage={false}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '4rem', fontWeight: '800', color: 'white', lineHeight: 1 }}>
                                            {overallScore}
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.5rem' }}>
                                            {getScoreLabel(overallScore)}
                                        </div>
                                    </div>
                                </div>

                                {/* External & Internal Scores */}
                                <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <CircularProgress
                                            percentage={externalScore || 0}
                                            size={120}
                                            strokeWidth={10}
                                            color="white"
                                            backgroundColor="rgba(255, 255, 255, 0.2)"
                                            showPercentage={true}
                                        />
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            marginTop: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {getTranslation('externalBiosecurity')}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <CircularProgress
                                            percentage={internalScore || 0}
                                            size={120}
                                            strokeWidth={10}
                                            color="white"
                                            backgroundColor="rgba(255, 255, 255, 0.2)"
                                            showPercentage={true}
                                        />
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'rgba(255, 255, 255, 0.95)',
                                            marginTop: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {getTranslation('internalBiosecurity')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                <button
                                    style={{
                                        padding: '1rem 2.5rem',
                                        background: 'white',
                                        color: '#667eea',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                    }}
                                    onClick={() => navigate('/swine/biosecurity/results')}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                    }}
                                >
                                    📊 {getTranslation('viewReport')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Farm Profile Status */}
                <div style={{
                    background: 'white',
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    marginBottom: '2.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                📋 {getTranslation('farmProfile')}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                ✓ {getTranslation('completed')}
                            </p>
                        </div>
                        <button
                            style={{
                                padding: '0.625rem 1.25rem',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => navigate('/swine/biosecurity/farm-profile')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>

                {/* External Biosecurity Section */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        marginBottom: '1.25rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        📥 {getTranslation('externalSection')}
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
                        {focusAreas.filter(fa => fa.category.includes('external') || fa.category.includes('eksternal') || fa.category.includes('ngoài')).map(fa => (
                            <FocusAreaCard
                                key={fa.number}
                                focusArea={fa}
                                assessment={currentAssessment}
                                language={language}
                            />
                        ))}
                    </div>
                </div>

                {/* Internal Biosecurity Section */}
                <div>
                    <h2 style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        marginBottom: '1.25rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                    }}>
                        🏠 {getTranslation('internalSection')}
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
                        {focusAreas.filter(fa => fa.category.includes('internal') || fa.category.includes('trong')).map(fa => (
                            <FocusAreaCard
                                key={fa.number}
                                focusArea={fa}
                                assessment={currentAssessment}
                                language={language}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', paddingBottom: '2rem' }}>

                    {/* Complete Assessment Button - Only show when all areas are completed */}
                    {completedCount === 4 && (
                        <button
                            style={{
                                padding: '0.875rem 2rem',
                                background: '#10B981', // Green
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '0.9375rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => {
                                if (window.confirm(language === 'id' ? 'Selesaikan penilaian dan simpan laporan?' : 'Complete assessment and save report?')) {
                                    // Calculate final scores
                                    const overall = calculateOverallScore(currentAssessment, language);
                                    const external = calculateExternalScore(currentAssessment, language);
                                    const internal = calculateInternalScore(currentAssessment, language);

                                    // Save to history
                                    completeAssessment(overall, external, internal);

                                    alert(language === 'id' ? 'Penilaian berhasil disimpan!' : 'Assessment saved successfully!');

                                    // Navigate to report or main dashboard
                                    navigate('/swine/biosecurity/report');
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.3)';
                            }}
                        >
                            ✅ {language === 'id' ? 'Selesai & Simpan' : (language === 'vt' ? 'Hoàn thành & Lưu' : 'Complete & Save')}
                        </button>
                    )}

                    <button
                        style={{
                            padding: '0.875rem 2rem',
                            background: '#7C3AED',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.75rem',
                            fontSize: '0.9375rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px rgba(124, 58, 237, 0.2)',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => navigate('/swine/biosecurity/report')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px rgba(124, 58, 237, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.2)';
                        }}
                    >
                        📊 {getTranslation('viewAnalysis') || 'View Analysis & Improvements'}
                    </button>

                    <button
                        style={{
                            padding: '0.875rem 2rem',
                            background: 'white',
                            color: '#ef4444',
                            border: '2px solid #ef4444',
                            borderRadius: '0.75rem',
                            fontSize: '0.9375rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                        onClick={() => {
                            if (window.confirm(getTranslation('confirmDiscard'))) {
                                resetBiosecuritySession();
                                navigate('/swine/biosecurity');
                            }
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        🗑️ {getTranslation('discardAssessment')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BiosecurityDashboard;

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
import PigWellTopNav from '../../components/common/PigWellTopNav';

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
        if (score >= 80) return '#2EAA5E';
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
            vi: {
                excellent: 'Xuß║Ñt sß║»c',
                good: 'Tß╗æt',
                moderate: 'Vß╗½a phß║úi',
                poor: 'K├⌐m'
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
                backToPigWell: 'Back to PigWell Module',
                edit: 'Edit',
                completeSave: 'Complete & Save',
                confirmComplete: 'Complete assessment and save report?',
                savedSuccess: 'Assessment saved successfully!',
                viewAnalysis: 'View Analysis & Improvements'
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
                backToPigWell: 'Kembali ke Modul PigWell',
                edit: 'Ubah',
                completeSave: 'Selesai & Simpan',
                confirmComplete: 'Selesaikan penilaian dan simpan laporan?',
                savedSuccess: 'Penilaian berhasil disimpan!',
                viewAnalysis: 'Lihat Analisis & Perbaikan'
            },
            vi: {
                title: 'Bß║úng ─æiß╗üu khiß╗ân ─É├ính gi├í An ninh sinh hß╗ìc',
                subtitle: '─É├ính gi├í to├án diß╗çn c├íc biß╗çn ph├íp an ninh sinh hß╗ìc trang trß║íi',
                overallScore: '─Éiß╗âm An ninh sinh hß╗ìc Tß╗òng thß╗â',
                externalBiosecurity: 'B├¬n ngo├ái',
                internalBiosecurity: 'B├¬n trong',
                farmProfile: 'Hß╗ô s╞í Trang trß║íi',
                completed: 'Ho├án th├ánh',
                viewReport: 'Xem B├ío c├ío ─Éß║ºy ─æß╗º',
                externalSection: 'AN NINH SINH Hß╗îC B├èN NGO├ÇI',
                internalSection: 'AN NINH SINH Hß╗îC B├èN TRONG',
                notStarted: 'Ch╞░a ─æ├ính gi├í',
                changeLanguage: '─Éß╗òi Ng├┤n ngß╗»',
                backToDashboard: 'Quay lß║íi Bß║úng ─æiß╗üu khiß╗ân',
                discardAssessment: 'Hß╗ºy ─É├ính gi├í',
                confirmDiscard: 'Bß║ín c├│ chß║»c chß║»n muß╗æn hß╗ºy ─æ├ính gi├í n├áy? Tß║Ñt cß║ú tiß║┐n tr├¼nh sß║╜ bß╗ï mß║Ñt.',
                backToPigWell: 'Quay lß║íi M├┤-─æun PigWell',
                edit: 'Chß╗ënh sß╗¡a',
                completeSave: 'Ho├án th├ánh & L╞░u',
                confirmComplete: 'Ho├án th├ánh ─æ├ính gi├í v├á l╞░u b├ío c├ío?',
                savedSuccess: '─É├ính gi├í ─æ├ú ─æ╞░ß╗úc l╞░u th├ánh c├┤ng!',
                viewAnalysis: 'Xem Ph├ón t├¡ch & Cß║úi tiß║┐n'
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    if (!currentAssessment) {
        return (
            <div className="fw-module-page">
                <PigWellTopNav />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="fw-module-page">
            <PigWellTopNav />
            <div className="fw-mod-card">
            <div className="fw-mod-content">

                {/* Overall Score Card (if assessment complete) */}
                {assessmentComplete && overallScore !== null && (
                    <div style={{
                        background: 'white',
                        borderRadius: '2rem',
                        padding: '3rem 2rem',
                        marginBottom: '2.5rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        borderTop: '4px solid var(--primary)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '800',
                                marginBottom: '2rem',
                                color: 'var(--text-primary)',
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
                                        color={getScoreColor(overallScore)}
                                        backgroundColor="#f1f5f9"
                                        showPercentage={false}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '4rem', fontWeight: '800', color: getScoreColor(overallScore), lineHeight: 1 }}>
                                            {overallScore}
                                        </div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#64748b', marginTop: '0.5rem' }}>
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
                                            color={getScoreColor(externalScore)}
                                            backgroundColor="#f1f5f9"
                                            showPercentage={true}
                                        />
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'var(--text-primary)',
                                            marginTop: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {getTranslation('externalBiosecurity')}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <CircularProgress
                                            percentage={internalScore || 0}
                                            size={120}
                                            strokeWidth={10}
                                            color={getScoreColor(internalScore)}
                                            backgroundColor="#f1f5f9"
                                            showPercentage={true}
                                        />
                                        <div style={{
                                            fontSize: '0.9375rem',
                                            color: 'var(--text-primary)',
                                            marginTop: '0.75rem',
                                            fontWeight: '700'
                                        }}>
                                            {getTranslation('internalBiosecurity')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
                                    onClick={() => navigate('/swine/biosecurity/results')}
                                >
                                    {getTranslation('viewReport')}
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
                                {getTranslation('farmProfile')}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {getTranslation('completed')}
                            </p>
                        </div>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.875rem',
                                borderRadius: '25px',
                                background: 'transparent',
                                color: '#2EAA5E',
                                border: '2px solid #2EAA5E',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => navigate('/swine/biosecurity/farm-profile')}
                        >
                            {getTranslation('edit')}
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
                        {getTranslation('externalSection')}
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                        {focusAreas.filter(fa => fa.number === 1 || fa.number === 2).map(fa => (
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
                        {getTranslation('internalSection')}
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))' }}>
                        {focusAreas.filter(fa => fa.number === 3 || fa.number === 4).map(fa => (
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
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', paddingBottom: '2rem', flexWrap: 'wrap' }}>

                    {/* Complete Assessment Button - Only show when all areas are completed */}
                    {completedCount === 4 && (
                        <button
                            style={{
                                padding: '0.875rem 2rem',
                                background: '#2EAA5E', // Green
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
                                if (window.confirm(getTranslation('confirmComplete'))) {
                                    // Calculate final scores
                                    const overall = calculateOverallScore(currentAssessment, language);
                                    const external = calculateExternalScore(currentAssessment, language);
                                    const internal = calculateInternalScore(currentAssessment, language);

                                    // Save to history
                                    completeAssessment(overall, external, internal);

                                    alert(getTranslation('savedSuccess'));

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
                            {getTranslation('completeSave')}
                        </button>
                    )}

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/swine/biosecurity/report')}
                    >
                        {getTranslation('viewAnalysis')}
                    </button>

                    <button
                        style={{
                            padding: '0.875rem 1.75rem',
                            borderRadius: '25px',
                            background: 'transparent',
                            color: '#2EAA5E',
                            border: '2px solid #2EAA5E',
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                            if (window.confirm(getTranslation('confirmDiscard'))) {
                                resetBiosecuritySession();
                                navigate('/swine/biosecurity');
                            }
                        }}
                    >
                        {getTranslation('discardAssessment')}
                    </button>
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

export default BiosecurityDashboard;


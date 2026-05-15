import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBroilerAssessment } from '../../contexts/BroilerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getLocalizedText, loadAssessment, saveAssessment, clearAssessment } from '../../utils/assessmentUtils';
import PoultryTopNav from '../../components/common/PoultryTopNav';

function BroilerAssessmentDashboard() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation();
    
    // Debug: Check translation function
    console.log('[Dashboard] Current language:', language);
    console.log('[Dashboard] Date translation:', t('poultry.biosecurity.dashboard.date'));
    console.log('[Dashboard] Assessor Name translation:', t('poultry.biosecurity.dashboard.assessorName'));
    console.log('[Dashboard] Assessment ID translation:', t('poultry.biosecurity.dashboard.assessmentId'));
    const {
        assessmentData,
        focusAreas,
        answers,
        progressStats,
        navigateTo,
        isLoading,
        error
    } = useBroilerAssessment();

    const [hasSavedProgress, setHasSavedProgress] = useState(false);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        // Check if there's saved progress
        const saved = loadAssessment();
        const hasProgress = saved && saved.answers && Object.keys(saved.answers).length > 0;
        setHasSavedProgress(hasProgress);
        console.log('Dashboard - Progress Stats:', progressStats);
        console.log('Dashboard - Answered:', progressStats?.answeredQuestions, 'Total:', progressStats?.totalQuestions);
        console.log('Dashboard - Percentage:', progressStats?.percentage);
    }, [answers, progressStats]);

    if (isLoading) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Broiler Biosecurity" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-title">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Broiler Biosecurity" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content">
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-title">Failed to Load</div>
                            <div className="fw-bio-empty-sub">{error}</div>
                            <button className="fw-bio-action-btn" onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!assessmentData || !focusAreas) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Broiler Biosecurity" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content">
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-title">Data Unavailable</div>
                            <div className="fw-bio-empty-sub">Assessment data could not be found.</div>
                            <button className="fw-bio-action-btn" onClick={() => window.location.reload()}>Retry</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const externalAreas = focusAreas.external_biosecurity?.areas || [];
    const internalAreas = focusAreas.internal_biosecurity?.areas || [];
    const allAreas = [...externalAreas, ...internalAreas];

    const handleStartFocusArea = (focusAreaType, subAreaIndex) => {
        const areas = focusAreaType === 'external' ? externalAreas : internalAreas;
        const area = areas[subAreaIndex];

        if (area && area.categories && area.categories.length > 0) {
            navigateTo({
                currentFocusAreaType: focusAreaType,
                currentSubAreaIndex: subAreaIndex,
                currentCategoryId: area.categories[0],
                currentQuestionIndex: 0
            });
            navigate('/poultry/biosecurity/questions');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/poultry');
    };

    const getFocusAreaProgress = (area) => {
        if (!area || !area.categories || !assessmentData.categories) return { answered: 0, total: 0 };

        let answered = 0;
        let total = 0;

        area.categories.forEach(catId => {
            const category = assessmentData.categories[catId];
            if (category && category.questions) {
                total += category.questions.length;
                category.questions.forEach(q => {
                    if (answers[q.id]) answered++;
                });
            }
        });

        return { answered, total };
    };

    // Focus area accent border colors (neutral)
    const focusAreaBorders = [
        '#366092', // Navy blue
        '#10B981', // Green
        '#F59E0B', // Amber
        '#8B5CF6'  // Purple
    ];

    // Background colors for focus areas
    const focusAreaColors = [
        '#eff6ff',
        '#f0fdf4',
        '#fefce8',
        '#fdf2f8'
    ];

    return (
        <div className="fw-module-page">
            <PoultryTopNav title="Broiler Biosecurity" />

            <div className="fw-mod-card">
                <div className="fw-mod-content">

                    {/* Stats Grid */}
                    <div className="fw-bio-stats-grid">
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.biosecurity.dashboard.totalQuestions') || 'Total Questions'}</div>
                            <div className="fw-bio-stat-value">{progressStats?.totalQuestions || 0}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.biosecurity.dashboard.acrossAllAreas') || 'across all areas'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.biosecurity.dashboard.answered') || 'Answered'}</div>
                            <div className="fw-bio-stat-value green">{progressStats?.answeredQuestions || 0}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.biosecurity.dashboard.questionsCompleted') || 'completed'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.biosecurity.dashboard.progress') || 'Progress'}</div>
                            <div className="fw-bio-stat-value amber">{progressStats?.percentage?.toFixed(0) || 0}%</div>
                            <div className="fw-bio-stat-sub">{t('poultry.biosecurity.dashboard.overallCompletion') || 'overall'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.biosecurity.dashboard.focusAreas') || 'Focus Areas'}</div>
                            <div className="fw-bio-stat-value">{allAreas.length}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.biosecurity.dashboard.totalAssessmentAreas') || 'total areas'}</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                        className="fw-bio-action-btn"
                        onClick={() => navigate('/poultry/biosecurity')}
                    >
                        {hasSavedProgress
                            ? (t('poultry.biosecurity.dashboard.continueAssessment') || 'Continue Assessment')
                            : (t('poultry.biosecurity.dashboard.startNew') || '+ Start New Assessment')
                        }
                    </button>

                    {hasSavedProgress && (
                        <button
                            className="fw-bio-action-btn secondary"
                            onClick={() => {
                                const saved = loadAssessment();
                                if (saved?.id) clearAssessment(saved.id);
                                window.location.reload();
                            }}
                        >
                            {t('poultry.biosecurity.dashboard.startFresh') || 'Start Fresh'}
                        </button>
                    )}

                    {/* Focus Areas */}
                    <div className="fw-welcome-section-label">
                        {t('poultry.biosecurity.dashboard.focusAreas') || 'Focus Areas'}
                    </div>

                    {/* External Biosecurity */}
                    {externalAreas.length > 0 && externalAreas.map((area, index) => {
                        const prog = getFocusAreaProgress(area);
                        const pct = prog.total > 0 ? Math.round((prog.answered / prog.total) * 100) : 0;
                        return (
                            <div
                                key={`ext-${index}`}
                                className="fw-bio-assess-item"
                                onClick={() => handleStartFocusArea('external', index)}
                            >
                                <div className={`fw-bio-assess-score${pct < 50 ? ' poor' : ''}`}>
                                    {pct}%
                                </div>
                                <div className="fw-bio-assess-info">
                                    <div className="fw-bio-assess-name">
                                        {area.name?.[language] || area.name?.en || area.name || `External Area ${index + 1}`}
                                    </div>
                                    <div className="fw-bio-assess-date">
                                        {prog.answered}/{prog.total} {t('poultry.biosecurity.dashboard.questionsCompleted') || 'answered'}
                                    </div>
                                </div>
                                <div className="fw-bio-assess-arrow">›</div>
                            </div>
                        );
                    })}

                    {/* Internal Biosecurity */}
                    {internalAreas.length > 0 && internalAreas.map((area, index) => {
                        const prog = getFocusAreaProgress(area);
                        const pct = prog.total > 0 ? Math.round((prog.answered / prog.total) * 100) : 0;
                        return (
                            <div
                                key={`int-${index}`}
                                className="fw-bio-assess-item"
                                onClick={() => handleStartFocusArea('internal', index)}
                            >
                                <div className={`fw-bio-assess-score${pct < 50 ? ' poor' : ''}`}>
                                    {pct}%
                                </div>
                                <div className="fw-bio-assess-info">
                                    <div className="fw-bio-assess-name">
                                        {area.name?.[language] || area.name?.en || area.name || `Internal Area ${index + 1}`}
                                    </div>
                                    <div className="fw-bio-assess-date">
                                        {prog.answered}/{prog.total} {t('poultry.biosecurity.dashboard.questionsCompleted') || 'answered'}
                                    </div>
                                </div>
                                <div className="fw-bio-assess-arrow">›</div>
                            </div>
                        );
                    })}

                    {/* View Results button if progress > 0 */}
                    {progressStats?.answeredQuestions > 0 && (
                        <button
                            className="fw-bio-action-btn secondary"
                            onClick={() => navigate('/poultry/biosecurity/results')}
                        >
                            {t('poultry.biosecurity.dashboard.viewResults') || 'View Results →'}
                        </button>
                    )}

                </div>

                {/* Bottom Nav */}
                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </button>
                    <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry')}>
                        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>PoultryWell</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BroilerAssessmentDashboard;

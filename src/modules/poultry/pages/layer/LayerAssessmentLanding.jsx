import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
    getAllSavedAssessments,
    generateAssessmentId,
    setCurrentAssessmentId,
    clearAssessment,
    saveAssessment,
    shouldShowQuestion,
    calculateOverallScore
} from '../../utils/layerAssessmentUtils';
import PoultryTopNav from '../../components/common/PoultryTopNav';

function LayerAssessmentLanding() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation();
    const [assessmentData, setAssessmentData] = useState(null);
    const [savedAssessments, setSavedAssessments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        lastScore: null,
        goodAssessments: 0,
        poorAssessments: 0
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        // Load assessment data
        fetch('/data/poultry/layer_assessment_complete.json')
            .then(res => res.json())
            .then(data => {
                setAssessmentData(data);
                loadSavedAssessments(data);
            })
            .catch(err => console.error('Failed to load assessment data:', err));
    }, []);

    const getVisibleQuestionCount = (data, answers) => {
        if (!data) return 128;

        let visibleCount = 0;
        data.categories.forEach(category => {
            category.questions.forEach(question => {
                if (shouldShowQuestion(question, answers)) {
                    visibleCount++;
                }
            });
        });
        return visibleCount;
    };

    const loadSavedAssessments = (data) => {
        const allAssessments = getAllSavedAssessments();
        const assessmentList = Object.values(allAssessments);

        // Sort by last modified (most recent first)
        assessmentList.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        setSavedAssessments(assessmentList);

        // Calculate Statistics
        if (data) {
            let completedCount = 0;
            let goodCount = 0;
            let poorCount = 0;
            let latestScore = null;

            assessmentList.forEach(assessment => {
                const totalQuestions = getVisibleQuestionCount(data, assessment.answers || {});
                const answeredCount = Object.keys(assessment.answers || {}).length;

                const isCompleted = answeredCount === totalQuestions && totalQuestions > 0;

                if (isCompleted) {
                    completedCount++;
                    const scoreResult = calculateOverallScore(data, assessment.answers || {});
                    const score = scoreResult.percentage;

                    if (latestScore === null) latestScore = score;

                    if (score >= 60) goodCount++;
                    else poorCount++;
                }
            });

            setStats({
                total: assessmentList.length,
                completed: completedCount,
                lastScore: latestScore,
                goodAssessments: goodCount,
                poorAssessments: poorCount
            });
        }
    };

    const handleStartNewAssessment = () => {
        const newId = generateAssessmentId();
        saveAssessment({}, { assessmentId: newId }, newId);
        setCurrentAssessmentId(newId);
        navigate('/poultry/layer-assessment/dashboard');
    };

    const handleContinueAssessment = (assessmentId) => {
        setCurrentAssessmentId(assessmentId);
        navigate('/poultry/layer-assessment/dashboard');
    };

    const handleDeleteAssessment = (assessmentId, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this assessment? This action cannot be undone.')) {
            clearAssessment(assessmentId);
            loadSavedAssessments(assessmentData);
        }
    };

    // Neutral accent colors for stat cards
    const accents = {
        pink: '#EC4899',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444'
    };

    if (!assessmentData) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Layer Assessment" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content">
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-title">Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fw-module-page">
            <PoultryTopNav title="Layer Assessment" />
            <div className="fw-mod-card">
                <div className="fw-mod-content">

                    {/* Stats Grid */}
                    <div className="fw-bio-stats-grid">
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.layer.landing.totalAssessments') || 'Total'}</div>
                            <div className="fw-bio-stat-value">{stats.total}</div>
                            <div className="fw-bio-stat-sub">{stats.completed} {t('poultry.layer.landing.completed') || 'completed'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.layer.landing.lastScore') || 'Last Score'}</div>
                            <div className={`fw-bio-stat-value ${stats.lastScore !== null ? 'green' : 'na'}`}>
                                {stats.lastScore !== null ? `${stats.lastScore}%` : 'N/A'}
                            </div>
                            <div className="fw-bio-stat-sub">{t('poultry.layer.landing.latestCompleted') || 'latest'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.layer.landing.goodAssessments') || 'Good'}</div>
                            <div className="fw-bio-stat-value green">{stats.goodAssessments}</div>
                            <div className="fw-bio-stat-sub">
                                {stats.completed > 0 ? Math.round((stats.goodAssessments / stats.completed) * 100) : 0}% {t('poultry.layer.landing.ofCompleted') || 'of completed'}
                            </div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.layer.landing.poorAssessments') || 'Poor'}</div>
                            <div className="fw-bio-stat-value red">{stats.poorAssessments}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.layer.landing.requiresAttention') || 'requires attention'}</div>
                        </div>
                    </div>

                    <button className="fw-bio-action-btn" onClick={handleStartNewAssessment}>
                        {t('poultry.layer.landing.startNewAssessment') || '+ Start New Assessment'}
                    </button>

                    <div className="fw-welcome-section-label">
                        {t('poultry.layer.landing.recentAssessments') || 'Recent Assessments'}
                    </div>

                    {savedAssessments.length === 0 ? (
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                            </div>
                            <div className="fw-bio-empty-title">{t('poultry.layer.landing.noAssessmentsYet') || 'No Assessments Yet'}</div>
                            <div className="fw-bio-empty-sub">{t('poultry.layer.landing.noAssessmentsText') || 'Start your first layer assessment'}</div>
                            <button className="fw-bio-action-btn" style={{ marginTop: 4 }} onClick={handleStartNewAssessment}>
                                {t('poultry.layer.landing.startFirstAssessment') || 'Start First Assessment'}
                            </button>
                        </div>
                    ) : (
                        savedAssessments.map((assessment) => {
                            const answeredCount = Object.keys(assessment.answers || {}).length;
                            const totalQuestions = getVisibleQuestionCount(assessmentData, assessment.answers || {});
                            const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
                            const isCompleted = answeredCount === totalQuestions && totalQuestions > 0;
                            const scoreResult = isCompleted ? calculateOverallScore(assessmentData, assessment.answers || {}) : null;
                            const score = scoreResult ? scoreResult.percentage : null;
                            const dateStr = new Date(assessment.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                            return (
                                <div
                                    key={assessment.id}
                                    className="fw-bio-assess-item"
                                    onClick={() => isCompleted
                                        ? (setCurrentAssessmentId(assessment.id), navigate(`/poultry/layer-assessment/results?id=${assessment.id}`))
                                        : handleContinueAssessment(assessment.id)
                                    }
                                >
                                    <div className={`fw-bio-assess-score${score !== null && score < 60 ? ' poor' : ''}`}>
                                        {isCompleted ? `${score}%` : `${percentage}%`}
                                    </div>
                                    <div className="fw-bio-assess-info">
                                        <div className="fw-bio-assess-name">{assessment.metadata?.assessmentId || assessment.id}</div>
                                        <div className="fw-bio-assess-date">
                                            {dateStr} · {isCompleted ? (t('poultry.layer.landing.completed') || 'Completed') : `${answeredCount}/${totalQuestions}`}
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDeleteAssessment(assessment.id, e)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: 16, padding: '4px', flexShrink: 0 }}>✕</button>
                                    <div className="fw-bio-assess-arrow">›</div>
                                </div>
                            );
                        })
                    )}
                </div>

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

export default LayerAssessmentLanding;

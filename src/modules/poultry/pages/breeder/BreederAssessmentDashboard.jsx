import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreederAssessment } from '../../contexts/BreederAssessmentContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../poultry.css';
import PoultryTopNav from '../../components/common/PoultryTopNav';

function BreederAssessmentDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language } = useLanguage();
    const {
        categories,
        categoryOrder,
        categoryScores,
        overallScore,
        riskConfig,
        progressStats,
        isComplete,
        isLoading,
        error,
        getCategoryProgress,
        navigateToCategory
    } = useBreederAssessment();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Breeder Assessment" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading assessment...</p>
                        </div>
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

    if (error) {
        return (
            <div className="fw-module-page">
                <PoultryTopNav title="Breeder Assessment" />
                <div className="fw-mod-card">
                    <div className="fw-mod-content" style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Error Loading Assessment</h2>
                        <p style={{ color: '#6b7280' }}>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Retry
                        </button>
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

    const handleCategoryClick = (categoryId) => {
        navigateToCategory(categoryId);
        navigate('/poultry/breeder-assessment/questions');
    };


    const handleBackToLanding = () => {
        navigate('/poultry/breeder-assessment');
    };

    return (
        <div className="fw-module-page">
            <PoultryTopNav title="Breeder Assessment" />
            <div className="fw-mod-card">
                <div className="fw-mod-content">
                    <p className="fw-mod-subtitle">{t('poultry.breeder.dashboard.subtitle')}</p>

                    {/* Stats */}
                    <div className="fw-bio-stats-grid">
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.breeder.dashboard.totalQuestions')}</div>
                            <div className="fw-bio-stat-value">{progressStats?.totalCount || 0}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.breeder.dashboard.allCategories')}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.breeder.dashboard.answered')}</div>
                            <div className="fw-bio-stat-value green">{progressStats?.answeredCount || 0}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.breeder.dashboard.questionsCompleted')}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.breeder.dashboard.progress')}</div>
                            <div className="fw-bio-stat-value amber">{progressStats?.percentage?.toFixed(0) || 0}%</div>
                            <div className="fw-bio-stat-sub">{t('poultry.breeder.dashboard.overallCompletion')}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.breeder.dashboard.currentScore')}</div>
                            <div className={`fw-bio-stat-value ${overallScore > 0 ? 'green' : 'na'}`}>{overallScore > 0 ? `${overallScore.toFixed(0)}%` : 'N/A'}</div>
                            <div className="fw-bio-stat-sub">{riskConfig?.labelText || '-'}</div>
                        </div>
                    </div>

                        {/* Category Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            {categoryOrder.map((categoryId) => {
                                const category = categories[categoryId];
                                const progress = getCategoryProgress(categoryId);
                                const categoryScore = categoryScores[categoryId];
                                const isStarted = progress.answeredCount > 0;
                                const isCompleted = progress.answeredCount === progress.totalCount && progress.totalCount > 0;

                                return (
                                    <div
                                        key={categoryId}
                                        onClick={() => handleCategoryClick(categoryId)}
                                        style={{
                                            background: 'white',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px',
                                            padding: '1.5rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#f59e0b';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Completion Badge */}
                                        {isCompleted && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: '#10b981',
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                 {t('poultry.breeder.dashboard.complete')}
                                            </div>
                                        )}

                                        {/* Category Header */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '0.5rem',
                                                background: '#fef3c7',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {categoryId === 'A' && ''}
                                                    {categoryId === 'B' && ''}
                                                    {categoryId === 'C' && ''}
                                                    {categoryId === 'D' && ''}
                                                    {categoryId === 'E' && ''}
                                                    {categoryId === 'F' && ''}
                                                    {categoryId === 'G' && ''}
                                                    {categoryId === 'I' && ''}
                                                    {categoryId === 'J' && ''}
                                                    {categoryId === 'K' && ''}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
                                                {category.name?.[language] || category.name?.en || (typeof category.name === 'string' ? category.name : '')}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {progress.totalCount} {t('poultry.breeder.dashboard.questions')}
                                            </p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '0.75rem',
                                                color: '#6b7280',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span>{progress.answeredCount} / {progress.totalCount} {t('poultry.breeder.dashboard.answered').toLowerCase()}</span>
                                                <span>{progress.percentage.toFixed(0)}%</span>
                                            </div>
                                            <div style={{
                                                height: '6px',
                                                background: '#e5e7eb',
                                                borderRadius: '999px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    height: '100%',
                                                    width: `${progress.percentage}%`,
                                                    background: isCompleted ? '#10b981' : '#f59e0b',
                                                    borderRadius: '999px',
                                                    transition: 'width 0.3s ease'
                                                }}></div>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        {categoryScore && categoryScore.percentage > 0 && (
                                            <div style={{
                                                padding: '0.75rem',
                                                background: '#f9fafb',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Score</span>
                                                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f59e0b' }}>
                                                    {categoryScore.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}

                                        {/* Action Hint */}
                                        <div style={{
                                            marginTop: '1rem',
                                            fontSize: '0.875rem',
                                            color: '#f59e0b',
                                            fontWeight: '500'
                                        }}>
                                            {isCompleted ? t('poultry.breeder.dashboard.reviewAnswers') : isStarted ? t('poultry.breeder.dashboard.continue') : t('poultry.breeder.dashboard.start')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            {(progressStats?.percentage >= 100 || progressStats?.answeredCount === progressStats?.totalCount) && (
                                <>
                                    <button className="fw-bio-action-btn" onClick={() => window.print()}>
                                        {t('poultry.breeder.dashboard.printAssessmentSummary')}
                                    </button>
                                    <button className="fw-bio-action-btn secondary" onClick={() => navigate('/poultry/breeder-assessment')}>
                                        {t('poultry.breeder.dashboard.backToMainDashboard')}
                                    </button>
                                </>
                            )}
                            <button
                                className="fw-bio-action-btn"
                                style={{ background: 'white', border: '2px solid #ef4444', color: '#ef4444' }}
                                onClick={() => {
                                    if (confirm(t('poultry.breeder.dashboard.discardConfirm'))) {
                                        const { clearAssessment, getCurrentAssessmentId } = require('../../utils/breederAssessmentUtils');
                                        const currentId = getCurrentAssessmentId();
                                        if (currentId) {
                                            clearAssessment(currentId);
                                            navigate('/poultry/breeder-assessment');
                                        }
                                    }
                                }}
                            >
                                {t('poultry.breeder.dashboard.discardAssessment')}
                            </button>
                        </div>
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

export default BreederAssessmentDashboard;

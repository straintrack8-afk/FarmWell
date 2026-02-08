import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayerAssessment } from '../../contexts/LayerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../poultry.css';

function LayerAssessmentDashboard() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        categories,
        categoryScores,
        overallScore,
        riskConfig,
        progressStats,
        isComplete,
        isLoading,
        error,
        getCategoryProgress,
        navigateToCategory
    } = useLayerAssessment();

    if (isLoading) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading assessment...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                            <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Error Loading Assessment</h2>
                            <p style={{ color: '#6b7280' }}>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn btn-primary"
                                style={{ marginTop: '1rem' }}
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleCategoryClick = (categoryIndex) => {
        navigateToCategory(categoryIndex);
        navigate('/poultry/layer-assessment/questions');
    };


    const handleBackToLanding = () => {
        navigate('/poultry/layer-assessment');
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    <div className="header">
                        <div
                            className="header-logo"
                            onClick={() => navigate('/poultry')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src="/images/PoultryWell_Logo.png" alt="PoultryWell" style={{ height: '80px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#374151'
                            }}>
                                {language.toUpperCase()}
                            </div>
                            <div className="offline-indicator online">
                                <span className="status-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                                Online
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Title */}
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={handleBackToLanding}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6b7280',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                ← Back
                            </button>
                            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Layer Farm Biosecurity Assessment
                            </h1>
                            <p style={{ color: '#6b7280' }}>Select a category to begin or continue your assessment</p>
                        </div>

                        {/* Progress Overview */}
                        <div style={{
                            background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                            borderRadius: '12px',
                            padding: '2rem',
                            color: 'white',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Overall Progress</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                                        {progressStats?.answeredCount || 0} / {progressStats?.totalCount || 0}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                                        {progressStats?.percentage?.toFixed(1) || 0}% Complete
                                    </div>
                                </div>
                                {overallScore > 0 && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Current Score</div>
                                        <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>
                                            {overallScore.toFixed(1)}%
                                        </div>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            background: 'rgba(255,255,255,0.2)',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            {riskConfig?.icon} {riskConfig?.labelText}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Progress Bar */}
                            <div style={{
                                marginTop: '1.5rem',
                                height: '8px',
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '999px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progressStats?.percentage || 0}%`,
                                    background: 'white',
                                    borderRadius: '999px',
                                    transition: 'width 0.3s ease'
                                }}></div>
                            </div>
                        </div>

                        {/* Category Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            {categories?.map((category, categoryIndex) => {
                                const progress = getCategoryProgress(categoryIndex);
                                const categoryScore = categoryScores[category.id];
                                const isStarted = progress.answeredCount > 0;
                                const isCompleted = progress.answeredCount === progress.totalCount && progress.totalCount > 0;

                                return (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategoryClick(categoryIndex)}
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
                                            e.currentTarget.style.borderColor = '#ec4899';
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
                                                ✓ Complete
                                            </div>
                                        )}

                                        {/* Category Header */}
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{
                                                display: 'inline-block',
                                                padding: '0.5rem',
                                                background: '#fce7f3',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {['ℹ️', '🐣', '🌾', '🐦', '🚜', '👥', '🐭', '🧼', '🏥', '🥚', '🗑️', '🌡️', '📊'][categoryIndex] || '📋'}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {category.name?.[language] || category.name?.en}
                                            </h3>
                                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                {progress.totalCount} questions
                                            </p>
                                        </div>

                                        {/* Progress */}
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '0.75rem',
                                                color: '#6b7280',
                                                marginBottom: '0.5rem'
                                            }}>
                                                <span>{progress.answeredCount} / {progress.totalCount} answered</span>
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
                                                    background: isCompleted ? '#10b981' : '#ec4899',
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
                                                <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ec4899' }}>
                                                    {categoryScore.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        )}

                                        {/* Action Hint */}
                                        <div style={{
                                            marginTop: '1rem',
                                            fontSize: '0.875rem',
                                            color: '#ec4899',
                                            fontWeight: '500'
                                        }}>
                                            {isCompleted ? 'Review answers →' : isStarted ? 'Continue →' : 'Start →'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                            {(progressStats?.percentage >= 100 || progressStats?.answeredCount === progressStats?.totalCount) && (
                                <>
                                    <button
                                        onClick={() => window.print()}
                                        className="btn btn-primary"
                                        style={{
                                            padding: '1rem 2rem',
                                            fontSize: '1.125rem',
                                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                                        }}
                                    >
                                        🖨️ Print Assessment Summary
                                    </button>
                                    <button
                                        onClick={() => navigate('/poultry/layer-assessment')}
                                        className="btn btn-outline"
                                        style={{
                                            padding: '1rem 2rem',
                                            fontSize: '1.125rem',
                                            border: '2px solid #6b7280',
                                            color: '#374151'
                                        }}
                                    >
                                        ← Back to Main Dashboard
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Discard Button */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to discard this assessment? This action cannot be undone.')) {
                                        const { loadAssessment, clearAssessment, getCurrentAssessmentId } = require('../../utils/layerAssessmentUtils');
                                        const currentId = getCurrentAssessmentId();
                                        if (currentId) {
                                            clearAssessment(currentId);
                                            navigate('/poultry/layer-assessment');
                                        }
                                    }
                                }}
                                className="btn"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '1rem',
                                    background: 'white',
                                    border: '2px solid #ef4444',
                                    color: '#ef4444',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#ef4444';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.color = '#ef4444';
                                }}
                            >
                                🗑️ Discard Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LayerAssessmentDashboard;

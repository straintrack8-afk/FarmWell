import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreederAssessment } from '../../contexts/BreederAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../poultry.css';

function BreederAssessmentDashboard() {
    const navigate = useNavigate();
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
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
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

    const handleCategoryClick = (categoryId) => {
        navigateToCategory(categoryId);
        navigate('/poultry/breeder-assessment/questions');
    };


    const handleBackToLanding = () => {
        navigate('/poultry/breeder-assessment');
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    
                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Title */}
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={handleBackToLanding}
                                style={{
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Back
                            </button>
                            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Breeder Farm Biosecurity Assessment
                            </h1>
                            <p style={{ color: '#6b7280' }}>Select a category to begin or continue your assessment</p>
                        </div>

                        {/* Progress Overview — 2×2 metric cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #366092', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Total Questions</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{progressStats?.totalCount || 0}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>across all categories</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Answered</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{progressStats?.answeredCount || 0}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>questions completed</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #F59E0B', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Progress</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#F59E0B', lineHeight: 1 }}>{progressStats?.percentage?.toFixed(0) || 0}%</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>overall completion</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #8B5CF6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Current Score</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: overallScore > 0 ? '#8B5CF6' : '#94a3b8', lineHeight: 1 }}>{overallScore > 0 ? `${overallScore.toFixed(0)}%` : 'N/A'}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>{riskConfig?.labelText || '-'}</div>
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
                                                 Complete
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
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {category.name?.en || categoryId}
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
                                            {isCompleted ? 'Review answers' : isStarted ? 'Continue' : 'Start'}
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
                                        Print Assessment Summary
                                    </button>
                                    <button
                                        onClick={() => navigate('/poultry/breeder-assessment')}
                                        className="btn btn-outline"
                                        style={{
                                            padding: '1rem 2rem',
                                            fontSize: '1.125rem',
                                            border: '2px solid #6b7280',
                                            color: '#374151'
                                        }}
                                    >
                                        Back to Main Dashboard
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Discard Button */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to discard this assessment? This action cannot be undone.')) {
                                        const { clearAssessment, getCurrentAssessmentId } = require('../../utils/breederAssessmentUtils');
                                        const currentId = getCurrentAssessmentId();
                                        if (currentId) {
                                            clearAssessment(currentId);
                                            navigate('/poultry/breeder-assessment');
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
                                 Discard Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BreederAssessmentDashboard;

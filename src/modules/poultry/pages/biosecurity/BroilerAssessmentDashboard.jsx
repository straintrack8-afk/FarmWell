import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBroilerAssessment } from '../../contexts/BroilerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText, loadAssessment, saveAssessment, clearAssessment } from '../../utils/assessmentUtils';

function BroilerAssessmentDashboard() {
    const navigate = useNavigate();
    const { language } = useLanguage();
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
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner"></div>
                        <p className="text-muted" style={{ marginTop: '1rem' }}>
                            Loading assessment...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '3rem' }}></div>
                        <h2 className="text-danger">Failed to Load</h2>
                        <p className="text-muted">{error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!assessmentData || !focusAreas) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '3rem' }}></div>
                        <h2>Data Unavailable</h2>
                        <p className="text-muted">Assessment data could not be found.</p>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            Retry
                        </button>
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
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    
                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {/* Title */}
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                    Broiler Farm Biosecurity Assessment
                                </h1>
                                <p style={{ color: '#6b7280' }}>
                                    {hasSavedProgress
                                        ? 'Select a category to continue your assessment'
                                        : 'Select a category to begin your assessment'
                                    }
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/poultry/biosecurity')}
                                style={{
                                    background: '#10B981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                Back to Dashboard
                            </button>
                        </div>

                        {/* Progress Overview — 2×2 metric cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #366092', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Total Questions</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{progressStats?.totalQuestions || 0}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>across all areas</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #10B981', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Answered</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{progressStats?.answeredQuestions || 0}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>questions completed</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #F59E0B', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Progress</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#F59E0B', lineHeight: 1 }}>{progressStats?.percentage?.toFixed(0) || 0}%</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>overall completion</div>
                            </div>
                            <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: '4px solid #8B5CF6', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Focus Areas</div>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#8B5CF6', lineHeight: 1 }}>{allAreas.length}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>total assessment areas</div>
                            </div>
                        </div>

                        {/* Assessment Information */}
                        <div style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Date
                                    </label>
                                    <div style={{
                                        fontSize: '1rem',
                                        color: '#1f2937',
                                        fontWeight: '500'
                                    }}>
                                        {(() => {
                                            const saved = loadAssessment();
                                            const date = saved?.metadata?.createdAt || saved?.savedAt || new Date().toISOString();
                                            return new Date(date).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            });
                                        })()}
                                    </div>
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Assessor Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter assessor name"
                                        defaultValue={(() => {
                                            const saved = loadAssessment();
                                            return saved?.metadata?.assessorName || '';
                                        })()}
                                        onBlur={(e) => {
                                            const saved = loadAssessment();
                                            if (saved) {
                                                const updatedMetadata = {
                                                    ...saved.metadata,
                                                    assessorName: e.target.value
                                                };
                                                saveAssessment(saved.answers, updatedMetadata, saved.id);
                                            }
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '0.5rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '1rem',
                                            color: '#1f2937'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: '#6b7280',
                                        marginBottom: '0.5rem'
                                    }}>
                                        Assessment ID
                                    </label>
                                    <div style={{
                                        fontSize: '1rem',
                                        color: '#1f2937',
                                        fontWeight: '600',
                                        fontFamily: 'monospace',
                                        background: '#f3f4f6',
                                        padding: '0.5rem',
                                        borderRadius: '6px'
                                    }}>
                                        {(() => {
                                            const saved = loadAssessment();
                                            return saved?.metadata?.assessmentId || saved?.id || 'N/A';
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* External Biosecurity */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '1rem'
                            }}>
                                {getLocalizedText(focusAreas.external_biosecurity?.name, language)}
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {externalAreas.map((area, index) => {
                                    const progress = getFocusAreaProgress(area);
                                    const percentage = progress.total > 0 ? Math.round((progress.answered / progress.total) * 100) : 0;
                                    const color = focusAreaColors[index];

                                    return (
                                        <div key={area.id} style={{
                                            background: 'white',
                                            borderRadius: '0.75rem',
                                            padding: '1.25rem',
                                            borderLeft: `4px solid ${focusAreaBorders[index] || '#366092'}`,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                            transition: 'box-shadow 0.2s ease',
                                            cursor: 'pointer',
                                            minWidth: 0,
                                            overflow: 'hidden'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'}
                                        >
                                            <div>
                                                {/* Header */}
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                                        FOCUS AREA {index + 1}
                                                    </div>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#1e293b' }}>
                                                        {getLocalizedText(area.name, language)}
                                                    </h3>
                                                    <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                                                        {getLocalizedText(area.subtitle, language)}
                                                    </p>
                                                </div>

                                                {/* Stats */}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                                                    <span>{area.question_count} questions</span>
                                                    <span>·</span>
                                                    <span>{progress.answered} answered</span>
                                                </div>

                                                {/* Progress */}
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                                                        <span>Progress</span>
                                                        <span>{percentage}%</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${percentage}%`, background: focusAreaBorders[index] || '#366092', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                                                    </div>
                                                </div>

                                                {/* Button */}
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem' }}
                                                    onClick={() => handleStartFocusArea('external', index)}
                                                >
                                                    {progress.answered > 0 ? 'Continue' : 'Start'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Internal Biosecurity */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#1f2937',
                                marginBottom: '1rem'
                            }}>
                                {getLocalizedText(focusAreas.internal_biosecurity?.name, language)}
                            </h2>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {internalAreas.map((area, index) => {
                                    const progress = getFocusAreaProgress(area);
                                    const percentage = progress.total > 0 ? Math.round((progress.answered / progress.total) * 100) : 0;
                                    const color = focusAreaColors[index + 2];

                                    return (
                                        <div key={area.id} style={{
                                            background: 'white',
                                            borderRadius: '0.75rem',
                                            padding: '1.25rem',
                                            borderLeft: `4px solid ${focusAreaBorders[(index + 2) % 4] || '#366092'}`,
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                            transition: 'box-shadow 0.2s ease',
                                            cursor: 'pointer',
                                            minWidth: 0,
                                            overflow: 'hidden'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'}
                                        >
                                            <div>
                                                {/* Header */}
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                                        FOCUS AREA {index + 3}
                                                    </div>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: '0 0 0.25rem 0', color: '#1e293b' }}>
                                                        {getLocalizedText(area.name, language)}
                                                    </h3>
                                                    <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                                                        {getLocalizedText(area.subtitle, language)}
                                                    </p>
                                                </div>

                                                {/* Stats */}
                                                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                                                    <span>{area.question_count} questions</span>
                                                    <span>·</span>
                                                    <span>{progress.answered} answered</span>
                                                </div>

                                                {/* Progress */}
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.3rem' }}>
                                                        <span>Progress</span>
                                                        <span>{percentage}%</span>
                                                    </div>
                                                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${percentage}%`, background: focusAreaBorders[(index + 2) % 4] || '#366092', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                                                    </div>
                                                </div>

                                                {/* Button */}
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ width: '100%', padding: '0.625rem', fontSize: '0.875rem' }}
                                                    onClick={() => handleStartFocusArea('internal', index)}
                                                >
                                                    {progress.answered > 0 ? 'Continue' : 'Start'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                            {(progressStats?.percentage >= 100 || progressStats?.answeredQuestions === progressStats?.totalQuestions) && (
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
                                        onClick={() => navigate('/poultry/biosecurity')}
                                        className="btn btn-primary"
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
                                        const saved = loadAssessment();
                                        if (saved?.id) {
                                            clearAssessment(saved.id);
                                            navigate('/poultry/biosecurity');
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

export default BroilerAssessmentDashboard;

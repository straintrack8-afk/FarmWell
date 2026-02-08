import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText, getCategoryProgress, getFocusAreaProgress } from '../../utils/assessmentUtils';

function CategoryProgress({
    focusAreas,
    categories,
    answers,
    currentCategoryId,
    onNavigate
}) {
    const { language } = useLanguage();

    if (!focusAreas || !categories) {
        return null;
    }

    const externalAreas = focusAreas.external_biosecurity?.areas || [];
    const internalAreas = focusAreas.internal_biosecurity?.areas || [];

    const renderFocusArea = (focusAreaData, areas, type) => {
        const color = type === 'external' ? '#ef4444' : '#3b82f6';
        const bgColor = type === 'external' ? '#fee2e2' : '#dbeafe';

        return (
            <div style={{ marginBottom: '1.5rem' }}>
                {/* Focus Area Header */}
                <div style={{
                    padding: '0.75rem 1rem',
                    background: bgColor,
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    border: `2px solid ${color}`
                }}>
                    <div style={{
                        fontWeight: 'bold',
                        color: type === 'external' ? '#991b1b' : '#1e40af',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {getLocalizedText(focusAreaData.name, language)}
                    </div>
                </div>

                {/* Sub-areas */}
                {areas.map((area, areaIndex) => {
                    const areaProgress = getFocusAreaProgress(area, categories, answers);

                    return (
                        <div key={area.id} style={{ marginBottom: '1rem' }}>
                            {/* Sub-area header */}
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '0.5rem',
                                paddingLeft: '0.5rem'
                            }}>
                                {getLocalizedText(area.name, language)} ({areaProgress.answered}/{areaProgress.total})
                            </div>

                            {/* Categories in this sub-area */}
                            <div className="categories-list">
                                {area.categories?.map(categoryId => {
                                    const category = categories[categoryId];
                                    if (!category) return null;

                                    const progress = getCategoryProgress(category, answers);
                                    const isCurrent = categoryId === currentCategoryId;
                                    const isCompleted = progress.answered === progress.total && progress.total > 0;

                                    return (
                                        <div
                                            key={categoryId}
                                            className={`category-item ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => onNavigate && onNavigate(categoryId)}
                                            style={{
                                                cursor: onNavigate ? 'pointer' : 'default',
                                                borderLeft: `3px solid ${color}`
                                            }}
                                        >
                                            <div className="category-indicator">
                                                {isCompleted ? (
                                                    <span className="check-icon">✓</span>
                                                ) : isCurrent ? (
                                                    <span className="current-icon">▶</span>
                                                ) : (
                                                    <span className="pending-icon">○</span>
                                                )}
                                            </div>

                                            <div className="category-info">
                                                <div className="category-name">
                                                    {getLocalizedText(category.name, language)}
                                                </div>
                                                <div className="category-stats">
                                                    <span>{progress.answered}/{progress.total}</span>
                                                    <div className="category-mini-progress">
                                                        <div
                                                            className="category-mini-progress-fill"
                                                            style={{
                                                                width: `${progress.percentage}%`,
                                                                background: color
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="category-weight">
                                                        {Math.round((category.weight || 0) * 100)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Calculate overall progress
    let totalQuestions = 0;
    let answeredQuestions = 0;
    Object.values(categories).forEach(cat => {
        const progress = getCategoryProgress(cat, answers);
        totalQuestions += progress.total;
        answeredQuestions += progress.answered;
    });
    const overallPercentage = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return (
        <div className="category-progress">
            <div className="progress-header">
                <h3 className="progress-title">Assessment Progress</h3>
                <div className="overall-progress">
                    <span className="progress-text">{answeredQuestions}/{totalQuestions}</span>
                    <span className="progress-percentage">({overallPercentage}%)</span>
                </div>
                <div className="progress-bar-container" style={{ marginTop: '0.5rem' }}>
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${overallPercentage}%` }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                {/* External Biosecurity */}
                {renderFocusArea(focusAreas.external_biosecurity, externalAreas, 'external')}

                {/* Internal Biosecurity */}
                {renderFocusArea(focusAreas.internal_biosecurity, internalAreas, 'internal')}
            </div>
        </div>
    );
}

export default CategoryProgress;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from './CircularProgress';

/**
 * Reusable card component for each focus area
 * Displays progress, scores, and navigation with modern gradient design
 */
function FocusAreaCard({ focusArea, assessment, language = 'en' }) {
    const navigate = useNavigate();
    const { number, name, description, total_questions, estimated_time_minutes } = focusArea;

    const focusAreaData = assessment?.focus_areas[number];
    const isCompleted = focusAreaData?.completed || false;
    const score = focusAreaData?.score || 0;
    const answeredCount = focusAreaData?.answers ? Object.keys(focusAreaData.answers).length : 0;
    const progressPercentage = (answeredCount / total_questions) * 100;

    // Gradient colors for each focus area
    const gradients = {
        1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };

    const gradient = gradients[number] || gradients[1];

    const getScoreColor = (score) => {
        if (score >= 80) return '#10B981'; // Green
        if (score >= 60) return '#3B82F6'; // Blue
        if (score >= 40) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    const handleClick = () => {
        navigate(`/swine/biosecurity/assessment/${number}`);
    };

    const getButtonText = () => {
        const translations = {
            en: { start: 'Start', continue: 'Continue', review: 'Review' },
            id: { start: 'Mulai', continue: 'Lanjutkan', review: 'Tinjau' },
            vt: { start: 'Bắt đầu', continue: 'Tiếp tục', review: 'Xem lại' }
        };

        const t = translations[language] || translations.en;

        if (isCompleted) return t.review;
        if (answeredCount > 0) return t.continue;
        return t.start;
    };

    const getTranslation = (key) => {
        const translations = {
            en: { questions: 'questions', min: 'min', answered: 'answered' },
            id: { questions: 'pertanyaan', min: 'menit', answered: 'dijawab' },
            vt: { questions: 'câu hỏi', min: 'phút', answered: 'đã trả lời' }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    return (
        <div
            style={{
                background: gradient,
                borderRadius: '1.5rem',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '220px'
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
            }}
        >
            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                pointerEvents: 'none'
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header with Score/Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            Focus Area {number}
                        </div>
                        <h3 style={{
                            fontSize: '1.375rem',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3'
                        }}>
                            {name}
                        </h3>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'rgba(255, 255, 255, 0.85)',
                            lineHeight: '1.5',
                            marginBottom: '0'
                        }}>
                            {description}
                        </p>
                    </div>

                    {/* Circular Progress or Score */}
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '90px' }}>
                        {isCompleted ? (
                            <>
                                <CircularProgress
                                    percentage={score}
                                    size={90}
                                    strokeWidth={7}
                                    color="white"
                                    backgroundColor="rgba(255, 255, 255, 0.2)"
                                    showPercentage={true}
                                />
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {getTranslation('score') || 'Score'}
                                </div>
                            </>
                        ) : (
                            <div style={{
                                height: '90px',
                                width: '90px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed rgba(255,255,255,0.3)',
                                borderRadius: '50%'
                            }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Pending
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Row */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.125rem' }}>📝</span>
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '500' }}>
                            {total_questions} {getTranslation('questions')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.125rem' }}>⏱️</span>
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '500' }}>
                            ~{estimated_time_minutes} {getTranslation('min')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.125rem' }}>✓</span>
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.95)', fontWeight: '500' }}>
                            {answeredCount} {getTranslation('answered')}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    style={{
                        width: '100%',
                        padding: '0.875rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#1f2937',
                        border: 'none',
                        borderRadius: '0.75rem',
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {getButtonText()} →
                </button>
            </div>
        </div>
    );
}

export default FocusAreaCard;

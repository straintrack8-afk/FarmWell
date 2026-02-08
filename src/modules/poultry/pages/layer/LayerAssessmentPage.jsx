import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayerAssessment } from '../../contexts/LayerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../poultry.css';

function LayerAssessmentPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        getCurrentCategory,
        getCurrentQuestion,
        getVisibleQuestions,
        answers,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        currentQuestionIndex,
        getCategoryProgress,
        isLoading
    } = useLayerAssessment();

    const category = getCurrentCategory();
    const question = getCurrentQuestion();
    const visibleQuestions = getVisibleQuestions();
    const progress = category ? getCategoryProgress(category.id) : null;

    if (isLoading || !category || !question) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    const handleAnswer = (answer) => {
        answerQuestion(question.id, answer);
    };

    const handleNext = () => {
        const hasNext = nextQuestion();
        if (!hasNext) {
            // Assessment complete, go to results
            navigate('/poultry/layer-assessment/results');
        }
    };

    const handlePrevious = () => {
        previousQuestion();
    };

    const handleBackToDashboard = () => {
        navigate('/poultry/layer-assessment/dashboard');
    };

    const handleSaveAndExit = () => {
        // Assessment is auto-saved, just navigate back to landing
        navigate('/poultry/layer-assessment');
    };

    // Check if this is the last question of the entire assessment
    const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;

    const currentAnswer = answers[question.id];
    const questionScore = question.answer_type === 'single_choice'
        ? question.options?.find(opt => opt.id === currentAnswer)?.score || 0
        : currentAnswer || 0;
    const showRiskWarning = questionScore < (question.risk_assessment?.trigger_score || 5);

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    <div className="header">
                        <div className="header-logo" onClick={() => navigate('/poultry')} style={{ cursor: 'pointer' }}>
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

                    {/* Progress Bar */}
                    <div style={{ padding: '1rem 2rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <button onClick={handleBackToDashboard} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '0.875rem' }}>
                                ← Back to Dashboard
                            </button>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Question {currentQuestionIndex + 1} of {visibleQuestions.length}
                            </span>
                        </div>
                        <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress?.percentage || 0}%`, background: '#ec4899', borderRadius: '999px', transition: 'width 0.3s ease' }}></div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                        {/* Category Badge */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                background: '#fce7f3',
                                borderRadius: '999px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#831843'
                            }}>
                                {category.name?.[language] || category.name?.en}
                            </span>
                        </div>

                        {/* Question */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', lineHeight: '1.4' }}>
                                {question.question?.[language] || question.question?.en}
                            </h2>
                            {question.required && (
                                <span style={{ fontSize: '0.875rem', color: '#ef4444' }}>* Required</span>
                            )}
                        </div>

                        {/* Answer Options */}
                        <div style={{ marginBottom: '2rem' }}>
                            {(question.answer_type === 'number_input' || question.answer_type === 'number') && (
                                <input
                                    type="number"
                                    value={currentAnswer || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder="Enter number"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        fontSize: '1rem',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '8px',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            )}

                            {question.answer_type === 'single_choice' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {question.options?.map((option) => {
                                        const isSelected = currentAnswer === option.id;
                                        return (
                                            <div
                                                key={option.id}
                                                onClick={() => handleAnswer(option.id)}
                                                style={{
                                                    padding: '1rem',
                                                    border: `2px solid ${isSelected ? '#f59e0b' : '#e5e7eb'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#fef3c7' : 'white',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) e.currentTarget.style.borderColor = '#ec4899';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) e.currentTarget.style.borderColor = '#e5e7eb';
                                                }}
                                            >
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    border: `2px solid ${isSelected ? '#ec4899' : '#d1d5db'}`,
                                                    background: isSelected ? '#ec4899' : 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>}
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: isSelected ? '600' : '400' }}>
                                                    {option.label?.[language] || option.label?.en}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {question.answer_type === 'multiple_choice' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {question.options?.map((option) => {
                                        const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(option.id);
                                        return (
                                            <div
                                                key={option.id}
                                                onClick={() => {
                                                    const newAnswer = isSelected
                                                        ? (currentAnswer || []).filter(id => id !== option.id)
                                                        : [...(currentAnswer || []), option.id];
                                                    handleAnswer(newAnswer);
                                                }}
                                                style={{
                                                    padding: '1rem',
                                                    border: `2px solid ${isSelected ? '#ec4899' : '#e5e7eb'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#fef3c7' : 'white',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem'
                                                }}
                                            >
                                                <div style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '4px',
                                                    border: `2px solid ${isSelected ? '#ec4899' : '#d1d5db'}`,
                                                    background: isSelected ? '#ec4899' : 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {isSelected && <span style={{ color: 'white', fontSize: '0.75rem' }}>✓</span>}
                                                </div>
                                                <span style={{ fontSize: '1rem', fontWeight: isSelected ? '600' : '400' }}>
                                                    {option.label?.[language] || option.label?.en}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Risk Warning */}
                        {currentAnswer && showRiskWarning && question.risk_assessment && (
                            <div style={{
                                padding: '1rem',
                                background: '#fef2f2',
                                border: '2px solid #fecaca',
                                borderRadius: '8px',
                                marginBottom: '2rem'
                            }}>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                                            Risk Identified
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: '#7f1d1d', margin: 0 }}>
                                            {question.risk_assessment.risk_description?.[language] || question.risk_assessment.risk_description?.en}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="btn"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'white',
                                    border: '2px solid #e5e7eb',
                                    opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                ← Previous
                            </button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {!isLastQuestion && (
                                    <button
                                        onClick={handleSaveAndExit}
                                        className="btn"
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            background: 'white',
                                            border: '2px solid #ec4899',
                                            color: '#ec4899',
                                            fontWeight: '600'
                                        }}
                                    >
                                        💾 Save & Exit
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                                    }}
                                >
                                    {isLastQuestion ? '✅ Complete & Save' : 'Next →'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LayerAssessmentPage;

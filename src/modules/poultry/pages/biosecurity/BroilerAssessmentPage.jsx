import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBroilerAssessment } from '../../contexts/BroilerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText } from '../../utils/assessmentUtils';
import QuestionCard from '../../components/biosecurity/QuestionCard';
import CategoryProgress from '../../components/biosecurity/CategoryProgress';
import '../../biosecurity.css';

function BroilerAssessmentPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        assessmentData,
        focusAreas,
        categories,
        currentCategoryId,
        currentQuestionIndex,
        answers,
        progressStats,
        isLoading,
        error,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        navigateTo,
        getCurrentQuestion,
        getCurrentCategory,
        getCurrentFocusArea,
        getCurrentQuestionNumber
    } = useBroilerAssessment();

    const [showValidation, setShowValidation] = useState(false);
    const [showProgress, setShowProgress] = useState(false);

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
                        <div style={{ fontSize: '3rem' }}>⚠️</div>
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

    const currentQuestion = getCurrentQuestion();
    const currentCategory = getCurrentCategory();
    const currentFocusArea = getCurrentFocusArea();

    if (!currentQuestion || !currentCategory) {
        return (
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card" style={{ textAlign: 'center', padding: '4rem' }}>
                        <div style={{ fontSize: '3rem' }}>📝</div>
                        <h2>No Question Available</h2>
                        <p className="text-muted">Please return to dashboard</p>
                        <button onClick={() => navigate('/poultry/biosecurity/assessment')} className="btn btn-primary">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const categoryName = getLocalizedText(currentCategory.name, language);
    const totalQuestionsInCategory = currentCategory.questions.length;
    const questionNumberInCategory = currentQuestionIndex + 1;

    const handleNext = () => {
        const currentAnswer = answers[currentQuestion.id];
        if (!currentAnswer) {
            setShowValidation(true);
            return;
        }
        setShowValidation(false);
        nextQuestion();
    };

    const handlePrevious = () => {
        setShowValidation(false);
        previousQuestion();
    };

    const handleAnswerChange = (answer) => {
        answerQuestion(currentQuestion.id, answer);
        setShowValidation(false);
    };

    const handleSaveAndExit = () => {
        navigate('/poultry/biosecurity/assessment');
    };

    const handleComplete = () => {
        const currentAnswer = answers[currentQuestion.id];
        if (!currentAnswer) {
            setShowValidation(true);
            return;
        }
        navigate('/poultry/biosecurity/results');
    };

    const handleCategoryClick = (categoryId) => {
        navigateTo({
            currentCategoryId: categoryId,
            currentQuestionIndex: 0
        });
        setShowProgress(false);
    };

    const isFirstQuestion = currentQuestionIndex === 0 && currentCategoryId === (focusAreas?.external_biosecurity?.areas?.[0]?.categories?.[0]);
    
    // Check if this is the last question in the entire assessment
    const isLastQuestion = () => {
        if (!progressStats) return false;
        const currentQuestionNum = getCurrentQuestionNumber();
        return currentQuestionNum === progressStats.totalQuestions;
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    <div className="assessment-page">
                        {/* Header */}
                        <div className="assessment-header">
                            <div className="header-left">
                                <h1 className="assessment-title">
                                    {getLocalizedText(assessmentData?.metadata?.title, language)}
                                </h1>
                                <div className="assessment-subtitle">
                                    {currentFocusArea && getLocalizedText(currentFocusArea.name, language)} → {categoryName}
                                </div>
                            </div>
                            <div className="header-right">
                                <button
                                    onClick={() => setShowProgress(!showProgress)}
                                    className="btn btn-outline btn-small"
                                >
                                    {showProgress ? '📝' : '📊'} {showProgress ? 'Hide Progress' : 'Show Progress'}
                                </button>
                            </div>
                        </div>

                        <div className="assessment-content">
                            {/* Progress Sidebar */}
                            {showProgress && (
                                <div className="progress-sidebar">
                                    <CategoryProgress
                                        focusAreas={focusAreas}
                                        categories={categories}
                                        answers={answers}
                                        currentCategoryId={currentCategoryId}
                                        onNavigate={handleCategoryClick}
                                    />
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="assessment-main">
                                {/* Progress Bar */}
                                <div className="question-progress">
                                    <div className="progress-info">
                                        <span className="progress-label">Question</span>
                                        <span className="progress-numbers">
                                            {getCurrentQuestionNumber()} / {progressStats?.totalQuestions || 0}
                                        </span>
                                        <span className="category-progress-text">
                                            ({questionNumberInCategory || 1}/{totalQuestionsInCategory || 0} in category)
                                        </span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${progressStats?.percentage || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Question Card */}
                                <QuestionCard
                                    question={currentQuestion}
                                    answer={answers[currentQuestion.id]}
                                    onAnswerChange={handleAnswerChange}
                                    language={language}
                                    showValidation={showValidation}
                                />

                                {/* Navigation Buttons */}
                                <div className="assessment-navigation">
                                    <div className="nav-left">
                                        {!isFirstQuestion && (
                                            <button
                                                onClick={handlePrevious}
                                                className="btn btn-outline"
                                            >
                                                ← Previous
                                            </button>
                                        )}
                                    </div>

                                    {!isLastQuestion() && (
                                        <div className="nav-center">
                                            <button
                                                onClick={handleSaveAndExit}
                                                className="btn btn-secondary"
                                            >
                                                💾 Save & Exit
                                            </button>
                                        </div>
                                    )}

                                    <div className="nav-right">
                                        {isLastQuestion() ? (
                                            <button
                                                onClick={handleComplete}
                                                className="btn btn-primary"
                                                style={{
                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                                                }}
                                            >
                                                ✓ Complete & Save
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleNext}
                                                className="btn btn-primary"
                                            >
                                                Next →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BroilerAssessmentPage;

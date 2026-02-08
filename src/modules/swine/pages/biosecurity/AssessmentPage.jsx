import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import { getFocusAreaQuestions, getAllFocusAreas, filterQuestionsByFarmType } from '../../data/questions_data';
import QuestionRenderer from '../../components/biosecurity/QuestionRenderer';

function AssessmentPage() {
    const navigate = useNavigate();
    const { focusArea: focusAreaParam } = useParams();
    const focusAreaNumber = parseInt(focusAreaParam);

    const { language: contextLanguage, farmType, currentAssessment, saveAnswer, completeFocusArea } = useBiosecurity();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [allQuestions, setAllQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [focusAreaInfo, setFocusAreaInfo] = useState(null);
    const [currentLang, setCurrentLang] = useState(contextLanguage || 'en');

    useEffect(() => {
        // Load questions for this focus area
        const lang = contextLanguage || 'en';
        setCurrentLang(lang);

        const faQuestions = getFocusAreaQuestions(focusAreaNumber, lang);
        setAllQuestions(faQuestions);

        // Filter questions based on farm type
        if (farmType) {
            const filtered = filterQuestionsByFarmType(faQuestions, farmType);
            setQuestions(filtered);
            console.log(`[Farm Type Filter] Focus Area ${focusAreaNumber}: ${farmType} - ${filtered.length}/${faQuestions.length} questions`);
        } else {
            // No farm type detected yet, use all questions
            setQuestions(faQuestions);
        }

        // Get focus area info
        const allFocusAreas = getAllFocusAreas(lang);
        const info = allFocusAreas.find(fa => fa.number === focusAreaNumber);
        setFocusAreaInfo(info);
    }, [focusAreaNumber, contextLanguage, farmType]); // Re-run when farm type changes

    const answers = currentAssessment?.focus_areas[focusAreaNumber]?.answers || {};

    // Get farm profile data for farm-type conditional logic
    const farmProfile = currentAssessment?.farm_profile || {};

    // Helper function to determine farm type from pre_q1 (farm profile)
    const getFarmType = () => {
        const animalCategories = farmProfile['pre_q1'] || [];
        return {
            has_sows: animalCategories.includes('sows_gilts_boars'),
            has_piglets: animalCategories.includes('weaned_piglets') || animalCategories.includes('suckling_piglets'),
            has_slaughter: animalCategories.includes('slaughter_pigs')
        };
    };

    // Evaluate condition string against current answers
    const evaluateCondition = (condition, currentAnswers, visibleQuestionIds) => {
        if (!condition) return true;

        // Custom handlers for specific complex conditions
        if (condition === 'Q45_includes_commercial') {
            const q45Answer = currentAnswers['Q45'];
            if (q45Answer === undefined || q45Answer === null) return true;
            return Array.isArray(q45Answer) && q45Answer.includes('commercial');
        }

        // Handle logical operators
        if (condition.includes(' OR ')) {
            const conditions = condition.split(' OR ');
            return conditions.some(c => evaluateCondition(c.trim(), currentAnswers, visibleQuestionIds));
        }

        if (condition.includes(' AND ')) {
            const conditions = condition.split(' AND ');
            return conditions.every(c => evaluateCondition(c.trim(), currentAnswers, visibleQuestionIds));
        }

        // Handle comparisons
        const match = condition.match(/^([A-Z0-9_]+)\s*(==|!=)\s*'(.+)'$/);
        if (match) {
            const [, questionId, operator, targetValue] = match;

            // STRICT CHECK: If the dependency question is NOT visible, this condition fails automatically
            // This prevents chained questions (Q27 dependent on Q26) from appearing if Q26 was hidden by Q25
            if (visibleQuestionIds && !visibleQuestionIds.has(questionId)) {
                return false;
            }

            const actualAnswer = currentAnswers[questionId];

            if (actualAnswer === undefined || actualAnswer === null) {
                return true;
            }

            if (operator === '==') {
                return actualAnswer === targetValue;
            } else if (operator === '!=') {
                return actualAnswer !== targetValue;
            }
        }

        return true;
    };

    // Get applicable questions based on conditional logic
    const getApplicableQuestions = () => {
        const applicable = [];
        const visibleQuestionIds = new Set();

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            let shouldSkipQuestion = false;

            // FIRST: Check if this question should be skipped based on PREVIOUS questions' answers
            for (let j = 0; j < i; j++) {
                const prevQuestion = questions[j];
                const prevAnswer = answers[prevQuestion.id];

                if (prevAnswer !== undefined) {
                    // Check all conditional logic fields of previous question
                    const logicFields = ['conditional_logic', 'conditional_logic_2', 'conditional_logic_3'];

                    for (const prevLogicField of logicFields) {
                        if (!prevQuestion[prevLogicField]) continue;

                        const prevLogic = prevQuestion[prevLogicField];

                        // Check if previous question's answer triggers a skip
                        let skipConditionMet = false;

                        if (prevLogic.if_answer !== undefined) {
                            if (Array.isArray(prevLogic.if_answer)) {
                                skipConditionMet = prevLogic.if_answer.includes(prevAnswer);
                            } else {
                                skipConditionMet = prevAnswer === prevLogic.if_answer;
                            }
                        } else if (prevLogic.if_answer_not !== undefined) {
                            skipConditionMet = prevAnswer !== prevLogic.if_answer_not;
                        } else if (prevLogic.if_answer_contains !== undefined) {
                            // For multiple choice answers
                            if (Array.isArray(prevAnswer)) {
                                skipConditionMet = prevAnswer.includes(prevLogic.if_answer_contains);
                            }
                        } else if (prevLogic.if_answer_not_contains !== undefined) {
                            // For multiple choice answers
                            if (Array.isArray(prevAnswer)) {
                                skipConditionMet = !prevAnswer.includes(prevLogic.if_answer_not_contains);
                            }
                        } else if (prevLogic.then && !prevLogic.if_answer && !prevLogic.if_answer_not) {
                            // Unconditional skip (always skip)
                            skipConditionMet = true;
                        }

                        // If condition met, handle skip action
                        if (skipConditionMet) {
                            // Handle skip_based_on_farm_type
                            if (prevLogic.then === 'skip_based_on_farm_type' && prevLogic.conditions) {
                                const farmType = getFarmType();
                                let skipTarget = null;

                                // Determine skip target based on farm type
                                if (farmType.has_sows && prevLogic.conditions.has_sows) {
                                    skipTarget = prevLogic.conditions.has_sows.target;
                                } else if (farmType.has_piglets && prevLogic.conditions.has_piglets) {
                                    skipTarget = prevLogic.conditions.has_piglets.target;
                                } else if (prevLogic.conditions.default) {
                                    skipTarget = prevLogic.conditions.default.target;
                                }

                                // Check if current question is in the skip range
                                if (skipTarget) {
                                    const targetIndex = questions.findIndex(q => q.id === skipTarget);
                                    if (targetIndex > j && i > j && i < targetIndex) {
                                        shouldSkipQuestion = true;
                                        break;
                                    }
                                }
                            }
                            // Handle regular skip_to
                            else if (prevLogic.then === 'skip_to' && prevLogic.target) {
                                // Check if current question is in the skip range
                                const targetIndex = questions.findIndex(q => q.id === prevLogic.target);
                                if (targetIndex > j && i > j && i < targetIndex) {
                                    shouldSkipQuestion = true;
                                    break;
                                }
                            }
                        }
                    }

                    if (shouldSkipQuestion) break;
                }
            }

            // If already marked to skip, don't include this question
            if (shouldSkipQuestion) {
                continue;
            }

            // SECOND: Check if question has dependency logic (depends_on)
            if (question.conditional_logic || question.conditional_logic_2) {
                const logicFields = ['conditional_logic', 'conditional_logic_2', 'conditional_logic_3'];

                for (const logicField of logicFields) {
                    if (!question[logicField]) continue;

                    const { if_answer, if_answer_not, depends_on } = question[logicField];

                    // Question depends on ANOTHER question's answer
                    if (depends_on) {
                        const dependsOnAnswer = answers[depends_on];

                        // If dependency question not answered yet, don't show this question
                        if (dependsOnAnswer === undefined || dependsOnAnswer === null) {
                            shouldSkipQuestion = true;
                            break;
                        }

                        // Check if answer matches condition
                        let conditionMet = false;
                        if (if_answer !== undefined) {
                            if (Array.isArray(if_answer)) {
                                conditionMet = if_answer.includes(dependsOnAnswer);
                            } else {
                                conditionMet = dependsOnAnswer === if_answer;
                            }
                        } else if (if_answer_not !== undefined) {
                            conditionMet = dependsOnAnswer !== if_answer_not;
                        }

                        // If condition not met, don't show this question
                        if (!conditionMet) {
                            shouldSkipQuestion = true;
                            break;
                        }
                    }
                }

                if (shouldSkipQuestion) {
                    continue;
                }
            }

            // THIRD: Check old-style condition string
            if (question.condition) {
                if (!evaluateCondition(question.condition, answers, visibleQuestionIds)) {
                    continue; // Skip this question
                }
            }

            // If we got here, include this question
            applicable.push(question);
            visibleQuestionIds.add(question.id); // Mark this question as visible
        }

        return applicable;
    };

    const applicableQuestions = getApplicableQuestions();
    const currentQuestion = applicableQuestions[currentQuestionIndex];
    const progress = applicableQuestions.length > 0
        ? Math.round(((currentQuestionIndex + 1) / applicableQuestions.length) * 100)
        : 0;

    const handleAnswerChange = (value) => {
        if (!currentQuestion) return;

        // Save answer
        saveAnswer(focusAreaNumber, currentQuestion.id, value);
    };

    const handleNext = () => {
        if (currentQuestionIndex < applicableQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Complete focus area
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSaveAndExit = () => {
        navigate('/swine/biosecurity/dashboard');
    };

    const handleComplete = () => {
        // Calculate and save score
        const score = completeFocusArea(focusAreaNumber);

        // Navigate back to dashboard
        navigate('/swine/biosecurity/dashboard');
    };

    const isAnswered = () => {
        if (!currentQuestion) return false;
        const answer = answers[currentQuestion.id];

        if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'multi_select') {
            return Array.isArray(answer) && answer.length > 0;
        }

        if (currentQuestion.type === 'table_choice') {
            if (!answer || typeof answer !== 'object') return false;
            // Check if all rows have been answered
            return currentQuestion.rows.every((row, index) =>
                answer[index] && answer[index].selected
            );
        }

        if (currentQuestion.type === 'matrix') {
            if (!answer || typeof answer !== 'object') return false;
            // Check if all rows have an answer
            return currentQuestion.rows.every(row => answer[row.id] !== undefined);
        }

        return answer !== undefined && answer !== null && answer !== '';
    };

    const getTranslation = (key) => {
        const translations = {
            en: {
                previous: 'Previous',
                saveExit: 'Save & Exit',
                next: 'Next',
                complete: 'Complete',
                question: 'Question',
                of: 'of',
                backToDashboard: 'Back to Dashboard',
                returnToDashboard: 'Return to Dashboard',
                focusAreaComplete: 'Focus Area Complete!',
                loading: 'Loading assessment...'
            },
            id: {
                previous: 'Sebelumnya',
                saveExit: 'Simpan & Keluar',
                next: 'Selanjutnya',
                complete: 'Selesai',
                question: 'Pertanyaan',
                of: 'dari',
                backToDashboard: 'Kembali ke Dashboard',
                returnToDashboard: 'Kembali ke Dashboard',
                focusAreaComplete: 'Area Fokus Selesai!',
                loading: 'Memuat penilaian...'
            },
            vt: {
                previous: 'Trước',
                saveExit: 'Lưu & Thoát',
                next: 'Tiếp',
                complete: 'Hoàn thành',
                question: 'Câu hỏi',
                of: 'của',
                backToDashboard: 'Quay lại Bảng điều khiển',
                returnToDashboard: 'Quay lại Bảng điều khiển',
                focusAreaComplete: 'Hoàn thành khu vực tập trung!',
                loading: 'Đang tải đánh giá...'
            }
        };
        // Use currentLang state which is synced with storage
        return translations[currentLang]?.[key] || translations.en[key];
    };

    if (questions.length === 0 || !focusAreaInfo) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>{getTranslation('focusAreaComplete')}</h2>
                    <button className="btn btn-primary" onClick={handleComplete}>
                        {getTranslation('returnToDashboard')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/swine/biosecurity/dashboard')}
                    style={{ marginBottom: '1rem' }}
                >
                    ← {getTranslation('backToDashboard')}
                </button>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                    Focus Area {focusAreaNumber}: {focusAreaInfo.name}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {focusAreaInfo.description}
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                        {getTranslation('question')} {currentQuestionIndex + 1} {getTranslation('of')} {applicableQuestions.length}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {progress}%
                    </span>
                </div>
                <div style={{
                    width: '100%',
                    height: '8px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Question */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    onChange={handleAnswerChange}
                    language={currentLang}
                />
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                <button
                    className="btn btn-secondary"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    style={{ flex: 1 }}
                >
                    ← {getTranslation('previous')}
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={handleSaveAndExit}
                    style={{ flex: 1 }}
                >
                    {getTranslation('saveExit')}
                </button>

                <button
                    className="btn btn-primary"
                    onClick={handleNext}
                    disabled={!isAnswered()}
                    style={{ flex: 1 }}
                >
                    {currentQuestionIndex === applicableQuestions.length - 1
                        ? getTranslation('complete')
                        : `${getTranslation('next')} →`
                    }
                </button>
            </div>
        </div>
    );
}

export default AssessmentPage;

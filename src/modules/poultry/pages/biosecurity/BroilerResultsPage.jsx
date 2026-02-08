import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBroilerAssessment } from '../../contexts/BroilerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText } from '../../utils/assessmentUtils';
import '../../../../portal.css';
import '../../poultry.css';

function BroilerResultsPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        assessmentData,
        focusAreas,
        categories,
        overallScore,
        externalScore,
        internalScore,
        focusAreaScores,
        categoryScores,
        grade,
        gradeConfig,
        triggeredRisks,
        progressStats,
        answers,
        calculateAllScores,
        scoringConfig
    } = useBroilerAssessment();

    React.useEffect(() => {
        if (calculateAllScores && assessmentData && focusAreas) {
            calculateAllScores();
        }
    }, [assessmentData, focusAreas, calculateAllScores]);

    const handleBackToLanding = () => {
        navigate('/poultry/biosecurity');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleNewAssessment = () => {
        navigate('/poultry/biosecurity');
    };

    if (!assessmentData) {
        return <div>Loading...</div>;
    }

    // Get grade color based on score ranges
    const getGradeColor = () => {
        if (overallScore < 50) return '#b91c1c'; // Dark Red - Critical Risk
        if (overallScore >= 50 && overallScore <= 75) return '#ef4444'; // Red - High Risk
        if (overallScore > 75 && overallScore <= 85) return '#eab308'; // Yellow - Medium Risk
        if (overallScore > 85 && overallScore <= 95) return '#10b981'; // Green - Low Risk
        return '#3b82f6'; // Blue - Excellent Biosecurity
    };

    // Get grade label based on score ranges
    const getGradeLabel = () => {
        if (overallScore < 50) return 'Critical Risk';
        if (overallScore >= 50 && overallScore <= 75) return 'High Risk';
        if (overallScore > 75 && overallScore <= 85) return 'Medium Risk';
        if (overallScore > 85 && overallScore <= 95) return 'Low Risk';
        return 'Excellent Biosecurity';
    };

    // Get all categories as array
    const allCategories = categories ? Object.values(categories) : [];

    // Get diseases at risk from risk_assessment data
    const getDiseasesAtRisk = () => {
        const diseaseMap = {};

        if (!categories || !answers) return [];

        Object.values(categories).forEach(category => {
            category.questions?.forEach(question => {
                const answer = answers[question.id];
                if (answer === undefined || answer === null) return;
                if (!question.risk_assessment) return;

                let questionScore = 0;

                // Calculate question score
                if (question.options) {
                    const selectedOption = question.options.find(opt => opt.id === answer);
                    questionScore = selectedOption?.score || 0;
                } else if (question.scoring_logic?.ranges) {
                    const numericAnswer = typeof answer === 'number' ? answer : parseFloat(answer);
                    if (!isNaN(numericAnswer)) {
                        const matchingRange = question.scoring_logic.ranges.find(
                            range => numericAnswer >= range.min && numericAnswer <= range.max
                        );
                        questionScore = matchingRange?.score || 0;
                    }
                }

                // Check if score is below trigger threshold
                const triggerScore = question.risk_assessment.trigger_score || 5;
                if (questionScore < triggerScore) {
                    const diseasesAffected = question.risk_assessment.diseases_affected || [];
                    
                    diseasesAffected.forEach(disease => {
                        if (disease === 'Multiple') return; // Skip generic "Multiple"
                        
                        if (!diseaseMap[disease]) {
                            diseaseMap[disease] = {
                                name: disease.replace(/_/g, ' '),
                                count: 0
                            };
                        }
                        diseaseMap[disease].count++;
                    });
                }
            });
        });

        // Convert to array and sort by count
        return Object.values(diseaseMap).sort((a, b) => b.count - a.count);
    };

    const diseasesAtRisk = getDiseasesAtRisk();
    
    console.log('[DEBUG] Diseases at Risk:', diseasesAtRisk);

    // Get improvement recommendations based on risk_assessment data
    const getImprovementRecommendations = () => {
        const recommendations = {
            critical: [],
            high: []
        };

        if (!categories || !answers) return recommendations;

        Object.values(categories).forEach(category => {
            category.questions?.forEach(question => {
                const answer = answers[question.id];
                if (answer === undefined || answer === null) return;
                if (!question.risk_assessment) return;

                let questionScore = 0;
                let maxScore = 0;

                // Calculate question score
                if (question.options) {
                    const selectedOption = question.options.find(opt => opt.id === answer);
                    questionScore = selectedOption?.score || 0;
                    maxScore = Math.max(...question.options.map(opt => opt.score || 0));
                } else if (question.scoring_logic?.ranges) {
                    const numericAnswer = typeof answer === 'number' ? answer : parseFloat(answer);
                    if (!isNaN(numericAnswer)) {
                        const matchingRange = question.scoring_logic.ranges.find(
                            range => numericAnswer >= range.min && numericAnswer <= range.max
                        );
                        questionScore = matchingRange?.score || 0;
                        maxScore = Math.max(...question.scoring_logic.ranges.map(r => r.score || 0));
                    }
                }

                // Check if score is below trigger threshold
                const triggerScore = question.risk_assessment.trigger_score || 5;
                if (questionScore < triggerScore) {
                    const priority = question.risk_assessment.priority || 'medium';
                    
                    // Parse multiline recommendation string into array
                    const recommendationText = getLocalizedText(question.risk_assessment.recommendation, language) || '';
                    const recommendationLines = recommendationText
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .map(line => {
                            // Remove number prefix like "1. " or "1." from the start
                            return line.replace(/^\d+\.\s*/, '');
                        });

                    const item = {
                        category: getLocalizedText(category.name, language),
                        question: getLocalizedText(question.question, language),
                        explanation: getLocalizedText(question.risk_assessment.risk_description, language),
                        recommendations: recommendationLines
                    };

                    if (priority === 'critical') {
                        recommendations.critical.push(item);
                    } else if (priority === 'high') {
                        recommendations.high.push(item);
                    }
                }
            });
        });

        return recommendations;
    };

    const improvements = getImprovementRecommendations();
    
    console.log('[DEBUG] Improvement Recommendations:', improvements);

    return (
        <>
            <style>{`
                @media print {
                    /* Hide non-printable elements */
                    .portal-layout {
                        min-height: auto !important;
                        padding: 0 !important;
                        background: white !important;
                    }
                    
                    .portal-container {
                        max-width: 100% !important;
                        margin: 0 !important;
                    }
                    
                    .portal-card {
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        padding: 0 !important;
                    }
                    
                    /* Hide header and action buttons */
                    .header {
                        display: none !important;
                    }
                    
                    button {
                        display: none !important;
                    }
                    
                    /* Adjust page margins */
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                    
                    /* CRITICAL: Keep priority sections together */
                    .priority-section {
                        display: block !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 0.5rem !important;
                        orphans: 3;
                        widows: 3;
                    }
                    
                    /* CRITICAL: Priority header must stay with content */
                    .priority-header {
                        display: block !important;
                        page-break-after: avoid !important;
                        break-after: avoid-page !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 0.5rem !important;
                        orphans: 3;
                        widows: 3;
                    }
                    
                    .priority-header + div {
                        display: block !important;
                        page-break-before: avoid !important;
                        break-before: avoid-page !important;
                        orphans: 3;
                        widows: 3;
                    }
                    
                    /* Prevent page breaks inside elements */
                    h2 {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    h2 + div {
                        page-break-before: avoid !important;
                        break-before: avoid !important;
                    }
                    
                    /* Keep recommendation cards together */
                    div[style*="background: #fef2f2"],
                    div[style*="background: #fffbeb"] {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 0.3rem !important;
                    }
                    
                    /* Clean backgrounds for print */
                    body {
                        background: white !important;
                    }
                    
                    /* Ensure colors print correctly */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    /* Reduce spacing for print */
                    div[style*="marginBottom: '0.75rem'"] {
                        margin-bottom: 0.3rem !important;
                    }
                    
                    div[style*="gap: '0.5rem'"] {
                        gap: 0.3rem !important;
                    }
                }
            `}</style>
            <div className="portal-layout">
                <div className="portal-container">
                    <div className="portal-card">
                {/* Header */}
                <div className="header" style={{ '@media print': { display: 'none' } }}>
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

                {/* Title */}
                <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem 2rem 0 2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Biosecurity Assessment Report
                    </h1>
                    <p style={{ color: '#6b7280' }}>Broiler Farm Biosecurity Evaluation</p>
                </div>

                {/* Content Wrapper */}
                <div style={{ padding: '0 2rem 2rem 2rem' }}>
                    {/* Overall Score Card */}
                    <div style={{
                        background: getGradeColor(),
                        borderRadius: '16px',
                        padding: '1.05rem',
                        textAlign: 'center',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            filter: 'blur(60px)'
                        }}></div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '2.1rem', marginBottom: '0.25rem' }}>
                                {overallScore > 95 ? '🎯' : overallScore > 85 ? '✅' : overallScore > 75 ? '⚠️' : overallScore >= 50 ? '🔴' : '❌'}
                            </div>
                            <div style={{
                                fontSize: '1.96875rem',
                                fontWeight: '700',
                                marginBottom: '0.25rem'
                            }}>
                                {overallScore}%
                            </div>
                            <div style={{
                                fontSize: '0.7875rem',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                {getGradeLabel()}
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                {progressStats?.answeredQuestions || 0} of {progressStats?.totalQuestions || 83} questions answered
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div style={{ marginBottom: '0.75rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '0.75rem'
                        }}>
                            Category Breakdown
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem'
                        }}>
                            {allCategories.map(category => {
                                const score = categoryScores[category.id];
                                const percentage = score?.percentage || 0;
                                const color = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#eab308' : percentage >= 30 ? '#f59e0b' : '#ef4444';

                                return (
                                    <div key={category.id} style={{
                                        padding: '1.05rem',
                                        background: 'white',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '12px'
                                    }}>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: '#6b7280',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {getLocalizedText(category.name, language)}
                                        </div>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: color,
                                            marginBottom: '0.35rem'
                                        }}>
                                            {percentage.toFixed(1)}%
                                        </div>
                                        <div style={{
                                            height: '6px',
                                            background: '#e5e7eb',
                                            borderRadius: '999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                background: color,
                                                borderRadius: '999px'
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Diseases at Risk */}
                    <div style={{ marginBottom: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '0.75rem',
                            color: '#1f2937'
                        }}>
                            Diseases at Risk
                        </h2>
                        {diseasesAtRisk && diseasesAtRisk.length > 0 ? (
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                            }}>
                                {diseasesAtRisk.map((disease, index) => (
                                    <div key={index} style={{
                                        padding: '0.5rem 1rem',
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                        borderRadius: '999px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <span>{disease.name}</span>
                                        <span style={{
                                            background: '#dc2626',
                                            color: 'white',
                                            borderRadius: '999px',
                                            padding: '0.125rem 0.5rem',
                                            fontSize: '0.75rem'
                                        }}>
                                            {disease.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280' }}>No significant disease risks identified</p>
                        )}
                    </div>

                    {/* Improvement Plan */}
                    <div style={{ marginBottom: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '0.75rem',
                            color: '#1f2937'
                        }}>
                            Improvement Plan
                        </h2>

                    {/* Critical Priority */}
                    {improvements.critical.length > 0 && (
                        <div className="priority-section" style={{ marginBottom: '2rem' }}>
                            <div className="priority-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                padding: '0.525rem 0.7rem',
                                background: '#fee2e2',
                                borderRadius: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#dc2626'
                                }}></div>
                                <span style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    color: '#991b1b'
                                }}>
                                    Critical Priority ({improvements.critical.length})
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {improvements.critical.map((item, index) => (
                                    <div key={index} style={{
                                        background: '#fef2f2',
                                        border: '2px solid #fecaca',
                                        borderRadius: '12px',
                                        padding: '0.75rem'
                                    }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#991b1b',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.category}
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.question}
                                        </div>
                                        {item.explanation && (
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {item.explanation}
                                            </div>
                                        )}
                                        {item.recommendations && item.recommendations.length > 0 && (
                                            <div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Recommended Actions:
                                                </div>
                                                <ol style={{
                                                    fontSize: '0.875rem',
                                                    color: '#4b5563',
                                                    paddingLeft: '1.5rem',
                                                    margin: 0
                                                }}>
                                                    {item.recommendations.map((rec, i) => (
                                                        <li key={i} style={{ marginBottom: '0.25rem' }}>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* High Priority */}
                    {improvements.high.length > 0 && (
                        <div className="priority-section" style={{ marginBottom: '2rem' }}>
                            <div className="priority-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                padding: '0.525rem 0.7rem',
                                background: '#fef3c7',
                                borderRadius: '8px'
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#f59e0b'
                                }}></div>
                                <span style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    color: '#92400e'
                                }}>
                                    High Priority ({improvements.high.length})
                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {improvements.high.map((item, index) => (
                                    <div key={index} style={{
                                        background: '#fffbeb',
                                        border: '2px solid #fde68a',
                                        borderRadius: '12px',
                                        padding: '0.75rem'
                                    }}>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: '#92400e',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.category}
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.question}
                                        </div>
                                        {item.explanation && (
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {item.explanation}
                                            </div>
                                        )}
                                        {item.recommendations && item.recommendations.length > 0 && (
                                            <div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#1f2937',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Recommended Actions:
                                                </div>
                                                <ol style={{
                                                    fontSize: '0.875rem',
                                                    color: '#4b5563',
                                                    paddingLeft: '1.5rem',
                                                    margin: 0
                                                }}>
                                                    {item.recommendations.map((rec, i) => (
                                                        <li key={i} style={{ marginBottom: '0.25rem' }}>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {improvements.critical.length === 0 && improvements.high.length === 0 && (
                        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                            Great job! No critical improvements needed at this time.
                        </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div style={{
                    padding: '2rem',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={handlePrint}
                        style={{
                            padding: '0.75rem 2rem',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
                    >
                        🖨️ Print Report
                    </button>
                    <button
                        onClick={handleBackToLanding}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'white',
                            color: '#374151',
                            border: '2px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9ca3af'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    >
                        ← Back to Dashboard
                    </button>
                    <button
                        onClick={handleNewAssessment}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Start New Assessment
                    </button>
                </div>
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default BroilerResultsPage;

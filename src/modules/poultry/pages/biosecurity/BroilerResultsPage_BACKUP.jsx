import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBroilerAssessment } from '../../contexts/BroilerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText } from '../../utils/assessmentUtils';
import ScoreCard from '../../components/biosecurity/ScoreCard';
import DiseaseRiskAlert from '../../components/biosecurity/DiseaseRiskAlert';
import '../../biosecurity.css';

function BroilerResultsPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        assessmentData,
        focusAreas,
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
        calculateAllScores
    } = useBroilerAssessment();

    // Force recalculate scores when results page loads
    React.useEffect(() => {
        console.log('Results Page - Forcing score recalculation');
        // Only calculate if data is loaded
        if (calculateAllScores && assessmentData && focusAreas) {
            calculateAllScores();
        }
    }, [assessmentData, focusAreas, calculateAllScores]);

    React.useEffect(() => {
        console.log('=== RESULTS PAGE DEBUG ===');
        console.log('Results Page - Overall Score:', overallScore);
        console.log('Results Page - External Score:', externalScore);
        console.log('Results Page - Internal Score:', internalScore);
        console.log('Results Page - Focus Area Scores:', focusAreaScores);
        console.log('Results Page - Category Scores:', categoryScores);
        console.log('Results Page - Answers:', answers);
        console.log('Results Page - Answers count:', Object.keys(answers || {}).length);
        console.log('Results Page - Progress Stats:', progressStats);
        console.log('Results Page - Grade:', grade);
        console.log('=========================');
    }, [overallScore, externalScore, internalScore, focusAreaScores, categoryScores, answers, progressStats, grade]);

    const handleNewAssessment = () => {
        if (confirm('Start a new assessment? This will clear your current progress.')) {
            localStorage.removeItem('broiler_assessment_progress');
            navigate('/poultry/biosecurity');
        }
    };

    const handleBackToLanding = () => {
        navigate('/poultry/biosecurity');
    };

    const handlePrint = () => {
        window.print();
    };

    if (!assessmentData) {
        return <div>Loading...</div>;
    }

    const externalAreas = focusAreas?.external_biosecurity?.areas || [];
    const internalAreas = focusAreas?.internal_biosecurity?.areas || [];

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    <div className="results-header">
                        <button
                            className="btn btn-back no-print"
                            onClick={handleBackToLanding}
                            style={{ position: 'absolute', left: '1rem', top: '1rem' }}
                        >
                            ← Back
                        </button>

                        <h1 className="results-title">
                            Assessment Results
                        </h1>
                        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                            {getLocalizedText(assessmentData.metadata?.title, language)}
                        </p>
                    </div>

                    {/* Overall Score */}
                    <div className="results-section">
                        <h2 className="section-title">Overall Biosecurity Score</h2>
                        <ScoreCard
                            score={overallScore}
                            maxScore={100}
                            grade={grade}
                            gradeConfig={gradeConfig}
                            language={language}
                        />
                    </div>

                    {/* External vs Internal Scores */}
                    <div className="results-section">
                        <h2 className="section-title">Biosecurity Breakdown</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {/* External Biosecurity */}
                            <div style={{
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                border: '2px solid #ef4444',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>
                                    {getLocalizedText(focusAreas?.external_biosecurity?.name, language)}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '0.5rem' }}>
                                    {externalScore}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                                    Weight: 61%
                                </div>
                            </div>

                            {/* Internal Biosecurity */}
                            <div style={{
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏠</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                                    {getLocalizedText(focusAreas?.internal_biosecurity?.name, language)}
                                </h3>
                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                                    {internalScore}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                    Weight: 39%
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Focus Area Scores */}
                    <div className="results-section">
                        <h2 className="section-title">Focus Area Performance</h2>
                        <div className="category-scores-grid">
                            {[...externalAreas, ...internalAreas].map((area, index) => {
                                const areaScore = focusAreaScores[area.id];
                                const isExternal = index < externalAreas.length;
                                const color = isExternal ? '#ef4444' : '#3b82f6';

                                return (
                                    <div key={area.id} className="category-score-card">
                                        <div className="category-score-header">
                                            <div className="category-score-name">
                                                {getLocalizedText(area.name, language)}
                                            </div>
                                            <div className="category-weight">
                                                {Math.round((area.weight || 0) * 100)}%
                                            </div>
                                        </div>
                                        <div className="category-score-body">
                                            <div
                                                className="category-score-value"
                                                style={{ color }}
                                            >
                                                {areaScore?.percentage || 0}
                                            </div>
                                            <div className="category-score-bar">
                                                <div
                                                    className="category-score-bar-fill"
                                                    style={{
                                                        width: `${areaScore?.percentage || 0}%`,
                                                        background: color
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Disease Risks */}
                    <div className="results-section">
                        <h2 className="section-title">Disease Risk Assessment</h2>
                        <DiseaseRiskAlert triggeredRisks={triggeredRisks} />
                    </div>

                    {/* Summary Stats */}
                    <div className="results-section">
                        <h2 className="section-title">Assessment Summary</h2>
                        <div className="summary-stats">
                            <div className="summary-stat">
                                <div className="stat-icon">📝</div>
                                <div className="stat-content">
                                    <div className="stat-value">{progressStats?.answeredQuestions || 0}</div>
                                    <div className="stat-label">Questions Answered</div>
                                </div>
                            </div>

                            <div className="summary-stat">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <div className="stat-value">{progressStats?.percentage || 0}%</div>
                                    <div className="stat-label">Completion Rate</div>
                                </div>
                            </div>

                            <div className="summary-stat">
                                <div className="stat-icon">⚠️</div>
                                <div className="stat-content">
                                    <div className="stat-value">{triggeredRisks?.length || 0}</div>
                                    <div className="stat-label">Risks Identified</div>
                                </div>
                            </div>

                            <div className="summary-stat">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-content">
                                    <div className="stat-value">{grade || 'N/A'}</div>
                                    <div className="stat-label">Overall Grade</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="results-actions">
                        <button
                            className="btn btn-secondary no-print"
                            onClick={handlePrint}
                        >
                            🖨️ Print Results
                        </button>

                        <button
                            className="btn btn-primary no-print"
                            onClick={handleNewAssessment}
                            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
                        >
                            🔄 Start New Assessment
                        </button>
                    </div>

                    {/* Footer Note */}
                    <div className="assessment-footer-note">
                        <p>
                            This assessment is based on scientifically validated biosecurity framework.
                            Results should be used as a guide for improving biosecurity practices.
                        </p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                            For detailed recommendations, consult with a veterinary professional.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BroilerResultsPage;

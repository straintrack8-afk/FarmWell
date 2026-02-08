import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLayerAssessment } from '../../contexts/LayerAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../poultry.css';

function BreederResultsPage() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        overallScore,
        riskConfig,
        categoryScores,
        categories,
        recommendations,
        diseasesAtRisk,
        progressStats,
        isComplete,
        resetAssessment
    } = useLayerAssessment();

    const handlePrint = () => {
        window.print();
    };

    const handleNewAssessment = () => {
        if (window.confirm('Are you sure you want to start a new assessment? This will clear all current answers.')) {
            resetAssessment();
            navigate('/poultry/layer-assessment/dashboard');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/poultry/layer-assessment/dashboard');
    };

    // Group recommendations by priority
    const criticalRecs = recommendations.filter(r => r.priority === 'critical');
    const highRecs = recommendations.filter(r => r.priority === 'high');
    const mediumRecs = recommendations.filter(r => r.priority === 'medium');
    const lowRecs = recommendations.filter(r => r.priority === 'low');

    return (
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

                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Title */}
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Biosecurity Assessment Report
                            </h1>
                            <p style={{ color: '#6b7280' }}>Layer Farm Biosecurity Evaluation</p>
                        </div>

                        {/* Overall Score Card */}
                        <div style={{
                            background: `linear-gradient(135deg, ${riskConfig?.color || '#f59e0b'} 0%, ${riskConfig?.color || '#d97706'} 100%)`,
                            borderRadius: '16px',
                            padding: '2rem',
                            color: 'white',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{riskConfig?.icon}</div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                {overallScore.toFixed(1)}%
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                                {riskConfig?.labelText}
                            </div>
                            <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                                {progressStats?.answeredCount} of {progressStats?.totalCount} questions answered
                            </div>
                        </div>

                        {/* Category Scores */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                Category Breakdown
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                {Object.entries(categories || {}).map(([categoryId, category]) => {
                                    const score = categoryScores[categoryId];
                                    if (!score) return null;

                                    const percentage = score.percentage || 0;
                                    const color = percentage >= 70 ? '#10b981' : percentage >= 50 ? '#eab308' : percentage >= 30 ? '#f59e0b' : '#ef4444';

                                    return (
                                        <div key={categoryId} style={{
                                            padding: '1.5rem',
                                            background: 'white',
                                            border: '2px solid #e5e7eb',
                                            borderRadius: '12px'
                                        }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                {category.name?.[language] || category.name?.en}
                                            </div>
                                            <div style={{ fontSize: '2rem', fontWeight: '700', color: color, marginBottom: '0.5rem' }}>
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
                        {diseasesAtRisk && diseasesAtRisk.length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                    Diseases at Risk
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    {diseasesAtRisk.slice(0, 10).map((disease, index) => (
                                        <div key={index} style={{
                                            padding: '0.75rem 1.25rem',
                                            background: '#fef2f2',
                                            border: '2px solid #fecaca',
                                            borderRadius: '999px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <span style={{ fontWeight: '600', color: '#991b1b' }}>{disease.name}</span>
                                            <span style={{
                                                padding: '0.125rem 0.5rem',
                                                background: '#ef4444',
                                                color: 'white',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                {disease.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Improvement Recommendations */}
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                                Improvement Plan
                            </h2>

                            {/* Critical Priority */}
                            {criticalRecs.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        background: '#fef2f2',
                                        borderLeft: '4px solid #ef4444',
                                        marginBottom: '1rem'
                                    }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b' }}>
                                            🔴 Critical Priority ({criticalRecs.length})
                                        </h3>
                                    </div>
                                    {criticalRecs.map((rec, index) => (
                                        <div key={index} style={{
                                            padding: '1.5rem',
                                            background: 'white',
                                            border: '2px solid #fecaca',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                {rec.categoryName}
                                            </div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                                {rec.question}
                                            </h4>
                                            <p style={{ fontSize: '0.875rem', color: '#7f1d1d', marginBottom: '1rem' }}>
                                                {rec.riskDescription}
                                            </p>
                                            <div style={{ fontSize: '0.875rem' }}>
                                                <strong>Recommended Actions:</strong>
                                                <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                                    {rec.actions.map((action, i) => (
                                                        <li key={i} style={{ marginBottom: '0.25rem' }}>{action}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* High Priority */}
                            {highRecs.length > 0 && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        background: '#fef3c7',
                                        borderLeft: '4px solid #f59e0b',
                                        marginBottom: '1rem'
                                    }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#92400e' }}>
                                            🟠 High Priority ({highRecs.length})
                                        </h3>
                                    </div>
                                    {highRecs.slice(0, 5).map((rec, index) => (
                                        <div key={index} style={{
                                            padding: '1.5rem',
                                            background: 'white',
                                            border: '2px solid #fde68a',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                                                {rec.categoryName}
                                            </div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                                {rec.question}
                                            </h4>
                                            <p style={{ fontSize: '0.875rem', color: '#78350f', marginBottom: '1rem' }}>
                                                {rec.riskDescription}
                                            </p>
                                            <div style={{ fontSize: '0.875rem' }}>
                                                <strong>Recommended Actions:</strong>
                                                <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                                                    {rec.actions.map((action, i) => (
                                                        <li key={i} style={{ marginBottom: '0.25rem' }}>{action}</li>
                                                    ))}
                                                </ol>
                                            </div>
                                        </div>
                                    ))}
                                    {highRecs.length > 5 && (
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', textAlign: 'center' }}>
                                            + {highRecs.length - 5} more high priority items
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Summary if no recommendations */}
                            {recommendations.length === 0 && (
                                <div style={{
                                    padding: '2rem',
                                    background: '#d1fae5',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                                        Excellent Biosecurity!
                                    </h3>
                                    <p style={{ color: '#064e3b' }}>
                                        No critical improvements needed. Keep up the good work!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }} className="no-print">
                            <button onClick={handlePrint} className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                                🖨️ Print Report
                            </button>
                            <button onClick={handleBackToDashboard} className="btn" style={{ padding: '1rem 2rem', background: 'white', border: '2px solid #e5e7eb' }}>
                                ← Back to Dashboard
                            </button>
                            <button onClick={handleNewAssessment} className="btn" style={{ padding: '1rem 2rem', background: 'white', border: '2px solid #e5e7eb' }}>
                                Start New Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .header, .no-print { display: none !important; }
                    .portal-card { box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}

export default BreederResultsPage;

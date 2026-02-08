import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreederAssessment } from '../../contexts/BreederAssessmentContext';
import { useLanguage } from '../../../../contexts/LanguageContext';
import '../../../../portal.css';
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
        resetAssessment,
        completeAssessment
    } = useBreederAssessment();

    const handlePrint = () => {
        window.print();
    };

    const handleNewAssessment = () => {
        navigate('/poultry/breeder-assessment');
    };

    const handleBackToLanding = () => {
        navigate('/poultry/breeder-assessment');
    };

    // Group recommendations by priority
    const improvements = {
        critical: recommendations.filter(r => r.priority === 'critical'),
        high: recommendations.filter(r => r.priority === 'high'),
        medium: recommendations.filter(r => r.priority === 'medium'),
        low: recommendations.filter(r => r.priority === 'low')
    };

    // Get grade color based on score ranges
    const getGradeColor = () => {
        if (overallScore < 50) return '#b91c1c';
        if (overallScore >= 50 && overallScore <= 75) return '#ef4444';
        if (overallScore > 75 && overallScore <= 85) return '#eab308';
        if (overallScore > 85 && overallScore <= 95) return '#10b981';
        return '#3b82f6';
    };

    const getGradeLabel = () => {
        if (overallScore < 50) return 'Critical Risk';
        if (overallScore >= 50 && overallScore <= 75) return 'High Risk';
        if (overallScore > 75 && overallScore <= 85) return 'Medium Risk';
        if (overallScore > 85 && overallScore <= 95) return 'Low Risk';
        return 'Excellent Biosecurity';
    };

    const allCategories = categories ? Object.values(categories) : [];

    return (
        <>
            <style>{`
                @media print {
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
                    
                    .header {
                        display: none !important;
                    }
                    
                    button {
                        display: none !important;
                    }
                    
                    @page {
                        margin: 1cm;
                        size: A4;
                    }
                    
                    .priority-section {
                        display: block !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                        margin-bottom: 0.5rem !important;
                    }
                    
                    .priority-header {
                        display: block !important;
                        page-break-after: avoid !important;
                        break-after: avoid-page !important;
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    h2 {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
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
                    <p style={{ color: '#6b7280' }}>Breeder Farm Biosecurity Evaluation</p>
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
                                {overallScore.toFixed(1)}%
                            </div>
                            <div style={{
                                fontSize: '0.7875rem',
                                fontWeight: '600',
                                marginBottom: '0.5rem'
                            }}>
                                {getGradeLabel()}
                            </div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                {progressStats?.answeredCount || 0} of {progressStats?.totalCount || 131} questions answered
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
                                            {category.name?.[language] || category.name?.en}
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
                                            {item.categoryName}
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.question}
                                        </div>
                                        {item.riskDescription && (
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {item.riskDescription}
                                            </div>
                                        )}
                                        {item.actions && item.actions.length > 0 && (
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
                                                    margin: 0,
                                                    listStylePosition: 'outside'
                                                }}>
                                                    {item.actions.map((rec, i) => (
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
                                            {item.categoryName}
                                        </div>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: '#1f2937',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {item.question}
                                        </div>
                                        {item.riskDescription && (
                                            <div style={{
                                                fontSize: '0.875rem',
                                                color: '#6b7280',
                                                marginBottom: '0.75rem'
                                            }}>
                                                {item.riskDescription}
                                            </div>
                                        )}
                                        {item.actions && item.actions.length > 0 && (
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
                                                    margin: 0,
                                                    listStylePosition: 'outside'
                                                }}>
                                                    {item.actions.map((rec, i) => (
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

export default BreederResultsPage;

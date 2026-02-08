import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getAllSavedAssessments, generateAssessmentId, setCurrentAssessmentId, clearAssessment, saveAssessment } from '../../utils/breederAssessmentUtils';
import '../../poultry.css';

function BreederAssessmentLanding() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [savedAssessments, setSavedAssessments] = useState([]);

    useEffect(() => {
        loadSavedAssessments();
    }, []);

    const loadSavedAssessments = () => {
        const allAssessments = getAllSavedAssessments();
        const assessmentList = Object.values(allAssessments);
        assessmentList.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        setSavedAssessments(assessmentList);
    };

    const handleStartNewAssessment = () => {
        const newId = generateAssessmentId();
        saveAssessment({}, { assessmentId: newId }, newId);
        setCurrentAssessmentId(newId);
        navigate('/poultry/breeder-assessment/dashboard');
    };

    const handleContinueAssessment = (assessmentId) => {
        setCurrentAssessmentId(assessmentId);
        navigate('/poultry/breeder-assessment/dashboard');
    };

    const handleDeleteAssessment = (assessmentId, e) => {
        e.stopPropagation();
        if (confirm('Delete this assessment? This action cannot be undone.')) {
            clearAssessment(assessmentId);
            loadSavedAssessments();
        }
    };

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    <div className="header">
                        <div
                            className="header-logo"
                            onClick={() => navigate('/poultry')}
                            style={{
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            <img
                                src="/images/PoultryWell_Logo.png"
                                alt="PoultryWell"
                                style={{ height: '80px', width: 'auto' }}
                                title="Back to Poultry Module"
                            />
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
                                <span className="status-dot" style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#10B981'
                                }}></span>
                                Online
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                        {/* Title Section */}
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐓</div>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '1rem',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Breeder Farm Biosecurity Assessment
                            </h1>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#6b7280',
                                maxWidth: '700px',
                                margin: '0 auto',
                                lineHeight: '1.6'
                            }}>
                                Comprehensive biosecurity evaluation for breeder farms
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                                borderRadius: '12px',
                                border: '2px solid #c4b5fd'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    140 Questions
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#5b21b6' }}>
                                    Comprehensive assessment across 14 biosecurity categories
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                borderRadius: '12px',
                                border: '2px solid #f87171'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Risk Assessment
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                                    5-tier risk scale (Excellent to Critical)
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                borderRadius: '12px',
                                border: '2px solid #60a5fa'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Multi-Language
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#1e3a8a' }}>
                                    Available in English, Vietnamese, and Indonesian
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                borderRadius: '12px',
                                border: '2px solid #34d399'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🦠</div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    Disease Mapping
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: '#064e3b' }}>
                                    Links biosecurity gaps to specific disease risks
                                </p>
                            </div>
                        </div>

                        {/* Assessment Categories */}
                        <div style={{
                            background: '#f9fafb',
                            borderRadius: '12px',
                            padding: '2rem',
                            marginBottom: '2rem'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
                                Assessment Categories
                            </h2>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem'
                            }}>
                                {[
                                    { icon: 'ℹ️', name: 'General Farm Info', count: 7 },
                                    { icon: '🐣', name: 'Chick Supply', count: 11 },
                                    { icon: '🌾', name: 'Feed & Water', count: 10 },
                                    { icon: '🐦', name: 'Bird Management', count: 8 },
                                    { icon: '🚜', name: 'Equipment & Materials', count: 9 },
                                    { icon: '👥', name: 'Personnel & Visitors', count: 15 },
                                    { icon: '🐭', name: 'Pest Control', count: 8 },
                                    { icon: '🧼', name: 'Cleaning & Disinfection', count: 14 },
                                    { icon: '🏥', name: 'Health Management', count: 12 },
                                    { icon: '🥚', name: 'Egg Handling', count: 13 },
                                    { icon: '🐣', name: 'Hatchery Management', count: 10 },
                                    { icon: '🗑️', name: 'Waste Management', count: 10 },
                                    { icon: '🌡️', name: 'Environment Control', count: 7 },
                                    { icon: '📊', name: 'Record Keeping', count: 6 }
                                ].map((category, index) => (
                                    <div key={index} style={{
                                        padding: '1rem',
                                        background: 'white',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}>
                                        <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{category.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{category.count} questions</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Start New Assessment Button */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '2rem'
                        }}>
                            <button
                                onClick={handleStartNewAssessment}
                                className="btn btn-primary"
                                style={{
                                    padding: '1rem 2rem',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    minWidth: '220px',
                                    border: 'none',
                                    borderRadius: '999px',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                                }}
                            >
                                🆕 Start New Assessment
                            </button>
                        </div>

                        {/* Saved Assessments List */}
                        {savedAssessments.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    marginBottom: '1rem',
                                    color: '#1f2937'
                                }}>
                                    📋 Saved Assessments
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    {savedAssessments.map((assessment) => {
                                        const answeredCount = Object.keys(assessment.answers || {}).length;
                                        const totalQuestions = 140;
                                        const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
                                        const lastModified = new Date(assessment.lastModified);
                                        const dateStr = lastModified.toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        });

                                        return (
                                            <div
                                                key={assessment.id}
                                                style={{
                                                    background: 'white',
                                                    border: '2px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    padding: '1.5rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        marginBottom: '0.5rem'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '0.875rem',
                                                            color: '#6b7280'
                                                        }}>
                                                            Last modified: {dateStr}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            color: '#3b82f6',
                                                            fontFamily: 'monospace',
                                                            background: '#eff6ff',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '4px'
                                                        }}>
                                                            ID: {assessment.metadata?.assessmentId || assessment.id}
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            color: '#1f2937'
                                                        }}>
                                                            {answeredCount} / {totalQuestions} questions answered
                                                        </div>
                                                        <div style={{
                                                            padding: '0.25rem 0.75rem',
                                                            background: percentage === 100 ? '#dcfce7' : '#fef3c7',
                                                            color: percentage === 100 ? '#166534' : '#92400e',
                                                            borderRadius: '999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}>
                                                            {percentage}% Complete
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem'
                                                }}>
                                                    {percentage === 100 ? (
                                                        <button
                                                            onClick={() => navigate(`/poultry/breeder-assessment/results?id=${assessment.id}`)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.75rem 1.5rem',
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                border: 'none',
                                                                borderRadius: '999px',
                                                                color: 'white',
                                                                fontSize: '0.9375rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                                                            }}
                                                        >
                                                            📊 View Summary
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleContinueAssessment(assessment.id)}
                                                            className="btn"
                                                            style={{
                                                                padding: '0.75rem 1.5rem',
                                                                background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                                                border: 'none',
                                                                borderRadius: '999px',
                                                                color: 'white',
                                                                fontSize: '0.9375rem',
                                                                fontWeight: '600',
                                                                boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
                                                            }}
                                                        >
                                                            ▶️ Continue
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                                                        className="btn"
                                                        style={{
                                                            padding: '0.75rem',
                                                            background: 'white',
                                                            border: '2px solid #ef4444',
                                                            borderRadius: '999px',
                                                            color: '#ef4444',
                                                            fontSize: '0.9375rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Info Note */}
                        <div style={{
                            marginTop: '2rem',
                            padding: '1rem',
                            background: '#eff6ff',
                            borderRadius: '8px',
                            border: '1px solid #3b82f6',
                            textAlign: 'center'
                        }}>
                            <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
                                💡 <strong>Estimated time:</strong> 40-55 minutes | Your progress is automatically saved
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="footer-branding" style={{ marginTop: '3rem', paddingBottom: '2rem' }}>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-6">
                            Powered By
                        </p>
                        <div className="flex justify-center items-center">
                            <img
                                src="/images/Vaksindo_logo.png"
                                alt="Vaksindo"
                                className="vaksindo-logo"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BreederAssessmentLanding;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
    getAllSavedAssessments,
    generateAssessmentId,
    setCurrentAssessmentId,
    clearAssessment,
    saveAssessment,
    calculateOverallScore
} from '../../utils/breederAssessmentUtils';
import '../../poultry.css';

function BreederAssessmentLanding() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [assessmentData, setAssessmentData] = useState(null);
    const [savedAssessments, setSavedAssessments] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        lastScore: null,
        goodAssessments: 0,
        poorAssessments: 0
    });

    useEffect(() => {
        // Load assessment data
        fetch('/data/poultry/breeder_assessment.json')
            .then(res => res.json())
            .then(data => {
                setAssessmentData(data);
                loadSavedAssessments(data);
            })
            .catch(err => console.error('Failed to load assessment data:', err));
    }, []);

    const loadSavedAssessments = (data) => {
        const allAssessments = getAllSavedAssessments();
        const assessmentList = Object.values(allAssessments);

        // Sort by last modified (most recent first)
        assessmentList.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        setSavedAssessments(assessmentList);

        // Calculate Statistics
        if (data) {
            let completedCount = 0;
            let goodCount = 0;
            let poorCount = 0;
            let latestScore = null;

            assessmentList.forEach(assessment => {
                const answeredCount = Object.keys(assessment.answers || {}).length;
                const totalQuestions = data.total_questions || 140;

                // Calculate percentage based on total questions in json
                const isCompleted = answeredCount === totalQuestions;

                if (isCompleted) {
                    completedCount++;
                    const scoreResult = calculateOverallScore(data, assessment.answers || {});
                    const score = scoreResult.percentage;

                    if (latestScore === null) latestScore = score;

                    if (score >= 60) goodCount++;
                    else poorCount++;
                }
            });

            setStats({
                total: assessmentList.length,
                completed: completedCount,
                lastScore: latestScore,
                goodAssessments: goodCount,
                poorAssessments: poorCount
            });
        }
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
        if (window.confirm('Delete this assessment? This action cannot be undone.')) {
            clearAssessment(assessmentId);
            loadSavedAssessments(assessmentData);
        }
    };

    // Neutral accent colors for stat cards
    const accents = {
        purple: '#8B5CF6',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444'
    };

    if (!assessmentData) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading assessment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    {/* Header */}
                    
                    {/* Page Title */}
                    <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.375rem', color: '#1e293b' }}>
                            Breeder Farm Assessment Dashboard
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                            Comprehensive biosecurity evaluation for breeder farms
                        </p>
                    </div>

                    {/* Statistics Cards — 2×2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {/* Total Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.purple}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Total Assessments</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{stats.total}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>{stats.completed} completed</div>
                        </div>

                        {/* Last Score */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.green}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', lineHeight: 1.3 }}>Last Score</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: stats.lastScore !== null ? (stats.lastScore >= 80 ? '#10B981' : stats.lastScore >= 60 ? '#3B82F6' : stats.lastScore >= 40 ? '#F59E0B' : '#EF4444') : '#1e293b', lineHeight: 1 }}>
                                {stats.lastScore !== null ? stats.lastScore : 'N/A'}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>Latest completed assessment</div>
                        </div>

                        {/* Good Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.amber}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Good Assessments</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{stats.goodAssessments}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                                {stats.completed > 0 ? Math.round((stats.goodAssessments / stats.completed) * 100) : 0}% of completed
                            </div>
                        </div>

                        {/* Poor Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.red}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Poor Assessments</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444', lineHeight: 1 }}>{stats.poorAssessments}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>Requires attention</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Quick Actions</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                            <button
                                className="btn btn-primary"
                                onClick={handleStartNewAssessment}
                            >
                                Start New Assessment
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    const recentAuditsSection = document.getElementById('recent-assessments');
                                    if (recentAuditsSection) {
                                        recentAuditsSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                View Assessment History
                            </button>
                        </div>
                    </div>

                    {/* Recent Assessments */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} id="recent-assessments">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Assessments</h2>
                        </div>

                        {savedAssessments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>No Assessments Yet</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                                    Start your first breeder farm biosecurity assessment to track compliance and health quality
                                </p>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleStartNewAssessment}
                                >
                                    Start First Assessment
                                </button>
                            </div>

                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left' }}>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                ID / Date
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Progress / Score
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Status
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {savedAssessments.map(assessment => {
                                            const answeredCount = Object.keys(assessment.answers || {}).length;
                                            const totalQuestions = assessmentData?.total_questions || 140;
                                            const percentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
                                            const isCompleted = answeredCount === totalQuestions;

                                            const scoreResult = isCompleted ? calculateOverallScore(assessmentData, assessment.answers || {}) : null;
                                            const score = scoreResult ? scoreResult.percentage : null;

                                            const lastModified = new Date(assessment.lastModified);
                                            const dateStr = lastModified.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            });

                                            return (
                                                <tr key={assessment.id} style={{
                                                    background: '#f9fafb',
                                                    borderRadius: '0.75rem'
                                                }}>
                                                    <td style={{ padding: '1.25rem', borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                                                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9375rem', marginBottom: '0.2rem' }}>
                                                            {assessment.metadata?.assessmentId || assessment.id}
                                                        </div>
                                                        <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                                                            {dateStr}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.25rem' }}>
                                                        {isCompleted ? (
                                                            <div style={{ fontWeight: '700', fontSize: '1.25rem', color: score >= 80 ? '#10B981' : score >= 60 ? '#3B82F6' : score >= 40 ? '#F59E0B' : '#EF4444' }}>
                                                                {score}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.3rem' }}>
                                                                    {answeredCount} / {totalQuestions} answered
                                                                </div>
                                                                <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden', width: '120px' }}>
                                                                    <div style={{ height: '100%', width: `${percentage}%`, background: '#8b5cf6', borderRadius: '999px' }}></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '1.25rem' }}>
                                                        <span style={{
                                                            padding: '0.375rem 0.875rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            backgroundColor: isCompleted ? '#D1FAE5' : '#FEF3C7',
                                                            color: isCompleted ? '#065F46' : '#92400E'
                                                        }}>
                                                            {isCompleted ? 'Completed' : 'In Progress'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                            <button
                                                                onClick={() => {
                                                                    if (isCompleted) {
                                                                        setCurrentAssessmentId(assessment.id);
                                                                        navigate(`/poultry/breeder-assessment/results?id=${assessment.id}`);
                                                                    } else {
                                                                        handleContinueAssessment(assessment.id);
                                                                    }
                                                                }}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                    border: 'none',
                                                                    borderRadius: '0.5rem',
                                                                    color: 'white',
                                                                    fontSize: '0.8125rem',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease',
                                                                    boxShadow: isCompleted ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                                                                }}
                                                            >
                                                                {isCompleted ? 'View Report' : 'Continue'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteAssessment(assessment.id, e)}
                                                                style={{
                                                                    padding: '0.5rem',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    borderRadius: '0.5rem',
                                                                    color: '#94a3b8',
                                                                    fontSize: '0.8125rem',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.background = '#FEE2E2';
                                                                    e.currentTarget.style.color = '#EF4444';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.background = 'transparent';
                                                                    e.currentTarget.style.color = '#94a3b8';
                                                                }}
                                                                title="Delete Assessment"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                                    </div>
            </div>
        </div>
    );
}

export default BreederAssessmentLanding;

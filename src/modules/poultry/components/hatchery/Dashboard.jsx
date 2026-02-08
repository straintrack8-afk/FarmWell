import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import Header from '../common/Header';
import ScoreBadge from './common/ScoreBadge';
import { formatDate, formatRelativeTime, daysUntilDue } from '../../utils/hatchery/dateUtils';
import '../../hatchery.css';

function Dashboard() {
    const navigate = useNavigate();
    const { audits, statistics, storageInfo, createNewAudit } = useHatcheryAudit();

    const completedAudits = audits.filter(a => a.status === 'completed' || a.status === 'approved');
    const lastAudit = completedAudits[completedAudits.length - 1];

    const handleStartNewAudit = () => {
        createNewAudit();
        navigate('/poultry/hatchery-audit/new');
    };

    const handleViewHistory = () => {
        navigate('/poultry/hatchery-audit/history');
    };

    const handleViewReport = (auditId) => {
        navigate(`/poultry/hatchery-audit/report/${auditId}`);
    };

    // Gradient colors for stat cards
    const gradients = {
        blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        purple: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        green: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };


    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    <Header />

                    {/* Page Title */}
                    <div style={{ marginBottom: '2.5rem', marginTop: '2rem' }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            Hatchery Audit Dashboard
                        </h1>
                        <p style={{ color: '#6B7280', fontSize: '1.125rem' }}>
                            Comprehensive quarterly assessment of hatchery operations
                        </p>
                    </div>

                    {/* Storage Warning */}
                    {storageInfo && storageInfo.isNearLimit && (
                        <div style={{
                            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                            border: '1px solid #F59E0B',
                            borderRadius: '1rem',
                            padding: '1rem 1.5rem',
                            marginBottom: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                            <div>
                                <strong>Storage Warning:</strong> You're using {storageInfo.percentUsed}% of available storage ({storageInfo.sizeMB} MB).
                                Consider exporting old audits to free up space.
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2.5rem'
                    }}>
                        {/* Total Audits */}
                        <div style={{
                            background: gradients.blue,
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-30px',
                                right: '-30px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Total Audits
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
                                    {statistics?.totalAudits || 0}
                                </div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>
                                    {statistics?.completedAudits || 0} completed
                                </div>
                            </div>
                        </div>

                        {/* Last Audit Score */}
                        <div style={{
                            background: gradients.purple,
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-30px',
                                right: '-30px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Last Audit Score
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
                                    {lastAudit?.summary?.environmental?.score || 'N/A'}
                                </div>
                                {lastAudit && (
                                    <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>
                                        {lastAudit.summary?.environmental?.classification || '-'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Good Audits */}
                        <div style={{
                            background: gradients.green,
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(67, 233, 123, 0.3)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-30px',
                                right: '-30px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Good Audits
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
                                    {statistics?.goodCount || 0}
                                </div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>
                                    {statistics?.totalAudits > 0
                                        ? Math.round((statistics.goodCount / statistics.completedAudits) * 100)
                                        : 0}% of total
                                </div>
                            </div>
                        </div>

                        {/* Poor Audits */}
                        <div style={{
                            background: gradients.orange,
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-30px',
                                right: '-30px',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)'
                            }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚠️</div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Poor Audits
                                </div>
                                <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1 }}>
                                    {statistics?.poorCount || 0}
                                </div>
                                <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>
                                    Requires attention
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        marginBottom: '2.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h2 style={{ fontSize: '1.375rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                            Quick Actions
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <button
                                style={{
                                    padding: '1.25rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                }}
                                onClick={handleStartNewAudit}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>➕</span>
                                <span>Start New Audit</span>
                            </button>
                            <button
                                style={{
                                    padding: '1.25rem',
                                    background: 'white',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    color: '#1f2937',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                onClick={handleViewHistory}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>📋</span>
                                <span>View Audit History</span>
                            </button>
                            <button
                                style={{
                                    padding: '1.25rem',
                                    background: 'white',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '0.75rem',
                                    color: '#1f2937',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                onClick={() => navigate('/poultry/hatchery-audit/settings')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#667eea';
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                                <span>Settings</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Audits */}
                    <div style={{
                        background: 'white',
                        borderRadius: '1.5rem',
                        padding: '2rem',
                        marginBottom: '2.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.375rem', fontWeight: '700' }}>
                                Recent Audits
                            </h2>
                            {completedAudits.length > 0 && (
                                <button
                                    onClick={handleViewHistory}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        background: 'white',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#667eea'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        {completedAudits.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '4rem 2rem'
                            }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📊</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.75rem' }}>
                                    No Audits Yet
                                </h3>
                                <p style={{ color: '#6B7280', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                                    Start your first hatchery audit to track compliance and environmental quality
                                </p>
                                <button
                                    style={{
                                        padding: '1rem 2.5rem',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        fontSize: '1.0625rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                                    }}
                                    onClick={handleStartNewAudit}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                    }}
                                >
                                    Start First Audit
                                </button>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left' }}>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Audit #
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Date
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Location
                                            </th>
                                            <th style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Score
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
                                        {completedAudits.slice(-5).reverse().map(audit => (
                                            <tr key={audit.id} style={{
                                                background: '#f9fafb',
                                                borderRadius: '0.75rem'
                                            }}>
                                                <td style={{ padding: '1.25rem', fontWeight: '600', borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
                                                    {audit.auditNumber}
                                                </td>
                                                <td style={{ padding: '1.25rem', fontSize: '0.9375rem' }}>
                                                    {formatDate(audit.auditDate)}
                                                </td>
                                                <td style={{ padding: '1.25rem', fontSize: '0.9375rem' }}>
                                                    {audit.info?.location || 'N/A'}
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: '700', fontSize: '1.25rem' }}>
                                                            {audit.summary?.environmental?.score || 'N/A'}
                                                        </span>
                                                        <ScoreBadge
                                                            classification={audit.summary?.environmental?.classification}
                                                            showIcon={true}
                                                        />
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem' }}>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '600',
                                                        backgroundColor: '#D1FAE5',
                                                        color: '#065F46'
                                                    }}>
                                                        {audit.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.25rem', textAlign: 'right', borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
                                                    <button
                                                        onClick={() => handleViewReport(audit.id)}
                                                        style={{
                                                            padding: '0.625rem 1.25rem',
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            border: 'none',
                                                            borderRadius: '0.5rem',
                                                            color: 'white',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(0)';
                                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
                                                        }}
                                                    >
                                                        View Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Last Audit Summary */}
                    {lastAudit && (
                        <div style={{
                            background: 'white',
                            borderRadius: '1.5rem',
                            padding: '2rem',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: '700' }}>
                                    Last Audit Summary
                                </h2>
                                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                    {formatRelativeTime(lastAudit.completedAt)}
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                        Vaccine Storage
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                                            {lastAudit.summary?.vaccineStorage?.percentage || 0}%
                                        </span>
                                        <ScoreBadge
                                            classification={lastAudit.summary?.vaccineStorage?.classification}
                                            showIcon={false}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                        Equipment
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                                            {lastAudit.summary?.equipment?.percentage || 0}%
                                        </span>
                                        <ScoreBadge
                                            classification={lastAudit.summary?.equipment?.classification}
                                            showIcon={false}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                        Techniques
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                                            {lastAudit.summary?.techniques?.percentage || 0}%
                                        </span>
                                        <ScoreBadge
                                            classification={lastAudit.summary?.techniques?.classification}
                                            showIcon={false}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                        Environmental
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>
                                            {lastAudit.summary?.environmental?.score || 'N/A'}
                                        </span>
                                        <ScoreBadge
                                            classification={lastAudit.summary?.environmental?.classification}
                                            showIcon={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {lastAudit.issues && lastAudit.issues.length > 0 && (
                                <div style={{ marginTop: '2rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                        Critical Issues ({lastAudit.issues.length})
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {lastAudit.issues.slice(0, 3).map((issue, index) => (
                                            <div key={index} style={{
                                                padding: '1rem 1.25rem',
                                                background: issue.priority === 'critical' ? '#FEE2E2' : '#FEF3C7',
                                                border: `1px solid ${issue.priority === 'critical' ? '#FCA5A5' : '#FDE68A'}`,
                                                borderRadius: '0.75rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}>
                                                <span style={{ fontSize: '1.5rem' }}>{issue.priority === 'critical' ? '🔴' : '⚠️'}</span>
                                                <div>
                                                    <strong>{issue.category}:</strong> {issue.issue}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* End of white container */}
            </div>
        </div>
    );
}

export default Dashboard;

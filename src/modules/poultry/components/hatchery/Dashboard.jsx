import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
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

    return (
        <div className="hatchery-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                        🧫 Hatchery Audit Dashboard
                    </h1>
                    <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                        Comprehensive quarterly assessment of hatchery operations
                    </p>
                </div>
                <button
                    onClick={() => navigate('/poultry')}
                    className="btn-hatchery btn-outline"
                >
                    ← Back to Poultry Module
                </button>
            </div>

            {/* Storage Warning */}
            {storageInfo && storageInfo.isNearLimit && (
                <div className="alert warning">
                    <span>⚠️</span>
                    <div>
                        <strong>Storage Warning:</strong> You're using {storageInfo.percentUsed}% of available storage ({storageInfo.sizeMB} MB).
                        Consider exporting old audits to free up space.
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Audits</div>
                    <div className="stat-value">{statistics?.totalAudits || 0}</div>
                    <div className="stat-change">
                        {statistics?.completedAudits || 0} completed
                    </div>
                </div>

                <div className={`stat-card ${lastAudit?.summary?.environmental?.classification?.toLowerCase() || ''}`}>
                    <div className="stat-label">Last Audit Score</div>
                    <div className="stat-value">
                        {lastAudit?.summary?.environmental?.score || 'N/A'}
                    </div>
                    {lastAudit && (
                        <div className="stat-change">
                            <ScoreBadge
                                classification={lastAudit.summary?.environmental?.classification}
                                showIcon={false}
                            />
                        </div>
                    )}
                </div>

                <div className="stat-card good">
                    <div className="stat-label">Good Audits</div>
                    <div className="stat-value">{statistics?.goodCount || 0}</div>
                    <div className="stat-change positive">
                        {statistics?.totalAudits > 0
                            ? Math.round((statistics.goodCount / statistics.completedAudits) * 100)
                            : 0}% of total
                    </div>
                </div>

                <div className="stat-card poor">
                    <div className="stat-label">Poor Audits</div>
                    <div className="stat-value">{statistics?.poorCount || 0}</div>
                    <div className="stat-change negative">
                        Requires attention
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="hatchery-card">
                <div className="hatchery-card-header">
                    <h2 className="hatchery-card-title">Quick Actions</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <button
                        onClick={handleStartNewAudit}
                        className="btn-hatchery btn-primary"
                        style={{ padding: '1.5rem', fontSize: '1rem', justifyContent: 'center' }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>➕</span>
                        <span>Start New Audit</span>
                    </button>
                    <button
                        onClick={handleViewHistory}
                        className="btn-hatchery btn-outline"
                        style={{ padding: '1.5rem', fontSize: '1rem', justifyContent: 'center' }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>📋</span>
                        <span>View Audit History</span>
                    </button>
                    <button
                        onClick={() => navigate('/poultry/hatchery-audit/settings')}
                        className="btn-hatchery btn-outline"
                        style={{ padding: '1.5rem', fontSize: '1rem', justifyContent: 'center' }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>⚙️</span>
                        <span>Settings</span>
                    </button>
                </div>
            </div>

            {/* Recent Audits */}
            <div className="hatchery-card">
                <div className="hatchery-card-header">
                    <h2 className="hatchery-card-title">Recent Audits</h2>
                    {completedAudits.length > 0 && (
                        <button onClick={handleViewHistory} className="btn-hatchery btn-outline">
                            View All
                        </button>
                    )}
                </div>

                {completedAudits.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Audits Yet</h3>
                        <p>Start your first hatchery audit to track compliance and environmental quality</p>
                        <button
                            onClick={handleStartNewAudit}
                            className="btn-hatchery btn-primary"
                            style={{ marginTop: '1rem' }}
                        >
                            Start First Audit
                        </button>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Audit #</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Environmental Score</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedAudits.slice(-5).reverse().map(audit => (
                                <tr key={audit.id}>
                                    <td style={{ fontWeight: '600' }}>{audit.auditNumber}</td>
                                    <td>{formatDate(audit.auditDate)}</td>
                                    <td>{audit.info?.location || 'N/A'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontWeight: '600' }}>
                                                {audit.summary?.environmental?.score || 'N/A'}
                                            </span>
                                            <ScoreBadge
                                                classification={audit.summary?.environmental?.classification}
                                                showIcon={true}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            backgroundColor: '#D1FAE5',
                                            color: '#065F46'
                                        }}>
                                            {audit.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleViewReport(audit.id)}
                                            className="btn-hatchery btn-outline"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                        >
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Last Audit Summary */}
            {lastAudit && (
                <div className="hatchery-card">
                    <div className="hatchery-card-header">
                        <h2 className="hatchery-card-title">Last Audit Summary</h2>
                        <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                            {formatRelativeTime(lastAudit.completedAt)}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                                Vaccine Storage
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
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
                                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
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
                                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
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
                                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
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
                        <div style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                Critical Issues ({lastAudit.issues.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {lastAudit.issues.slice(0, 3).map((issue, index) => (
                                    <div key={index} className={`alert ${issue.priority === 'critical' ? 'error' : 'warning'}`}>
                                        <span>{issue.priority === 'critical' ? '🔴' : '⚠️'}</span>
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
    );
}

export default Dashboard;

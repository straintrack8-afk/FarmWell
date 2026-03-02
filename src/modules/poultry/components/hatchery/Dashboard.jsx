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

    // Neutral accent colors for stat cards
    const accents = {
        blue: '#366092',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444'
    };


    return (
        <div className="portal-layout">
            <div className="portal-container">
                <div className="portal-card">
                    <Header />

                    {/* Page Title */}
                    <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.375rem', color: '#1e293b' }}>
                            Hatchery Audit Dashboard
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                            Comprehensive quarterly assessment of hatchery operations
                        </p>
                    </div>

                    {/* Storage Warning */}
                    {storageInfo && storageInfo.isNearLimit && (
                        <div style={{
                            background: '#fef3c7',
                            border: '1px solid #F59E0B',
                            borderRadius: '0.75rem',
                            padding: '0.875rem 1.25rem',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <div>
                                <strong>Storage Warning:</strong> You're using {storageInfo.percentUsed}% of available storage ({storageInfo.sizeMB} MB).
                                Consider exporting old audits to free up space.
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards — 2×2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {/* Total Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.blue}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Total Audits</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{statistics?.totalAudits || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>{statistics?.completedAudits || 0} completed</div>
                        </div>

                        {/* Last Audit Score */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.green}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem', lineHeight: 1.3 }}>Last Score</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>{lastAudit?.summary?.environmental?.score || 'N/A'}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>{lastAudit ? (lastAudit.summary?.environmental?.classification || '-') : '-'}</div>
                        </div>

                        {/* Good Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.amber}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Good Audits</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981', lineHeight: 1 }}>{statistics?.goodCount || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                                {statistics?.totalAudits > 0 ? Math.round((statistics.goodCount / statistics.completedAudits) * 100) : 0}% of total
                            </div>
                        </div>

                        {/* Poor Audits */}
                        <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1rem', borderLeft: `4px solid ${accents.red}`, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', minWidth: 0, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>Poor Audits</div>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444', lineHeight: 1 }}>{statistics?.poorCount || 0}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.3rem' }}>Requires attention</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Quick Actions</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                            <button
                                style={{ padding: '0.875rem', background: '#1e293b', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '0.9375rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s ease' }}
                                onClick={handleStartNewAudit}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
                            >
                                Start New Audit
                            </button>
                            <button
                                style={{ padding: '0.875rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', color: '#374151', fontSize: '0.9375rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                onClick={handleViewHistory}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#366092'; e.currentTarget.style.color = '#366092'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                            >
                                View Audit History
                            </button>
                            <button
                                style={{ padding: '0.875rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '0.75rem', color: '#374151', fontSize: '0.9375rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                                onClick={() => navigate('/poultry/hatchery-audit/settings')}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#366092'; e.currentTarget.style.color = '#366092'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#374151'; }}
                            >
                                Settings
                            </button>
                        </div>
                    </div>

                    {/* Recent Audits */}
                    <div style={{ background: 'white', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }} id="recent-audits">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Audits</h2>
                            {completedAudits.length > 0 && (
                                <button
                                    onClick={handleViewHistory}
                                    style={{ padding: '0.5rem 1rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', color: '#374151' }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#366092'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                                >
                                    View All
                                </button>
                            )}
                        </div>

                        {completedAudits.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1e293b' }}>No Audits Yet</h3>
                                <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                                    Start your first hatchery audit to track compliance and environmental quality
                                </p>
                                <button
                                    style={{ padding: '0.75rem 2rem', background: '#1e293b', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '0.9375rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s ease' }}
                                    onClick={handleStartNewAudit}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#1e293b'}
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

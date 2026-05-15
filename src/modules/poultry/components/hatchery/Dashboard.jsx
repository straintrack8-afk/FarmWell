import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import ScoreBadge from './common/ScoreBadge';
import { formatDate, formatRelativeTime, daysUntilDue } from '../../utils/hatchery/dateUtils';
import '../../hatchery.css';
import PoultryTopNav from '../common/PoultryTopNav';

function Dashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
        <div className="fw-module-page">
            <PoultryTopNav title="Hatchery Audit" />
            <div className="fw-mod-card">
                <div className="fw-mod-content">

                    {/* Storage Warning */}
                    {storageInfo && storageInfo.isNearLimit && (
                        <div style={{ background: '#F4FBF7', border: '1px solid #C8E8D4', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#1E5C3A' }}>
                            ⚠️ Storage {storageInfo.percentUsed}% used ({storageInfo.sizeMB} MB). Consider exporting old audits.
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="fw-bio-stats-grid">
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.hatchery.dashboard.totalAudits') || 'Total Audits'}</div>
                            <div className="fw-bio-stat-value">{statistics?.totalAudits || 0}</div>
                            <div className="fw-bio-stat-sub">{statistics?.completedAudits || 0} {t('poultry.hatchery.dashboard.completed') || 'completed'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.hatchery.dashboard.lastScore') || 'Last Score'}</div>
                            <div className={`fw-bio-stat-value ${lastAudit ? 'green' : 'na'}`}>
                                {lastAudit?.summary?.environmental?.score || 'N/A'}
                            </div>
                            <div className="fw-bio-stat-sub">{lastAudit?.summary?.environmental?.classification || '-'}</div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.hatchery.dashboard.goodAudits') || 'Good'}</div>
                            <div className="fw-bio-stat-value green">{statistics?.goodCount || 0}</div>
                            <div className="fw-bio-stat-sub">
                                {statistics?.completedAudits > 0 ? Math.round((statistics.goodCount / statistics.completedAudits) * 100) : 0}% {t('poultry.hatchery.dashboard.ofTotal') || 'of total'}
                            </div>
                        </div>
                        <div className="fw-bio-stat-card">
                            <div className="fw-bio-stat-label">{t('poultry.hatchery.dashboard.poorAudits') || 'Poor'}</div>
                            <div className="fw-bio-stat-value red">{statistics?.poorCount || 0}</div>
                            <div className="fw-bio-stat-sub">{t('poultry.hatchery.dashboard.requiresAttention') || 'requires attention'}</div>
                        </div>
                    </div>

                    <button className="fw-bio-action-btn" onClick={handleStartNewAudit}>
                        {t('poultry.hatchery.dashboard.startNewAudit') || '+ Start New Audit'}
                    </button>
                    <button className="fw-bio-action-btn secondary" onClick={handleViewHistory}>
                        {t('poultry.hatchery.dashboard.viewAuditHistory') || 'View Audit History'}
                    </button>
                    <button className="fw-bio-action-btn secondary" onClick={() => navigate('/poultry/hatchery-audit/settings')}>
                        {t('poultry.hatchery.dashboard.settings') || 'Settings'}
                    </button>

                    <div className="fw-welcome-section-label">
                        {t('poultry.hatchery.dashboard.recentAudits') || 'Recent Audits'}
                    </div>

                    {completedAudits.length === 0 ? (
                        <div className="fw-bio-empty">
                            <div className="fw-bio-empty-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 12h6M9 16h4"/></svg>
                            </div>
                            <div className="fw-bio-empty-title">{t('poultry.hatchery.dashboard.noAuditsYet') || 'No Audits Yet'}</div>
                            <div className="fw-bio-empty-sub">{t('poultry.hatchery.dashboard.noAuditsText') || 'Start your first hatchery audit'}</div>
                            <button className="fw-bio-action-btn" style={{ marginTop: 4 }} onClick={handleStartNewAudit}>
                                {t('poultry.hatchery.dashboard.startFirstAudit') || 'Start First Audit'}
                            </button>
                        </div>
                    ) : (
                        completedAudits.slice(-5).reverse().map(audit => (
                            <div
                                key={audit.id}
                                className="fw-bio-assess-item"
                                onClick={() => handleViewReport(audit.id)}
                            >
                                <div className="fw-bio-assess-score">
                                    {audit.summary?.environmental?.score || 'N/A'}
                                </div>
                                <div className="fw-bio-assess-info">
                                    <div className="fw-bio-assess-name">{audit.auditNumber} · {audit.info?.location || ''}</div>
                                    <div className="fw-bio-assess-date">{formatDate(audit.auditDate)} · {audit.summary?.environmental?.classification || audit.status}</div>
                                </div>
                                <div className="fw-bio-assess-arrow">›</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </button>
                    <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry')}>
                        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        <span>PoultryWell</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

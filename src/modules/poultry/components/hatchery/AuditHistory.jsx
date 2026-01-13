import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import { formatDate } from '../../utils/hatchery/dateUtils';
import { AUDIT_STATUS } from '../../utils/hatcheryConstants';
import ScoreBadge from './common/ScoreBadge';
import '../../hatchery.css';

function AuditHistory() {
    const navigate = useNavigate();
    const { audits, deleteAudit } = useHatcheryAudit();

    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: '',
        location: 'all'
    });

    const [sortConfig, setSortConfig] = useState({
        key: 'auditDate',
        direction: 'desc'
    });

    // Get unique locations for filter
    const locations = useMemo(() => {
        const locs = new Set();
        audits.forEach(audit => {
            if (audit.info?.location) locs.add(audit.info.location);
        });
        return Array.from(locs);
    }, [audits]);

    // Filter and sort audits
    const filteredAudits = useMemo(() => {
        let filtered = [...audits];

        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(a => a.status === filters.status);
        }

        // Location filter
        if (filters.location !== 'all') {
            filtered = filtered.filter(a => a.info?.location === filters.location);
        }

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(a =>
                a.auditNumber?.toLowerCase().includes(search) ||
                a.info?.auditor?.toLowerCase().includes(search) ||
                a.info?.location?.toLowerCase().includes(search)
            );
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(a =>
                new Date(a.info?.auditDate) >= new Date(filters.dateFrom)
            );
        }
        if (filters.dateTo) {
            filtered = filtered.filter(a =>
                new Date(a.info?.auditDate) <= new Date(filters.dateTo)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            // Handle nested properties
            if (sortConfig.key === 'auditDate') {
                aVal = a.info?.auditDate || '';
                bVal = b.info?.auditDate || '';
            } else if (sortConfig.key === 'location') {
                aVal = a.info?.location || '';
                bVal = b.info?.location || '';
            } else if (sortConfig.key === 'auditor') {
                aVal = a.info?.auditor || '';
                bVal = b.info?.auditor || '';
            } else if (sortConfig.key === 'score') {
                aVal = a.finalScore?.score || 0;
                bVal = b.finalScore?.score || 0;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [audits, filters, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleDelete = (auditId) => {
        if (confirm('Are you sure you want to delete this audit? This action cannot be undone.')) {
            deleteAudit(auditId);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            [AUDIT_STATUS.COMPLETED]: { label: 'Completed', color: '#10B981' },
            [AUDIT_STATUS.IN_PROGRESS]: { label: 'In Progress', color: '#3B82F6' },
            [AUDIT_STATUS.DRAFT]: { label: 'Draft', color: '#6B7280' },
            [AUDIT_STATUS.INCUBATING]: { label: 'Incubating', color: '#F59E0B' }
        };

        const config = statusConfig[status] || { label: status, color: '#6B7280' };

        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: config.color + '20',
                color: config.color
            }}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="hatchery-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Audit History
                    </h1>
                    <p style={{ color: '#6B7280' }}>
                        {filteredAudits.length} audit{filteredAudits.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <button
                    onClick={() => navigate('/poultry/hatchery-audit')}
                    className="btn-hatchery btn-outline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Filters */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Audit #, auditor, location..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Status</label>
                        <select
                            className="form-select"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="all">All Statuses</option>
                            <option value={AUDIT_STATUS.COMPLETED}>Completed</option>
                            <option value={AUDIT_STATUS.IN_PROGRESS}>In Progress</option>
                            <option value={AUDIT_STATUS.DRAFT}>Draft</option>
                            <option value={AUDIT_STATUS.INCUBATING}>Incubating</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Location</label>
                        <select
                            className="form-select"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        >
                            <option value="all">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">From Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">To Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.dateTo}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                        />
                    </div>
                </div>
            </div>

            {/* Audits Table */}
            <div className="hatchery-card" style={{ padding: 0, overflow: 'auto' }}>
                {filteredAudits.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            No Audits Found
                        </h3>
                        <p style={{ color: '#6B7280' }}>
                            Try adjusting your filters or create a new audit.
                        </p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                            <tr>
                                <th onClick={() => handleSort('auditNumber')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Audit # {sortConfig.key === 'auditNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('auditDate')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Date {sortConfig.key === 'auditDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('location')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('auditor')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Auditor {sortConfig.key === 'auditor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('status')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('score')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAudits.map((audit) => (
                                <tr key={audit.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '1rem', fontWeight: '600' }}>
                                        {audit.auditNumber}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {formatDate(audit.info?.auditDate, 'short')}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {audit.info?.location || '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {audit.info?.auditor || '-'}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {getStatusBadge(audit.status)}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {audit.status === AUDIT_STATUS.COMPLETED && audit.finalScore ? (
                                            <ScoreBadge classification={audit.finalScore.classification} />
                                        ) : (
                                            <span style={{ color: '#6B7280' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => navigate(`/poultry/hatchery-audit/report/${audit.id}`)}
                                                className="btn-hatchery btn-outline"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                            >
                                                View
                                            </button>
                                            {audit.status !== AUDIT_STATUS.COMPLETED && (
                                                <button
                                                    onClick={() => navigate(`/poultry/hatchery-audit/audit/${audit.id}`)}
                                                    className="btn-hatchery btn-primary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                >
                                                    Continue
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(audit.id)}
                                                className="btn-hatchery btn-danger"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AuditHistory;

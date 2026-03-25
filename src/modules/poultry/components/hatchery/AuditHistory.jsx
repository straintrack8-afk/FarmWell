import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import { formatDate } from '../../utils/hatchery/dateUtils';
import { AUDIT_STATUS } from '../../utils/hatcheryConstants';
import ScoreBadge from './common/ScoreBadge';
import { useLanguage } from "../../../../contexts/LanguageContext";
import '../../hatchery.css';

function AuditHistory() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { audits, removeAudit } = useHatcheryAudit();

    const translations = {
        // Page header
        title: {
            en: "Audit History",
            id: "Riwayat Audit",
            vi: "Lịch sử Kiểm toán"
        },
        auditsFound: {
            en: "audit found",
            id: "audit ditemukan",
            vi: "kiểm toán tìm thấy"
        },
        auditsFoundPlural: {
            en: "audits found",
            id: "audit ditemukan",
            vi: "kiểm toán tìm thấy"
        },
        
        // Buttons
        backToDashboard: {
            en: "Back to Dashboard",
            id: "Kembali ke Dasbor",
            vi: "Quay lại Bảng điều khiển"
        },
        view: {
            en: "View",
            id: "Lihat",
            vi: "Xem"
        },
        continue: {
            en: "Continue",
            id: "Lanjutkan",
            vi: "Tiếp tục"
        },
        delete: {
            en: "Delete",
            id: "Hapus",
            vi: "Xóa"
        },
        
        // Search and filters
        search: {
            en: "Search",
            id: "Cari",
            vi: "Tìm kiếm"
        },
        searchPlaceholder: {
            en: "Audit #, auditor, location...",
            id: "Audit #, auditor, lokasi...",
            vi: "Kiểm toán #, kiểm toán viên, vị trí..."
        },
        status: {
            en: "Status",
            id: "Status",
            vi: "Trạng thái"
        },
        location: {
            en: "Location",
            id: "Lokasi",
            vi: "Vị trí"
        },
        fromDate: {
            en: "From Date",
            id: "Dari Tanggal",
            vi: "Từ Ngày"
        },
        toDate: {
            en: "To Date",
            id: "Sampai Tanggal",
            vi: "Đến Ngày"
        },
        
        // Dropdown options
        allStatuses: {
            en: "All Statuses",
            id: "Semua Status",
            vi: "Tất cả Trạng thái"
        },
        allLocations: {
            en: "All Locations",
            id: "Semua Lokasi",
            vi: "Tất cả Vị trí"
        },
        
        // Status values
        statusDraft: {
            en: "Draft",
            id: "Draf",
            vi: "Bản nháp"
        },
        statusCompleted: {
            en: "Completed",
            id: "Selesai",
            vi: "Hoàn thành"
        },
        statusInProgress: {
            en: "In Progress",
            id: "Sedang Berlangsung",
            vi: "Đang thực hiện"
        },
        statusIncubating: {
            en: "Incubating",
            id: "Inkubasi",
            vi: "Đang ấp"
        },
        
        // Table headers
        auditNumber: {
            en: "Audit #",
            id: "Audit #",
            vi: "Kiểm toán #"
        },
        date: {
            en: "Date",
            id: "Tanggal",
            vi: "Ngày"
        },
        auditor: {
            en: "Auditor",
            id: "Auditor",
            vi: "Kiểm toán viên"
        },
        score: {
            en: "Score",
            id: "Skor",
            vi: "Điểm"
        },
        actions: {
            en: "Actions",
            id: "Aksi",
            vi: "Hành động"
        },
        
        // Empty state
        noAuditsFound: {
            en: "No Audits Found",
            id: "Tidak Ada Audit Ditemukan",
            vi: "Không Tìm thấy Kiểm toán"
        },
        noAuditsMessage: {
            en: "Try adjusting your filters or create a new audit.",
            id: "Coba sesuaikan filter Anda atau buat audit baru.",
            vi: "Thử điều chỉnh bộ lọc của bạn hoặc tạo kiểm toán mới."
        }
    };

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
            removeAudit(auditId);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            [AUDIT_STATUS.COMPLETED]: { label: translations.statusCompleted[language], color: '#10B981' },
            [AUDIT_STATUS.IN_PROGRESS]: { label: translations.statusInProgress[language], color: '#3B82F6' },
            [AUDIT_STATUS.DRAFT]: { label: translations.statusDraft[language], color: '#6B7280' },
            [AUDIT_STATUS.INCUBATING]: { label: translations.statusIncubating[language], color: '#F59E0B' }
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
                        {translations.title[language]}
                    </h1>
                    <p style={{ color: '#6B7280' }}>
                        {filteredAudits.length} {filteredAudits.length === 1 ? translations.auditsFound[language] : translations.auditsFoundPlural[language]}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/poultry/hatchery-audit')}
                    className="btn-hatchery btn-primary"
                >
                    {translations.backToDashboard[language]}
                </button>
            </div>

            {/* Filters */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{translations.search[language]}</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={translations.searchPlaceholder[language]}
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{translations.status[language]}</label>
                        <select
                            className="form-select"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="all">{translations.allStatuses[language]}</option>
                            <option value={AUDIT_STATUS.COMPLETED}>{translations.statusCompleted[language]}</option>
                            <option value={AUDIT_STATUS.IN_PROGRESS}>{translations.statusInProgress[language]}</option>
                            <option value={AUDIT_STATUS.DRAFT}>{translations.statusDraft[language]}</option>
                            <option value={AUDIT_STATUS.INCUBATING}>{translations.statusIncubating[language]}</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{translations.location[language]}</label>
                        <select
                            className="form-select"
                            value={filters.location}
                            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                        >
                            <option value="all">{translations.allLocations[language]}</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{translations.fromDate[language]}</label>
                        <input
                            type="date"
                            className="form-input"
                            value={filters.dateFrom}
                            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">{translations.toDate[language]}</label>
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
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            {translations.noAuditsFound[language]}
                        </h3>
                        <p style={{ color: '#6B7280' }}>
                            {translations.noAuditsMessage[language]}
                        </p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                            <tr>
                                <th onClick={() => handleSort('auditNumber')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.auditNumber[language]} {sortConfig.key === 'auditNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('auditDate')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.date[language]} {sortConfig.key === 'auditDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('location')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.location[language]} {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('auditor')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.auditor[language]} {sortConfig.key === 'auditor' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('status')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.status[language]} {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('score')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}>
                                    {translations.score[language]} {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>{translations.actions[language]}</th>
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
                                                {translations.view[language]}
                                            </button>
                                            {audit.status !== AUDIT_STATUS.COMPLETED && (
                                                <button
                                                    onClick={() => navigate(`/poultry/hatchery-audit/audit/${audit.id}`)}
                                                    className="btn-hatchery btn-primary"
                                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                                >
                                                    {translations.continue[language]}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(audit.id)}
                                                className="btn-hatchery btn-danger"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                            >
                                                {translations.delete[language]}
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

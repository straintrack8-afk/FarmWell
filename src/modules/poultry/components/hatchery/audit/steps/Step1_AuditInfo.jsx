import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { formatDateForInput } from '../../../../utils/hatchery/dateUtils';

function Step1_AuditInfo() {
    const { currentAudit, updateAuditSection, locations } = useHatcheryAudit();
    const info = currentAudit?.info || {};

    const handleChange = (field, value) => {
        updateAuditSection('info', {
            ...info,
            [field]: value
        });
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Audit Information
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Enter basic information about this hatchery audit.
            </p>

            <div className="form-group">
                <label className="form-label required">Audit Date</label>
                <input
                    type="date"
                    className="form-input"
                    value={info.auditDate || formatDateForInput(new Date())}
                    onChange={(e) => handleChange('auditDate', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label required">Auditor Name</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder="Enter auditor name"
                    value={info.auditor || ''}
                    onChange={(e) => handleChange('auditor', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label required">Hatchery Location</label>
                {locations && locations.length > 0 ? (
                    <select
                        className="form-select"
                        value={info.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    >
                        <option value="">Select location</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.name}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter hatchery location"
                        value={info.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                )}
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
                    You can add locations in Settings
                </p>
            </div>

            <div className="form-group">
                <label className="form-label required">Audit Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label className="checkbox-group" style={{ flex: 1 }}>
                        <input
                            type="radio"
                            name="auditType"
                            value="scheduled"
                            checked={info.auditType === 'scheduled'}
                            onChange={(e) => handleChange('auditType', e.target.value)}
                        />
                        <span className="checkbox-label">
                            <strong>Scheduled</strong>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                Regular quarterly audit
                            </span>
                        </span>
                    </label>
                    <label className="checkbox-group" style={{ flex: 1 }}>
                        <input
                            type="radio"
                            name="auditType"
                            value="ad_hoc"
                            checked={info.auditType === 'ad_hoc'}
                            onChange={(e) => handleChange('auditType', e.target.value)}
                        />
                        <span className="checkbox-label">
                            <strong>Ad-hoc</strong>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                Unscheduled inspection
                            </span>
                        </span>
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                    className="form-textarea"
                    placeholder="Add any additional notes about this audit..."
                    value={info.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>

            <div className="alert info">
                <span>ℹ️</span>
                <div>
                    <strong>Audit Reference:</strong> {currentAudit?.auditNumber || 'Will be generated on save'}
                </div>
            </div>
        </div>
    );
}

export default Step1_AuditInfo;

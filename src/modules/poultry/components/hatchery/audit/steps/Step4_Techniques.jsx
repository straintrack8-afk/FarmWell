import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { DROPLET_UNIFORMITY } from '../../../../utils/hatcheryConstants';

function Step4_Techniques() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const techniques = currentAudit?.techniques || {};

    const handleChange = (field, value) => {
        updateAuditSection('techniques', {
            ...techniques,
            [field]: value
        });
    };

    const preparationChecks = [
        { key: 'asepticTechnique', label: 'Aseptic technique followed' },
        { key: 'handHygiene', label: 'Hand hygiene performed before preparation' },
        { key: 'newSyringe', label: 'New syringe used for each batch' },
        { key: 'correctNeedle', label: '21G needle used' },
        { key: 'expiryChecked', label: 'Expiration dates checked' },
        { key: 'mixedCorrectly', label: 'Mixed according to manufacturer guidelines' },
        { key: 'recordsMaintained', label: 'Records maintained (date, time, batch, lot)' }
    ];

    const prepPassed = preparationChecks.filter(c => techniques[c.key] === true).length;
    const prepPercentage = Math.round((prepPassed / preparationChecks.length) * 100);

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Vaccination Techniques Assessment
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Observe and assess vaccine preparation and vaccination quality.
            </p>

            {/* Vaccine Preparation */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    A. Vaccine Preparation
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {preparationChecks.map((check) => (
                        <label key={check.key} className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={techniques[check.key] || false}
                                onChange={(e) => handleChange(check.key, e.target.checked)}
                            />
                            <span className="checkbox-label">{check.label}</span>
                        </label>
                    ))}
                </div>
                <div className="alert info" style={{ marginTop: '1rem' }}>
                    <span>📊</span>
                    <div>
                        <strong>Preparation Score:</strong> {prepPassed} / {preparationChecks.length} ({prepPercentage}%)
                    </div>
                </div>
            </div>

            {/* Spray Vaccination Quality */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    B. Spray Vaccination Quality
                </h3>

                <div className="form-group">
                    <label className="form-label">Sample Size (trays observed)</label>
                    <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={techniques.spraySampleSize || 0}
                        onChange={(e) => handleChange('spraySampleSize', parseInt(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Droplet Uniformity</label>
                    <select
                        className="form-select"
                        value={techniques.dropletUniformity || ''}
                        onChange={(e) => handleChange('dropletUniformity', e.target.value)}
                    >
                        <option value="">Select quality</option>
                        <option value={DROPLET_UNIFORMITY.EXCELLENT}>Excellent</option>
                        <option value={DROPLET_UNIFORMITY.GOOD}>Good</option>
                        <option value={DROPLET_UNIFORMITY.FAIR}>Fair</option>
                        <option value={DROPLET_UNIFORMITY.POOR}>Poor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Tray Coverage (%)</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-input"
                        value={techniques.trayCoverage || 0}
                        onChange={(e) => handleChange('trayCoverage', parseFloat(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                    {techniques.trayCoverage && (
                        <p style={{
                            fontSize: '0.75rem',
                            marginTop: '0.5rem',
                            color: techniques.trayCoverage >= 90 ? '#10B981' : '#F59E0B'
                        }}>
                            {techniques.trayCoverage >= 90 ? '✓ Good coverage' : '⚠ Coverage below 90%'}
                        </p>
                    )}
                </div>
            </div>

            {/* Injection Quality */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    C. Injection Quality Assessment
                </h3>

                <div className="form-group">
                    <label className="form-label">Sample Size (chicks observed)</label>
                    <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={techniques.injectionSampleSize || 0}
                        onChange={(e) => handleChange('injectionSampleSize', parseInt(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">Accurate Injection (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.accurateInjectionPercent || 0}
                            onChange={(e) => handleChange('accurateInjectionPercent', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bleeding (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.bleedingPercent || 0}
                            onChange={(e) => handleChange('bleedingPercent', parseFloat(e.target.value))}
                        />
                        {techniques.bleedingPercent > 5 && (
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#EF4444' }}>
                                ⚠ Exceeds 5% threshold
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Wet Neck (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.wetNeckPercent || 0}
                            onChange={(e) => handleChange('wetNeckPercent', parseFloat(e.target.value))}
                        />
                        {techniques.wetNeckPercent > 5 && (
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#EF4444' }}>
                                ⚠ Exceeds 5% threshold
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">No Vaccine (%)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.noVaccinePercent || 0}
                            onChange={(e) => handleChange('noVaccinePercent', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="form-group">
                <label className="form-label">Notes & Observations</label>
                <textarea
                    className="form-textarea"
                    placeholder="Record any issues, observations, or training needs..."
                    value={techniques.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}

export default Step4_Techniques;

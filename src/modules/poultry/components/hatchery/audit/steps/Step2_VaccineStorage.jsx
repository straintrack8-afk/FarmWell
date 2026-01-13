import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import PhotoUpload from '../../common/PhotoUpload';

function Step2_VaccineStorage() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const vaccineStorage = currentAudit?.vaccineStorage || {};

    const handleChange = (field, value) => {
        updateAuditSection('vaccineStorage', {
            ...vaccineStorage,
            [field]: value
        });
    };

    const handlePhotosChange = (photos) => {
        handleChange('photos', photos);
    };

    const checklist = [
        { key: 'temperatureOk', label: 'Refrigerator temperature maintained at +2°C to +8°C' },
        { key: 'tempLogAvailable', label: 'Temperature monitoring log available and up-to-date' },
        { key: 'vaccineOnly', label: 'Refrigerator used for vaccine storage only (no food/beverages)' },
        { key: 'fifoFollowed', label: 'Vaccines arranged by "First to expire, first out" principle' },
        { key: 'properPositioning', label: 'Vaccines stored in proper position (not on door shelves)' },
        { key: 'clearLabeling', label: 'Clear labeling for vaccines with cold chain incidents' }
    ];

    const passedCount = checklist.filter(item => vaccineStorage[item.key] === true).length;
    const percentage = Math.round((passedCount / checklist.length) * 100);

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Vaccine Storage Assessment
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Inspect vaccine storage conditions and compliance with cold chain requirements.
            </p>

            {/* Temperature Input */}
            <div className="form-group">
                <label className="form-label">Current Refrigerator Temperature (°C)</label>
                <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="Enter temperature"
                    value={vaccineStorage.currentTemperature || ''}
                    onChange={(e) => handleChange('currentTemperature', parseFloat(e.target.value))}
                    style={{ maxWidth: '200px' }}
                />
                {vaccineStorage.currentTemperature && (
                    <p style={{
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        color: vaccineStorage.currentTemperature >= 2 && vaccineStorage.currentTemperature <= 8 ? '#10B981' : '#EF4444'
                    }}>
                        {vaccineStorage.currentTemperature >= 2 && vaccineStorage.currentTemperature <= 8
                            ? '✓ Temperature within acceptable range'
                            : '⚠ Temperature out of range (+2°C to +8°C)'}
                    </p>
                )}
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    Storage Compliance Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {checklist.map((item) => (
                        <label key={item.key} className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={vaccineStorage[item.key] || false}
                                onChange={(e) => handleChange(item.key, e.target.checked)}
                            />
                            <span className="checkbox-label">{item.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Compliance Score */}
            <div className="alert info" style={{ marginBottom: '2rem' }}>
                <span>📊</span>
                <div>
                    <strong>Compliance Score:</strong> {passedCount} / {checklist.length} ({percentage}%)
                    <br />
                    <span style={{ fontSize: '0.875rem' }}>
                        {percentage >= 95 ? '✓ Excellent' : percentage >= 85 ? '⚠ Good' : percentage >= 75 ? '⚠ Fair' : '✗ Poor'}
                    </span>
                </div>
            </div>

            {/* Notes */}
            <div className="form-group">
                <label className="form-label">Notes & Observations</label>
                <textarea
                    className="form-textarea"
                    placeholder="Record any issues, observations, or corrective actions taken..."
                    value={vaccineStorage.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>

            {/* Photo Upload */}
            <div className="form-group">
                <label className="form-label">Photos</label>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
                    Upload photos of refrigerator, temperature log, and vaccine storage arrangement
                </p>
                <PhotoUpload
                    photos={vaccineStorage.photos || []}
                    onPhotosChange={handlePhotosChange}
                    maxPhotos={5}
                />
            </div>
        </div>
    );
}

export default Step2_VaccineStorage;

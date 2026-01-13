import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { formatDate, formatRelativeTime, addDays } from '../../../../utils/hatchery/dateUtils';

function Step7_Incubation() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const info = currentAudit?.info || {};

    const handleIncubationStart = () => {
        const now = new Date().toISOString();
        updateAuditSection('info', {
            ...info,
            incubationStartDate: now,
            incubationExpectedEndDate: addDays(now, 3)
        });
    };

    const handleUpdateDate = (field, value) => {
        updateAuditSection('info', {
            ...info,
            [field]: value
        });
    };

    const isIncubating = !!info.incubationStartDate;

    // Calculate progress (simplified)
    const start = info.incubationStartDate ? new Date(info.incubationStartDate).getTime() : 0;
    const end = info.incubationExpectedEndDate ? new Date(info.incubationExpectedEndDate).getTime() : 0;
    const now = Date.now();

    let progress = 0;
    if (start && end) {
        const total = end - start;
        const current = now - start;
        progress = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
    }

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Incubation Tracking
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                Track the 3-5 day incubation period for environmental samples (37°C).
            </p>

            {!isIncubating ? (
                <div className="hatchery-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌡️</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Ready to Incubate?
                    </h3>
                    <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                        Ensure all samples are placed in the incubator at 37°C.
                    </p>
                    <button
                        onClick={handleIncubationStart}
                        className="btn-hatchery btn-primary"
                        style={{ fontSize: '1.25rem', padding: '1rem 2rem' }}
                    >
                        Start Incubation Timer
                    </button>
                </div>
            ) : (
                <div>
                    <div className="alert info" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>🌡️</div>
                        <div>
                            <strong>Incubation In Progress</strong>
                            <br />
                            Started {formatRelativeTime(info.incubationStartDate)}
                        </div>
                    </div>

                    <div className="hatchery-card">
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Progress (3 Days)</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${progress}%`, backgroundColor: progress >= 100 ? '#10B981' : '#3B82F6' }}></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={info.incubationStartDate ? new Date(info.incubationStartDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleUpdateDate('incubationStartDate', e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Expected Completion (72 hours)</label>
                            <input
                                type="datetime-local"
                                className="form-input"
                                value={info.incubationExpectedEndDate ? new Date(info.incubationExpectedEndDate).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleUpdateDate('incubationExpectedEndDate', e.target.value)}
                            />
                        </div>
                    </div>

                    {progress >= 100 && (
                        <div className="alert success" style={{ marginTop: '2rem' }}>
                            <span>✓</span>
                            <div>
                                <strong>Incubation Complete</strong>
                                <br />
                                Proceed to Results Entry to record colony counts.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Step7_Incubation;

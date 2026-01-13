import React, { useState } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { SAMPLE_TYPES, SAMPLE_LOCATIONS as LOCATION_CONFIG } from '../../../../utils/hatcheryConstants';
import { formatTimeForInput } from '../../../../utils/hatchery/dateUtils';

function Step6_SampleCollection() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const samples = currentAudit?.samples || {};
    const [expandedGroups, setExpandedGroups] = useState(
        Object.keys(LOCATION_CONFIG).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const handleUpdateSample = (locationKey, sampleIndex, field, value) => {
        const updatedGroup = [...samples[locationKey]];
        updatedGroup[sampleIndex] = { ...updatedGroup[sampleIndex], [field]: value };

        // Auto-set collection time if marking as collected
        if (field === 'collected' && value === true && !updatedGroup[sampleIndex].collectionTime) {
            updatedGroup[sampleIndex].collectionTime = new Date().toISOString();
        }

        updateAuditSection('samples', {
            ...samples,
            [locationKey]: updatedGroup
        });
    };

    const handleCollectAll = (locationKey) => {
        const updatedGroup = samples[locationKey].map(sample => ({
            ...sample,
            collected: true,
            collectionTime: sample.collectionTime || new Date().toISOString()
        }));

        updateAuditSection('samples', {
            ...samples,
            [locationKey]: updatedGroup
        });
    };

    const toggleGroup = (key) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const totalSamples = Object.values(samples).reduce((sum, group) => sum + group.length, 0);
    const collectedCount = Object.values(samples).flat().filter(s => s.collected).length;
    const progress = Math.round((collectedCount / totalSamples) * 100);

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Sample Collection
                </h2>
                <p style={{ color: '#6B7280' }}>
                    Record sample collection for each location. Ensure aseptic technique is used.
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span>Collection Progress</span>
                    <span>{collectedCount} / {totalSamples} ({progress}%)</span>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Sample Groups */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(LOCATION_CONFIG).map(([key, config]) => {
                    const groupSamples = samples[key] || [];
                    if (groupSamples.length === 0) return null;

                    const groupCollected = groupSamples.filter(s => s.collected).length;
                    const isComplete = groupCollected === groupSamples.length;

                    return (
                        <div key={key} className="hatchery-card" style={{ padding: '0', overflow: 'hidden' }}>
                            {/* Group Header */}
                            <div
                                onClick={() => toggleGroup(key)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    backgroundColor: isComplete ? '#F0FDF4' : '#fff',
                                    borderBottom: expandedGroups[key] ? '1px solid #E5E7EB' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{ fontSize: '1.25rem', transform: `rotate(${expandedGroups[key] ? '90deg' : '0deg'})`, transition: 'transform 0.2s' }}>
                                        ›
                                    </span>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: isComplete ? '#065F46' : '#111827' }}>
                                            {config.name}
                                        </h3>
                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                            {config.type === SAMPLE_TYPES.AIR_PLATE ? '🧫 Air Plates' : '🧪 Swabs'} • {groupCollected}/{groupSamples.length} collected
                                        </div>
                                    </div>
                                </div>
                                {isComplete && <span style={{ color: '#059669', fontWeight: '600' }}>✓ Complete</span>}
                            </div>

                            {/* Group Content */}
                            {expandedGroups[key] && (
                                <div style={{ padding: '1.5rem' }}>
                                    {groupCollected < groupSamples.length && (
                                        <button
                                            onClick={() => handleCollectAll(key)}
                                            className="btn-hatchery btn-outline"
                                            style={{ marginBottom: '1rem', fontSize: '0.75rem', width: '100%' }}
                                        >
                                            Mark All as Collected
                                        </button>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {groupSamples.map((sample, index) => (
                                            <div key={sample.id} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                padding: '0.75rem',
                                                backgroundColor: sample.collected ? '#F9FAFB' : '#fff',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '0.5rem',
                                                opacity: sample.collected ? 0.8 : 1
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={sample.collected}
                                                        onChange={(e) => handleUpdateSample(key, index, 'collected', e.target.checked)}
                                                        style={{ width: '1.25rem', height: '1.25rem' }}
                                                    />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{sample.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>ID: {sample.id}</div>
                                                    </div>
                                                </div>

                                                {sample.collected && (
                                                    <div style={{ paddingLeft: '2.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            placeholder="Add specific location note..."
                                                            value={sample.notes || ''}
                                                            onChange={(e) => handleUpdateSample(key, index, 'notes', e.target.value)}
                                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Step6_SampleCollection;

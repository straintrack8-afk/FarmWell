import React, { useState, useEffect } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { calculatePlateScore, calculateEnvironmentalScore, classifyEnvironmentalScore } from '../../../../utils/hatchery/scoringEngine';
import { SAMPLE_TYPES, SAMPLE_LOCATIONS as LOCATION_CONFIG } from '../../../../utils/hatcheryConstants';
import ScoreBadge from '../../common/ScoreBadge';

function Step8_Results() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const samples = currentAudit?.samples || {};
    const [auditScore, setAuditScore] = useState({ score: 0, classification: 'N/A' });
    const [expandedGroups, setExpandedGroups] = useState(
        Object.keys(LOCATION_CONFIG).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    useEffect(() => {
        // Calculate overall score whenever samples change
        const score = calculateEnvironmentalScore(samples);
        const classificationObj = classifyEnvironmentalScore(score);
        setAuditScore({
            score,
            classification: classificationObj.label || 'N/A'
        });
    }, [samples]);

    const handleUpdateResult = (locationKey, sampleIndex, field, value) => {
        const updatedGroup = [...samples[locationKey]];
        const sample = { ...updatedGroup[sampleIndex], [field]: parseInt(value) || 0 };

        // Calculate individual sample score
        if (sample.type === SAMPLE_TYPES.AIR_PLATE) {
            sample.score = calculatePlateScore(sample.aspergillusCount || 0, sample.colonyCount || 0);
        } else {
            // Logic for swabs if different? Usually just presence/absence or count
            // Assuming simplified count for swabs too, or just 1-5 scale directly
            // For now using same logic or manual score entry if needed
            // If swab, maybe just colony count matters
            sample.score = calculatePlateScore(0, sample.colonyCount || 0); // Assuming no Aspergillus diff for swabs
        }

        updatedGroup[sampleIndex] = sample;

        updateAuditSection('samples', {
            ...samples,
            [locationKey]: updatedGroup
        });
    };

    const toggleGroup = (key) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getScoreColor = (score) => {
        if (score === 1) return '#10B981'; // Excellent
        if (score === 2) return '#10B981'; // Good
        if (score === 3) return '#F59E0B'; // Fair
        if (score === 4) return '#F97316'; // Warning
        if (score >= 5) return '#EF4444'; // Critical
        return '#6B7280';
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                Results Entry
            </h2>

            {/* Overall Score Summary */}
            <div className="hatchery-card" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h3 style={{ fontSize: '1rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Environmental Score
                    </h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#111827' }}>
                        {auditScore.score}
                    </div>
                </div>
                <div>
                    <ScoreBadge classification={auditScore.classification} showIcon={true} />
                </div>
            </div>

            {/* Results Entry Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(LOCATION_CONFIG).map(([key, config]) => {
                    const groupSamples = samples[key] || [];
                    if (groupSamples.length === 0) return null;

                    return (
                        <div key={key} className="hatchery-card" style={{ padding: '0', overflow: 'hidden' }}>
                            {/* Group Header */}
                            <div
                                onClick={() => toggleGroup(key)}
                                style={{
                                    padding: '1rem 1.5rem',
                                    backgroundColor: '#F9FAFB',
                                    borderBottom: expandedGroups[key] ? '1px solid #E5E7EB' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ fontWeight: '600' }}>{config.name}</span>
                                <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                    {groupSamples.length} samples
                                </span>
                            </div>

                            {/* Samples List */}
                            {expandedGroups[key] && (
                                <div style={{ padding: '1rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>
                                                <th style={{ padding: '0.5rem' }}>Sample ID</th>
                                                {config.type === SAMPLE_TYPES.AIR_PLATE && (
                                                    <th style={{ padding: '0.5rem' }}>Aspergillus</th>
                                                )}
                                                <th style={{ padding: '0.5rem' }}>
                                                    {config.type === SAMPLE_TYPES.AIR_PLATE ? 'Other Molds' : 'Colony Count'}
                                                </th>
                                                <th style={{ padding: '0.5rem' }}>Score (1-5)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupSamples.map((sample, index) => (
                                                <tr key={sample.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: '500' }}>
                                                        {sample.name}
                                                    </td>

                                                    {config.type === SAMPLE_TYPES.AIR_PLATE && (
                                                        <td style={{ padding: '0.5rem' }}>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                className="form-input"
                                                                style={{ maxWidth: '80px', padding: '0.25rem' }}
                                                                value={sample.aspergillusCount || ''}
                                                                onChange={(e) => handleUpdateResult(key, index, 'aspergillusCount', e.target.value)}
                                                            />
                                                        </td>
                                                    )}

                                                    <td style={{ padding: '0.5rem' }}>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-input"
                                                            style={{ maxWidth: '80px', padding: '0.25rem' }}
                                                            value={sample.colonyCount || ''}
                                                            onChange={(e) => handleUpdateResult(key, index, 'colonyCount', e.target.value)}
                                                        />
                                                    </td>

                                                    <td style={{ padding: '0.5rem' }}>
                                                        <div style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '2rem',
                                                            height: '2rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: getScoreColor(sample.score),
                                                            color: 'white',
                                                            fontWeight: '600'
                                                        }}>
                                                            {sample.score || '-'}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Step8_Results;

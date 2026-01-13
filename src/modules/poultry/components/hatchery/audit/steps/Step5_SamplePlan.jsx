import React, { useEffect } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { SAMPLE_LOCATIONS as LOCATION_CONFIG } from '../../../../utils/hatcheryConstants';

function Step5_SamplePlan() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const samples = currentAudit?.samples || {};

    useEffect(() => {
        // Initialize samples if they don't exist
        if (Object.keys(samples).length === 0) {
            initializeSamples();
        }
    }, []);

    const initializeSamples = () => {
        const newSamples = {};

        Object.entries(LOCATION_CONFIG).forEach(([key, config]) => {
            newSamples[key] = [];
            for (let i = 0; i < config.defaultCount; i++) {
                newSamples[key].push({
                    id: `${key}-${i + 1}`,
                    name: `${config.name} #${i + 1}`,
                    locationCode: config.code,
                    type: config.type,
                    collected: false,
                    collectionTime: null,
                    incubationStart: null,
                    incubationEnd: null,
                    colonyCount: null,
                    aspergillusCount: null,
                    score: null,
                    notes: ''
                });
            }
        });

        updateAuditSection('samples', newSamples);
    };

    const handleReset = () => {
        if (confirm('Reset sample plan to default? Any custom changes will be lost.')) {
            initializeSamples();
        }
    };

    const totalSamples = Object.values(samples).reduce((sum, group) => sum + group.length, 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        Environmental Sampling Plan
                    </h2>
                    <p style={{ color: '#6B7280' }}>
                        Review and confirm the 30-point sampling plan.
                    </p>
                </div>
                <button
                    onClick={handleReset}
                    className="btn-hatchery btn-outline"
                    style={{ fontSize: '0.875rem' }}
                >
                    Reset to Default
                </button>
            </div>

            <div className="alert info" style={{ marginBottom: '2rem' }}>
                <span>📋</span>
                <div>
                    <strong>Total Samples: {totalSamples}</strong>
                    <br />
                    Standard protocol requires 30 monitoring points across the hatchery.
                </div>
            </div>

            <div className="sample-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {Object.entries(LOCATION_CONFIG).map(([key, config]) => (
                    <div key={key} className="hatchery-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                                {config.name} ({config.code})
                            </h3>
                            <span className="badge" style={{ backgroundColor: '#E5E7EB', color: '#374151' }}>
                                {samples[key]?.length || 0} samples
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {samples[key]?.map((sample, index) => (
                                <div key={sample.id} style={{
                                    padding: '0.5rem',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #E5E7EB',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{sample.name}</span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#6B7280',
                                        textTransform: 'uppercase',
                                        backgroundColor: '#E5E7EB',
                                        padding: '0.125rem 0.375rem',
                                        borderRadius: '0.25rem'
                                    }}>
                                        {sample.type.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="alert warning" style={{ marginTop: '2rem' }}>
                <span>⚠</span>
                <div>
                    <strong>Note:</strong> Once you proceed to collection, the sampling plan cannot be modified.
                </div>
            </div>
        </div>
    );
}

export default Step5_SamplePlan;

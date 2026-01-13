import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../contexts/HatcheryAuditContext';
import { downloadAuditPDF } from '../../utils/hatchery/pdfExport';
import { downloadAuditExcel } from '../../utils/hatchery/excelExport';
import { formatDate } from '../../utils/hatchery/dateUtils';
import ScoreBadge from './common/ScoreBadge';
import '../../hatchery.css';

function AuditReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { audits } = useHatcheryAudit();
    const [audit, setAudit] = useState(null);

    useEffect(() => {
        const foundAudit = audits.find(a => a.id === id);
        setAudit(foundAudit);
    }, [id, audits]);

    if (!audit) {
        return (
            <div className="hatchery-container">
                <div className="hatchery-card">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <h2>Audit Not Found</h2>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                            The requested audit could not be found.
                        </p>
                        <button
                            onClick={() => navigate('/poultry/hatchery-audit')}
                            className="btn-hatchery btn-primary"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleExportPDF = () => {
        downloadAuditPDF(audit);
    };

    const handleExportExcel = () => {
        downloadAuditExcel(audit);
    };

    return (
        <div className="hatchery-container">
            {/* Header */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            {audit.auditNumber}
                        </h1>
                        <p style={{ color: '#6B7280' }}>
                            {formatDate(audit.info?.auditDate, 'long')} • {audit.info?.location}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => navigate('/poultry/hatchery-audit/history')} className="btn-hatchery btn-outline">
                            ← Back
                        </button>
                        <button onClick={handleExportPDF} className="btn-hatchery btn-primary">
                            📄 Export PDF
                        </button>
                        <button onClick={handleExportExcel} className="btn-hatchery btn-success">
                            📊 Export Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* Overall Score */}
            {audit.finalScore && (
                <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{ fontSize: '0.875rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                Environmental Score
                            </h2>
                            <div style={{ fontSize: '3rem', fontWeight: '700' }}>
                                {audit.finalScore.score}
                            </div>
                        </div>
                        <ScoreBadge classification={audit.finalScore.classification} showIcon={true} />
                    </div>
                </div>
            )}

            {/* Audit Information */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                    Audit Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Auditor</div>
                        <div style={{ fontWeight: '600' }}>{audit.info?.auditor || 'N/A'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Audit Type</div>
                        <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{audit.info?.auditType || 'N/A'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Status</div>
                        <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{audit.status || 'N/A'}</div>
                    </div>
                </div>
                {audit.info?.notes && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.5rem' }}>Notes</div>
                        <div>{audit.info.notes}</div>
                    </div>
                )}
            </div>

            {/* Vaccine Storage */}
            {audit.vaccineStorage && (
                <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Vaccine Storage Assessment
                    </h2>
                    {audit.vaccineStorage.currentTemperature && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontWeight: '600' }}>Temperature: </span>
                            <span style={{
                                color: audit.vaccineStorage.currentTemperature >= 2 && audit.vaccineStorage.currentTemperature <= 8 ? '#10B981' : '#EF4444'
                            }}>
                                {audit.vaccineStorage.currentTemperature}°C
                            </span>
                        </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
                        {[
                            { key: 'temperatureOk', label: 'Temperature maintained (+2°C to +8°C)' },
                            { key: 'tempLogAvailable', label: 'Temperature log available' },
                            { key: 'vaccineOnly', label: 'Refrigerator for vaccines only' },
                            { key: 'fifoFollowed', label: 'FIFO principle followed' },
                            { key: 'properPositioning', label: 'Proper positioning' },
                            { key: 'clearLabeling', label: 'Clear labeling' }
                        ].map(item => (
                            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: audit.vaccineStorage[item.key] ? '#10B981' : '#EF4444', fontSize: '1.25rem' }}>
                                    {audit.vaccineStorage[item.key] ? '✓' : '✗'}
                                </span>
                                <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Equipment */}
            {audit.equipment && audit.equipment.length > 0 && (
                <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Vaccination Equipment
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {audit.equipment.map((eq, index) => (
                            <div key={index} style={{ padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '0.5rem' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                                    {eq.name || eq.type} (Qty: {eq.quantity || 1})
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
                                    <span style={{ color: eq.conditionGood ? '#10B981' : '#EF4444' }}>
                                        {eq.conditionGood ? '✓' : '✗'} Condition
                                    </span>
                                    <span style={{ color: eq.maintenanceCurrent ? '#10B981' : '#EF4444' }}>
                                        {eq.maintenanceCurrent ? '✓' : '✗'} Maintenance
                                    </span>
                                    <span style={{ color: eq.dosesSufficient ? '#10B981' : '#EF4444' }}>
                                        {eq.dosesSufficient ? '✓' : '✗'} Doses
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Techniques */}
            {audit.techniques && (
                <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Vaccination Techniques
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {audit.techniques.spraySampleSize && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Spray Sample Size</div>
                                <div style={{ fontWeight: '600' }}>{audit.techniques.spraySampleSize} trays</div>
                            </div>
                        )}
                        {audit.techniques.dropletUniformity && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Droplet Uniformity</div>
                                <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{audit.techniques.dropletUniformity}</div>
                            </div>
                        )}
                        {audit.techniques.trayCoverage && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Tray Coverage</div>
                                <div style={{ fontWeight: '600' }}>{audit.techniques.trayCoverage}%</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Environmental Samples Summary */}
            {audit.samples && Object.keys(audit.samples).length > 0 && (
                <div className="hatchery-card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                        Environmental Assessment
                    </h2>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                            <thead style={{ backgroundColor: '#F9FAFB' }}>
                                <tr>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Sample ID</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Location</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Type</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #E5E7EB' }}>Aspergillus</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #E5E7EB' }}>Other Molds</th>
                                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #E5E7EB' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(audit.samples).map(([locationKey, sampleGroup]) =>
                                    sampleGroup.map((sample, index) => (
                                        <tr key={`${locationKey}-${index}`} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.75rem' }}>{sample.id}</td>
                                            <td style={{ padding: '0.75rem' }}>{sample.name}</td>
                                            <td style={{ padding: '0.75rem' }}>{sample.type === 'air_plate' ? 'Air Plate' : 'Swab'}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sample.aspergillusCount || '-'}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sample.colonyCount || '-'}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                {sample.score ? (
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        width: '2rem',
                                                        height: '2rem',
                                                        borderRadius: '50%',
                                                        backgroundColor: sample.score <= 2 ? '#10B981' : sample.score === 3 ? '#F59E0B' : '#EF4444',
                                                        color: 'white',
                                                        fontWeight: '600'
                                                    }}>
                                                        {sample.score}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuditReport;

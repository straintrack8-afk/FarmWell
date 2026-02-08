import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { getLocalizedText, getRiskColor } from '../../utils/assessmentUtils';

function DiseaseRiskAlert({ triggeredRisks }) {
    const { language } = useLanguage();

    if (!triggeredRisks || triggeredRisks.length === 0) {
        return (
            <div className="disease-risk-alerts">
                <div className="alerts-header">
                    <h3 className="alerts-title">Disease Risk Assessment</h3>
                    <div className="alerts-count" style={{ background: '#10b981' }}>
                        0
                    </div>
                </div>
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 2rem',
                    color: '#6b7280'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#10b981' }}>
                        No Critical Risks Detected
                    </h4>
                    <p>
                        Based on your answers, no major disease risk triggers were identified.
                        Continue maintaining good biosecurity practices.
                    </p>
                </div>
            </div>
        );
    }

    // Group by risk level
    const criticalRisks = triggeredRisks.filter(r => r.riskLevel === 'critical');
    const highRisks = triggeredRisks.filter(r => r.riskLevel === 'high');
    const mediumRisks = triggeredRisks.filter(r => r.riskLevel === 'medium');
    const lowRisks = triggeredRisks.filter(r => r.riskLevel === 'low');

    const renderRiskCard = (riskData) => {
        const { disease, triggeredBy, riskLevel, triggerCount, totalWeight } = riskData;
        const color = getRiskColor(riskLevel);

        return (
            <div
                key={disease.id}
                className="risk-alert-card"
                style={{ borderLeftColor: color }}
            >
                <div className="risk-alert-header">
                    <div className="risk-alert-icon" style={{ color }}>
                        {riskLevel === 'critical' ? '🔴' : riskLevel === 'high' ? '🟠' : riskLevel === 'medium' ? '🟡' : '🟢'}
                    </div>
                    <div className="risk-alert-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <h4 className="disease-name">
                                {getLocalizedText(disease.name, language)}
                            </h4>
                            <span
                                className="risk-level-badge"
                                style={{ background: color }}
                            >
                                {riskLevel.toUpperCase()}
                            </span>
                            {disease.zoonotic && (
                                <span className="zoonotic-badge">
                                    ⚠️ Zoonotic
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Disease Info */}
                <div style={{ marginTop: '1rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}>
                        {disease.mortality_rate && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    Mortality Rate
                                </div>
                                <div style={{ fontWeight: '600', color: '#ef4444' }}>
                                    {disease.mortality_rate}
                                </div>
                            </div>
                        )}
                        {disease.economic_impact && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    Economic Impact
                                </div>
                                <div style={{ fontWeight: '600', color: '#f59e0b', textTransform: 'capitalize' }}>
                                    {disease.economic_impact.replace('_', ' ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trigger Information */}
                <div className="risk-triggers">
                    <div className="triggers-label">
                        Risk Triggered By:
                    </div>
                    <div className="triggers-count">
                        {triggerCount} answer{triggerCount > 1 ? 's' : ''} (Weight: {totalWeight})
                    </div>
                </div>

                {/* Triggered Questions */}
                <div style={{ marginTop: '0.75rem' }}>
                    {triggeredBy.map((trigger, index) => (
                        <div
                            key={index}
                            style={{
                                fontSize: '0.875rem',
                                padding: '0.5rem 0.75rem',
                                background: '#f9fafb',
                                borderRadius: '6px',
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span style={{
                                background: getRiskColor(trigger.riskLevel),
                                color: 'white',
                                padding: '0.125rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                            }}>
                                Q{trigger.questionId}
                            </span>
                            <span style={{ color: '#6b7280' }}>
                                Weight: {trigger.weight}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Zoonotic Warning */}
                {disease.zoonotic && (
                    <div className="zoonotic-warning">
                        <div className="warning-icon">⚠️</div>
                        <div className="warning-text">
                            <strong>Zoonotic Disease Warning:</strong> This disease can be transmitted to humans.
                            Implement strict personal protective equipment (PPE) protocols and hygiene measures.
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="disease-risk-alerts">
            <div className="alerts-header">
                <h3 className="alerts-title">Disease Risk Assessment</h3>
                <div
                    className="alerts-count"
                    style={{
                        background: criticalRisks.length > 0 ? '#ef4444' :
                            highRisks.length > 0 ? '#f59e0b' : '#10b981'
                    }}
                >
                    {triggeredRisks.length}
                </div>
            </div>

            <div className="alerts-list">
                {/* Critical Risks */}
                {criticalRisks.length > 0 && (
                    <>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#991b1b',
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🔴 Critical Risks ({criticalRisks.length})
                        </div>
                        {criticalRisks.map(renderRiskCard)}
                    </>
                )}

                {/* High Risks */}
                {highRisks.length > 0 && (
                    <>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#92400e',
                            marginTop: criticalRisks.length > 0 ? '1.5rem' : 0,
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🟠 High Risks ({highRisks.length})
                        </div>
                        {highRisks.map(renderRiskCard)}
                    </>
                )}

                {/* Medium Risks */}
                {mediumRisks.length > 0 && (
                    <>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#78350f',
                            marginTop: (criticalRisks.length + highRisks.length) > 0 ? '1.5rem' : 0,
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🟡 Medium Risks ({mediumRisks.length})
                        </div>
                        {mediumRisks.map(renderRiskCard)}
                    </>
                )}

                {/* Low Risks */}
                {lowRisks.length > 0 && (
                    <>
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#365314',
                            marginTop: (criticalRisks.length + highRisks.length + mediumRisks.length) > 0 ? '1.5rem' : 0,
                            marginBottom: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            🟢 Low Risks ({lowRisks.length})
                        </div>
                        {lowRisks.map(renderRiskCard)}
                    </>
                )}
            </div>

            {/* Summary Note */}
            <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#f3f4f6',
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#4b5563'
            }}>
                <strong>Note:</strong> Risk levels are determined by specific answers that trigger disease concerns.
                Higher weights indicate stronger risk factors. Address critical and high risks immediately.
            </div>
        </div>
    );
}

export default DiseaseRiskAlert;

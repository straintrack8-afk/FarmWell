import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

function getCategoryClass(category) {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('bacterial')) return 'badge-bacterial';
    if (lower.includes('viral')) return 'badge-viral';
    if (lower.includes('parasitic')) return 'badge-parasitic';
    if (lower.includes('nutritional')) return 'badge-nutritional';
    if (lower.includes('toxicosis')) return 'badge-toxicosis';
    return 'badge-other';
}

const textToBullets = (text) => {
    if (!text) return [];
    let cleaned = text.replace(/\*\*/g, '').replace(/\*/g, '');
    return cleaned
        .split(/\n|;\s*|\.\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.endsWith('.') ? s : s + '.');
};

function DiseaseDetail() {
    const {
        selectedDisease: disease,
        setStep,
        reset
    } = useDiagnosis();

    if (!disease) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}></div>
                    <h3 className="empty-state-title">Disease Not Found</h3>
                    <p className="empty-state-text">
                        Please start a new diagnosis to view disease details.
                    </p>
                    <button className="btn btn-primary" onClick={() => setStep(STEPS.LANDING)}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const handleNewDiagnosis = () => {
        reset();
        setStep(STEPS.LANDING);
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            {/* Back Button */}
            <div style={{ padding: '1rem 0' }}>
                <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setStep(STEPS.RESULTS)}
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                    Back to Results
                </button>
            </div>

            {/* Main Content Card */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Disease Header */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                        {disease.name}
                    </h1>
                    {disease.latinName && (
                        <p style={{
                            fontStyle: 'italic',
                            color: 'var(--text-muted)',
                            marginBottom: '1rem'
                        }}>
                            {disease.latinName}
                        </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        <span className={`badge ${getCategoryClass(disease.category)}`}>
                            {disease.category || 'Other'}
                        </span>

                        <div className={`mortality-indicator mortality-moderate`}>
                            <span className="mortality-dot"></span>
                            {disease.mortality || 'Variable mortality'}
                        </div>

                        {disease.ageGroups?.map(ag => (
                            <span
                                key={ag}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)'
                                }}
                            >
                                {ag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Zoonotic Warning */}
                {disease.zoonotic && (
                    <div className="zoonotic-warning" style={{ marginBottom: '1.5rem' }}>
                        <div className="zoonotic-warning-icon" style={{ fontSize: '1.5rem' }}></div>
                        <div className="zoonotic-warning-content">
                            <div className="zoonotic-warning-title">Zoonotic Disease Hazard</div>
                            <div className="zoonotic-warning-text">
                                {disease.zoonoticNote || 'This disease can spread to humans. Always use proper biosecurity and hygiene protocols when handling affected birds.'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Single Scroll Content */}
                <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', marginTop: '1.5rem' }}>
                    {/* Description */}
                    {disease.description && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Description
                            </h3>
                            <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                                {disease.description}
                            </p>
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                    {/* Clinical Signs */}
                    {disease.symptoms?.length > 0 && (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Clinical Signs
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                {disease.symptoms.map((symptom, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>•</span>
                                        {symptom}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transmission */}
                    {disease.transmission && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Transmission
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {textToBullets(disease.transmission).map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Diagnosis */}
                    {disease.diagnosis && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Diagnosis Methods
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {textToBullets(disease.diagnosis).map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Treatment */}
                    {disease.treatment && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Treatment Options
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {textToBullets(disease.treatment).map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Prevention */}
                    {disease.controlPrevention && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Control & Prevention
                                </h3>
                                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                    {textToBullets(disease.controlPrevention).map((item, i) => (
                                        <li key={i} style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Vaccines (New) */}
                    {disease.vaccines?.length > 0 && (
                        <>
                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                            <div style={{ marginBottom: '1rem' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Vaccine Recommendations
                                </h3>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {disease.vaccines.map((vac, idx) => (
                                        <div key={idx} style={{
                                            padding: '1rem',
                                            background: '#E0ECFF',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--primary-light)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.75rem'
                                        }}>
                                            {/* Assumes images are in public/images/ */}
                                            {vac.photo && (
                                                <div style={{ width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                                                    <img
                                                        src={`/images/${vac.photo}`}
                                                        alt={vac.name}
                                                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h4 style={{ margin: '0 0 0.5rem', color: 'var(--primary-dark)', fontWeight: '600' }}>
                                                    {vac.name}
                                                </h4>
                                                {vac.details && (
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                                                        {vac.details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {/* Back to Results + New Diagnosis side by side */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={() => setStep(STEPS.RESULTS)}
                    >
                        Back to Results
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ flex: 1, minWidth: 0 }}
                        onClick={handleNewDiagnosis}
                    >
                        New Diagnosis
                    </button>
                </div>
                {/* Print full-width below */}
                <button
                    className="btn btn-outline"
                    style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    onClick={() => window.print()}
                >
                    Print
                </button>
            </div>
        </div>
    );
}

export default DiseaseDetail;

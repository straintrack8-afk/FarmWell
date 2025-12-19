import { useParams, useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { formatDescription, cleanText } from '../utils/formatters';

function getCategoryClass(category) {
    const lower = category?.toLowerCase() || '';
    if (lower.includes('bacterial')) return 'badge-bacterial';
    if (lower.includes('viral')) return 'badge-viral';
    if (lower.includes('parasitic')) return 'badge-parasitic';
    if (lower.includes('nutritional')) return 'badge-nutritional';
    if (lower.includes('toxicosis')) return 'badge-toxicosis';
    return 'badge-other';
}

function getMortalityClass(level) {
    const mapping = {
        'Very High': 'mortality-very-high',
        'High': 'mortality-high',
        'Moderate': 'mortality-moderate',
        'Low': 'mortality-low',
        'Minimal': 'mortality-minimal'
    };
    return mapping[level] || 'mortality-moderate';
}

function DiseasePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { diseases, resetDiagnosis } = useDiagnosis();

    const disease = diseases.find(d => d.id === parseInt(id));

    if (!disease) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '3rem' }}>❓</div>
                    <h3 className="empty-state-title">Disease Not Found</h3>
                    <p className="empty-state-text">
                        The disease you're looking for doesn't exist.
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const handleNewDiagnosis = () => {
        resetDiagnosis();
        navigate('/');
    };

    return (
        <div className="container" style={{ paddingBottom: '2rem', maxWidth: '800px' }}>
            {/* Back Button */}
            <div style={{ padding: '1rem 0' }}>
                <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Back to Results
                </button>
            </div>

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
                        {disease.category?.replace(/\*/g, '').trim() || 'Other'}
                    </span>

                    <div className={`mortality-indicator ${getMortalityClass(disease.mortalityLevel)}`}>
                        <span className="mortality-dot"></span>
                        {disease.mortalityLevel} mortality
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
            {disease.zoonoticRisk && (
                <div className="zoonotic-warning" style={{ marginBottom: '1.5rem' }}>
                    <div className="zoonotic-warning-icon" style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div className="zoonotic-warning-content">
                        <div className="zoonotic-warning-title">Zoonotic Disease</div>
                        <div className="zoonotic-warning-text">
                            {disease.zoonoticDetails || 'This disease can spread to humans. Use proper biosecurity measures.'}
                        </div>
                    </div>
                </div>
            )}

            {/* Single Scroll Content */}
            <div className="card" style={{ padding: '1.5rem' }}>
                {/* Description */}
                {disease.description && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📋 Description
                        </h3>
                        <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                            {formatDescription(disease.description)}
                        </div>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Clinical Signs */}
                {disease.symptoms?.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🩺 Clinical Signs
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '0.5rem'
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
                                    <span style={{ color: 'var(--primary)' }}>•</span>
                                    {symptom}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Transmission */}
                {disease.transmission && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔄 Transmission
                        </h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {cleanText(disease.transmission)}
                        </p>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Diagnosis Methods */}
                {disease.diagnosisMethod && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔬 Diagnosis Methods
                        </h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {cleanText(disease.diagnosisMethod)}
                        </p>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Treatment Options */}
                {disease.treatmentOptions && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            💊 Treatment Options
                        </h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {cleanText(disease.treatmentOptions)}
                        </p>
                    </div>
                )}

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Control & Prevention */}
                {disease.controlPrevention && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🛡️ Control & Prevention
                        </h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                            {cleanText(disease.controlPrevention)}
                        </p>
                    </div>
                )}

                {/* Vaccine Recommendation */}
                {disease.vaccineRecommendation && (
                    <>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                💉 Vaccine Recommendation
                            </h3>
                            <div style={{
                                padding: '1rem',
                                background: '#E0ECFF',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--primary-light)',
                                lineHeight: '1.7'
                            }}>
                                {cleanText(disease.vaccineRecommendation)}
                            </div>
                        </div>
                    </>
                )}

                {/* Key Facts */}
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        📊 Key Facts
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem'
                    }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Mortality</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                {disease.mortality || disease.mortalityLevel || 'Unknown'}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Zoonotic Risk</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                {disease.zoonoticRisk ? 'Yes - Can infect humans' : 'No'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Powered by Vaksindo */}
            <div style={{
                maxWidth: '600px',
                margin: '1.5rem auto',
                textAlign: 'center',
                padding: '1.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
            }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Powered by
                </p>
                <img
                    src="/images/Vaksindo_logo.png"
                    alt="Vaksindo"
                    style={{ height: '150px', width: 'auto' }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <button className="btn btn-secondary" onClick={() => navigate('/results')}>
                    ← Back to Results
                </button>
                <button className="btn btn-outline" onClick={handleNewDiagnosis}>
                    🔄 New Diagnosis
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                >
                    🖨️ Print
                </button>
            </div>
        </div>
    );
}

export default DiseasePage;

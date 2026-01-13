import { useNavigate } from 'react-router-dom';
import { useDiagnosis, AGE_GROUPS } from '../contexts/DiagnosisContext';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Results' }
    ];

    return (
        <div className="progress-steps">
            {steps.map(s => (
                <div
                    key={s.num}
                    className={`progress-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
                >
                    <div className="step-number">
                        {step > s.num ? '✓' : s.num}
                    </div>
                    <span>{s.label}</span>
                </div>
            ))}
        </div>
    );
}

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

function DiseaseCard({ disease, onClick }) {
    return (
        <div className="disease-card" onClick={onClick}>
            <div className="disease-card-header">
                <div>
                    <div className="disease-name">{disease.name}</div>
                    {disease.latinName && (
                        <div className="disease-latin">{disease.latinName}</div>
                    )}
                </div>
                {disease.zoonoticRisk && (
                    <span className="badge badge-zoonotic" title="Can spread to humans">
                        ⚠️ Zoonotic
                    </span>
                )}
            </div>

            <div className="disease-meta">
                <span className={`badge ${getCategoryClass(disease.category)}`}>
                    {disease.category?.replace(/\*/g, '').trim() || 'Other'}
                </span>
                <div className={`mortality-indicator ${getMortalityClass(disease.mortalityLevel)}`}>
                    <span className="mortality-dot"></span>
                    {disease.mortalityLevel} mortality
                </div>
            </div>

            {disease.description && (
                <p className="disease-description">{disease.description}</p>
            )}

            {disease.matchCount > 0 && (
                <div className="match-indicator">
                    ✓ Matches {disease.matchCount} symptom(s)
                </div>
            )}
        </div>
    );
}

function ResultsPage() {
    const navigate = useNavigate();
    const {
        selectedAge,
        selectedSymptoms,
        filteredDiseases,
        resetDiagnosis
    } = useDiagnosis();

    // Redirect if no age selected
    if (!selectedAge) {
        navigate('../age');
        return null;
    }

    const selectedAgeGroup = AGE_GROUPS.find(a => a.id === selectedAge);

    const handleDiseaseClick = (diseaseId) => {
        navigate(`../disease/${diseaseId}`);
    };

    const handleNewDiagnosis = () => {
        resetDiagnosis();
        navigate('../');
    };

    const handleRefineSymptoms = () => {
        navigate('../symptoms');
    };

    return (
        <div>
            <ProgressBar step={3} />

            <div className="container">
                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">
                        {filteredDiseases.length} Possible Disease{filteredDiseases.length !== 1 ? 's' : ''}
                    </h1>
                    <p className="page-subtitle">
                        Based on your selections
                    </p>
                </div>

                {/* Selection Summary */}
                <div style={{
                    maxWidth: '700px',
                    margin: '0 auto 1.5rem',
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)'
                }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <strong>Age Group:</strong> {selectedAgeGroup?.name}
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <strong>Symptoms ({selectedSymptoms.length}):</strong>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedSymptoms.map(symptom => (
                            <span
                                key={symptom}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.8125rem'
                                }}
                            >
                                {symptom}
                            </span>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginTop: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <button className="btn btn-secondary btn-sm" onClick={handleRefineSymptoms}>
                            ← Refine Symptoms
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={handleNewDiagnosis}>
                            🔄 New Diagnosis
                        </button>
                    </div>
                </div>

                {/* Zoonotic Warning */}
                {filteredDiseases.some(d => d.zoonoticRisk) && (
                    <div className="zoonotic-warning" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
                        <div className="zoonotic-warning-icon" style={{ fontSize: '1.5rem' }}>⚠️</div>
                        <div className="zoonotic-warning-content">
                            <div className="zoonotic-warning-title">Zoonotic Disease Warning</div>
                            <div className="zoonotic-warning-text">
                                Some results can spread to humans. Use proper PPE and hygiene.
                            </div>
                        </div>
                    </div>
                )}

                {/* Disease List */}
                <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '2rem' }}>
                    {filteredDiseases.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon" style={{ fontSize: '3rem' }}>🔍</div>
                            <h3 className="empty-state-title">No Diseases Found</h3>
                            <p className="empty-state-text">
                                No diseases match all your selected symptoms. Try removing some symptoms.
                            </p>
                            <button className="btn btn-primary" onClick={handleRefineSymptoms}>
                                Refine Symptoms
                            </button>
                        </div>
                    ) : (
                        filteredDiseases.map(disease => (
                            <DiseaseCard
                                key={disease.id}
                                disease={disease}
                                onClick={() => handleDiseaseClick(disease.id)}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResultsPage;

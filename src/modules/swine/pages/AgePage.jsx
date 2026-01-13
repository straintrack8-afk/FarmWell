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

function AgePage() {
    const navigate = useNavigate();
    const { selectedAge, setSelectedAge } = useDiagnosis();

    const handleSelectAge = (ageId) => {
        setSelectedAge(ageId);
    };

    const handleContinue = () => {
        if (selectedAge) {
            navigate('../symptoms');
        }
    };

    return (
        <div className="has-action-bar">
            <ProgressBar step={1} />

            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Select Age Group</h1>
                    <p className="page-subtitle">
                        Choose the age group of the affected pig(s)
                    </p>
                </div>

                <div className="age-grid">
                    {AGE_GROUPS.map(age => (
                        <div
                            key={age.id}
                            className={`age-card ${selectedAge === age.id ? 'selected' : ''}`}
                            onClick={() => handleSelectAge(age.id)}
                        >
                            <div className="age-card-icon">{age.icon}</div>
                            <div className="age-card-title">{age.name}</div>
                            <div className="age-card-subtitle">{age.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAge && (
                <div className="action-bar slide-up">
                    <div className="action-bar-content">
                        <div className="action-bar-info">
                            Selected: <strong>{AGE_GROUPS.find(a => a.id === selectedAge)?.name}</strong>
                        </div>
                        <button className="btn btn-primary" onClick={handleContinue}>
                            Continue →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AgePage;

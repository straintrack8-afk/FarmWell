import React from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

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

function AgeSelection() {
    const {
        selectedAge,
        setAge,
        setStep,
        ageGroups
    } = useDiagnosis();

    const handleSelectAge = (ageId) => {
        setAge(ageId);
    };

    const handleContinue = () => {
        if (selectedAge) {
            setStep(STEPS.SYMPTOMS);
        }
    };

    return (
        <div className="has-action-bar">
            <ProgressBar step={1} />

            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Select Age Group</h1>
                    <p className="page-subtitle">
                        Choose the age group of the affected birds
                    </p>
                </div>

                <div className="age-grid">
                    {ageGroups.map(age => (
                        <div
                            key={age.id}
                            className={`age-card ${selectedAge === age.id ? 'selected' : ''}`}
                            onClick={() => handleSelectAge(age.id)}
                        >
                            <div className="age-card-icon">{age.icon || '🐔'}</div>
                            <div className="age-card-title">{age.shortLabel || age.label}</div>
                            <div className="age-card-subtitle">{age.shortLabel ? age.label : ''}</div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAge && (
                <div className="action-bar slide-up">
                    <div className="action-bar-content">
                        <div className="action-bar-info">
                            Selected: <strong>{ageGroups.find(a => a.id === selectedAge)?.label}</strong>
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

export default AgeSelection;

import React, { useState, useMemo } from 'react';
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

function SymptomSelection() {
    const {
        setStep,
        symptomCategories,
        selectedSymptoms,
        toggleSymptom,
        clearSymptoms,
        filteredDiseases,
        getSymptomCount,
        selectedAge,
        ageGroups
    } = useDiagnosis();

    const [openCategories, setOpenCategories] = useState(Object.keys(symptomCategories));
    const [searchTerm, setSearchTerm] = useState('');

    const toggleCategory = (catKey) => {
        setOpenCategories(prev =>
            prev.includes(catKey)
                ? prev.filter(k => k !== catKey)
                : [...prev, catKey]
        );
    };

    const handleShowResults = () => {
        setStep(STEPS.RESULTS);
    };

    const selectedAgeGroup = ageGroups.find(a => a.id === selectedAge);

    const categoryIcons = {
        mortality: '☠️',
        fever: '🌡️',
        locomotion: '🦿',
        excretion: '💧',
        skin: '🔴',
        production: '🥚',
        respiratory: '🫁',
        nervous: '🧠',
        digestive: '📋'
    };

    return (
        <div className="has-action-bar">
            <ProgressBar step={2} />

            <div className="container">
                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">Select Symptoms</h1>
                    <p className="page-subtitle">
                        Age: <strong>{selectedAgeGroup?.name || selectedAgeGroup?.label || 'All'}</strong>
                    </p>
                </div>

                {/* Search */}
                <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Selected summary */}
                {selectedSymptoms.length > 0 && (
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: '#ECFDF5',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        <span>
                            <strong>{selectedSymptoms.length}</strong> symptom(s) selected
                        </span>
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={clearSymptoms}
                        >
                            Clear All
                        </button>
                    </div>
                )}

                {/* Symptom Categories */}
                <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '1rem' }}>
                    {Object.entries(symptomCategories).map(([key, category]) => {
                        const filteredSympts = category.symptoms.filter(s =>
                            !searchTerm || s.toLowerCase().includes(searchTerm.toLowerCase())
                        );

                        // Hide empty categories when searching
                        if (filteredSympts.length === 0 && searchTerm) return null;

                        return (
                            <div
                                key={key}
                                className={`collapsible ${openCategories.includes(key) ? 'open' : ''}`}
                                style={{ marginBottom: '0.75rem' }}
                            >
                                <div
                                    className="collapsible-header"
                                    onClick={() => toggleCategory(key)}
                                >
                                    <div className="collapsible-title">
                                        <span style={{ fontSize: '1.25rem' }}>{categoryIcons[key] || '📋'}</span>
                                        {category.label}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                                            ({filteredSympts.length})
                                        </span>
                                    </div>
                                    <svg
                                        className="collapsible-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        width="20"
                                        height="20"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>

                                <div className="collapsible-content">
                                    <div className="collapsible-body">
                                        {filteredSympts.map(symptom => {
                                            const count = getSymptomCount(symptom);
                                            // Hide 0 count unless selected or searching
                                            if (count === 0 && !selectedSymptoms.includes(symptom) && !searchTerm) return null;

                                            return (
                                                <label
                                                    key={symptom}
                                                    className="checkbox-group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSymptoms.includes(symptom)}
                                                        onChange={() => toggleSymptom(symptom)}
                                                    />
                                                    <span className="checkbox-label">{symptom}</span>
                                                    <span className="checkbox-count">{count}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="action-bar">
                <div className="action-bar-content">
                    <div className="action-bar-info">
                        <span className="action-bar-count">{filteredDiseases.length}</span> possible diseases
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setStep(STEPS.AGE)}
                        >
                            ← Change Age
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleShowResults}
                            disabled={selectedSymptoms.length === 0}
                            style={{ opacity: selectedSymptoms.length === 0 ? 0.5 : 1 }}
                        >
                            Show Results →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SymptomSelection;

import { useState } from 'react';
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

function SymptomsPage() {
    const navigate = useNavigate();
    const {
        selectedAge,
        symptoms,
        selectedSymptoms,
        toggleSymptom,
        clearSymptoms,
        filteredDiseases
    } = useDiagnosis();

    const [openCategories, setOpenCategories] = useState(['mortality', 'digestive', 'respiratory', 'general']);
    const [searchTerm, setSearchTerm] = useState('');

    // Redirect if no age selected
    if (!selectedAge) {
        navigate('/age');
        return null;
    }

    const toggleCategory = (catId) => {
        setOpenCategories(prev =>
            prev.includes(catId)
                ? prev.filter(id => id !== catId)
                : [...prev, catId]
        );
    };

    const handleShowResults = () => {
        navigate('/results');
    };

    // Filter symptoms by search term
    const getFilteredSymptoms = (categorySymptoms) => {
        if (!searchTerm) return categorySymptoms;
        return categorySymptoms.filter(s =>
            s.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getCategoryIcon = (iconName) => {
        const icons = {
            'skull': '☠️',
            'droplet': '💧',
            'wind': '🫁',
            'brain': '🧠',
            'heart': '❤️',
            'palette': '🎨',
            'thermometer': '🌡️',
            'bone': '🦴',
            'eye': '👁️'
        };
        return icons[iconName] || '📋';
    };

    const selectedAgeGroup = AGE_GROUPS.find(a => a.id === selectedAge);

    return (
        <div className="has-action-bar">
            <ProgressBar step={2} />

            <div className="container">
                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">Select Symptoms</h1>
                    <p className="page-subtitle">
                        Age: <strong>{selectedAgeGroup?.name}</strong>
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

                {/* Selected symptoms summary */}
                {selectedSymptoms.length > 0 && (
                    <div style={{
                        maxWidth: '600px',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: '#E0ECFF',
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
                    {symptoms.categories?.map(category => {
                        const filteredSymptoms = getFilteredSymptoms(category.symptoms);
                        if (filteredSymptoms.length === 0 && searchTerm) return null;

                        return (
                            <div
                                key={category.id}
                                className={`collapsible ${openCategories.includes(category.id) ? 'open' : ''}`}
                            >
                                <div
                                    className="collapsible-header"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    <div className="collapsible-title">
                                        <span style={{ fontSize: '1.25rem' }}>{getCategoryIcon(category.icon)}</span>
                                        {category.name}
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: 'normal'
                                        }}>
                                            ({filteredSymptoms.length})
                                        </span>
                                    </div>
                                    <svg
                                        className="collapsible-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>

                                <div className="collapsible-content">
                                    <div className="collapsible-body">
                                        {filteredSymptoms.slice(0, 20).map(symptom => (
                                            <label
                                                key={symptom.id}
                                                className="checkbox-group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSymptoms.includes(symptom.label)}
                                                    onChange={() => toggleSymptom(symptom.label)}
                                                />
                                                <span className="checkbox-label">{symptom.label}</span>
                                                <span className="checkbox-count">{symptom.count}</span>
                                            </label>
                                        ))}
                                        {filteredSymptoms.length > 20 && (
                                            <div style={{
                                                padding: '0.5rem',
                                                textAlign: 'center',
                                                color: 'var(--text-muted)',
                                                fontSize: '0.875rem'
                                            }}>
                                                Showing top 20 of {filteredSymptoms.length} symptoms
                                            </div>
                                        )}
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
    );
}

export default SymptomsPage;

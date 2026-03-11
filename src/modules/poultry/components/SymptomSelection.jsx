import React, { useState, useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';

function ProgressBar({ step }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Body Part' },
        { num: 3, label: 'Symptoms' },
        { num: 4, label: 'Results' }
    ];

    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {steps.map(s => (
                    <div key={s.num} style={{ flex: 1, textAlign: 'center', padding: '0 2px' }}>
                        <div style={{
                            width: 'clamp(28px, 8vw, 40px)',
                            height: 'clamp(28px, 8vw, 40px)',
                            borderRadius: '50%',
                            background: step >= s.num ? '#10b981' : '#e5e7eb',
                            color: 'white',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: 'clamp(0.75rem, 3vw, 1rem)',
                            marginBottom: '0.35rem'
                        }}>
                            {s.num}
                        </div>
                        <div style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)', color: '#6b7280', lineHeight: 1.2 }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>
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
        ageGroups,
        bodyPartsWithSymptoms,  // ⭐ NEW - Get body parts with symptoms
        selectedBodyParts       // ⭐ NEW - Get selected body parts
    } = useDiagnosis();

    // ⭐ Get filtered symptoms based on selected body parts
    const allSymptoms = useMemo(() => {
        if (!bodyPartsWithSymptoms) return [];
        
        // If no body parts selected, show all symptoms
        if (selectedBodyParts.length === 0) {
            const symptomsSet = new Set();
            bodyPartsWithSymptoms.forEach(part => {
                if (part.symptoms) {
                    part.symptoms.forEach(s => symptomsSet.add(s));
                }
            });
            return Array.from(symptomsSet).sort();
        }
        
        // Filter symptoms by selected body parts
        const symptomsSet = new Set();
        selectedBodyParts.forEach(partId => {
            const bodyPart = bodyPartsWithSymptoms.find(p => p.id === partId);
            if (bodyPart && bodyPart.symptoms) {
                bodyPart.symptoms.forEach(s => symptomsSet.add(s));
            }
        });
        return Array.from(symptomsSet).sort();
    }, [bodyPartsWithSymptoms, selectedBodyParts]);

    const [openCategories, setOpenCategories] = useState(symptomCategories ? Object.keys(symptomCategories) : []);
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

    const selectedAgeGroup = ageGroups && ageGroups.find(a => a.id === selectedAge);

    const categoryIcons = {
        mortality: '',
        fever: '',
        locomotion: '',
        excretion: '',
        skin: '',
        production: '',
        respiratory: '',
        nervous: '',
        digestive: ''
    };

    return (
        <div className="has-action-bar">
            <div className="container">
                <div style={{ paddingTop: '2rem' }}>
                    <ProgressBar step={2} />
                </div>

                <div className="page-header" style={{ paddingBottom: '1rem' }}>
                    <h1 className="page-title">Select Symptoms</h1>
                    <p className="page-subtitle">
                        Age: <strong>{selectedAgeGroup?.name || selectedAgeGroup?.label || 'All'}</strong>
                    </p>
                    
                    {/* ⭐ NEW - Show body part filter info */}
                    {selectedBodyParts.length > 0 && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1rem',
                            background: '#EFF6FF',
                            borderRadius: '8px',
                            border: '1px solid #BFDBFE'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: '#1E40AF', marginBottom: '0.25rem' }}>
                                <strong>Filtered by body areas:</strong>
                            </div>
                            <div style={{ fontSize: '0.875rem', color: '#3B82F6' }}>
                                {selectedBodyParts.map(partId => {
                                    const part = bodyPartsWithSymptoms?.find(p => p.id === partId);
                                    return part?.name;
                                }).filter(Boolean).join(', ')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                                Showing {allSymptoms.length} relevant symptoms
                            </div>
                        </div>
                    )}
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
                    {symptomCategories && Object.entries(symptomCategories).map(([key, category]) => {
                        const symptoms = Array.isArray(category) ? category : (category.symptoms || []);
                        
                        // ⭐ Filter by both search term AND selected body parts
                        const filteredSympts = symptoms.filter(s => {
                            const matchesSearch = !searchTerm || s.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesBodyPart = allSymptoms.includes(s);
                            return matchesSearch && matchesBodyPart;
                        });

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
                                        <span style={{ fontSize: '1.25rem' }}>{categoryIcons[key] || ''}</span>
                                        {category.label || key.charAt(0).toUpperCase() + key.slice(1)}
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
                            onClick={() => setStep(STEPS.BODY_PART)}
                        >
                            ← Back to Body Parts
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleShowResults}
                            disabled={selectedSymptoms.length === 0}
                            style={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                border: 'none',
                                color: 'white',
                                opacity: selectedSymptoms.length === 0 ? 0.5 : 1
                            }}
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SymptomSelection;

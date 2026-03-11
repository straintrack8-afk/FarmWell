import React, { useState, useMemo } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import { getSeverityColor, getCategoryClass } from '../utils/diseaseFieldMapping';

function AllDiseases() {
    const { diseases, setStep, viewDiseaseDetail } = useDiagnosis();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSeverity, setSelectedSeverity] = useState('All');

    // Get unique categories and severities
    const categories = useMemo(() => {
        const cats = new Set(diseases.map(d => d.category).filter(Boolean));
        return ['All', ...Array.from(cats).sort()];
    }, [diseases]);

    const severities = useMemo(() => {
        const sevs = new Set(diseases.map(d => d.severity).filter(Boolean));
        return ['All', ...Array.from(sevs).sort()];
    }, [diseases]);

    // Filter diseases
    const filteredDiseases = useMemo(() => {
        return diseases.filter(disease => {
            const matchesSearch = !searchQuery || 
                disease.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || disease.category === selectedCategory;
            const matchesSeverity = selectedSeverity === 'All' || disease.severity === selectedSeverity;
            
            return matchesSearch && matchesCategory && matchesSeverity;
        });
    }, [diseases, searchQuery, selectedCategory, selectedSeverity]);

    const handleDiseaseClick = (disease) => {
        viewDiseaseDetail(disease);
        setStep(STEPS.DETAIL);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-primary)',
            paddingBottom: '2rem'
        }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        All Poultry Diseases & Conditions
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#6B7280' }}>
                        Browse and explore {diseases.length} diseases in our database
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        {/* Search */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                Search Disease
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Severity Filter */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                                Severity
                            </label>
                            <select
                                value={selectedSeverity}
                                onChange={(e) => setSelectedSeverity(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '2px solid #E5E7EB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    background: 'white'
                                }}
                            >
                                {severities.map(sev => (
                                    <option key={sev} value={sev}>{sev}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6B7280' }}>
                        Showing <strong>{filteredDiseases.length}</strong> of {diseases.length} diseases
                    </div>
                </div>

                {/* Disease Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem'
                }}>
                    {filteredDiseases.map(disease => (
                        <div
                            key={disease.id}
                            onClick={() => handleDiseaseClick(disease)}
                            style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1.25rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(16, 185, 129, 0.15)';
                                e.currentTarget.style.borderColor = '#10B981';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = 'transparent';
                            }}
                        >
                            {/* Disease Name */}
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                marginBottom: '0.75rem',
                                color: '#111827',
                                lineHeight: '1.4'
                            }}>
                                {disease.name}
                            </h3>

                            {/* Badges */}
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {/* Category */}
                                {disease.category && (
                                    <span className={getCategoryClass(disease.category)} style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {disease.category}
                                    </span>
                                )}

                                {/* Severity */}
                                {disease.severity && (
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: getSeverityColor(disease.severity) + '20',
                                        color: getSeverityColor(disease.severity)
                                    }}>
                                        {disease.severity}
                                    </span>
                                )}

                                {/* Zoonotic */}
                                {disease.zoonotic && (
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        background: '#FEE2E2',
                                        color: '#DC2626'
                                    }}>
                                        ⚠️ Zoonotic
                                    </span>
                                )}
                            </div>

                            {/* Description preview */}
                            {(disease.description || disease.deskripsi) && (
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#6B7280',
                                    lineHeight: '1.5',
                                    marginBottom: '0.75rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}>
                                    {disease.description || disease.deskripsi}
                                </p>
                            )}

                            {/* Age Groups */}
                            {disease.ageGroups && disease.ageGroups.length > 0 && (
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                    <strong>Affects:</strong> {disease.ageGroups.join(', ')}
                                </div>
                            )}

                            {/* Click to view */}
                            <div style={{
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #E5E7EB',
                                fontSize: '0.875rem',
                                color: '#10B981',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                View Details →
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results */}
                {filteredDiseases.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                            No diseases found
                        </h3>
                        <p style={{ color: '#6B7280' }}>
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}

                {/* Back Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setStep(STEPS.SYMPTOMS)}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem'
                        }}
                    >
                        ← Back to Symptom Selection
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AllDiseases;

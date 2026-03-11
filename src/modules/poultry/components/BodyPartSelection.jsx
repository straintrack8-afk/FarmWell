/**
 * BodyPartSelection Component
 * Step 2: Select affected body parts/systems and symptoms
 */

import React, { useMemo, useState } from 'react';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { BODY_PARTS } from '../utils/constants';
import './BodyPartSelection.css';

function ProgressBar({ step }) {
  const steps = [
    { num: 1, label: 'Age' },
    { num: 2, label: 'Body Part & Symptoms' },
    { num: 3, label: 'Results' }
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
        {steps.map((s, idx) => (
          <div key={s.num} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: s.num <= step ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#E5E7EB',
                color: s.num <= step ? 'white' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.5rem',
                fontWeight: '600',
                fontSize: '1.125rem'
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: s.num === step ? '600' : '400',
                color: s.num === step ? '#10B981' : '#6B7280'
              }}>
                {s.label}
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div style={{
                height: '2px',
                flex: 1,
                background: s.num < step ? '#10B981' : '#E5E7EB',
                marginTop: '-1.5rem'
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const BodyPartSelection = () => {
  const { 
    selectedSymptoms,
    toggleSymptom,
    clearSymptoms,
    calculateResults,
    viewDiseaseDetail,
    setStep,
    selectedAge,
    bodyPartsWithSymptoms,
    diseases,
    STEPS 
  } = useDiagnosis();

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleContinue = () => {
    // Calculate results before showing results page
    calculateResults();
    setStep(STEPS.RESULTS);
  };

  const handleBack = () => {
    setStep(STEPS.AGE);
  };

  // Real-time disease matching as symptoms are selected
  const possibleDiseases = useMemo(() => {
    if (selectedSymptoms.length === 0 || !diseases) return [];

    const scored = diseases.map(disease => {
      const symptomsArray = disease.symptomsEnhanced || disease.symptoms || [];
      
      let matchedSymptoms = [];
      let totalWeight = 0;
      let matchedWeight = 0;
      
      symptomsArray.forEach(symptom => {
        const symptomName = typeof symptom === 'string' ? symptom : symptom.name;
        const symptomWeight = typeof symptom === 'object' ? (symptom.weight || 0.5) : 0.5;
        
        totalWeight += symptomWeight;
        
        if (selectedSymptoms.includes(symptomName)) {
          matchedSymptoms.push(symptomName);
          matchedWeight += symptomWeight;
        }
      });
      
      const matchCount = matchedSymptoms.length;
      const percentage = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0;

      return {
        ...disease,
        matchCount,
        percentage: Math.round(percentage * 10) / 10
      };
    });

    const filtered = scored.filter(d => d.matchCount > 0);
    // Sort by percentage first (highest first), then by match count
    const sorted = filtered.sort((a, b) => {
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      return b.matchCount - a.matchCount;
    });

    return sorted.slice(0, 10); // Top 10 matches
  }, [selectedSymptoms, diseases]);

  // Filter symptoms by search term
  const filteredBodyParts = useMemo(() => {
    if (!bodyPartsWithSymptoms) return [];
    
    if (!searchTerm) return bodyPartsWithSymptoms;
    
    return bodyPartsWithSymptoms.map(part => ({
      ...part,
      symptoms: part.symptoms.filter(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(part => part.symptoms.length > 0);
  }, [bodyPartsWithSymptoms, searchTerm]);

  return (
    <div className="body-part-selection">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <ProgressBar step={2} />
        
        {/* Header */}
        <div className="step-header" style={{ marginBottom: '1.5rem' }}>
          <h2 className="step-title">Select Symptoms</h2>
          <p className="step-subtitle">
            Search and select symptoms you observe
            {selectedAge && <span className="age-badge"> • Age: {selectedAge}</span>}
          </p>
        </div>

      {/* 3-BOX LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        
        {/* BOX 1: Search and Select Symptoms */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#0EA5E9', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>1</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Search All Symptom(s)</span>
          </div>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              width: '100%'
            }}
          />

          {/* Symptoms List by Category - Accordion Style */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredBodyParts.map((part) => {
              const isExpanded = expandedCategories[part.id];
              const categorySymptomCount = part.symptoms.length;
              
              return (
              <div key={part.id} style={{ marginBottom: '0.5rem' }}>
                {/* Category Header - Clickable */}
                <div
                  onClick={() => toggleCategory(part.id)}
                  style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151',
                    padding: '0.75rem',
                    background: isExpanded ? '#F0FDF4' : '#F9FAFB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #E5E7EB',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isExpanded ? '#F0FDF4' : '#F3F4F6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isExpanded ? '#F0FDF4' : '#F9FAFB';
                  }}
                >
                  <span>{part.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6B7280',
                      background: '#E5E7EB',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px'
                    }}>
                      {categorySymptomCount}
                    </span>
                    <span style={{ fontSize: '1rem' }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                
                {/* Symptoms List - Collapsible */}
                {isExpanded && (
                  <div style={{ paddingLeft: '0.5rem', marginTop: '0.5rem' }}>
                    {part.symptoms.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <div
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '6px',
                        background: isSelected ? '#F0FDF4' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ 
                        fontSize: '0.8125rem',
                        color: isSelected ? '#059669' : '#374151',
                        fontWeight: isSelected ? '500' : '400'
                      }}>
                        {symptom}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSymptom(symptom);
                        }}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isSelected ? '#10B981' : '#EF4444',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
                    </div>
                  );
                })}
                  </div>
                )}
              </div>
            );
            })}
          </div>
        </div>

        {/* BOX 2: Selected Symptoms */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#0EA5E9', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>2</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Selected Symptom(s)</span>
            </div>
            {selectedSymptoms.length > 0 && (
              <button
                onClick={clearSymptoms}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {selectedSymptoms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                <p style={{ fontSize: '0.875rem' }}>No symptoms selected</p>
              </div>
            ) : (
              selectedSymptoms.map((symptom) => (
                <div
                  key={symptom}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: '#F0FDF4',
                    border: '1px solid #10B981',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.8125rem',
                    color: '#059669',
                    fontWeight: '500',
                    flex: 1
                  }}>
                    {symptom}
                  </span>
                  <button
                    onClick={() => toggleSymptom(symptom)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#06B6D4',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOX 3: Possible Conditions */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            background: '#0EA5E9', 
            color: 'white', 
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '600' }}>3</span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Possible Condition(s)</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {possibleDiseases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
                <p style={{ fontSize: '0.875rem' }}>Select symptoms to see possible diseases</p>
              </div>
            ) : (
              possibleDiseases.map((disease) => (
                <div
                  key={disease.id}
                  onClick={() => viewDiseaseDetail(disease)}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '0.75rem',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F0FDF4';
                    e.currentTarget.style.borderColor = '#10B981';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F9FAFB';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      flex: 1
                    }}>
                      {disease.name}
                    </span>
                    <div style={{
                      width: '60px',
                      height: '6px',
                      background: '#E5E7EB',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginLeft: '0.5rem'
                    }}>
                      <div style={{
                        width: `${Math.min(disease.percentage, 100)}%`,
                        height: '100%',
                        background: disease.percentage >= 70 ? '#10B981' : disease.percentage >= 40 ? '#F59E0B' : '#EF4444',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {disease.percentage.toFixed(1)}% confidence
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-secondary"
        >
          ← Back to Age
        </button>

        <button
          type="button"
          onClick={() => setStep(STEPS.ALL_DISEASES)}
          className="btn btn-primary"
        >
          Show All Diseases/Conditions →
        </button>
      </div>
      </div>
    </div>
  );
};

export default BodyPartSelection;

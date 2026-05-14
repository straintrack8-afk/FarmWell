import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import '../styles/DiseaseDiagnosis.css';
import PoultryTopNav from './common/PoultryTopNav';

const CatIcons = {
  respiratory: () => (
    <svg viewBox="0 0 24 24"><path d="M6 4v6a6 6 0 0012 0V4"/><path d="M6 4a2 2 0 014 0"/><path d="M14 4a2 2 0 014 0"/><path d="M9 14c0 3 1.5 5 3 6"/><path d="M15 14c0 3-1.5 5-3 6"/></svg>
  ),
  digestive: () => (
    <svg viewBox="0 0 24 24"><path d="M8 4c0 0-2 2-2 6s2 6 2 6"/><path d="M16 4c0 0 2 2 2 6s-2 6-2 6"/><path d="M8 10h8"/><path d="M8 14h8"/><path d="M10 18c0 2 1 3 2 3s2-1 2-3"/></svg>
  ),
  musculoskeletal: () => (
    <svg viewBox="0 0 24 24"><path d="M6 6c0-1.1.9-2 2-2h1v3H8a2 2 0 01-2-2z"/><path d="M18 6a2 2 0 01-2 2h-1V5h1a2 2 0 012 2z"/><path d="M9 7h6v10H9z"/><path d="M8 16H7a2 2 0 000 4h1v-3"/><path d="M16 16h1a2 2 0 010 4h-1v-3"/></svg>
  ),
  integumentary: () => (
    <svg viewBox="0 0 24 24"><path d="M12 3c-1 0-2 .5-2 1.5S11 6 12 6s2-.5 2-1.5S13 3 12 3z"/><path d="M14 4c1-1 3-1 4-.5"/><path d="M8 6C6 7 4 9 4 12c0 2 1 3.5 3 4.5"/><path d="M16 6c2 1 4 3 4 6 0 2-1 3.5-3 4.5"/><ellipse cx="12" cy="16" rx="5" ry="4"/></svg>
  ),
  reproductive: () => (
    <svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="5" ry="6"/><path d="M12 8V4"/><path d="M9 6l3-3 3 3"/></svg>
  ),
  general: () => (
    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
};

function DiagnosisSteps({ currentStep }) {
    const steps = [
        { num: 1, label: 'Age' },
        { num: 2, label: 'Symptoms' },
        { num: 3, label: 'Results' },
    ];
    return (
        <div className="fw-mod-steps">
            {steps.map((step, i) => (
                <React.Fragment key={step.num}>
                    <div className="fw-mod-step">
                        <div className={`fw-mod-step-circle ${currentStep > step.num ? 'done' : currentStep === step.num ? 'active' : 'pending'}`}>
                            {currentStep > step.num ? '✓' : step.num}
                        </div>
                        <div className={`fw-mod-step-label${currentStep === step.num ? ' active' : ''}`}>
                            {step.label}
                        </div>
                    </div>
                    {i < steps.length - 1 && (
                        <div className={`fw-mod-step-line${currentStep > step.num ? ' done' : ''}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

const BodyPartSelectionNew = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const {
    symptomCategories,
    selectedSymptoms,
    selectedAge,
    results,
    toggleSymptom,
    clearSymptoms,
    calculateResults,
    viewDiseaseDetail,
    previousStep,
  } = useDiagnosis();

  const [currentStep, setCurrentStep] = useState(2);
  const [activeCategory, setActiveCategory] = useState('head_respiratory');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileTab, setMobileTab] = useState('symptoms');
  const [showResults, setShowResults] = useState(false);

  const ageLabel = selectedAge || 'All ages';

  const handleToggleSym = (symptom) => {
    toggleSymptom(symptom);
    setTimeout(() => calculateResults(), 0);
  };

  const handleClearAll = () => {
    clearSymptoms();
    setTimeout(() => calculateResults(), 0);
  };

  const selectCategory = (catId) => {
    setActiveCategory(catId);
    setSearchTerm('');
    if (window.innerWidth <= 640) {
      setMobileTab('symptoms');
    }
  };

  useEffect(() => {
    if (selectedSymptoms.length > 0) {
      calculateResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSymptoms.length]);

  const getCategorySelectedCount = (catId) => {
    if (!symptomCategories || !symptomCategories[catId]) return 0;
    const catData = symptomCategories[catId];
    return selectedSymptoms.filter(selSym => {
      return catData.symptoms.some(catSym => {
        const catSymName = typeof catSym === 'string' ? catSym : catSym.name || catSym;
        const selSymName = typeof selSym === 'string' ? selSym : selSym.name || selSym;
        return catSymName === selSymName;
      });
    }).length;
  };

  const handleDiseaseClick = (disease) => {
    viewDiseaseDetail(disease);
    navigate('/poultry/diagnostic/detail');
  };

  const totalSelected = selectedSymptoms ? selectedSymptoms.length : 0;

  return (
    <div className="fw-module-page">
      <PoultryTopNav title="Disease Diagnosis" />

      <div className="fw-mod-card">
        <DiagnosisSteps currentStep={2} />

        <div className="fw-mod-content">

          {/* Age + count tag */}
          <div className="fw-age-tag">
            ✓ {ageLabel} · {totalSelected} {totalSelected === 1 ? 'symptom' : 'symptoms'} selected
          </div>

          {/* Search */}
          <div className="fw-sym-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search symptoms..."
            />
          </div>

          {/* Category grid */}
          <div className="fw-welcome-section-label">Body System</div>
          <div className="fw-cat-grid">
            {Object.entries(symptomCategories || {}).map(([catId, catData]) => {
              const Icon = CatIcons[catId] || CatIcons.general;
              const isActive = activeCategory === catId;
              const catSymCount = selectedSymptoms?.filter(selSym => {
                return catData.symptoms?.some(catSym => {
                  const catSymName = typeof catSym === 'string' ? catSym : catSym.name || catSym;
                  const selSymName = typeof selSym === 'string' ? selSym : selSym.name || selSym;
                  return catSymName === selSymName;
                });
              }).length || 0;
              return (
                <div
                  key={catId}
                  className={`fw-cat-card${isActive ? ' active' : ''}`}
                  onClick={() => selectCategory(catId)}
                >
                  {catSymCount > 0 && <div className="fw-cat-badge">{catSymCount}</div>}
                  <Icon />
                  <div className="fw-cat-name">
                    {typeof catData.label === 'string' ? catData.label : catData.label?.[language] || catId}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Symptoms for active category */}
          {activeCategory && symptomCategories?.[activeCategory] && (
            <div className="fw-sym-chips-wrap">
              {(symptomCategories[activeCategory].symptoms || [])
                .filter(sym => {
                  if (!searchTerm) return true;
                  const symName = typeof sym === 'string' ? sym : sym.name || sym;
                  return symName.toLowerCase().includes(searchTerm.toLowerCase());
                })
                .map((sym, i) => {
                  const symName = typeof sym === 'string' ? sym : sym.name || sym;
                  const isSelected = selectedSymptoms?.some(s => {
                    const sName = typeof s === 'string' ? s : s.name || s;
                    return sName === symName;
                  });
                  return (
                    <div
                      key={sym.id || i}
                      className={`fw-sym-chip${isSelected ? ' selected' : ''}`}
                      onClick={() => handleToggleSym(sym)}
                    >
                      {symName}
                    </div>
                  );
                })}
            </div>
          )}

          {/* Selected bar */}
          {totalSelected > 0 && (
            <div className="fw-sym-selected-bar">
              <span className="fw-sym-selected-label">Selected symptoms</span>
              <span className="fw-sym-selected-count">{totalSelected}</span>
              <button className="fw-sym-clear-btn" onClick={handleClearAll}>Clear all</button>
            </div>
          )}

          {/* See Results */}
          <button
            className="fw-see-results-btn"
            disabled={totalSelected === 0}
            onClick={() => {
              calculateResults();
              navigate('/poultry/diagnostic/results');
            }}
          >
            See Results →
          </button>

        </div>

        <div className="fw-mod-bnav">
          <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
            <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </button>
          <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry/diagnostic')}>
            <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
            <span>Diagnostic</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BodyPartSelectionNew;

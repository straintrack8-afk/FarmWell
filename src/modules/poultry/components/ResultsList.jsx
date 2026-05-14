import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { STEPS } from '../utils/constants';
import DiagnosisDisclaimer from './DiagnosisDisclaimer';
import PoultryTopNav from './common/PoultryTopNav';
import { useLanguage } from '../../../contexts/LanguageContext';

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

const getCategoryBadgeClass = (category) => {
    const map = {
        'Viral': 'fw-badge-viral',
        'Bacterial': 'fw-badge-bacterial',
        'Parasitic': 'fw-badge-parasitic',
        'Fungal': 'fw-badge-fungal',
    };
    return map[category] || 'fw-badge-other';
};

function ResultsList() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const {
        results,  // ⭐ Use results instead of filteredDiseases
        selectedSymptoms,
        selectedAge,
        ageGroups,
        setStep,
        viewDiseaseDetail,
        reset
    } = useDiagnosis();

    const selectedAgeGroup = ageGroups.find(a => a.id === selectedAge);

    const handleDiseaseClick = (disease) => {
        viewDiseaseDetail(disease);
    };

    const handleNewDiagnosis = () => {
        reset();
        setStep(STEPS.LANDING);
    };

    const handleRefineSymptoms = () => {
        setStep(STEPS.BODY_PART);
    };

    return (
        <div className="fw-module-page">
            <PoultryTopNav title="Disease Diagnosis" />

            <div className="fw-mod-card">
                <DiagnosisSteps currentStep={3} />

                <div className="fw-mod-content">
                    <div className="fw-results-title">Possible Conditions</div>

                    {(!results || results.length === 0) ? (
                        <div className="fw-disease-empty">
                            <div className="fw-disease-empty-title">No matches found</div>
                            <div className="fw-disease-empty-sub">Try selecting different symptoms</div>
                        </div>
                    ) : (
                        results.map((disease, index) => {
                            const name = typeof disease.name === 'string'
                                ? disease.name
                                : disease.name?.[language] || disease.name?.en || disease.name || 'Unknown';
                            const score = disease.percentage || disease.score || disease.confidence || 0;
                            const pct = Math.round(score);
                            const category = disease.category || disease.type || '';
                            const isTop = index === 0;

                            return (
                                <div
                                    key={disease.id || index}
                                    className={`fw-result-card${isTop ? ' top-result' : ''}`}
                                    onClick={() => {
                                        viewDiseaseDetail(disease);
                                        navigate('/poultry/diagnostic/detail');
                                    }}
                                >
                                    <div className={`fw-result-rank${isTop ? ' top' : ''}`}>{index + 1}</div>
                                    <div className="fw-result-info">
                                        <div className="fw-result-name">{name}</div>
                                        <div className="fw-result-bar-wrap">
                                            <div className="fw-result-bar" style={{ width: `${pct}%` }} />
                                        </div>
                                        {category && (
                                            <span className={`fw-disease-badge ${getCategoryBadgeClass(category)}`}>
                                                {category}
                                            </span>
                                        )}
                                    </div>
                                    <div className={`fw-result-pct${pct < 20 ? ' low' : ''}`}>{pct}%</div>
                                </div>
                            );
                        })
                    )}

                    {/* Back to symptoms */}
                    <button
                        className="fw-back-symptoms-btn"
                        onClick={() => {
                            setStep(STEPS.SYMPTOMS);
                            navigate('/poultry/diagnostic/symptoms');
                        }}
                    >
                        ← Back to Symptoms
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
}

export default ResultsList;

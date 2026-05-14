import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../contexts/DiagnosisContext';
import { useTranslation } from '../../../hooks/useTranslation';
import { useLanguage } from '../../../contexts/LanguageContext';
import { STEPS } from '../utils/constants';
import PoultryTopNav from './common/PoultryTopNav';

const DiagnosticToolsIcon = () => (
    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'white', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
    </svg>
);

const AgeIconAll = () => (
    <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 2C9 2 7 5 7 8c0 2 .8 3.5 2 4.5"/>
        <path d="M12 2c3 0 5 3 5 6 0 2-.8 3.5-2 4.5"/>
        <ellipse cx="12" cy="16" rx="5" ry="4"/>
        <path d="M9 20l-.5 2M15 20l.5 2"/>
        <path d="M9 14h.01M15 14h.01"/>
    </svg>
);

const AgeIconChick = () => (
    <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <ellipse cx="12" cy="15" rx="4" ry="3.5"/>
        <path d="M10 19l-.5 2M14 19l.5 2"/>
        <circle cx="12" cy="8" r="3"/>
        <path d="M10 7l-2-2M14 7l2-2"/>
        <path d="M10 10c0 2 1 3 2 4"/>
    </svg>
);

const AgeIconGrower = () => (
    <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 3c-1 0-2 .5-2 1.5S11 6 12 6s2-.5 2-1.5S13 3 12 3z"/>
        <path d="M8 6C6 7 5 9 5 11c0 1.5.5 2.8 1.5 3.8"/>
        <path d="M16 6c2 1 3 3 3 5 0 1.5-.5 2.8-1.5 3.8"/>
        <ellipse cx="12" cy="16" rx="5" ry="4"/>
        <path d="M9 20l-.5 2M15 20l.5 2"/>
    </svg>
);

const AgeIconAdult = () => (
    <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
        <path d="M12 2c-1 0-2 .5-2 1.5S11 5 12 5s2-.5 2-1.5S13 2 12 2z"/>
        <path d="M14 3c1-1 3-1.5 4-1"/>
        <path d="M8 5C6 5 3 7.5 3 10c0 2 1 3.5 3 4.5"/>
        <path d="M16 5c2 0 5 2.5 5 5 0 2-1 3.5-3 4.5"/>
        <ellipse cx="12" cy="16" rx="6" ry="5"/>
        <path d="M9 21l-1 2M15 21l1 2"/>
        <path d="M9 14h.01M15 14h.01"/>
    </svg>
);

function DiagnosisSteps({ currentStep, t }) {
    const steps = [
        { num: 1, label: t('poultry.diagnosis.steps.age') || 'Age' },
        { num: 2, label: t('poultry.diagnosis.steps.bodyPartSymptoms') || 'Symptoms' },
        { num: 3, label: t('poultry.diagnosis.steps.results') || 'Results' },
    ];
    return (
        <div className="fw-mod-steps">
            {steps.map((step, i) => (
                <React.Fragment key={step.num}>
                    <div className="fw-mod-step">
                        <div className={`fw-mod-step-circle ${currentStep > step.num ? 'done' : currentStep === step.num ? 'active' : 'pending'}`}>
                            {step.num}
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

function AgeSelection() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { language } = useLanguage();
    const {
        selectedAge,
        setAge,
        setStep,
        ageGroups
    } = useDiagnosis();

    const ageIcons = {
        0: <AgeIconAll />,
        1: <AgeIconChick />,
        2: <AgeIconGrower />,
        3: <AgeIconAdult />,
    };

    return (
        <div className="fw-module-page">
            <PoultryTopNav title="Disease Diagnosis" />

            <div className="fw-mod-card">
                <DiagnosisSteps currentStep={1} t={t} />

                <div className="fw-mod-content">
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--fw-text)', marginBottom: '4px' }}>
                            {t('poultry.diagnosis.selectAge') || 'Select Age Group'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--fw-sub)' }}>
                            {t('poultry.diagnosis.selectAgeSubtitle') || 'Choose the age group of the affected birds'}
                        </div>
                    </div>

                    <div className="fw-animal-grid">
                        {ageGroups.map((group, index) => {
                            const isSelected = selectedAge === group.id || selectedAge === group.value;
                            return (
                                <div
                                    key={group.id || group.value || index}
                                    className={`fw-animal-card${isSelected ? ' selected' : ''}`}
                                    onClick={() => {
                                        setAge(group.id || group.value);
                                        setStep(STEPS.SYMPTOMS);
                                        navigate('/poultry/diagnostic/symptoms');
                                    }}
                                >
                                    <div className="fw-animal-card-icon">
                                        {ageIcons[index] || <AgeIconGrower />}
                                    </div>
                                    <div className="fw-animal-card-name">
                                        {group.label?.[language] || group.label || group.name || group.id}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="fw-mod-bnav">
                    <button className="fw-mod-bnav-home" onClick={() => navigate('/')}>
                        <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                    </button>
                    <button className="fw-mod-bnav-alerts" onClick={() => navigate('/poultry/diagnostic')}>
                        <DiagnosticToolsIcon />
                        <span>Diagnostic</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AgeSelection;

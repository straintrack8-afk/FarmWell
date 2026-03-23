import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHatcheryAudit } from '../../../contexts/HatcheryAuditContext';
import { AUDIT_STEPS } from '../../../utils/hatcheryConstants';
import { useLanguage } from "../../../../../contexts/LanguageContext";
import Step1_AuditInfo from './steps/Step1_AuditInfo';
import Step2_VaccineStorage from './steps/Step2_VaccineStorage';
import Step3_Equipment from './steps/Step3_Equipment';
import Step4_Techniques from './steps/Step4_Techniques';
import Step5_SamplePlan from './steps/Step5_SamplePlan';
import Step6_SampleCollection from './steps/Step6_SampleCollection';
import Step7_Incubation from './steps/Step7_Incubation';
import Step8_Results from './steps/Step8_Results';
import Step9_Review from './steps/Step9_Review';
import '../../../hatchery.css';

function AuditWizard() {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { currentAudit, updateCurrentAudit, completeAudit, discardCurrentAudit } = useHatcheryAudit();

    const translations = {
        // Step labels for progress indicator
        steps: {
            info: {
                en: "Info",
                id: "Info",
                vi: "Thông tin"
            },
            vaccineStorage: {
                en: "Vaccine Storage",
                id: "Penyimpanan Vaksin",
                vi: "Bảo quản Vắc-xin"
            },
            equipment: {
                en: "Equipment",
                id: "Peralatan",
                vi: "Thiết bị"
            },
            techniques: {
                en: "Techniques",
                id: "Teknik",
                vi: "Kỹ thuật"
            },
            samplePlan: {
                en: "Sample Plan",
                id: "Rencana Sampel",
                vi: "Kế hoạch Lấy mẫu"
            },
            collection: {
                en: "Collection",
                id: "Pengumpulan",
                vi: "Thu thập"
            },
            incubation: {
                en: "Incubation",
                id: "Inkubasi",
                vi: "Ấp trứng"
            },
            results: {
                en: "Results",
                id: "Hasil",
                vi: "Kết quả"
            },
            review: {
                en: "Review",
                id: "Tinjauan",
                vi: "Xem lại"
            }
        },
        
        // Global buttons
        buttons: {
            saveDraft: {
                en: "Save Draft",
                id: "Simpan Draf",
                vi: "Lưu Bản nháp"
            },
            discard: {
                en: "Discard",
                id: "Buang",
                vi: "Hủy bỏ"
            },
            previous: {
                en: "Previous",
                id: "Sebelumnya",
                vi: "Trước"
            },
            next: {
                en: "Next",
                id: "Berikutnya",
                vi: "Tiếp theo"
            },
            submit: {
                en: "Submit",
                id: "Kirim",
                vi: "Gửi"
            }
        },
        
        // Step header
        stepHeader: {
            en: "Step",
            id: "Langkah",
            vi: "Bước"
        },
        of: {
            en: "of",
            id: "dari",
            vi: "của"
        }
    };

    if (!currentAudit) {
        return (
            <div className="hatchery-container">
                <div className="hatchery-card">
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                        <h2>No Active Audit</h2>
                        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                            Please start a new audit from the dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/poultry/hatchery-audit')}
                            className="btn-hatchery btn-primary"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentStep = currentAudit.currentStep || AUDIT_STEPS.INFO;

    const steps = [
        { key: AUDIT_STEPS.INFO, label: translations.steps.info[language], number: 1 },
        { key: AUDIT_STEPS.VACCINE_STORAGE, label: translations.steps.vaccineStorage[language], number: 2 },
        { key: AUDIT_STEPS.EQUIPMENT, label: translations.steps.equipment[language], number: 3 },
        { key: AUDIT_STEPS.TECHNIQUES, label: translations.steps.techniques[language], number: 4 },
        { key: AUDIT_STEPS.SAMPLE_PLAN, label: translations.steps.samplePlan[language], number: 5 },
        { key: AUDIT_STEPS.SAMPLE_COLLECTION, label: translations.steps.collection[language], number: 6 },
        { key: AUDIT_STEPS.INCUBATION, label: translations.steps.incubation[language], number: 7 },
        { key: AUDIT_STEPS.RESULTS, label: translations.steps.results[language], number: 8 },
        { key: AUDIT_STEPS.REVIEW, label: translations.steps.review[language], number: 9 }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === currentStep);
    const currentStepNumber = currentStepIndex + 1;

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            updateCurrentAudit({ currentStep: steps[currentStepIndex + 1].key });
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            updateCurrentAudit({ currentStep: steps[currentStepIndex - 1].key });
        }
    };

    const handleGoToStep = (stepKey) => {
        updateCurrentAudit({ currentStep: stepKey });
    };

    const handleSaveDraft = () => {
        navigate('/poultry/hatchery-audit');
    };

    const handleComplete = async () => {
        const result = await completeAudit();
        if (result.success) {
            navigate('/poultry/hatchery-audit');
        } else {
            alert('Error completing audit: ' + result.error);
        }
    };

    const handleDiscard = () => {
        if (confirm('Are you sure you want to discard this audit? All data will be lost.')) {
            discardCurrentAudit();
            navigate('/poultry/hatchery-audit');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case AUDIT_STEPS.INFO:
                return <Step1_AuditInfo />;
            case AUDIT_STEPS.VACCINE_STORAGE:
                return <Step2_VaccineStorage />;
            case AUDIT_STEPS.EQUIPMENT:
                return <Step3_Equipment />;
            case AUDIT_STEPS.TECHNIQUES:
                return <Step4_Techniques />;
            case AUDIT_STEPS.SAMPLE_PLAN:
                return <Step5_SamplePlan />;
            case AUDIT_STEPS.SAMPLE_COLLECTION:
                return <Step6_SampleCollection />;
            case AUDIT_STEPS.INCUBATION:
                return <Step7_Incubation />;
            case AUDIT_STEPS.RESULTS:
                return <Step8_Results />;
            case AUDIT_STEPS.REVIEW:
                return <Step9_Review />;
            default:
                return <div>Unknown step</div>;
        }
    };

    return (
        <div className="hatchery-container">
            {/* Header */}
            <div className="hatchery-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                            {currentAudit.auditNumber || 'New Audit'}
                        </h1>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                            {translations.stepHeader[language]} {currentStepNumber} {translations.of[language]} {steps.length}: {steps[currentStepIndex]?.label}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleSaveDraft} className="btn-hatchery btn-primary">
                            {translations.buttons.saveDraft[language]}
                        </button>
                        <button onClick={handleDiscard} className="btn-hatchery btn-danger">
                            {translations.buttons.discard[language]}
                        </button>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="step-indicator">
                    {steps.map((step, index) => (
                        <div
                            key={step.key}
                            className={`step-item ${index < currentStepIndex ? 'completed' : ''} ${index === currentStepIndex ? 'active' : ''}`}
                            onClick={() => handleGoToStep(step.key)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="step-circle">
                                {index < currentStepIndex ? '' : step.number}
                            </div>
                            <div className="step-label">{step.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="hatchery-card">
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="btn-group" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '2px solid #E5E7EB' }}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                        className="btn-hatchery btn-primary"
                    >
                        {translations.buttons.previous[language]}
                    </button>

                    <div style={{ flex: 1 }} />

                    {currentStepIndex === steps.length - 1 ? (
                        <button
                            onClick={handleComplete}
                            className="btn-hatchery btn-success"
                        >
                            {translations.buttons.submit[language]}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="btn-hatchery btn-primary"
                        >
                            {translations.buttons.next[language]}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuditWizard;

import React from 'react';
import { getLocalizedText } from '../../utils/assessmentUtils';

function QuestionCard({ question, answer, onAnswerChange, language, showValidation = false }) {
    if (!question) return null;

    const questionText = getLocalizedText(question.question, language);
    const isRequired = question.required;
    const isAnswered = answer !== undefined && answer !== null && answer !== '';
    const hasRisks = question.disease_risks && question.disease_risks.length > 0;

    const handleOptionChange = (optionId) => {
        onAnswerChange(optionId);
    };

    const handleNumberChange = (value) => {
        if (value === '') {
            onAnswerChange('');
            return;
        }
        const numeric = Number(value);
        onAnswerChange(Number.isNaN(numeric) ? '' : numeric);
    };

    return (
        <div className="question-card">
            <div className="question-header">
                <h3 className="question-text">
                    {questionText}
                    {isRequired && <span className="required-indicator">*</span>}
                </h3>
                {hasRisks && (
                    <div className="risk-badge">
                        <span className="risk-icon">⚠️</span>
                        <span className="risk-text">Disease Risk Factor</span>
                    </div>
                )}
            </div>

            <div className="question-options">
                {question.answer_type === 'number_input' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input
                            type="number"
                            value={answer ?? ''}
                            min={question.validation?.min}
                            max={question.validation?.max}
                            onChange={(e) => handleNumberChange(e.target.value)}
                            className="option-input"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #e5e7eb',
                                fontSize: '1rem'
                            }}
                        />
                        {(question.validation?.min !== undefined || question.validation?.max !== undefined) && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {language === 'vi' && 'Giá trị hợp lệ: '}
                                {language === 'en' && 'Valid range: '}
                                {language === 'id' && 'Rentang valid: '}
                                {question.validation?.min ?? '—'} - {question.validation?.max ?? '—'}
                            </div>
                        )}
                    </div>
                ) : (
                    (question.options || []).map((option) => {
                        const optionLabel = getLocalizedText(option.label, language);
                        const isSelected = answer === option.id;

                        return (
                            <label
                                key={option.id}
                                className={`option-label ${isSelected ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name={question.id}
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => handleOptionChange(option.id)}
                                    className="option-input"
                                />
                                <span className="option-text">{optionLabel}</span>
                            </label>
                        );
                    })
                )}

                {question.answer_type !== 'number_input' && (!question.options || question.options.length === 0) && (
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {language === 'vi' && 'Không có lựa chọn cho câu hỏi này.'}
                        {language === 'en' && 'No options available for this question.'}
                        {language === 'id' && 'Tidak ada opsi untuk pertanyaan ini.'}
                    </div>
                )}
            </div>

            {showValidation && isRequired && !isAnswered && (
                <div className="validation-message">
                    <span className="validation-icon">⚠️</span>
                    <span className="validation-text">
                        {language === 'vi' && 'Câu hỏi này bắt buộc phải trả lời'}
                        {language === 'en' && 'This question is required'}
                        {language === 'id' && 'Pertanyaan ini wajib dijawab'}
                    </span>
                </div>
            )}

            {/* Risk Identification Box */}
            {answer && question.risk_assessment && (() => {
                let showRiskWarning = false;
                
                if (question.answer_type === 'number_input') {
                    const numericAnswer = Number(answer);
                    const triggerScore = question.risk_assessment.trigger_score;
                    showRiskWarning = !isNaN(numericAnswer) && numericAnswer <= triggerScore;
                } else if (question.answer_type === 'single_choice') {
                    const selectedOption = question.options?.find(opt => opt.id === answer);
                    const triggerScore = question.risk_assessment.trigger_score || 5;
                    showRiskWarning = selectedOption && (selectedOption.score || 0) <= triggerScore;
                }

                if (!showRiskWarning) return null;

                return (
                    <div style={{
                        padding: '1rem',
                        background: '#fef2f2',
                        border: '2px solid #fecaca',
                        borderRadius: '8px',
                        marginTop: '1rem'
                    }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                            <div>
                                <div style={{ fontWeight: '600', color: '#991b1b', marginBottom: '0.5rem' }}>
                                    {language === 'vi' && 'Nguy cơ đã xác định'}
                                    {language === 'en' && 'Risk Identified'}
                                    {language === 'id' && 'Risiko Teridentifikasi'}
                                </div>
                                <p style={{ fontSize: '0.875rem', color: '#7f1d1d', margin: 0 }}>
                                    {getLocalizedText(question.risk_assessment.risk_description, language)}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {hasRisks && answer && (
                <div className="risk-info">
                    {question.disease_risks
                        .filter(risk => risk.trigger === answer)
                        .map((risk, index) => (
                            <div key={index} className={`risk-alert risk-${risk.risk_level}`}>
                                <span className="risk-level-badge">{risk.risk_level.toUpperCase()}</span>
                                <span className="risk-disease">
                                    {language === 'vi' && 'Nguy cơ: '}
                                    {language === 'en' && 'Risk: '}
                                    {language === 'id' && 'Risiko: '}
                                    {risk.disease}
                                </span>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default QuestionCard;

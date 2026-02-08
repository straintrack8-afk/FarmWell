import React from 'react';

/**
 * Reusable component for rendering different question types
 * Supports: single_choice, multiple_choice, numeric, text
 */
function QuestionRenderer({ question, value, onChange, language = 'en' }) {
    const { type, text, help_text, options, validation } = question;

    const handleSingleChoiceChange = (optionValue) => {
        onChange(optionValue);
    };

    const handleMultipleChoiceChange = (optionValue) => {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
            ? currentValues.filter(v => v !== optionValue)
            : [...currentValues, optionValue];
        onChange(newValues);
    };

    const handleNumericChange = (e) => {
        const numValue = parseFloat(e.target.value);
        onChange(isNaN(numValue) ? '' : numValue);
    };

    const handleTextChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div className="question-container" style={{ marginBottom: '2rem' }}>
            {/* Question Text */}
            <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {text}
                </h3>
                {help_text && (
                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        padding: '0.75rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--primary)'
                    }}>
                        ℹ️ {help_text}
                    </p>
                )}
            </div>

            {/* Question Input Based on Type */}
            {(type === 'single_choice' || type === 'single_select') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {options.map((option, index) => (
                        <label
                            key={option.value}
                            className="card"
                            style={{
                                cursor: 'pointer',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                border: value === option.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: value === option.value ? 'var(--primary-light)' : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <input
                                type="radio"
                                name={question.id}
                                value={option.value}
                                checked={value === option.value}
                                onChange={() => handleSingleChoiceChange(option.value)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <span style={{ flex: 1, fontWeight: value === option.value ? '600' : '400' }}>
                                {option.text || option.label}
                            </span>
                        </label>
                    ))}
                </div>
            )}

            {(type === 'multiple_choice' || type === 'multi_select') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {options.map((option, index) => {
                        const isChecked = Array.isArray(value) && value.includes(option.value);
                        return (
                            <label
                                key={option.value}
                                className="card"
                                style={{
                                    cursor: 'pointer',
                                    padding: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    border: isChecked ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    background: isChecked ? 'var(--primary-light)' : 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={isChecked}
                                    onChange={() => handleMultipleChoiceChange(option.value)}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                />
                                <span style={{ flex: 1, fontWeight: isChecked ? '600' : '400' }}>
                                    {option.text || option.label}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}

            {(type === 'numeric' || type === 'number') && (
                <div>
                    <input
                        type="number"
                        value={value || ''}
                        onChange={handleNumericChange}
                        min={validation?.min}
                        max={validation?.max}
                        placeholder={`Enter number${validation?.unit ? ` (${validation.unit})` : ''}`}
                        className="input"
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid var(--border)',
                            borderRadius: '6px'
                        }}
                    />
                    {validation && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            {validation.min !== undefined && validation.max !== undefined &&
                                `Range: ${validation.min} - ${validation.max} ${validation.unit || ''}`
                            }
                        </p>
                    )}
                </div>
            )}

            {type === 'table_choice' && (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '0.9rem'
                    }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-secondary)' }}>
                                <th style={{
                                    padding: '0.75rem',
                                    textAlign: 'left',
                                    borderBottom: '2px solid var(--border)',
                                    fontWeight: '600'
                                }}>
                                    Action
                                </th>
                                {question.columns?.filter(col => col.type === 'boolean').map(col => (
                                    <th key={col.name} style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        borderBottom: '2px solid var(--border)',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {question.rows?.map((row, rowIndex) => {
                                const rowValue = value?.[rowIndex] || {};
                                return (
                                    <tr key={rowIndex} style={{
                                        borderBottom: '1px solid var(--border)',
                                        background: rowIndex % 2 === 0 ? 'white' : 'var(--bg-secondary)'
                                    }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            {row.action}
                                        </td>
                                        {question.columns?.filter(col => col.type === 'boolean').map(col => (
                                            <td key={col.name} style={{
                                                padding: '0.75rem',
                                                textAlign: 'center'
                                            }}>
                                                <input
                                                    type="radio"
                                                    name={`${question.id}-row-${rowIndex}`}
                                                    value={col.name}
                                                    checked={rowValue.selected === col.name}
                                                    onChange={() => {
                                                        const newValue = { ...(value || {}) };
                                                        newValue[rowIndex] = { selected: col.name };
                                                        onChange(newValue);
                                                    }}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {type === 'matrix' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {question.rows.map((row) => (
                        <div key={row.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '0.75rem' }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>{row.text}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {question.columns.map((col) => (
                                    <label
                                        key={`${row.id}-${col.value}`}
                                        style={{
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`${question.id}-${row.id}`}
                                            value={col.value}
                                            checked={value?.[row.id] === col.value}
                                            onChange={() => {
                                                const newValue = { ...value, [row.id]: col.value };
                                                onChange(newValue);
                                            }}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span>{col.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {type === 'text' && (
                <input
                    type="text"
                    value={value || ''}
                    onChange={handleTextChange}
                    placeholder="Enter your answer"
                    className="input"
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        border: '1px solid var(--border)',
                        borderRadius: '6px'
                    }}
                />
            )}
        </div>
    );
}

export default QuestionRenderer;

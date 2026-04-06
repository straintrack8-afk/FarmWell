import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

function ChecklistItem({ id, text, priority, checked, onToggle }) {
    const { t } = useTranslation();

    const getPriorityBadge = () => {
        if (priority === 'critical') {
            return (
                <span style={{
                    display: 'inline-block',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    color: 'var(--fw-card)',
                    background: 'var(--fw-red)',
                    borderRadius: '4px',
                    marginLeft: '0.5rem'
                }}>
                    {t('farmguide.critical') || 'KRITIS'}
                </span>
            );
        }
        if (priority === 'high') {
            return (
                <span style={{
                    display: 'inline-block',
                    padding: '0.125rem 0.5rem',
                    fontSize: '0.625rem',
                    fontWeight: '700',
                    color: 'var(--fw-card)',
                    background: 'var(--fw-orange)',
                    borderRadius: '4px',
                    marginLeft: '0.5rem'
                }}>
                    {t('farmguide.important') || 'PENTING'}
                </span>
            );
        }
        return null;
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.875rem',
            background: checked ? 'var(--fw-bg)' : 'var(--fw-card)',
            border: '1px solid var(--fw-border)',
            borderRadius: '8px',
            transition: 'all 0.2s'
        }}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={() => onToggle(id)}
                style={{
                    width: '18px',
                    height: '18px',
                    marginTop: '0.125rem',
                    cursor: 'pointer',
                    accentColor: 'var(--fw-teal)'
                }}
            />
            <label
                htmlFor={id}
                style={{
                    flex: 1,
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    color: checked ? 'var(--fw-sub)' : 'var(--fw-text)',
                    textDecoration: checked ? 'line-through' : 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                {text}
                {getPriorityBadge()}
            </label>
        </div>
    );
}

export default ChecklistItem;

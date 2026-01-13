import React from 'react';
import '../../../hatchery.css';

/**
 * ProgressBar Component
 * Displays a visual progress bar
 */
function ProgressBar({ current, total, showLabel = true }) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div style={{ width: '100%' }}>
            {showLabel && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#6B7280'
                }}>
                    <span>Progress</span>
                    <span>{current} / {total} ({percentage}%)</span>
                </div>
            )}
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;

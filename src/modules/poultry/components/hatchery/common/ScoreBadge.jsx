import React from 'react';
import '../../../hatchery.css';

/**
 * ScoreBadge Component
 * Displays a colored badge based on classification (GOOD, FAIR, POOR)
 */
function ScoreBadge({ classification, score, showIcon = true }) {
    const getClassificationClass = () => {
        const classif = String(classification || '').toUpperCase();
        if (classif === 'GOOD' || classif === 'EXCELLENT') return 'good';
        if (classif === 'FAIR') return 'fair';
        if (classif === 'POOR') return 'poor';
        return 'info';
    };

    const getIcon = () => {
        const classif = String(classification || '').toUpperCase();
        if (classif === 'GOOD' || classif === 'EXCELLENT') return '✓';
        if (classif === 'FAIR') return '⚠';
        if (classif === 'POOR') return '✗';
        return 'ℹ';
    };

    const badgeClass = getClassificationClass();

    return (
        <span className={`score-badge ${badgeClass}`}>
            {showIcon && <span>{getIcon()}</span>}
            <span>{classification || 'N/A'}</span>
            {score !== undefined && score !== null && (
                <span>({typeof score === 'number' ? `${score}%` : score})</span>
            )}
        </span>
    );
}

export default ScoreBadge;

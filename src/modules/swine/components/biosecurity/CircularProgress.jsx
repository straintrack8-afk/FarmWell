import React from 'react';

/**
 * Circular Progress Indicator Component
 * Modern, animated circular progress bar with percentage display
 */
function CircularProgress({
    percentage = 0,
    size = 120,
    strokeWidth = 8,
    color = '#667eea',
    backgroundColor = '#e5e7eb',
    showPercentage = true,
    label = '',
    animated = true
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Background Circle */}
            <svg
                width={size}
                height={size}
                style={{
                    transform: 'rotate(-90deg)',
                    position: 'absolute'
                }}
            >
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />

                {/* Progress arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{
                        transition: animated ? 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                />
            </svg>

            {/* Center Content */}
            <div style={{
                position: 'relative',
                textAlign: 'center',
                zIndex: 1
            }}>
                {showPercentage && (
                    <div style={{
                        fontSize: size * 0.25,
                        fontWeight: '700',
                        color: color,
                        lineHeight: 1
                    }}>
                        {Math.round(percentage)}
                    </div>
                )}
                {label && (
                    <div style={{
                        fontSize: size * 0.1,
                        color: 'var(--text-muted)',
                        marginTop: '0.25rem',
                        fontWeight: '500'
                    }}>
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CircularProgress;

import React from 'react';

/**
 * Priority Badge Component
 * Displays priority level with appropriate color coding
 */
export default function PriorityBadge({ priority, language = 'en' }) {
    const priorityConfig = {
        critical: {
            label: { en: 'Critical', id: 'Kritis', vt: 'Nghiêm Trọng' },
            color: '#DC2626',
            bgColor: '#FEE2E2',
            icon: '🔴'
        },
        high: {
            label: { en: 'High', id: 'Tinggi', vt: 'Cao' },
            color: '#EA580C',
            bgColor: '#FFEDD5',
            icon: '🟠'
        },
        medium: {
            label: { en: 'Medium', id: 'Sedang', vt: 'Trung Bình' },
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            icon: '🟡'
        },
        low: {
            label: { en: 'Low', id: 'Rendah', vt: 'Thấp' },
            color: '#10B981',
            bgColor: '#D1FAE5',
            icon: '🟢'
        }
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    const label = config.label[language] || config.label.en;

    return (
        <span
            className="priority-badge"
            style={{
                backgroundColor: config.bgColor,
                color: config.color
            }}
        >
            <span className="priority-icon">{config.icon}</span>
            {label}

            <style jsx>{`
        .priority-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .priority-icon {
          font-size: 14px;
        }
      `}</style>
        </span>
    );
}

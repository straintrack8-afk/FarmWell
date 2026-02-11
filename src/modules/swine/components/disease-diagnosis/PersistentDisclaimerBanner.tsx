import { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { DISEASE_DIAGNOSIS_DISCLAIMERS, DisclaimerLanguage } from '../../constants/disclaimers';

interface PersistentDisclaimerBannerProps {
  language: DisclaimerLanguage;
}

const COLLAPSE_KEY = 'farmwell_disclaimer_banner_collapsed';

export function PersistentDisclaimerBanner({ language }: PersistentDisclaimerBannerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const disclaimer = DISEASE_DIAGNOSIS_DISCLAIMERS[language];

  useEffect(() => {
    const collapsed = localStorage.getItem(COLLAPSE_KEY);
    setIsCollapsed(collapsed === 'true');
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(COLLAPSE_KEY, String(newState));
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: '#FFFBEB',
        borderBottom: '2px solid #FCD34D',
        transition: 'all 0.3s ease'
      }}
      role="alert"
      aria-live="polite"
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isCollapsed ? '0.75rem 1rem' : '1rem'
        }}
      >
        {/* Header - Always Visible */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
          onClick={toggleCollapse}
        >
          <AlertCircle size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#92400E'
              }}
            >
              {disclaimer.title}
            </span>
            {isCollapsed && (
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#B45309',
                  marginLeft: '0.5rem'
                }}
              >
                - {disclaimer.shortText.substring(0, 60)}...
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse();
            }}
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s'
            }}
            aria-label={isCollapsed ? 'Expand disclaimer' : 'Collapse disclaimer'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {/* Expandable Content */}
        {!isCollapsed && (
          <div
            style={{
              marginTop: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #FCD34D',
              animation: 'slideDown 0.3s ease'
            }}
          >
            <p
              style={{
                fontSize: '0.8125rem',
                lineHeight: '1.5',
                color: '#92400E',
                margin: 0
              }}
            >
              {disclaimer.shortText}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media print {
          [role="alert"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { DISEASE_DIAGNOSIS_DISCLAIMERS, DisclaimerLanguage } from '../../constants/disclaimers';

interface DisclaimerModalProps {
  language: DisclaimerLanguage;
  onAccept: () => void;
}

export function DisclaimerModal({ language, onAccept }: DisclaimerModalProps) {
  const [isChecked, setIsChecked] = useState(false);
  const disclaimer = DISEASE_DIAGNOSIS_DISCLAIMERS[language];

  const handleAccept = () => {
    if (isChecked) {
      onAccept();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        padding: '1rem'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '100%',
          padding: '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={24} color="#F59E0B" />
          </div>
          <h2
            id="disclaimer-title"
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0
            }}
          >
            {disclaimer.title}
          </h2>
        </div>

        {/* Content */}
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.5',
              color: '#92400E',
              margin: 0
            }}
          >
            {disclaimer.fullText}
          </p>
        </div>

        {/* Checkbox */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              autoFocus
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                cursor: 'pointer',
                accentColor: '#667eea',
                flexShrink: 0
              }}
              aria-label={disclaimer.checkboxLabel}
            />
            <span
              style={{
                fontSize: '0.875rem',
                lineHeight: '1.5',
                color: '#374151'
              }}
            >
              {disclaimer.checkboxLabel}
            </span>
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleAccept}
          disabled={!isChecked}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            backgroundColor: isChecked ? '#667eea' : '#D1D5DB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isChecked ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: isChecked ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (isChecked) {
              e.currentTarget.style.backgroundColor = '#5568d3';
            }
          }}
          onMouseLeave={(e) => {
            if (isChecked) {
              e.currentTarget.style.backgroundColor = '#667eea';
            }
          }}
        >
          {disclaimer.continueButton}
        </button>
      </div>
    </div>
  );
}

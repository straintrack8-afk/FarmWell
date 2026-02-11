import { Stethoscope, Phone, FileText } from 'lucide-react';
import { DISEASE_DIAGNOSIS_DISCLAIMERS, DisclaimerLanguage } from '../../constants/disclaimers';

interface DiagnosisResultDisclaimerProps {
  language: DisclaimerLanguage;
  diseaseIndicated: string;
}

export function DiagnosisResultDisclaimer({ language, diseaseIndicated }: DiagnosisResultDisclaimerProps) {
  const disclaimer = DISEASE_DIAGNOSIS_DISCLAIMERS[language];

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '2px solid #FCD34D',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      className="diagnosis-result-disclaimer"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#DBEAFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Stethoscope size={20} color="#3B82F6" />
        </div>
        <div>
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              marginBottom: '0.25rem'
            }}
          >
            {disclaimer.title}
          </h3>
          {diseaseIndicated && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0
              }}
            >
              Detected: <strong>{diseaseIndicated}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Warning Message */}
      <div
        style={{
          backgroundColor: '#FEF3C7',
          borderLeft: '4px solid #F59E0B',
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          marginBottom: '1rem'
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

      {/* Next Steps */}
      <div style={{ marginBottom: '1rem' }}>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {disclaimer.nextSteps}
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {disclaimer.recommendedActions.map((action, index) => (
            <li
              key={index}
              style={{
                fontSize: '0.8125rem',
                lineHeight: '1.5',
                color: '#4B5563'
              }}
            >
              {action}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          paddingTop: '1rem',
          borderTop: '1px solid #E5E7EB'
        }}
      >
        <button
          onClick={() => {
            // Placeholder for vet finder feature
            alert('Veterinarian contact feature coming soon');
          }}
          style={{
            flex: '1 1 auto',
            minWidth: '150px',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
          }}
        >
          <Phone size={16} />
          {disclaimer.contactVet}
        </button>
        <button
          onClick={() => {
            window.print();
          }}
          style={{
            flex: '1 1 auto',
            minWidth: '150px',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#374151',
            border: '2px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB';
            e.currentTarget.style.borderColor = '#9CA3AF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#D1D5DB';
          }}
        >
          <FileText size={16} />
          {disclaimer.saveReport}
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .diagnosis-result-disclaimer {
            page-break-inside: avoid;
            border: 2px solid #000 !important;
            box-shadow: none !important;
          }
          
          .diagnosis-result-disclaimer button {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .diagnosis-result-disclaimer > div:last-child {
            flex-direction: column;
          }
          
          .diagnosis-result-disclaimer button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import { getDiseaseRiskLevel } from '../../utils/biosecurityScoring';

/**
 * Disease Risk Card Component
 * Displays disease name, risk score, and risk level with color coding
 */
export default function DiseaseRiskCard({ disease, riskScore, language = 'en' }) {
    const riskLevel = getDiseaseRiskLevel(riskScore, language);

    // Format disease name for display
    const formatDiseaseName = (name) => {
        return name
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .trim();
    };

    return (
        <div className="disease-risk-card">
            <div className="disease-risk-header">
                <div className="disease-name">
                    <span className="disease-icon">{riskLevel.icon}</span>
                    <h4>{formatDiseaseName(disease)}</h4>
                </div>
                <div
                    className="risk-score"
                    style={{ color: riskLevel.color }}
                >
                    {riskScore}
                </div>
            </div>

            <div className="risk-level-bar">
                <div
                    className="risk-level-fill"
                    style={{
                        width: `${riskScore}%`,
                        backgroundColor: riskLevel.color
                    }}
                />
            </div>

            <div className="risk-label" style={{ color: riskLevel.color }}>
                {riskLevel.label}
            </div>

            <style jsx>{`
        .disease-risk-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .disease-risk-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .disease-risk-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .disease-name {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .disease-icon {
          font-size: 24px;
        }

        .disease-name h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .risk-score {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
        }

        .risk-level-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .risk-level-fill {
          height: 100%;
          transition: width 0.6s ease;
          border-radius: 4px;
        }

        .risk-label {
          font-size: 14px;
          font-weight: 600;
          text-align: center;
        }
      `}</style>
        </div>
    );
}

import React from 'react';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import DiseaseRiskCard from './DiseaseRiskCard';

/**
 * Disease Risk Section Component
 * Displays top disease risks from the assessment
 */
export default function DiseaseRiskSection({ maxDisplay = 6 }) {
    const { getDiseaseRisks, language } = useBiosecurity();
    const diseaseRisks = getDiseaseRisks();

    // Get top N disease risks
    const topRisks = Object.entries(diseaseRisks)
        .slice(0, maxDisplay);

    if (topRisks.length === 0) {
        return null;
    }

    const translations = {
        en: {
            title: 'Disease Risk Profile',
            subtitle: 'Risk assessment for major pig diseases based on your biosecurity practices',
            noRisks: 'No disease risk data available'
        },
        id: {
            title: 'Profil Risiko Penyakit',
            subtitle: 'Penilaian risiko untuk penyakit babi utama berdasarkan praktik biosekuriti Anda',
            noRisks: 'Tidak ada data risiko penyakit'
        },
        vt: {
            title: 'Hồ Sơ Rủi Ro Bệnh',
            subtitle: 'Đánh giá rủi ro cho các bệnh lợn chính dựa trên thực hành an toàn sinh học của bạn',
            noRisks: 'Không có dữ liệu rủi ro bệnh'
        }
    };

    const t = translations[language] || translations.en;

    return (
        <div className="disease-risk-section">
            <div className="section-header">
                <h2>{t.title}</h2>
                <p className="section-subtitle">{t.subtitle}</p>
            </div>

            <div className="disease-risk-grid">
                {topRisks.map(([disease, riskScore]) => (
                    <DiseaseRiskCard
                        key={disease}
                        disease={disease}
                        riskScore={riskScore}
                        language={language}
                    />
                ))}
            </div>

            <style jsx>{`
        .disease-risk-section {
          margin: 32px 0;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .section-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .disease-risk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        @media (max-width: 768px) {
          .disease-risk-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}

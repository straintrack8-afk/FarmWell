import React from 'react';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import PriorityBadge from './PriorityBadge';

/**
 * Priority Recommendations Section Component
 * Displays recommendations grouped by priority level
 */
export default function PriorityRecommendationsSection() {
    const { getPriorityRecommendationsData, language } = useBiosecurity();
    const recommendations = getPriorityRecommendationsData();

    if (!recommendations) {
        return null;
    }

    const translations = {
        en: {
            title: 'Improvement Recommendations',
            subtitle: 'Prioritized actions to enhance your biosecurity',
            critical: 'Critical Priority',
            high: 'High Priority',
            medium: 'Medium Priority',
            low: 'Low Priority',
            noItems: 'No items',
            score: 'Score',
            affectedDiseases: 'Affected Diseases'
        },
        id: {
            title: 'Rekomendasi Perbaikan',
            subtitle: 'Tindakan prioritas untuk meningkatkan biosekuriti Anda',
            critical: 'Prioritas Kritis',
            high: 'Prioritas Tinggi',
            medium: 'Prioritas Sedang',
            low: 'Prioritas Rendah',
            noItems: 'Tidak ada item',
            score: 'Skor',
            affectedDiseases: 'Penyakit Terkait'
        },
        vt: {
            title: 'Khuyến Nghị Cải Thiện',
            subtitle: 'Hành động ưu tiên để tăng cường an toàn sinh học',
            critical: 'Ưu Tiên Nghiêm Trọng',
            high: 'Ưu Tiên Cao',
            medium: 'Ưu Tiên Trung Bình',
            low: 'Ưu Tiên Thấp',
            noItems: 'Không có mục',
            score: 'Điểm',
            affectedDiseases: 'Bệnh Liên Quan'
        }
    };

    const t = translations[language] || translations.en;

    const priorityOrder = ['critical', 'high', 'medium', 'low'];
    const priorityLabels = {
        critical: t.critical,
        high: t.high,
        medium: t.medium,
        low: t.low
    };

    // Filter out empty priority groups
    const nonEmptyPriorities = priorityOrder.filter(
        priority => recommendations[priority]?.length > 0
    );

    if (nonEmptyPriorities.length === 0) {
        return null;
    }

    return (
        <div className="priority-recommendations-section">
            <div className="section-header">
                <h2>{t.title}</h2>
                <p className="section-subtitle">{t.subtitle}</p>
            </div>

            <div className="priority-groups">
                {nonEmptyPriorities.map(priority => (
                    <div key={priority} className="priority-group">
                        <div className="priority-group-header">
                            <h3>{priorityLabels[priority]}</h3>
                            <PriorityBadge priority={priority} language={language} />
                            <span className="item-count">
                                {recommendations[priority].length} {recommendations[priority].length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        <div className="recommendations-list">
                            {recommendations[priority].map((item, index) => (
                                <div key={`${priority}-${index}`} className="recommendation-item">
                                    <div className="recommendation-header">
                                        <span className="question-number">Q{item.questionNumber}</span>
                                        <span className="recommendation-score" style={{
                                            color: item.score < 25 ? '#DC2626' : item.score < 50 ? '#EA580C' : '#F59E0B'
                                        }}>
                                            {t.score}: {item.score}/100
                                        </span>
                                    </div>

                                    <div className="question-text">{item.questionText}</div>

                                    <div className="risk-description">
                                        <strong>⚠️ Risk:</strong> {item.riskDescription}
                                    </div>

                                    <div className="recommendation-text">
                                        <strong>💡 Recommendation:</strong>
                                        <div className="recommendation-content">
                                            {item.recommendation.split('\n').map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {item.diseasesAffected && item.diseasesAffected.length > 0 && (
                                        <div className="affected-diseases">
                                            <strong>{t.affectedDiseases}:</strong>
                                            <div className="disease-tags">
                                                {item.diseasesAffected.map(disease => (
                                                    <span key={disease} className="disease-tag">
                                                        {disease.replace(/_/g, ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .priority-recommendations-section {
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

        .priority-groups {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .priority-group {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .priority-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }

        .priority-group-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          flex: 1;
        }

        .item-count {
          font-size: 14px;
          color: #6b7280;
        }

        .recommendations-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .recommendation-item {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          border-left: 4px solid #e5e7eb;
        }

        .recommendation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .question-number {
          background: #3b82f6;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
        }

        .recommendation-score {
          font-size: 14px;
          font-weight: 600;
        }

        .question-text {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 12px;
        }

        .risk-description {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 12px;
          padding: 12px;
          background: white;
          border-radius: 6px;
        }

        .recommendation-text {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 12px;
        }

        .recommendation-content {
          margin-top: 8px;
          padding-left: 16px;
        }

        .recommendation-content div {
          margin-bottom: 4px;
        }

        .affected-diseases {
          font-size: 13px;
          color: #6b7280;
        }

        .disease-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .disease-tag {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .priority-group {
            padding: 16px;
          }

          .recommendation-item {
            padding: 12px;
          }
        }
      `}</style>
        </div>
    );
}

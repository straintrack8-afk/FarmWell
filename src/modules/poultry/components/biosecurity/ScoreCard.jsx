import React from 'react';
import { getLocalizedText } from '../../utils/assessmentUtils';

function ScoreCard({ score, grade, language, showDetails = true }) {
    if (!grade) return null;

    const description = getLocalizedText(grade.description, language);
    const recommendation = getLocalizedText(grade.recommendation, language);

    const getGradeIcon = (level) => {
        const icons = {
            'A': '🏆',
            'B': '👍',
            'C': '⚠️',
            'D': '❌',
            'F': '🚨'
        };
        return icons[level] || '📊';
    };

    return (
        <div className="score-card" style={{ borderColor: grade.color }}>
            <div className="score-header">
                <div className="score-icon">{getGradeIcon(grade.level)}</div>
                <div className="score-main">
                    <div className="score-value" style={{ color: grade.color }}>
                        {score.toFixed(1)}
                    </div>
                    <div className="score-max">/ 100</div>
                </div>
                <div className="score-grade" style={{ backgroundColor: grade.color }}>
                    {grade.level}
                </div>
            </div>

            {showDetails && (
                <>
                    <div className="score-description">
                        <h4 className="description-title">
                            {language === 'vi' && 'Đánh giá'}
                            {language === 'en' && 'Assessment'}
                            {language === 'id' && 'Penilaian'}
                        </h4>
                        <p className="description-text">{description}</p>
                    </div>

                    <div className="score-recommendation">
                        <h4 className="recommendation-title">
                            {language === 'vi' && 'Khuyến nghị'}
                            {language === 'en' && 'Recommendation'}
                            {language === 'id' && 'Rekomendasi'}
                        </h4>
                        <p className="recommendation-text">{recommendation}</p>
                    </div>

                    <div className="score-risk-level">
                        <span className="risk-label">
                            {language === 'vi' && 'Mức độ rủi ro:'}
                            {language === 'en' && 'Risk Level:'}
                            {language === 'id' && 'Tingkat Risiko:'}
                        </span>
                        <span className={`risk-badge risk-${grade?.risk || 'unknown'}`}>
                            {grade?.risk ? grade.risk.toUpperCase() : 'N/A'}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

export default ScoreCard;

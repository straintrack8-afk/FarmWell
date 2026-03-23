import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from './CircularProgress';

/**
 * Reusable card component for each focus area
 * Displays progress, scores, and navigation with modern gradient design
 */
function FocusAreaCard({ focusArea, assessment, language = 'en' }) {
    const navigate = useNavigate();
    const { number, name, description, total_questions, estimated_time_minutes } = focusArea;

    const focusAreaData = assessment?.focus_areas[number];
    const isCompleted = focusAreaData?.completed || false;
    const score = focusAreaData?.score || 0;
    const answeredCount = focusAreaData?.answers ? Object.keys(focusAreaData.answers).length : 0;
    const progressPercentage = (answeredCount / total_questions) * 100;

    // Accent colors for each focus area to maintain visual distinction without heavy gradients
    const accentColors = {
        1: '#10B981',
        2: '#10B981',
        3: '#10B981',
        4: '#10B981'
    };

    const accentColor = accentColors[number] || accentColors[1];

    const getScoreColor = (score) => {
        if (score >= 80) return '#10B981'; // Green
        if (score >= 60) return '#3B82F6'; // Blue
        if (score >= 40) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    const handleClick = () => {
        navigate(`/swine/biosecurity/assessment/${number}`);
    };

    const getButtonText = () => {
        const translations = {
            en: { start: 'Start', continue: 'Continue', review: 'Review' },
            id: { start: 'Mulai', continue: 'Lanjutkan', review: 'Tinjau' },
            vi: { start: 'Bắt đầu', continue: 'Tiếp tục', review: 'Xem lại' }
        };

        const t = translations[language] || translations.en;

        if (isCompleted) return t.review;
        if (answeredCount > 0) return t.continue;
        return t.start;
    };

    const getTranslation = (key) => {
        const translations = {
            en: { questions: 'questions', min: 'min', answered: 'answered', score: 'Score', pending: 'Pending' },
            id: { questions: 'pertanyaan', min: 'menit', answered: 'dijawab', score: 'Skor', pending: 'Tertunda' },
            vi: { questions: 'câu hỏi', min: 'phút', answered: 'đã trả lời', score: 'Điểm', pending: 'Chưa làm' }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    const getTranslatedName = () => {
        const translations = {
            1: { id: 'Pembelian & Transportasi', vi: 'Mua & Vận chuyển', en: 'Purchase & Transport' },
            2: { id: 'Fasilitas & SDM', vi: 'Cơ sở & Con người', en: 'Facilities & People' },
            3: { id: 'Manajemen Produksi', vi: 'Quản lý Sản xuất', en: 'Production Management' },
            4: { id: 'Protokol Kebersihan', vi: 'Quy trình Vệ sinh', en: 'Hygiene Protocols' }
        };
        return translations[number]?.[language] || translations[number]?.en || name;
    };

    const getTranslatedDescription = () => {
        const translations = {
            1: { id: 'Cegah masuknya penyakit melalui hewan dan kendaraan', vi: 'Ngăn ngừa bệnh qua động vật và phương tiện', en: 'Prevent disease entry through animals and vehicles' },
            2: { id: 'Kendalikan akses dan biosekuriti lingkungan', vi: 'Kiểm soát tiếp cận và an toàn sinh học môi trường', en: 'Control access and environmental biosecurity' },
            3: { id: 'Cegah penyebaran penyakit di dalam peternakan', vi: 'Ngăn ngừa lây lan bệnh trong trang trại', en: 'Prevent disease spread within the farm' },
            4: { id: 'Jaga kebersihan di semua area', vi: 'Duy trì vệ sinh ở tất cả các khu vực', en: 'Maintain cleanliness across all areas' }
        };
        return translations[number]?.[language] || translations[number]?.en || description;
    };

    return (
        <div
            style={{
                background: 'white',
                borderRadius: '1.5rem',
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '220px',
                border: '1px solid #e5e7eb',
                borderTop: `4px solid ${accentColor}`
            }}
            onClick={handleClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
            }}
        >
            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header with Score/Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            color: accentColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.5rem'
                        }}>
                            {language === 'id' ? `Area Fokus ${number}` : language === 'vi' ? `Khu vực ${number}` : `Focus Area ${number}`}
                        </div>
                        <h3 style={{
                            fontSize: '1.25rem',
                            fontWeight: '800',
                            color: '#1e293b',
                            marginBottom: '0.5rem',
                            lineHeight: '1.3'
                        }}>
                            {getTranslatedName()}
                        </h3>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            lineHeight: '1.5',
                            marginBottom: '0'
                        }}>
                            {getTranslatedDescription()}
                        </p>
                    </div>

                    {/* Circular Progress or Score */}
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '90px' }}>
                        {isCompleted ? (
                            <>
                                <CircularProgress
                                    percentage={score}
                                    size={80}
                                    strokeWidth={7}
                                    color={getScoreColor(score)}
                                    backgroundColor="#f1f5f9"
                                    showPercentage={false}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    fontWeight: '800',
                                    fontSize: '1.25rem',
                                    color: getScoreColor(score)
                                }}>
                                    {score}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#64748b',
                                    marginTop: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {getTranslation('score') || 'Score'}
                                </div>
                            </>
                        ) : (
                            <div style={{
                                height: '80px',
                                width: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '50%'
                            }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '700' }}>
                                    {getTranslation('pending')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Row */}
                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f1f5f9'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                            {total_questions} {getTranslation('questions')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                            ~{estimated_time_minutes} {getTranslation('min')}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>
                            {answeredCount} {getTranslation('answered')}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    className={isCompleted ? "btn btn-outline" : "btn btn-primary"}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 0'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    {getButtonText()}
                </button>
            </div>
        </div>
    );
}

export default FocusAreaCard;


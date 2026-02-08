import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBiosecurity } from '../../contexts/BiosecurityContext';
import {
    getAllCriticalActionItems,
    getScoreInterpretation,
    calculateOverallScore,
    calculateExternalScore,
    calculateInternalScore
} from '../../utils/biosecurityScoring';
import CircularProgress from '../../components/biosecurity/CircularProgress';
import DiseaseRiskSection from '../../components/biosecurity/DiseaseRiskSection';
import PriorityRecommendationsSection from '../../components/biosecurity/PriorityRecommendationsSection';

function BiosecurityReportPage() {
    const navigate = useNavigate();
    const { currentAssessment, language } = useBiosecurity();
    const [criticalItems, setCriticalItems] = useState([]);
    const [scoreAnalysis, setScoreAnalysis] = useState(null);

    useEffect(() => {
        if (currentAssessment) {
            const items = getAllCriticalActionItems(currentAssessment, language);
            setCriticalItems(items);

            // Calculate scores dynamically to ensure accuracy
            const overall = calculateOverallScore(currentAssessment, language);
            const external = calculateExternalScore(currentAssessment, language);
            const internal = calculateInternalScore(currentAssessment, language);
            const interpretation = getScoreInterpretation(overall, language);

            setScoreAnalysis({
                overall,
                external,
                internal,
                interpretation
            });
        }
    }, [currentAssessment, language]);

    const getTranslation = (key) => {
        const translations = {
            en: {
                title: 'Biosecurity Analysis Report',
                backToDashboard: 'Back to Assessment',
                overallScore: 'Overall Score',
                external: 'External Biosecurity',
                internal: 'Internal Biosecurity',
                riskLevel: 'Risk Status',
                criticalActions: 'Critical Actions Required',
                recommendation: 'Recommendation',
                print: 'Print Report',
                noRisks: 'Excellent work! No critical risks identified.',
                improvementPlan: 'Improvement Plan',
                assessmentDate: 'Assessment Date',
                assessorName: 'Assessor Name',
                farmName: 'Farm Name',
                auditType: 'Audit Type',
                focusAreaScores: 'Focus Area Scores',
                score: 'Score',
                auditTypes: {
                    internal: 'Internal Audit',
                    external: 'External Audit',
                    certification: 'Certification Audit',
                    surveillance: 'Surveillance Audit'
                }
            },
            id: {
                title: 'Laporan Analisa Biosekuriti',
                backToDashboard: 'Kembali ke Penilaian',
                overallScore: 'Skor Keseluruhan',
                external: 'Biosekuriti Eksternal',
                internal: 'Biosekuriti Internal',
                riskLevel: 'Status Risiko',
                criticalActions: 'Tindakan Kritis Diperlukan',
                recommendation: 'Rekomendasi',
                print: 'Cetak Laporan',
                noRisks: 'Kerja bagus! Tidak ada risiko kritis yang teridentifikasi.',
                improvementPlan: 'Rencana Perbaikan',
                assessmentDate: 'Tanggal Penilaian',
                assessorName: 'Nama Penilai',
                farmName: 'Nama Peternakan',
                auditType: 'Jenis Audit',
                focusAreaScores: 'Skor Area Fokus',
                score: 'Skor',
                auditTypes: {
                    internal: 'Audit Internal',
                    external: 'Audit Eksternal',
                    certification: 'Audit Sertifikasi',
                    surveillance: 'Audit Pengawasan'
                }
            },
            vt: {
                title: 'Báo cáo Phân tích An ninh sinh học',
                backToDashboard: 'Quay lại Đánh giá',
                overallScore: 'Điểm tổng thể',
                external: 'An ninh sinh học bên ngoài',
                internal: 'An ninh sinh học nội bộ',
                riskLevel: 'Tình trạng rủi ro',
                criticalActions: 'Hành động khẩn cấp cần thiết',
                recommendation: 'Khuyến nghị',
                print: 'In báo cáo',
                noRisks: 'Làm tốt lắm! Không có rủi ro nghiêm trọng nào được xác định.',
                improvementPlan: 'Kế hoạch cải thiện',
                assessmentDate: 'Ngày Đánh Giá',
                assessorName: 'Tên Người Đánh Giá',
                farmName: 'Tên Trang Trại',
                auditType: 'Loại Kiểm Toán',
                focusAreaScores: 'Điểm Khu Vực Tập Trung',
                score: 'Điểm',
                auditTypes: {
                    internal: 'Kiểm Toán Nội Bộ',
                    external: 'Kiểm Toán Bên Ngoài',
                    certification: 'Kiểm Toán Chứng Nhận',
                    surveillance: 'Kiểm Toán Giám Sát'
                }
            }
        };
        return translations[language]?.[key] || translations.en[key];
    };

    // Load farm profile data
    const [farmProfile, setFarmProfile] = useState(null);

    useEffect(() => {
        const savedProfile = localStorage.getItem('pigwell_farm_profile');
        if (savedProfile) {
            try {
                setFarmProfile(JSON.parse(savedProfile));
            } catch (error) {
                console.error('Error loading farm profile:', error);
            }
        }
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'id' ? 'id-ID' : language === 'vt' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!currentAssessment) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <p>No assessment data found.</p>
                <button
                    onClick={() => navigate('/swine/biosecurity/dashboard')}
                    className="btn btn-primary"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container print-container" style={{ paddingBottom: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
            <style>
                {`
                    @media print {
                        @page {
                            margin: 15mm;
                            size: A4;
                        }
                        body {
                            background: white;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .print-container {
                            width: 100% !important;
                            max-width: none !important;
                            padding: 0 !important;
                            margin: 0 !important;
                            box-shadow: none !important;
                        }
                        .break-inside-avoid {
                            break-inside: avoid;
                            page-break-inside: avoid;
                        }
                        /* Ensure all improvement plan items print */
                        div[style*="borderLeft: '6px solid #EF4444'"] {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        /* Force content to be visible */
                        * {
                            overflow: visible !important;
                        }
                        /* Ensure proper spacing */
                        h2 {
                            page-break-after: avoid;
                        }
                    }
                `}
            </style>

            {/* Header / Navigation */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/swine/biosecurity/dashboard')}
                    className="btn btn-secondary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    ← {getTranslation('backToDashboard')}
                </button>
                <button
                    onClick={() => window.print()}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    🖨️ {getTranslation('print')}
                </button>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--text-primary)' }}>
                {getTranslation('title')}
            </h1>

            {/* Farm Profile Information */}
            {farmProfile && (
                <div style={{
                    background: 'white',
                    borderRadius: '1rem',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    marginBottom: '2rem',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '0.5rem'
                            }}>
                                {getTranslation('assessmentDate')}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                            }}>
                                {formatDate(farmProfile.assessmentDate)}
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '0.5rem'
                            }}>
                                {getTranslation('assessorName')}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                            }}>
                                {farmProfile.assessorName || '-'}
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '0.5rem'
                            }}>
                                {getTranslation('farmName')}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                            }}>
                                {farmProfile.farmName || '-'}
                            </div>
                        </div>

                        <div>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                marginBottom: '0.5rem'
                            }}>
                                {getTranslation('auditType')}
                            </div>
                            <div style={{
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)'
                            }}>
                                {farmProfile.auditType ? getTranslation('auditTypes')[farmProfile.auditType] : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Score Overview Card */}
            {scoreAnalysis && (
                <div style={{
                    background: 'white',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    marginBottom: '3rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
                        <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                            {getTranslation('overallScore')}
                        </h3>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                            <CircularProgress
                                percentage={scoreAnalysis.overall}
                                size={140}
                                strokeWidth={10}
                                color={scoreAnalysis.interpretation.color}
                                showPercentage={true}
                            />
                        </div>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: `${scoreAnalysis.interpretation.color}20`,
                            color: scoreAnalysis.interpretation.color,
                            borderRadius: '2rem',
                            display: 'inline-block',
                            fontWeight: '700',
                            fontSize: '0.875rem'
                        }}>
                            {scoreAnalysis.interpretation.label}
                        </div>
                    </div>

                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>{getTranslation('external')}</h3>
                            <div style={{ background: '#f9fafb', height: '1.5rem', borderRadius: '1rem', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${scoreAnalysis.external}%`,
                                    height: '100%',
                                    background: scoreAnalysis.external >= 60 ? '#10B981' : (scoreAnalysis.external >= 40 ? '#F59E0B' : '#EF4444'),
                                    transition: 'width 1s ease'
                                }} />
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: '700', marginTop: '0.5rem' }}>{scoreAnalysis.external}/100</div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>{getTranslation('internal')}</h3>
                            <div style={{ background: '#f9fafb', height: '1.5rem', borderRadius: '1rem', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${scoreAnalysis.internal}%`,
                                    height: '100%',
                                    background: scoreAnalysis.internal >= 60 ? '#10B981' : (scoreAnalysis.internal >= 40 ? '#F59E0B' : '#EF4444'),
                                    transition: 'width 1s ease'
                                }} />
                            </div>
                            <div style={{ textAlign: 'right', fontWeight: '700', marginTop: '0.5rem' }}>{scoreAnalysis.internal}/100</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Focus Area Scores */}
            {currentAssessment && (
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1.5rem'
                    }}>
                        {[
                            {
                                number: 1,
                                title: 'Purchase & Transport',
                                description: 'Prevent disease entry through animals and vehicles',
                                color: '#8B5CF6',
                                bgColor: '#EDE9FE'
                            },
                            {
                                number: 2,
                                title: 'Facilities & People',
                                description: 'Control access and environmental biosecurity',
                                color: '#EC4899',
                                bgColor: '#FCE7F3'
                            },
                            {
                                number: 3,
                                title: 'Production Management',
                                description: 'Prevent disease spread within the farm',
                                color: '#06B6D4',
                                bgColor: '#CFFAFE'
                            },
                            {
                                number: 4,
                                title: 'Hygiene Protocols',
                                description: 'Maintain cleanliness across all areas',
                                color: '#10B981',
                                bgColor: '#D1FAE5'
                            }
                        ].map((area) => {
                            const focusAreaData = currentAssessment.focus_areas[area.number];
                            const score = focusAreaData?.score || 0;

                            return (
                                <div key={area.number} style={{
                                    background: area.bgColor,
                                    borderRadius: '1rem',
                                    padding: '1.5rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    border: `2px solid ${area.color}20`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        color: area.color,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        marginBottom: '0.75rem'
                                    }}>
                                        Focus Area {area.number}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '1rem'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '700',
                                                color: area.color,
                                                marginBottom: '0.5rem',
                                                lineHeight: '1.3'
                                            }}>
                                                {area.title}
                                            </h3>
                                            <p style={{
                                                fontSize: '0.875rem',
                                                color: '#6B7280',
                                                margin: 0,
                                                lineHeight: '1.4'
                                            }}>
                                                {area.description}
                                            </p>
                                        </div>

                                        <div style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <CircularProgress
                                                percentage={score}
                                                size={80}
                                                strokeWidth={8}
                                                color={area.color}
                                                showPercentage={false}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                fontSize: '1.5rem',
                                                fontWeight: '800',
                                                color: area.color
                                            }}>
                                                {score}
                                            </div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                color: area.color,
                                                marginTop: '0.5rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {getTranslation('score')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* NEW: Disease Risk Profile Section */}
            <DiseaseRiskSection maxDisplay={6} />

            {/* NEW: Priority-Based Recommendations Section */}
            <PriorityRecommendationsSection />

            {/* Critical Action Items */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    🚨 {getTranslation('improvementPlan')}
                </h2>

                {criticalItems.length === 0 ? (
                    <div style={{
                        padding: '3rem',
                        background: '#ECFDF5',
                        border: '1px solid #10B981',
                        borderRadius: '1rem',
                        textAlign: 'center',
                        color: '#065F46'
                    }}>
                        <h3>{getTranslation('noRisks')}</h3>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {criticalItems.map((item, index) => (
                            <div key={index} className="break-inside-avoid" style={{
                                background: 'white',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                borderLeft: '6px solid #EF4444'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{
                                        background: '#FEF2F2',
                                        color: '#B91C1C',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase'
                                    }}>
                                        Risk Detected
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        Focus Area {item.focusArea}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                                    {item.question}
                                </h3>
                                <div style={{
                                    background: '#F9FAFB',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        <strong>Your Answer:</strong> {item.answer.toString()}
                                    </p>
                                    <div style={{ marginTop: '0.75rem', color: '#059669', fontSize: '0.9rem' }}>
                                        <strong>💡 Recommendation:</strong> Implement standard biosecurity procedure to address this risk. Ensure compliance with biosecurity manual section {item.focusArea}.{item.questionNumber}.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BiosecurityReportPage;

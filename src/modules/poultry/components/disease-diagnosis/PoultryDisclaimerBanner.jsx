import React, { useState, useEffect } from 'react';

const COLLAPSE_KEY = 'farmwell_poultry_disclaimer_banner_collapsed';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        shortText: "This tool only helps recognize disease symptoms in poultry. If disease signs are observed, immediately contact a veterinarian for professional consultation and diagnosis."
    },
    id: {
        title: "Pemberitahuan Penting",
        shortText: "Tool ini hanya membantu mengenali gejala penyakit pada unggas. Jika terlihat tanda-tanda penyakit, segera hubungi dokter hewan untuk konsultasi dan diagnosis profesional."
    },
    vi: {
        title: "Thông báo Quan trọng",
        shortText: "Công cụ này chỉ giúp nhận biết triệu chứng bệnh ở gia cầm. Nếu phát hiện dấu hiệu bệnh, hãy liên hệ ngay với bác sĩ thú y để được tư vấn và chẩn đoán chuyên nghiệp."
    }
};

function PoultryDisclaimerBanner({ language = 'en' }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const lang = DISCLAIMER_TEXT[language] || DISCLAIMER_TEXT['en'];

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
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#F59E0B' }}>ⓘ</span>
                    <div style={{ flex: 1 }}>
                        <span
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#92400E'
                            }}
                        >
                            {lang.title}
                        </span>
                        {isCollapsed && (
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#B45309',
                                    marginLeft: '0.5rem'
                                }}
                            >
                                - {lang.shortText.substring(0, 60)}...
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
                            fontSize: '1rem',
                            transition: 'transform 0.2s'
                        }}
                        aria-label={isCollapsed ? 'Expand disclaimer' : 'Collapse disclaimer'}
                        aria-expanded={!isCollapsed}
                    >
                        {isCollapsed ? '▼' : '▲'}
                    </button>
                </div>

                {/* Expandable Content */}
                {!isCollapsed && (
                    <div
                        style={{
                            marginTop: '0.75rem',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid #FCD34D',
                            animation: 'poultryBannerSlideDown 0.3s ease'
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
                            {lang.shortText}
                        </p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes poultryBannerSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media print {
          [role="alert"] { display: none !important; }
        }
      `}</style>
        </div>
    );
}

export default PoultryDisclaimerBanner;

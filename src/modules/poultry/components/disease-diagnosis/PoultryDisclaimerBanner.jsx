import React, { useState, useEffect } from 'react';

const COLLAPSE_KEY = 'farmwell_poultry_disclaimer_banner_collapsed';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        shortText: "This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly."
    },
    id: {
        title: "Pemberitahuan Penting",
        shortText: "Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan."
    },
    vi: {
        title: "Thông báo Quan trọng",
        shortText: "Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời."
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
                backgroundColor: '#F4FBF7',
                borderBottom: '1.5px solid #C8E8D4',
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
                    <svg style={{ flexShrink: 0, width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="#1E7A42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div style={{ flex: 1 }}>
                        <span
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                color: '#1E7A42',
                                fontFamily: 'Plus Jakarta Sans, sans-serif'
                            }}
                        >
                            {lang.title}
                        </span>
                        {isCollapsed && (
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color: '#4a8a6a',
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
                            color: '#2EAA5E',
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
                            borderTop: '1px solid #C8E8D4',
                            animation: 'poultryBannerSlideDown 0.3s ease'
                        }}
                    >
                        <p
                            style={{
                                fontSize: '0.8125rem',
                                lineHeight: '1.5',
                                color: '#1E5C3A',
                                margin: 0,
                                fontFamily: 'Plus Jakarta Sans, sans-serif'
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

import React, { useState } from 'react';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        fullText: "This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.",
        checkboxLabel: "I understand and agree to this disclaimer",
        continueButton: "Continue to Tool"
    },
    id: {
        title: "Pemberitahuan Penting",
        fullText: "Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan mengkonfirmasi diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda sakit, segera konsultasikan dengan dokter hewan.",
        checkboxLabel: "Saya memahami dan menyetujui disclaimer ini",
        continueButton: "Lanjutkan ke Tool"
    },
    vi: {
        title: "Thông báo Quan trọng",
        fullText: "Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Nó không đưa ra chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự, và chỉ bác sĩ thú y có trình độ mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả được cung cấp bởi công cụ này chỉ mang tính chất hướng dẫn. Nếu động vật có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y ngay lập tức.",
        checkboxLabel: "Tôi hiểu và đồng ý với tuyên bố miễn trừ trách nhiệm này",
        continueButton: "Tiếp tục sử dụng Công cụ"
    }
};

function PoultryDisclaimerModal({ language = 'en', onAccept }) {
    const [isChecked, setIsChecked] = useState(false);
    const lang = DISCLAIMER_TEXT[language] || DISCLAIMER_TEXT['en'];

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
            aria-labelledby="poultry-disclaimer-title"
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
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
                            borderRadius: '14px',
                            backgroundColor: '#DDF2E8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, stroke: '#1E7A42', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                    </div>
                    <h2
                        id="poultry-disclaimer-title"
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0
                        }}
                    >
                        {lang.title}
                    </h2>
                </div>

                {/* Content */}
                <div
                    style={{
                        backgroundColor: '#F4FBF7',
                        border: '1px solid #C8E8D4',
                        borderRadius: '10px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}
                >
                    <p
                        style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            color: '#1E5C3A',
                            margin: 0
                        }}
                    >
                        {lang.fullText}
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
                                accentColor: '#2EAA5E',
                                flexShrink: 0
                            }}
                            aria-label={lang.checkboxLabel}
                        />
                        <span
                            style={{
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                color: '#374151'
                            }}
                        >
                            {lang.checkboxLabel}
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
                        backgroundColor: isChecked ? '#2EAA5E' : '#D1D5DB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: isChecked ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        opacity: isChecked ? 1 : 0.6,
                        fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                        if (isChecked) e.currentTarget.style.backgroundColor = '#1E7A42';
                    }}
                    onMouseLeave={(e) => {
                        if (isChecked) e.currentTarget.style.backgroundColor = '#2EAA5E';
                    }}
                >
                    {lang.continueButton}
                </button>
            </div>
        </div>
    );
}

export default PoultryDisclaimerModal;

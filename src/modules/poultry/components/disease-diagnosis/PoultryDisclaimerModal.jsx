import React, { useState } from 'react';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        fullText: "This tool is designed as a supporting aid to help identify early signs of disease in poultry and does not replace the role of a veterinarian. To ensure proper animal health, please consult a veterinarian immediately if any signs of illness are observed.",
        checkboxLabel: "I understand and agree to this disclaimer",
        continueButton: "Continue to Tool"
    },
    id: {
        title: "Pemberitahuan Penting",
        fullText: "Tool ini dirancang sebagai sarana pendukung dalam mengenali gejala awal penyakit pada unggas dan tidak menggantikan peran dokter hewan. Untuk memastikan kondisi kesehatan ternak, segera lakukan konsultasi dengan dokter hewan apabila terdapat tanda-tanda penyakit.",
        checkboxLabel: "Saya memahami dan menyetujui disclaimer ini",
        continueButton: "Lanjutkan ke Tool"
    },
    vi: {
        title: "Thông báo Quan trọng",
        fullText: "Công cụ này được thiết kế như một phương tiện hỗ trợ trong việc nhận diện sớm các dấu hiệu bệnh ở gia cầm và không thay thế vai trò của bác sĩ thú y. Vui lòng liên hệ bác sĩ thú y để được tư vấn khi phát hiện bất kỳ dấu hiệu bệnh nào.",
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
                    borderRadius: '12px',
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
                            borderRadius: '50%',
                            backgroundColor: '#FEF3C7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: '1.5rem'
                        }}
                    >
                        ⚠️
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
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1.5rem'
                    }}
                >
                    <p
                        style={{
                            fontSize: '0.875rem',
                            lineHeight: '1.6',
                            color: '#92400E',
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
                                accentColor: '#667eea',
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
                        backgroundColor: isChecked ? '#667eea' : '#D1D5DB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isChecked ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        opacity: isChecked ? 1 : 0.6
                    }}
                    onMouseEnter={(e) => {
                        if (isChecked) e.currentTarget.style.backgroundColor = '#5568d3';
                    }}
                    onMouseLeave={(e) => {
                        if (isChecked) e.currentTarget.style.backgroundColor = '#667eea';
                    }}
                >
                    {lang.continueButton}
                </button>
            </div>
        </div>
    );
}

export default PoultryDisclaimerModal;

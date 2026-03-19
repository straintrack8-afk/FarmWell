import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function CollapsibleDisclaimerBanner({ language = 'en' }) {
    const [isVisible, setIsVisible] = useState(true);

    const disclaimerText = {
        en: {
            title: 'Important Notice',
            content: 'Important Notice: This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.'
        },
        id: {
            title: 'Pemberitahuan Penting',
            content: 'Pemberitahuan Penting: Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan.'
        },
        vi: {
            title: 'Thông báo Quan trọng',
            content: 'Thông báo quan trọng: Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời.'
        }
    };

    const text = disclaimerText[language] || disclaimerText.en;

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                style={{
                    width: '100%',
                    background: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#FEF3C7'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFBEB'}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                    <span style={{ fontWeight: '600', color: '#D97706', fontSize: '0.875rem' }}>
                        {text.title}
                    </span>
                </div>
                <ChevronDown size={20} color="#D97706" />
            </button>
        );
    }

    return (
        <div style={{
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚠️</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: '#D97706', marginBottom: '0.25rem' }}>
                            {text.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#B45309', lineHeight: '1.5' }}>
                            {text.content}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(217, 119, 6, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    aria-label="Hide disclaimer"
                >
                    <ChevronUp size={20} color="#D97706" />
                </button>
            </div>
        </div>
    );
}

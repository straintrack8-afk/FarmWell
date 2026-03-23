import React from 'react';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        detected: "Detected",
        fullText: "This tool helps identify possible health problems in livestock. It does not provide a diagnosis and does not replace veterinary advice. Different diseases may show similar symptoms, and only a qualified veterinarian can properly examine the animals and confirm the correct diagnosis. The results provided by this tool are for guidance only. If animals show signs of illness, consult a veterinarian promptly.",
        nextSteps: "Next Steps",
        recommendedActions: [
            "Contact veterinarian immediately",
            "Do not administer medication without professional consultation",
            "Isolate affected birds",
            "Document all symptoms and changes",
            "Prepare flock health history and vaccination records"
        ],
        contactVet: "Contact Veterinarian",
        saveReport: "Save Report"
    },
    id: {
        title: "Pemberitahuan Penting",
        detected: "Terdeteksi",
        fullText: "Alat ini membantu mengidentifikasi kemungkinan masalah kesehatan pada ternak. Alat ini tidak memberikan diagnosis dan tidak menggantikan saran dokter hewan. Penyakit yang berbeda dapat menunjukkan gejala yang serupa, dan hanya dokter hewan yang berkualifikasi yang dapat memeriksa hewan dengan benar dan memastikan diagnosis yang tepat. Hasil yang diberikan oleh alat ini hanya untuk panduan. Jika hewan menunjukkan tanda-tanda penyakit, segera konsultasikan dengan dokter hewan.",
        nextSteps: "Langkah Selanjutnya",
        recommendedActions: [
            "Hubungi dokter hewan segera",
            "Jangan berikan obat tanpa konsultasi profesional",
            "Isolasi unggas yang sakit",
            "Catat semua gejala dan perubahan kondisi",
            "Siapkan riwayat kesehatan dan vaksinasi unggas"
        ],
        contactVet: "Hubungi Dokter Hewan",
        saveReport: "Simpan Laporan"
    },
    vi: {
        title: "Thông báo Quan trọng",
        detected: "Đã phát hiện",
        fullText: "Công cụ này giúp xác định các vấn đề sức khỏe có thể xảy ra ở vật nuôi. Công cụ này không cung cấp chẩn đoán và không thay thế lời khuyên của bác sĩ thú y. Các bệnh khác nhau có thể có triệu chứng tương tự và chỉ bác sĩ thú y có chuyên môn mới có thể kiểm tra động vật đúng cách và xác nhận chẩn đoán chính xác. Kết quả do công cụ này cung cấp chỉ mang tính chất hướng dẫn. Nếu vật nuôi có dấu hiệu bệnh, hãy tham khảo ý kiến bác sĩ thú y kịp thời.",
        nextSteps: "Các Bước Tiếp theo",
        recommendedActions: [
            "Liên hệ bác sĩ thú y ngay lập tức",
            "Không dùng thuốc mà không có tư vấn chuyên nghiệp",
            "Cách ly gia cầm bị bệnh",
            "Ghi chép tất cả triệu chứng và thay đổi",
            "Chuẩn bị lịch sử sức khỏe và tiêm phòng của đàn"
        ],
        contactVet: "Liên hệ Bác sĩ Thú y",
        saveReport: "Lưu Báo cáo"
    }
};

function DiagnosisDisclaimer({ language = 'en', diseaseIndicated }) {
    const lang = DISCLAIMER_TEXT[language] || DISCLAIMER_TEXT['en'];

    return (
        <div
            style={{
                backgroundColor: 'white',
                border: '2px solid #FCD34D',
                borderRadius: '12px',
                padding: '1.5rem',
                marginTop: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
            className="diagnosis-disclaimer-card"
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#DBEAFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: '1.25rem'
                    }}
                >

                </div>
                <div>
                    <h3
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0,
                            marginBottom: '0.25rem'
                        }}
                    >
                        {lang.title}
                    </h3>
                    {diseaseIndicated && (
                        <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: 0 }}>
                            {lang.detected}: <strong>{diseaseIndicated}</strong>
                        </p>
                    )}
                </div>
            </div>

            {/* Warning Message */}
            <div
                style={{
                    backgroundColor: '#FEF3C7',
                    borderLeft: '4px solid #F59E0B',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    marginBottom: '1rem'
                }}
            >
                <p
                    style={{
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        color: '#92400E',
                        margin: 0
                    }}
                >
                    {lang.fullText}
                </p>
            </div>

            {/* Next Steps */}
            <div style={{ marginBottom: '1rem' }}>
                <h4
                    style={{
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: '#374151',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    {lang.nextSteps}
                </h4>
                <ul
                    style={{
                        margin: 0,
                        paddingLeft: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}
                >
                    {lang.recommendedActions.map((action, index) => (
                        <li
                            key={index}
                            style={{
                                fontSize: '0.8125rem',
                                lineHeight: '1.5',
                                color: '#4B5563'
                            }}
                        >
                            {action}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Buttons */}
            <div
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    paddingTop: '1rem',
                    borderTop: '1px solid #E5E7EB'
                }}
            >
                <button
                    onClick={() => alert('Veterinarian contact feature coming soon')}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '150px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; }}
                >
                    {lang.contactVet}
                </button>
                <button
                    onClick={() => window.print()}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '150px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#10B981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#10B981';
                    }}
                >
                    {lang.saveReport}
                </button>
            </div>

            {/* Print Styles */}
            <style>{`
        @media print {
          .diagnosis-disclaimer-card {
            page-break-inside: avoid;
            border: 2px solid #000 !important;
            box-shadow: none !important;
          }
          .diagnosis-disclaimer-card button {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .diagnosis-disclaimer-card > div:last-of-type {
            flex-direction: column;
          }
          .diagnosis-disclaimer-card button {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}

export default DiagnosisDisclaimer;

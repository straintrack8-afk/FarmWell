import React from 'react';

const DISCLAIMER_TEXT = {
    en: {
        title: "Important Notice",
        detected: "Detected",
        fullText: "This tool is designed as a supporting aid to help identify early signs of disease in poultry and does not replace the role of a veterinarian. To ensure proper animal health, please consult a veterinarian immediately if any signs of illness are observed.",
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
        fullText: "Tool ini dirancang sebagai sarana pendukung dalam mengenali gejala awal penyakit pada unggas dan tidak menggantikan peran dokter hewan. Untuk memastikan kondisi kesehatan ternak, segera lakukan konsultasi dengan dokter hewan apabila terdapat tanda-tanda penyakit.",
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
        fullText: "Công cụ này được thiết kế như một phương tiện hỗ trợ trong việc nhận diện sớm các dấu hiệu bệnh ở gia cầm và không thay thế vai trò của bác sĩ thú y. Vui lòng liên hệ bác sĩ thú y để được tư vấn khi phát hiện bất kỳ dấu hiệu bệnh nào.",
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
                    🩺
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
                        backgroundColor: '#3B82F6',
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
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3B82F6'; }}
                >
                    📞 {lang.contactVet}
                </button>
                <button
                    onClick={() => window.print()}
                    style={{
                        flex: '1 1 auto',
                        minWidth: '150px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '2px solid #D1D5DB',
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
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = '#9CA3AF';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#D1D5DB';
                    }}
                >
                    📄 {lang.saveReport}
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

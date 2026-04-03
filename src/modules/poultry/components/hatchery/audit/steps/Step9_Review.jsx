import React, { useState } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { useLanguage } from '../../../../../../contexts/LanguageContext';
import { formatDate } from '../../../../utils/hatchery/dateUtils';

function Step9_Review() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const [certified, setCertified] = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split('T')[0]);

    const translations = {
        title: {
            en: "Audit Review & Summary",
            id: "Tinjauan & Ringkasan Audit",
            vi: "Xem lại & Tóm tắt Kiểm toán"
        },
        description: {
            en: "Review all audit data before final submission.",
            id: "Tinjau semua data audit sebelum pengiriman akhir.",
            vi: "Xem lại tất cả dữ liệu kiểm toán trước khi gửi cuối cùng."
        },
        summaryTitle: {
            en: "Audit Summary",
            id: "Ringkasan Audit",
            vi: "Tóm tắt Kiểm toán"
        },
        step1Summary: {
            en: "Audit Information",
            id: "Informasi Audit",
            vi: "Thông tin Kiểm toán"
        },
        step2Summary: {
            en: "Vaccine Storage",
            id: "Penyimpanan Vaksin",
            vi: "Bảo quản Vắc-xin"
        },
        step3Summary: {
            en: "Equipment",
            id: "Peralatan",
            vi: "Thiết bị"
        },
        step4Summary: {
            en: "Techniques",
            id: "Teknik",
            vi: "Kỹ thuật"
        },
        step5Summary: {
            en: "Sample Plan",
            id: "Rencana Sampel",
            vi: "Kế hoạch Lấy mẫu"
        },
        step6Summary: {
            en: "Sample Collection",
            id: "Pengumpulan Sampel",
            vi: "Thu thập Mẫu"
        },
        step7Summary: {
            en: "Incubation Data",
            id: "Data Inkubasi",
            vi: "Dữ liệu Ấp trứng"
        },
        step8Summary: {
            en: "Results Entry",
            id: "Entri Hasil",
            vi: "Nhập Kết quả"
        },
        reviewChecklistTitle: {
            en: "Final Review Checklist",
            id: "Daftar Periksa Tinjauan Akhir",
            vi: "Danh sách Kiểm tra Xem lại Cuối cùng"
        },
        reviewChecklist: {
            item1: {
                en: "All required fields completed",
                id: "Semua kolom yang diperlukan telah diisi",
                vi: "Tất cả các trường bắt buộc đã hoàn thành"
            },
            item2: {
                en: "Data accuracy verified",
                id: "Keakuratan data diverifikasi",
                vi: "Độ chính xác dữ liệu đã được xác minh"
            },
            item3: {
                en: "Supporting documents attached (if applicable)",
                id: "Dokumen pendukung dilampirkan (jika ada)",
                vi: "Tài liệu hỗ trợ đã đính kèm (nếu có)"
            },
            item4: {
                en: "All issues and observations recorded",
                id: "Semua masalah dan pengamatan dicatat",
                vi: "Tất cả các vấn đề và quan sát đã được ghi lại"
            },
            item5: {
                en: "Corrective actions noted where necessary",
                id: "Tindakan perbaikan dicatat bila diperlukan",
                vi: "Hành động khắc phục đã được ghi chú khi cần thiết"
            }
        },
        certificationTitle: {
            en: "Auditor Certification",
            id: "Sertifikasi Auditor",
            vi: "Chứng nhận Kiểm toán viên"
        },
        certificationText: {
            en: "I certify that this audit was conducted in accordance with standard procedures and that the information provided is accurate to the best of my knowledge.",
            id: "Saya menyatakan bahwa audit ini dilakukan sesuai dengan prosedur standar dan bahwa informasi yang diberikan akurat sepengetahuan saya.",
            vi: "Tôi chứng nhận rằng cuộc kiểm toán này được thực hiện theo các quy trình tiêu chuẩn và thông tin được cung cấp là chính xác theo hiểu biết tốt nhất của tôi."
        },
        certificationCheckbox: {
            en: "I certify the accuracy of this audit",
            id: "Saya menyatakan keakuratan audit ini",
            vi: "Tôi chứng nhận tính chính xác của cuộc kiểm toán này"
        },
        signatureTitle: {
            en: "Auditor Signature",
            id: "Tanda Tangan Auditor",
            vi: "Chữ ký Kiểm toán viên"
        },
        signatureName: {
            en: "Full Name",
            id: "Nama Lengkap",
            vi: "Họ và Tên"
        },
        signatureNamePlaceholder: {
            en: "Enter full name",
            id: "Masukkan nama lengkap",
            vi: "Nhập họ và tên"
        },
        signatureDate: {
            en: "Date",
            id: "Tanggal",
            vi: "Ngày"
        },
        warningIncomplete: {
            en: "Warning: Some sections are incomplete",
            id: "Peringatan: Beberapa bagian belum lengkap",
            vi: "Cảnh báo: Một số phần chưa hoàn thành"
        },
        warningCertification: {
            en: "You must certify the audit before submitting",
            id: "Anda harus menyatakan audit sebelum mengirim",
            vi: "Bạn phải chứng nhận kiểm toán trước khi gửi"
        },
        editSection: {
            en: "Edit Section",
            id: "Edit Bagian",
            vi: "Chỉnh sửa Phần"
        },
        viewDetails: {
            en: "View Details",
            id: "Lihat Detail",
            vi: "Xem Chi tiết"
        },
        noData: {
            en: "No data available",
            id: "Tidak ada data tersedia",
            vi: "Không có dữ liệu"
        },
        temperature: {
            en: "Temperature",
            id: "Suhu",
            vi: "Nhiệt độ"
        },
        humidity: {
            en: "Humidity",
            id: "Kelembaban",
            vi: "Độ ẩm"
        },
        score: {
            en: "Score",
            id: "Skor",
            vi: "Điểm"
        },
        samples: {
            en: "samples",
            id: "sampel",
            vi: "mẫu"
        },
        collected: {
            en: "collected",
            id: "dikumpulkan",
            vi: "đã thu thập"
        },
        inProgress: {
            en: "In Progress",
            id: "Sedang Berlangsung",
            vi: "Đang thực hiện"
        },
        complete: {
            en: "Complete",
            id: "Lengkap",
            vi: "Hoàn thành"
        }
    };

    const handleCertificationChange = (checked) => {
        setCertified(checked);
        updateAuditSection('review', {
            ...currentAudit.review,
            certified,
            signatureName,
            signatureDate
        });
    };

    const handleSignatureNameChange = (name) => {
        setSignatureName(name);
        updateAuditSection('review', {
            ...currentAudit.review,
            certified,
            signatureName: name,
            signatureDate
        });
    };

    const handleSignatureDateChange = (date) => {
        setSignatureDate(date);
        updateAuditSection('review', {
            ...currentAudit.review,
            certified,
            signatureName,
            signatureDate: date
        });
    };

    const getStepSummary = (stepKey, stepTitle) => {
        const stepData = currentAudit[stepKey] || {};
        
        switch (stepKey) {
            case 'info':
                return (
                    <div>
                        <p><strong>Audit Date:</strong> {stepData.auditDate ? formatDate(stepData.auditDate) : translations.noData[language]}</p>
                        <p><strong>Auditor:</strong> {stepData.auditor || translations.noData[language]}</p>
                        <p><strong>Audit Type:</strong> {stepData.auditType || translations.noData[language]}</p>
                    </div>
                );
            case 'vaccineStorage':
                return (
                    <div>
                        <p><strong>{translations.temperature[language]}:</strong> {stepData.temperature || translations.noData[language]}°C</p>
                        <p><strong>{translations.humidity[language]}:</strong> {stepData.humidity || translations.noData[language]}%</p>
                        <p><strong>{translations.score[language]}:</strong> {stepData.complianceScore || 0}%</p>
                    </div>
                );
            case 'equipment':
                const equipmentCount = Object.keys(stepData).length;
                return (
                    <div>
                        <p><strong>Equipment Items:</strong> {equipmentCount}</p>
                        <p><strong>Average Score:</strong> {equipmentCount > 0 ? 'Calculating...' : 'N/A'}</p>
                    </div>
                );
            case 'techniques':
                const prepScore = stepData.preparationScore || 0;
                return (
                    <div>
                        <p><strong>Preparation Score:</strong> {prepScore}%</p>
                        <p><strong>Sample Size:</strong> {stepData.spraySampleSize || 0} trays</p>
                    </div>
                );
            case 'samples':
                const totalSamples = Object.values(stepData).reduce((sum, group) => sum + group.length, 0);
                return (
                    <div>
                        <p><strong>Total {translations.samples[language]}:</strong> {totalSamples}</p>
                        <p><strong>Locations:</strong> {Object.keys(stepData).length}</p>
                    </div>
                );
            case 'collection':
                const samples = currentAudit.samples || {};
                const allSamples = Object.values(samples).flat();
                const collectedCount = allSamples.filter(s => s.collected).length;
                return (
                    <div>
                        <p><strong>{translations.samples[language]} {translations.collected[language]}:</strong> {collectedCount}/{allSamples.length}</p>
                        <p><strong>Progress:</strong> {allSamples.length > 0 ? Math.round((collectedCount / allSamples.length) * 100) : 0}%</p>
                    </div>
                );
            default:
                return <p>{translations.noData[language]}</p>;
        }
    };

    const isAuditComplete = () => {
        // Basic validation - in a real implementation, this would be more comprehensive
        return currentAudit.info?.auditDate && 
               currentAudit.info?.auditor && 
               certified && 
               signatureName;
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            {/* Audit Summary */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                    {translations.summaryTitle[language]}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step1Summary[language]}
                        </h4>
                        {getStepSummary('info', translations.step1Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step2Summary[language]}
                        </h4>
                        {getStepSummary('vaccineStorage', translations.step2Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step3Summary[language]}
                        </h4>
                        {getStepSummary('equipment', translations.step3Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step4Summary[language]}
                        </h4>
                        {getStepSummary('techniques', translations.step4Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step5Summary[language]}
                        </h4>
                        {getStepSummary('samples', translations.step5Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step6Summary[language]}
                        </h4>
                        {getStepSummary('collection', translations.step6Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step7Summary[language]}
                        </h4>
                        {getStepSummary('info', translations.step7Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                            {translations.step8Summary[language]}
                        </h4>
                        {getStepSummary('results', translations.step8Summary[language])}
                        <button style={{ marginTop: '0.5rem', fontSize: '0.75rem' }} className="btn-hatchery btn-secondary">
                            {translations.editSection[language]}
                        </button>
                    </div>
                </div>
            </div>

            {/* Review Checklist */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.reviewChecklistTitle[language]}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Object.values(translations.reviewChecklist).map((item, index) => (
                        <label key={index} className="checkbox-group">
                            <input type="checkbox" />
                            <span className="checkbox-label">{item[language]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Auditor Certification */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.certificationTitle[language]}
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '1rem', fontStyle: 'italic' }}>
                    {translations.certificationText[language]}
                </p>
                <label className="checkbox-group">
                    <input
                        type="checkbox"
                        checked={certified}
                        onChange={(e) => handleCertificationChange(e.target.checked)}
                    />
                    <span className="checkbox-label">{translations.certificationCheckbox[language]}</span>
                </label>
            </div>

            {/* Signature */}
            <div className="hatchery-card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.signatureTitle[language]}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">{translations.signatureName[language]}</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={translations.signatureNamePlaceholder[language]}
                            value={signatureName}
                            onChange={(e) => handleSignatureNameChange(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">{translations.signatureDate[language]}</label>
                        <input
                            type="date"
                            className="form-input"
                            value={signatureDate}
                            onChange={(e) => handleSignatureDateChange(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Warnings */}
            {!isAuditComplete() && (
                <div className="alert warning" style={{ marginBottom: '2rem' }}>
                    <span></span>
                    <div>
                        <strong>{translations.warningIncomplete[language]}</strong>
                        {!certified && <><br />{translations.warningCertification[language]}</>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step9_Review;

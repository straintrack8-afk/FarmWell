import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { formatDateForInput } from '../../../../utils/hatchery/dateUtils';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step1_AuditInfo() {
    const { currentAudit, updateAuditSection, locations } = useHatcheryAudit();
    const { language } = useLanguage();
    const info = currentAudit?.info || {};

    const translations = {
        // Page header
        title: {
            en: "Audit Information",
            id: "Informasi Audit",
            vi: "Thông tin Kiểm toán"
        },
        description: {
            en: "Enter basic information about this hatchery audit.",
            id: "Masukkan informasi dasar tentang audit penetasan ini.",
            vi: "Nhập thông tin cơ bản về cuộc kiểm toán trại ấp này."
        },
        
        // Form fields
        auditDate: {
            en: "Audit Date",
            id: "Tanggal Audit",
            vi: "Ngày Kiểm toán"
        },
        auditorName: {
            en: "Auditor Name",
            id: "Nama Auditor",
            vi: "Tên Kiểm toán viên"
        },
        auditorPlaceholder: {
            en: "Enter auditor name",
            id: "Masukkan nama auditor",
            vi: "Nhập tên kiểm toán viên"
        },
        hatcheryLocation: {
            en: "Hatchery Location",
            id: "Lokasi Penetasan",
            vi: "Vị trí Trại ấp"
        },
        locationPlaceholder: {
            en: "Enter hatchery location",
            id: "Masukkan lokasi penetasan",
            vi: "Nhập vị trí trại ấp"
        },
        locationHelper: {
            en: "You can add locations in Settings",
            id: "Anda dapat menambahkan lokasi di Pengaturan",
            vi: "Bạn có thể thêm vị trí trong Cài đặt"
        },
        selectLocation: {
            en: "Select location",
            id: "Pilih lokasi",
            vi: "Chọn vị trí"
        },
        auditType: {
            en: "Audit Type",
            id: "Jenis Audit",
            vi: "Loại Kiểm toán"
        },
        scheduled: {
            en: "Scheduled",
            id: "Terjadwal",
            vi: "Theo lịch"
        },
        scheduledDesc: {
            en: "Regular quarterly audit",
            id: "Audit rutin triwulanan",
            vi: "Kiểm toán định kỳ hàng quý"
        },
        adhoc: {
            en: "Ad-hoc",
            id: "Ad-hoc",
            vi: "Đột xuất"
        },
        adhocDesc: {
            en: "Unscheduled inspection",
            id: "Inspeksi tidak terjadwal",
            vi: "Kiểm tra không theo lịch"
        },
        notes: {
            en: "Notes",
            id: "Catatan",
            vi: "Ghi chú"
        },
        notesPlaceholder: {
            en: "Add any additional notes about this audit...",
            id: "Tambahkan catatan tambahan tentang audit ini...",
            vi: "Thêm bất kỳ ghi chú bổ sung nào về cuộc kiểm toán này..."
        },
        
        // Audit Reference
        auditReference: {
            en: "Audit Reference:",
            id: "Referensi Audit:",
            vi: "Tham chiếu Kiểm toán:"
        },
        willBeGenerated: {
            en: "Will be generated on save",
            id: "Akan dibuat saat disimpan",
            vi: "Sẽ được tạo khi lưu"
        }
    };

    const handleChange = (field, value) => {
        updateAuditSection('info', {
            ...info,
            [field]: value
        });
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            <div className="form-group">
                <label className="form-label required">{translations.auditDate[language]}</label>
                <input
                    type="date"
                    className="form-input"
                    value={info.auditDate || formatDateForInput(new Date())}
                    onChange={(e) => handleChange('auditDate', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label required">{translations.auditorName[language]}</label>
                <input
                    type="text"
                    className="form-input"
                    placeholder={translations.auditorPlaceholder[language]}
                    value={info.auditor || ''}
                    onChange={(e) => handleChange('auditor', e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label required">{translations.hatcheryLocation[language]}</label>
                {locations && locations.length > 0 ? (
                    <select
                        className="form-select"
                        value={info.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    >
                        <option value="">{translations.selectLocation[language]}</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.name}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        className="form-input"
                        placeholder={translations.locationPlaceholder[language]}
                        value={info.location || ''}
                        onChange={(e) => handleChange('location', e.target.value)}
                    />
                )}
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.5rem' }}>
                    {translations.locationHelper[language]}
                </p>
            </div>

            <div className="form-group">
                <label className="form-label required">{translations.auditType[language]}</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <label className="checkbox-group" style={{ flex: 1 }}>
                        <input
                            type="radio"
                            name="auditType"
                            value="scheduled"
                            checked={info.auditType === 'scheduled'}
                            onChange={(e) => handleChange('auditType', e.target.value)}
                        />
                        <span className="checkbox-label">
                            <strong>{translations.scheduled[language]}</strong>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                {translations.scheduledDesc[language]}
                            </span>
                        </span>
                    </label>
                    <label className="checkbox-group" style={{ flex: 1 }}>
                        <input
                            type="radio"
                            name="auditType"
                            value="ad_hoc"
                            checked={info.auditType === 'ad_hoc'}
                            onChange={(e) => handleChange('auditType', e.target.value)}
                        />
                        <span className="checkbox-label">
                            <strong>{translations.adhoc[language]}</strong>
                            <br />
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                {translations.adhocDesc[language]}
                            </span>
                        </span>
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">{translations.notes[language]}</label>
                <textarea
                    className="form-textarea"
                    placeholder={translations.notesPlaceholder[language]}
                    value={info.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>

            <div className="alert info">
                <span></span>
                <div>
                    <strong>{translations.auditReference[language]}</strong> {currentAudit?.auditNumber || translations.willBeGenerated[language]}
                </div>
            </div>
        </div>
    );
}

export default Step1_AuditInfo;

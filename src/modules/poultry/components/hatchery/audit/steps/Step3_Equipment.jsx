import React, { useState } from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { EQUIPMENT_TYPES } from '../../../../utils/hatcheryConstants';
import PhotoUpload from '../../common/PhotoUpload';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step3_Equipment() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const equipment = currentAudit?.equipment || [];
    const [editingIndex, setEditingIndex] = useState(null);

    const translations = {
        title: {
            en: "Vaccination Equipment Assessment",
            id: "Penilaian Peralatan Vaksinasi",
            vi: "Đánh giá Thiết bị Tiêm chủng"
        },
        description: {
            en: "Assess the condition and maintenance status of vaccination equipment.",
            id: "Evaluasi kondisi dan status pemeliharaan peralatan vaksinasi.",
            vi: "Đánh giá tình trạng và tình trạng bảo trì thiết bị tiêm chủng."
        },
        overallScore: {
            en: "Overall Equipment Score:",
            id: "Skor Peralatan Keseluruhan:",
            vi: "Điểm Thiết bị Tổng thể:"
        },
        equipmentAssessed: {
            en: "equipment item{plural} assessed",
            id: "item peralatan{plural} dinilai",
            vi: "thiết bị{plural} được đánh giá"
        },
        equipmentHeader: {
            en: "Equipment #{index} - {score}%",
            id: "Peralatan #{index} - {score}%",
            vi: "Thiết bị #{index} - {score}%"
        },
        delete: {
            en: "Delete",
            id: "Hapus",
            vi: "Xóa"
        },
        deleteConfirm: {
            en: "Delete this equipment entry?",
            id: "Hapus entri peralatan ini?",
            vi: "Xóa mục thiết bị này?"
        },
        equipmentType: {
            en: "Equipment Type",
            id: "Jenis Peralatan",
            vi: "Loại Thiết bị"
        },
        equipmentName: {
            en: "Equipment Name/Model",
            id: "Nama/Model Peralatan",
            vi: "Tên/Model Thiết bị"
        },
        namePlaceholder: {
            en: "e.g., Henke Sass Wolf Model X",
            id: "misalnya, Henke Sass Wolf Model X",
            vi: "ví dụ, Henke Sass Wolf Model X"
        },
        quantity: {
            en: "Quantity",
            id: "Kuantitas",
            vi: "Số lượng"
        },
        lastServiceDate: {
            en: "Last Service Date",
            id: "Tanggal Layanan Terakhir",
            vi: "Ngày Bảo trì Cuối cùng"
        },
        availableDoses: {
            en: "Available Doses",
            id: "Dosis Tersedia",
            vi: "Liều có sẵn"
        },
        dosesPlaceholder: {
            en: "Number of doses available",
            id: "Jumlah dosis tersedia",
            vi: "Số liều có sẵn"
        },
        conditionChecks: {
            en: "Condition Checks",
            id: "Pemeriksaan Kondisi",
            vi: "Kiểm tra Tình trạng"
        },
        goodCondition: {
            en: "Equipment in good working condition",
            id: "Peralatan dalam kondisi kerja baik",
            vi: "Thiết bị hoạt động tốt"
        },
        maintenancePerformed: {
            en: "Regular maintenance performed",
            id: "Pemeliharaan rutin dilakukan",
            vi: "Bảo trì định kỳ được thực hiện"
        },
        dosesSufficient: {
            en: "Sufficient vaccine doses available",
            id: "Dosis vaksin yang cukup tersedia",
            vi: "Có đủ liều vắc-xin"
        },
        cleaningProtocol: {
            en: "Cleaning & disinfection protocol followed",
            id: "Protokol pembersihan & disinfeksi diikuti",
            vi: "Tuân thủ quy trình vệ sinh & khử trùng"
        },
        sparePartsAdequate: {
            en: "Spare parts inventory adequate",
            id: "Inventori suku cadang memadai",
            vi: "Kho phụ tùng đầy đủ"
        },
        notes: {
            en: "Notes",
            id: "Catatan",
            vi: "Ghi chú"
        },
        notesPlaceholder: {
            en: "Any issues or observations...",
            id: "Masalah atau pengamatan apa pun...",
            vi: "Bất kỳ vấn đề hoặc quan sát nào..."
        },
        photos: {
            en: "Photos",
            id: "Foto",
            vi: "Hình ảnh"
        },
        addEquipment: {
            en: "Add Equipment",
            id: "Tambah Peralatan",
            vi: "Thêm Thiết bị"
        },
        noEquipmentMessage: {
            en: 'Click "Add Equipment" to start assessing vaccination equipment.',
            id: 'Klik "Tambah Peralatan" untuk mulai menilai peralatan vaksinasi.',
            vi: 'Nhấp "Thêm Thiết bị" để bắt đầu đánh giá thiết bị tiêm chủng.'
        },
        equipmentTypes: {
            sprayCabinet: {
                en: "Spray Cabinet (Henke Sass Wolf)",
                id: "Kabinet Semprot (Henke Sass Wolf)",
                vi: "Tủ phun (Henke Sass Wolf)"
            },
            pneumaticVaccinator: {
                en: "Pneumatic Vaccinator",
                id: "Vaksinator Pneumatik",
                vi: "Máy tiêm khí nén"
            },
            other: {
                en: "Other",
                id: "Lainnya",
                vi: "Khác"
            }
        }
    };

    const handleAddEquipment = () => {
        const newEquipment = {
            id: Date.now().toString(),
            type: EQUIPMENT_TYPES.SPRAY_CABINET,
            name: '',
            quantity: 1,
            conditionGood: false,
            maintenanceCurrent: false,
            lastServiceDate: '',
            dosesSufficient: false,
            dosesAvailable: 0,
            cleaningFollowed: false,
            sparePartsAdequate: false,
            notes: '',
            photos: []
        };
        updateAuditSection('equipment', [...equipment, newEquipment]);
        setEditingIndex(equipment.length);
    };

    const handleUpdateEquipment = (index, field, value) => {
        const updated = [...equipment];
        updated[index] = { ...updated[index], [field]: value };
        updateAuditSection('equipment', updated);
    };

    const handleDeleteEquipment = (index) => {
        if (confirm(translations.deleteConfirm[language])) {
            const updated = equipment.filter((_, i) => i !== index);
            updateAuditSection('equipment', updated);
            if (editingIndex === index) setEditingIndex(null);
        }
    };

    const calculateEquipmentScore = (eq) => {
        const checks = [
            eq.conditionGood,
            eq.maintenanceCurrent,
            eq.dosesSufficient,
            eq.cleaningFollowed,
            eq.sparePartsAdequate
        ];
        const passed = checks.filter(c => c === true).length;
        return Math.round((passed / checks.length) * 100);
    };

    const totalScore = equipment.length > 0
        ? Math.round(equipment.reduce((sum, eq) => sum + calculateEquipmentScore(eq), 0) / equipment.length)
        : 0;

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            {/* Overall Score */}
            {equipment.length > 0 && (
                <div className="alert info" style={{ marginBottom: '2rem' }}>
                    <span></span>
                    <div>
                        <strong>{translations.overallScore[language]}</strong> {totalScore}%
                        <br />
                        <span style={{ fontSize: '0.875rem' }}>
                            {equipment.length} {translations.equipmentAssessed[language].replace('{plural}', equipment.length !== 1 ? 's' : '')}
                        </span>
                    </div>
                </div>
            )}

            {/* Equipment List */}
            {equipment.map((eq, index) => (
                <div key={eq.id} className="hatchery-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>
                            {translations.equipmentHeader[language].replace('{index}', index + 1).replace('{score}', calculateEquipmentScore(eq))}
                        </h3>
                        <button
                            onClick={() => handleDeleteEquipment(index)}
                            className="btn-hatchery btn-danger"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            {translations.delete[language]}
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">{translations.equipmentType[language]}</label>
                        <select
                            className="form-select"
                            value={eq.type}
                            onChange={(e) => handleUpdateEquipment(index, 'type', e.target.value)}
                        >
                            <option value={EQUIPMENT_TYPES.SPRAY_CABINET}>{translations.equipmentTypes.sprayCabinet[language]}</option>
                            <option value={EQUIPMENT_TYPES.PNEUMATIC_VACCINATOR}>{translations.equipmentTypes.pneumaticVaccinator[language]}</option>
                            <option value={EQUIPMENT_TYPES.OTHER}>{translations.equipmentTypes.other[language]}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.equipmentName[language]}</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder={translations.namePlaceholder[language]}
                            value={eq.name || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'name', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.quantity[language]}</label>
                        <input
                            type="number"
                            min="1"
                            className="form-input"
                            value={eq.quantity || 1}
                            onChange={(e) => handleUpdateEquipment(index, 'quantity', parseInt(e.target.value))}
                            style={{ maxWidth: '150px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.lastServiceDate[language]}</label>
                        <input
                            type="date"
                            className="form-input"
                            value={eq.lastServiceDate || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'lastServiceDate', e.target.value)}
                            style={{ maxWidth: '200px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.availableDoses[language]}</label>
                        <input
                            type="number"
                            min="0"
                            className="form-input"
                            placeholder={translations.dosesPlaceholder[language]}
                            value={eq.dosesAvailable || 0}
                            onChange={(e) => handleUpdateEquipment(index, 'dosesAvailable', parseInt(e.target.value))}
                            style={{ maxWidth: '200px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                            {translations.conditionChecks[language]}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.conditionGood || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'conditionGood', e.target.checked)}
                                />
                                <span className="checkbox-label">{translations.goodCondition[language]}</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.maintenanceCurrent || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'maintenanceCurrent', e.target.checked)}
                                />
                                <span className="checkbox-label">{translations.maintenancePerformed[language]}</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.dosesSufficient || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'dosesSufficient', e.target.checked)}
                                />
                                <span className="checkbox-label">{translations.dosesSufficient[language]}</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.cleaningFollowed || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'cleaningFollowed', e.target.checked)}
                                />
                                <span className="checkbox-label">{translations.cleaningProtocol[language]}</span>
                            </label>
                            <label className="checkbox-group">
                                <input
                                    type="checkbox"
                                    checked={eq.sparePartsAdequate || false}
                                    onChange={(e) => handleUpdateEquipment(index, 'sparePartsAdequate', e.target.checked)}
                                />
                                <span className="checkbox-label">{translations.sparePartsAdequate[language]}</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.notes[language]}</label>
                        <textarea
                            className="form-textarea"
                            placeholder={translations.notesPlaceholder[language]}
                            value={eq.notes || ''}
                            onChange={(e) => handleUpdateEquipment(index, 'notes', e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.photos[language]}</label>
                        <PhotoUpload
                            photos={eq.photos || []}
                            onPhotosChange={(photos) => handleUpdateEquipment(index, 'photos', photos)}
                            maxPhotos={3}
                        />
                    </div>
                </div>
            ))}

            {/* Add Equipment Button */}
            <button
                onClick={handleAddEquipment}
                className="btn-hatchery btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
            >
                 {translations.addEquipment[language]}
            </button>

            {equipment.length === 0 && (
                <div className="alert info" style={{ marginTop: '1rem' }}>
                    <span></span>
                    <div>
                        {translations.noEquipmentMessage[language]}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Step3_Equipment;

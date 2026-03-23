import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import PhotoUpload from '../../common/PhotoUpload';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step2_VaccineStorage() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const vaccineStorage = currentAudit?.vaccineStorage || {};

    const translations = {
        title: {
            en: "Vaccine Storage Assessment",
            id: "Penilaian Penyimpanan Vaksin",
            vi: "Đánh giá Bảo quản Vắc-xin"
        },
        description: {
            en: "Inspect vaccine storage conditions and compliance with cold chain requirements.",
            id: "Periksa kondisi penyimpanan vaksin dan kepatuhan terhadap persyaratan rantai dingin.",
            vi: "Kiểm tra điều kiện bảo quản vắc-xin và tuân thủ yêu cầu chuỗi lạnh."
        },
        temperature: {
            en: "Current Refrigerator Temperature (°C)",
            id: "Suhu Lemari Es Saat Ini (°C)",
            vi: "Nhiệt độ Tủ lạnh Hiện tại (°C)"
        },
        temperaturePlaceholder: {
            en: "Enter temperature",
            id: "Masukkan suhu",
            vi: "Nhập nhiệt độ"
        },
        checklistTitle: {
            en: "Storage Compliance Checklist",
            id: "Daftar Periksa Kepatuhan Penyimpanan",
            vi: "Danh sách Kiểm tra Tuân thủ Bảo quản"
        },
        checklist: {
            item1: {
                en: "Refrigerator temperature maintained at +2°C to +8°C",
                id: "Suhu lemari es dijaga pada +2°C hingga +8°C",
                vi: "Nhiệt độ tủ lạnh duy trì ở +2°C đến +8°C"
            },
            item2: {
                en: "Temperature monitoring log available and up-to-date",
                id: "Log pemantauan suhu tersedia dan terkini",
                vi: "Nhật ký theo dõi nhiệt độ có sẵn và cập nhật"
            },
            item3: {
                en: "Refrigerator used for vaccine storage only (no food/beverages)",
                id: "Lemari es hanya digunakan untuk penyimpanan vaksin (tanpa makanan/minuman)",
                vi: "Tủ lạnh chỉ dùng để bảo quản vắc-xin (không có thức ăn/đồ uống)"
            },
            item4: {
                en: "Vaccines arranged by 'First to expire, first out' principle",
                id: "Vaksin disusun berdasarkan prinsip 'Yang pertama kadaluarsa, keluar pertama'",
                vi: "Vắc-xin được sắp xếp theo nguyên tắc 'Hết hạn trước, dùng trước'"
            },
            item5: {
                en: "Vaccines stored in proper position (not on door shelves)",
                id: "Vaksin disimpan dalam posisi yang tepat (tidak di rak pintu)",
                vi: "Vắc-xin được lưu trữ ở vị trí đúng (không trên kệ cửa)"
            },
            item6: {
                en: "Clear labeling for vaccines with cold chain incidents",
                id: "Pelabelan jelas untuk vaksin dengan insiden rantai dingin",
                vi: "Dán nhãn rõ ràng cho vắc-xin có sự cố chuỗi lạnh"
            }
        },
        complianceScore: {
            en: "Compliance Score:",
            id: "Skor Kepatuhan:",
            vi: "Điểm Tuân thủ:"
        },
        ratings: {
            excellent: {
                en: "Excellent",
                id: "Sangat Baik",
                vi: "Xuất sắc"
            },
            good: {
                en: "Good",
                id: "Baik",
                vi: "Tốt"
            },
            fair: {
                en: "Fair",
                id: "Cukup",
                vi: "Trung bình"
            },
            poor: {
                en: "Poor",
                id: "Buruk",
                vi: "Kém"
            }
        },
        notes: {
            en: "Notes & Observations",
            id: "Catatan & Pengamatan",
            vi: "Ghi chú & Quan sát"
        },
        notesPlaceholder: {
            en: "Record any issues, observations, or corrective actions taken...",
            id: "Catat masalah, pengamatan, atau tindakan korektif yang diambil...",
            vi: "Ghi lại bất kỳ vấn đề, quan sát, hoặc hành động khắc phục nào đã thực hiện..."
        },
        photos: {
            en: "Photos",
            id: "Foto",
            vi: "Hình ảnh"
        },
        photosHelper: {
            en: "Upload photos of refrigerator, temperature log, and vaccine storage arrangement",
            id: "Unggah foto lemari es, log suhu, dan pengaturan penyimpanan vaksin",
            vi: "Tải lên hình ảnh tủ lạnh, nhật ký nhiệt độ và cách sắp xếp bảo quản vắc-xin"
        },
        tempRange: {
            within: {
                en: "Temperature within acceptable range",
                id: "Suhu dalam rentang dapat diterima",
                vi: "Nhiệt độ trong phạm vi chấp nhận"
            },
            outOfRange: {
                en: "Temperature out of range (+2°C to +8°C)",
                id: "Suhu di luar rentang (+2°C hingga +8°C)",
                vi: "Nhiệt độ ngoài phạm vi (+2°C đến +8°C)"
            }
        }
    };

    const handleChange = (field, value) => {
        updateAuditSection('vaccineStorage', {
            ...vaccineStorage,
            [field]: value
        });
    };

    const handlePhotosChange = (photos) => {
        handleChange('photos', photos);
    };

    const checklist = [
        { key: 'temperatureOk', labelKey: 'item1' },
        { key: 'tempLogAvailable', labelKey: 'item2' },
        { key: 'vaccineOnly', labelKey: 'item3' },
        { key: 'fifoFollowed', labelKey: 'item4' },
        { key: 'properPositioning', labelKey: 'item5' },
        { key: 'clearLabeling', labelKey: 'item6' }
    ];

    const passedCount = checklist.filter(item => vaccineStorage[item.key] === true).length;
    const percentage = Math.round((passedCount / checklist.length) * 100);

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            {/* Temperature Input */}
            <div className="form-group">
                <label className="form-label">{translations.temperature[language]}</label>
                <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder={translations.temperaturePlaceholder[language]}
                    value={vaccineStorage.currentTemperature || ''}
                    onChange={(e) => handleChange('currentTemperature', parseFloat(e.target.value))}
                    style={{ maxWidth: '200px' }}
                />
                {vaccineStorage.currentTemperature && (
                    <p style={{
                        fontSize: '0.75rem',
                        marginTop: '0.5rem',
                        color: vaccineStorage.currentTemperature >= 2 && vaccineStorage.currentTemperature <= 8 ? '#10B981' : '#EF4444'
                    }}>
                        {vaccineStorage.currentTemperature >= 2 && vaccineStorage.currentTemperature <= 8
                            ? translations.tempRange.within[language]
                            : translations.tempRange.outOfRange[language]}
                    </p>
                )}
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.checklistTitle[language]}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {checklist.map((item) => (
                        <label key={item.key} className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={vaccineStorage[item.key] || false}
                                onChange={(e) => handleChange(item.key, e.target.checked)}
                            />
                            <span className="checkbox-label">{translations.checklist[item.labelKey][language]}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Compliance Score */}
            <div className="alert info" style={{ marginBottom: '2rem' }}>
                <span></span>
                <div>
                    <strong>{translations.complianceScore[language]}</strong> {passedCount} / {checklist.length} ({percentage}%)
                    <br />
                    <span style={{ fontSize: '0.875rem' }}>
                        {percentage >= 95 ? ' ' + translations.ratings.excellent[language] : 
                         percentage >= 85 ? ' ' + translations.ratings.good[language] : 
                         percentage >= 75 ? ' ' + translations.ratings.fair[language] : 
                         ' ' + translations.ratings.poor[language]}
                    </span>
                </div>
            </div>

            {/* Notes */}
            <div className="form-group">
                <label className="form-label">{translations.notes[language]}</label>
                <textarea
                    className="form-textarea"
                    placeholder={translations.notesPlaceholder[language]}
                    value={vaccineStorage.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>

            {/* Photo Upload */}
            <div className="form-group">
                <label className="form-label">{translations.photos[language]}</label>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>
                    {translations.photosHelper[language]}
                </p>
                <PhotoUpload
                    photos={vaccineStorage.photos || []}
                    onPhotosChange={handlePhotosChange}
                    maxPhotos={5}
                />
            </div>
        </div>
    );
}

export default Step2_VaccineStorage;

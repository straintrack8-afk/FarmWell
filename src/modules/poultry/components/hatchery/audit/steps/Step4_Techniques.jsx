import React from 'react';
import { useHatcheryAudit } from '../../../../contexts/HatcheryAuditContext';
import { DROPLET_UNIFORMITY } from '../../../../utils/hatcheryConstants';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

function Step4_Techniques() {
    const { currentAudit, updateAuditSection } = useHatcheryAudit();
    const { language } = useLanguage();
    const techniques = currentAudit?.techniques || {};

    const translations = {
        title: {
            en: "Vaccination Techniques Assessment",
            id: "Penilaian Teknik Vaksinasi",
            vi: "Đánh giá Kỹ thuật Tiêm chủng"
        },
        description: {
            en: "Observe and assess vaccine preparation and vaccination quality.",
            id: "Amati dan evaluasi kualitas persiapan dan vaksinasi.",
            vi: "Quan sát và đánh giá chất lượng chuẩn bị và tiêm chủng."
        },
        
        // Vaccine Preparation section
        preparationTitle: {
            en: "A. Vaccine Preparation",
            id: "A. Persiapan Vaksin",
            vi: "A. Chuẩn bị Vắc-xin"
        },
        preparationChecks: {
            item1: {
                en: "Aseptic technique followed",
                id: "Teknik aseptik diikuti",
                vi: "Tuân thủ kỹ thuật vô trùng"
            },
            item2: {
                en: "Hand hygiene performed before preparation",
                id: "Higiene tangan dilakukan sebelum persiapan",
                vi: "Vệ sinh tay thực hiện trước khi chuẩn bị"
            },
            item3: {
                en: "New syringe used for each batch",
                id: "Suntikan baru digunakan untuk setiap batch",
                vi: "Sử dụng kim tiêm mới cho mỗi lô"
            },
            item4: {
                en: "21G needle used",
                id: "Jarum 21G digunakan",
                vi: "Sử dụng kim 21G"
            },
            item5: {
                en: "Expiration dates checked",
                id: "Tanggal kedaluwarsa diperiksa",
                vi: "Kiểm tra ngày hết hạn"
            },
            item6: {
                en: "Mixed according to manufacturer guidelines",
                id: "Dicampur sesuai panduan produsen",
                vi: "Pha theo hướng dẫn của nhà sản xuất"
            },
            item7: {
                en: "Records maintained (date, time, batch, lot)",
                id: "Catatan dipelihara (tanggal, waktu, batch, lot)",
                vi: "Hồ sơ được duy trì (ngày, giờ, lô, số lô)"
            }
        },
        preparationScore: {
            en: "Preparation Score:",
            id: "Skor Persiapan:",
            vi: "Điểm Chuẩn bị:"
        },
        
        // Spray Vaccination Quality section
        sprayQualityTitle: {
            en: "B. Spray Vaccination Quality",
            id: "B. Kualitas Vaksinasi Semprot",
            vi: "B. Chất lượng Tiêm chủng Phun"
        },
        sampleSizeTrays: {
            en: "Sample Size (trays observed)",
            id: "Ukuran Sampel (baki yang diamati)",
            vi: "Cỡ mẫu (khay quan sát)"
        },
        dropletUniformity: {
            en: "Droplet Uniformity",
            id: "Keseragaman Tetesan",
            vi: "Độ đồng đều của giọt"
        },
        selectQuality: {
            en: "Select quality",
            id: "Pilih kualitas",
            vi: "Chọn chất lượng"
        },
        trayCoverage: {
            en: "Tray Coverage (%)",
            id: "Cakupan Baki (%)",
            vi: "Độ bao phủ khay (%)"
        },
        coverageFeedback: {
            good: {
                en: "Good coverage",
                id: "Cakupan baik",
                vi: "Độ bao phủ tốt"
            },
            belowThreshold: {
                en: "Coverage below 90%",
                id: "Cakupan di bawah 90%",
                vi: "Độ bao phủ dưới 90%"
            }
        },
        
        // Injection Quality section
        injectionQualityTitle: {
            en: "C. Injection Quality Assessment",
            id: "C. Penilaian Kualitas Injeksi",
            vi: "C. Đánh giá Chất lượng Tiêm"
        },
        sampleSizeChicks: {
            en: "Sample Size (chicks observed)",
            id: "Ukuran Sampel (anak ayam diamati)",
            vi: "Cỡ mẫu (gà con quan sát)"
        },
        accurateInjection: {
            en: "Accurate Injection (%)",
            id: "Injeksi Akurat (%)",
            vi: "Tiêm chính xác (%)"
        },
        bleeding: {
            en: "Bleeding (%)",
            id: "Perdarahan (%)",
            vi: "Chảy máu (%)"
        },
        wetNeck: {
            en: "Wet Neck (%)",
            id: "Leher Basah (%)",
            vi: "Cổ ướt (%)"
        },
        noVaccine: {
            en: "No Vaccine (%)",
            id: "Tidak Ada Vaksin (%)",
            vi: "Không có vắc-xin (%)"
        },
        exceedsThreshold: {
            en: "Exceeds 5% threshold",
            id: "Melebihi ambang batas 5%",
            vi: "Vượt ngưỡng 5%"
        },
        
        // Notes section
        notes: {
            en: "Notes & Observations",
            id: "Catatan & Pengamatan",
            vi: "Ghi chú & Quan sát"
        },
        notesPlaceholder: {
            en: "Record any issues, observations, or training needs...",
            id: "Catat masalah, pengamatan, atau kebutuhan pelatihan...",
            vi: "Ghi lại các vấn đề, quan sát hoặc nhu cầu đào tạo..."
        },
        
        // Quality ratings
        qualityRatings: {
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
        }
    };

    const handleChange = (field, value) => {
        updateAuditSection('techniques', {
            ...techniques,
            [field]: value
        });
    };

    const preparationChecks = [
        { key: 'asepticTechnique', labelKey: 'item1' },
        { key: 'handHygiene', labelKey: 'item2' },
        { key: 'newSyringe', labelKey: 'item3' },
        { key: 'correctNeedle', labelKey: 'item4' },
        { key: 'expiryChecked', labelKey: 'item5' },
        { key: 'mixedCorrectly', labelKey: 'item6' },
        { key: 'recordsMaintained', labelKey: 'item7' }
    ];

    const prepPassed = preparationChecks.filter(c => techniques[c.key] === true).length;
    const prepPercentage = Math.round((prepPassed / preparationChecks.length) * 100);

    return (
        <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>
                {translations.title[language]}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>
                {translations.description[language]}
            </p>

            {/* Vaccine Preparation */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.preparationTitle[language]}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {preparationChecks.map((check) => (
                        <label key={check.key} className="checkbox-group">
                            <input
                                type="checkbox"
                                checked={techniques[check.key] || false}
                                onChange={(e) => handleChange(check.key, e.target.checked)}
                            />
                            <span className="checkbox-label">{translations.preparationChecks[check.labelKey][language]}</span>
                        </label>
                    ))}
                </div>
                <div className="alert info" style={{ marginTop: '1rem' }}>
                    <span></span>
                    <div>
                        <strong>{translations.preparationScore[language]}</strong> {prepPassed} / {preparationChecks.length} ({prepPercentage}%)
                    </div>
                </div>
            </div>

            {/* Spray Vaccination Quality */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.sprayQualityTitle[language]}
                </h3>

                <div className="form-group">
                    <label className="form-label">{translations.sampleSizeTrays[language]}</label>
                    <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={techniques.spraySampleSize || 0}
                        onChange={(e) => handleChange('spraySampleSize', parseInt(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">{translations.dropletUniformity[language]}</label>
                    <select
                        className="form-select"
                        value={techniques.dropletUniformity || ''}
                        onChange={(e) => handleChange('dropletUniformity', e.target.value)}
                    >
                        <option value="">{translations.selectQuality[language]}</option>
                        <option value={DROPLET_UNIFORMITY.EXCELLENT}>{translations.qualityRatings.excellent[language]}</option>
                        <option value={DROPLET_UNIFORMITY.GOOD}>{translations.qualityRatings.good[language]}</option>
                        <option value={DROPLET_UNIFORMITY.FAIR}>{translations.qualityRatings.fair[language]}</option>
                        <option value={DROPLET_UNIFORMITY.POOR}>{translations.qualityRatings.poor[language]}</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">{translations.trayCoverage[language]}</label>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        className="form-input"
                        value={techniques.trayCoverage || 0}
                        onChange={(e) => handleChange('trayCoverage', parseFloat(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                    {techniques.trayCoverage && (
                        <p style={{
                            fontSize: '0.75rem',
                            marginTop: '0.5rem',
                            color: techniques.trayCoverage >= 90 ? '#10B981' : '#F59E0B'
                        }}>
                            {techniques.trayCoverage >= 90 ? ' ' + translations.coverageFeedback.good[language] : ' ' + translations.coverageFeedback.belowThreshold[language]}
                        </p>
                    )}
                </div>
            </div>

            {/* Injection Quality */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                    {translations.injectionQualityTitle[language]}
                </h3>

                <div className="form-group">
                    <label className="form-label">{translations.sampleSizeChicks[language]}</label>
                    <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={techniques.injectionSampleSize || 0}
                        onChange={(e) => handleChange('injectionSampleSize', parseInt(e.target.value))}
                        style={{ maxWidth: '150px' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                        <label className="form-label">{translations.accurateInjection[language]}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.accurateInjectionPercent || 0}
                            onChange={(e) => handleChange('accurateInjectionPercent', parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.bleeding[language]}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.bleedingPercent || 0}
                            onChange={(e) => handleChange('bleedingPercent', parseFloat(e.target.value))}
                        />
                        {techniques.bleedingPercent > 5 && (
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#EF4444' }}>
                                 {translations.exceedsThreshold[language]}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.wetNeck[language]}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.wetNeckPercent || 0}
                            onChange={(e) => handleChange('wetNeckPercent', parseFloat(e.target.value))}
                        />
                        {techniques.wetNeckPercent > 5 && (
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#EF4444' }}>
                                 {translations.exceedsThreshold[language]}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">{translations.noVaccine[language]}</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            className="form-input"
                            value={techniques.noVaccinePercent || 0}
                            onChange={(e) => handleChange('noVaccinePercent', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="form-group">
                <label className="form-label">{translations.notes[language]}</label>
                <textarea
                    className="form-textarea"
                    placeholder={translations.notesPlaceholder[language]}
                    value={techniques.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}

export default Step4_Techniques;
